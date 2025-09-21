import re
import socket
import ssl
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from typing import List

import requests
import tldextract
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from textblob import TextBlob

app = FastAPI()

# ✅ CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DebateRequest(BaseModel):
    claim: str
    pro_response: str
    con_response: str

# Domain extraction regex and function
DOMAIN_RE = re.compile(
    r"\b(?:https?://)?(?:www\.)?([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)\b", re.IGNORECASE
)

def extract_domains(text: str) -> List[str]:
    if not text:
        return []
    matches = DOMAIN_RE.findall(text)
    cleaned = set()
    for m in matches:
        d = m.rstrip(".,;:)/]")
        reg = tldextract.extract(d).registered_domain
        if reg:
            cleaned.add(reg.lower())
    return list(cleaned)

# SSL trust helpers
TRUSTED_CAS = ["digicert", "let's encrypt", "letsencrypt", "amazon", "google", "sectigo", "globalsign", "comodo"]

def _issuer_string(cert: dict) -> str:
    issuer = cert.get("issuer", ())
    parts = []
    for rdn in issuer:
        for attr in rdn:
            if isinstance(attr, tuple) and len(attr) >= 2:
                parts.append(attr[1])
    return " ".join(parts).lower()

def check_ssl(domain: str) -> int:
    if not domain:
        return 0
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = True
        ctx.verify_mode = ssl.CERT_REQUIRED
        with socket.create_connection((domain, 443), timeout=4) as sock:
            with ctx.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                if not cert:
                    return 0
                score = 1
                not_after = cert.get("notAfter")
                if not_after:
                    try:
                        expiry = datetime.strptime(not_after, "%b %d %H:%M:%S %Y %Z")
                    except Exception:
                        try:
                            expiry = datetime.strptime(not_after, "%Y%m%d%H%M%SZ")
                        except Exception:
                            expiry = None
                    if expiry:
                        days_left = (expiry - datetime.utcnow()).days
                        if days_left > 365:
                            score += 2
                        elif days_left > 30:
                            score += 1
                        else:
                            score -= 1
                issuer_str = _issuer_string(cert)
                if any(ca in issuer_str for ca in TRUSTED_CAS):
                    score += 1
                tls_ver = ssock.version()
                if tls_ver and ("1.2" in tls_ver or "1.3" in tls_ver):
                    score += 1
                return max(0, min(score, 5))
    except Exception:
        pass
    try:
        resp = requests.get(f"https://{domain}", timeout=4)
        if resp.ok:
            return 2
    except Exception:
        pass
    return 0

# Domain trust scorer
def check_domain(domain: str) -> int:
    ext = tldextract.extract(domain)
    tld = ext.suffix or ""
    tld = tld.lower()
    if tld in ["gov", "edu", "org"]:
        return 5
    elif tld in ["com", "net"]:
        return 3
    else:
        return 1

# Text analysis helpers
def analyze_sentiment_score(text: str) -> float:
    polarity = TextBlob(text).sentiment.polarity
    return round((polarity + 1) * 2, 2)  # map -1..1 to 0..4

def detect_bias(text: str) -> int:
    extreme_words = ["always", "never", "must", "absolutely", "completely", "undoubtedly", "without a doubt"]
    count = sum(word in text.lower() for word in extreme_words)
    return min(count, 5)

def detect_legitimacy(text: str) -> int:
    triggers = ["because", "evidence", "study", "according to", "research", "report", "data", "cited"]
    found = any(t in text.lower() for t in triggers)
    return 5 if found else 2

# Main argument judging function
def judge_argument(text: str) -> dict:
    domains = extract_domains(text)
    ssl_score = 0
    domain_score = 0
    if domains:
        with ThreadPoolExecutor(max_workers=min(6, len(domains))) as ex:
            ssl_results = list(ex.map(check_ssl, domains))
        ssl_score = sum(ssl_results)
        domain_score = sum(check_domain(d) for d in domains)
    sentiment_score = analyze_sentiment_score(text)
    bias_score = detect_bias(text)
    legitimacy_score = detect_legitimacy(text)
    return {
        "domains_found": domains,
        "ssl_score": ssl_score,
        "domain_score": domain_score,
        "legitimacy": legitimacy_score,
        "sentiment_raw": TextBlob(text).sentiment.polarity,
        "sentiment_score": sentiment_score,
        "bias": bias_score,
    }

@app.post("/jury")
def jury(req: DebateRequest):
    pro_eval = judge_argument(req.pro_response)
    con_eval = judge_argument(req.con_response)
    pro_total = sum(
        [
            pro_eval["ssl_score"],
            pro_eval["domain_score"],
            pro_eval["legitimacy"],
            pro_eval["sentiment_score"],
            pro_eval["bias"],
        ]
    )
    con_total = sum(
        [
            con_eval["ssl_score"],
            con_eval["domain_score"],
            con_eval["legitimacy"],
            con_eval["sentiment_score"],
            con_eval["bias"],
        ]
    )
    if pro_total > con_total:
        winner = "pro"
        verdict = (
            f"The jury evaluated the arguments and finds PRO stronger: {pro_total} vs {con_total}. PRO wins."
        )
    elif con_total > pro_total:
        winner = "con"
        verdict = (
            f"The jury evaluated the arguments and finds CON stronger: {con_total} vs {pro_total}. CON wins."
        )
    else:
        winner = "draw"
        verdict = f"The jury finds a tie: both scored {pro_total}."
    return {
        "evaluation_parameters": ["domains_found", "ssl_score", "domain_score", "legitimacy", "sentiment_score", "bias"],
        "pro_eval": pro_eval,
        "con_eval": con_eval,
        "pro_total": pro_total,
        "con_total": con_total,
        "winner": winner,
        "final_verdict": verdict,
    }