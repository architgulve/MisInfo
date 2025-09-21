from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import uuid4
import asyncio
import logging
import requests
import socket
import ssl
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

import tldextract
import whois
from textblob import TextBlob

from WebScraper import staged_scrape
from groq import Groq

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(_name_)
from dotenv import load_dotenv
import os

load_dotenv()  # loads .env file into environment variables

support_api_key = os.getenv("GROQ_SUPPORT_API_KEY")
against_api_key = os.getenv("GROQ_AGAINST_API_KEY")

support = Groq(api_key=support_api_key)
against = Groq(api_key=against_api_key)

app = FastAPI(title="Misinfo Finder Debate API", version="2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClaimRequest(BaseModel):
    claim: str
    rounds: int = 3

class DebateRequest(BaseModel):
    claim: str
    pro_response: str
    con_response: str

class DebateSession:
    def _init_(self, claim: str, evidence: list, rounds: int):
        self.id = str(uuid4())
        self.claim = claim
        self.evidence = evidence
        self.rounds = rounds
        self.history: list = []

SESSIONS = {}

def build_prompt(session: DebateSession, role: str) -> str:
    head = f'Claim: "{session.claim}"\nYou are the {role.upper()} side in a debate.\n'
    if session.evidence:
        evid = "\n".join(f"- {c.get('headline','')} ({c.get('url','')})" for c in session.evidence[:5])
        section = "Sources:\n" + evid + "\n"
        instructions = "Respond concisely and cite sources in parentheses. Do NOT hallucinate.\n"
    else:
        section = ""
        instructions = "No evidence was found. Do not generate arguments or speculate.\n"
    history = ""
    for msg in session.history[-2:]:
        speaker = "PRO" if msg["role"] == "pro" else "CON"
        history += f"{speaker}: {msg['content']}\n"
    return head + section + history + instructions

async def generate_turn(session: DebateSession, role: str, llm_client: Groq):
    if not session.evidence:
        session.history.append({"role": role, "content": "No evidence available."})
        return
    prompt = build_prompt(session, role)
    resp = llm_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role":"user","content":prompt}],
        max_tokens=400,
        temperature=0.7,
    )
    session.history.append({"role": role, "content": resp.choices[0].message.content.strip()})

async def run_debate(session: DebateSession):
    for _ in range(session.rounds):
        await generate_turn(session, "pro", support)
        await generate_turn(session, "con", against)
#not using this ignore
def domain_age_score(domain: str) -> int:
    try:
        w = whois.whois(domain)
        creation = w.creation_date
        if isinstance(creation, list):
            creation = creation[0]
        if not creation:
            return 0
        years = (datetime.now() - creation).days / 365
        if years >= 10:
            return 5
        if years >= 5:
            return 3
        if years >= 1:
            return 2
        return 1
    except:
        return 0

# def check_ssl(domain: str) -> int:
#     try:
#         ctx = ssl.create_default_context()
#         with socket.create_connection((domain,443),timeout=3) as sock:
#             with ctx.wrap_socket(sock,server_hostname=domain) as ssock:
#                 if ssock.getpeercert():
#                     return 5
#         return 0
#     except:
#         return 0

def check_domain(domain: str) -> int:
    tld = tldextract.extract(domain).suffix.lower()
    if tld in {"gov","edu","org"}:
        return 5
    if tld in {"com","net"}:
        return 3
    return 1

def analyze_sentiment(text: str) -> float:
    return TextBlob(text).sentiment.polarity

def detect_bias(text: str) -> int:
    extremes = ["always","never","must","absolutely","completely"]
    return min(sum(w in text.lower() for w in extremes), 5)

def detect_legitimacy(text: str) -> int:
    triggers = ["because","evidence","study","report","data","according to"]
    return 5 if any(t in text.lower() for t in triggers) else 2

def judge_argument(text: str) -> dict:
    words = text.split()
    domains = {tldextract.extract(w).registered_domain for w in words if "." in w}
    domains = {d for d in domains if d}
    ssl_scores = []
    age_scores = []
    # if domains:
    #     with ThreadPoolExecutor() as ex:
    #         ssl_scores = list(ex.map(check_ssl, domains))
    age_scores = [domain_age_score(d) for d in domains]
    eval = {
        "domains": list(domains),
        "ssl_score": 0,
        "domain_score": sum(check_domain(d) for d in domains),
        "age_score": sum(age_scores),
        "sentiment": analyze_sentiment(text),
        "bias": detect_bias(text),
        "legitimacy": detect_legitimacy(text),
    }
    return eval

def weighted_score(e: dict) -> float:
    count = max(len(e["domains"]), 1)
    return (
        (e["ssl_score"]/count)*1.5 +
        (e["domain_score"]/count)*1.5 +
        (e["age_score"]/count)*1.5 +
        e["legitimacy"]*3 +
        e["sentiment"]*4 +
        (5-e["bias"])*2
    )

@app.post("/debate/start")
async def start_debate(req: ClaimRequest):
    try:
        evidence = staged_scrape(req.claim, support)
        if not evidence:
            return {"error":"No evidence found."}
        sess = DebateSession(req.claim, evidence, req.rounds)
        SESSIONS[sess.id] = sess
        await run_debate(sess)
        final_pro, final_con = "", ""
        for m in reversed(sess.history):
            if m["role"]=="pro" and not final_pro:
                final_pro = m["content"]
            elif m["role"]=="con" and not final_con:
                final_con = m["content"]
            if final_pro and final_con:
                break
        pe = judge_argument(final_pro)
        ce = judge_argument(final_con)
        ps = weighted_score(pe)
        cs = weighted_score(ce)
        if ps > cs:
            verdict = "Based on evaluation, claim appears TRUE."
        elif cs > ps:
            verdict = "Based on evaluation, claim appears FALSE."
        else:
            verdict = "Based on evaluation, claim inconclusive."
        jury = {
            "evaluation_parameters":["SSL","Domain","Age","Legitimacy","Sentiment","Bias"],
            "pro_eval": pe,
            "con_eval": ce,
            "pro_score": ps,
            "con_score": cs,
            "final_verdict": verdict
        }
        return {
            "session_id": sess.id,
            "transcript": sess.history,
            "evidence": evidence,
            "jury": jury
        }
    except Exception as e:
        logger.error("Debate failed", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status":"healthy","sessions": len(SESSIONS)}