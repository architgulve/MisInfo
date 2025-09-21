import requests
from bs4 import BeautifulSoup
import tiktoken
from selenium_bot import SeleniumBot  
import pytesseract
from PIL import Image
from io import BytesIO
import time
import openai
from ddgs import DDGS

# ------------------- Tokenizer -------------------
encoding = tiktoken.encoding_for_model("gpt-4")

def chunk_text(text, max_tokens=300):
    tokens = encoding.encode(text)
    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk_tokens = tokens[i:i+max_tokens]
        chunk_text = encoding.decode(chunk_tokens)
        chunks.append(chunk_text)
    return chunks


# ------------------- Basic Scraper (Requests + BS4) -------------------
def scrape_site(url, max_paragraphs=10, max_tokens=300):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        r = requests.get(url, headers=headers, timeout=7)
        if "text/html" not in r.headers.get("Content-Type", ""):
            return []

        soup = BeautifulSoup(r.text, "html.parser")
        headline_tag = soup.find(["h1", "h2"])
        headline = headline_tag.get_text(strip=True) if headline_tag else ""

        paragraphs = soup.find_all("p")[:max_paragraphs]
        all_chunks = []
        for idx, p in enumerate(paragraphs):
            text = p.get_text(strip=True)
            if not text:
                continue
            chunks = chunk_text(text, max_tokens=max_tokens)
            for chunk_idx, chunk in enumerate(chunks):
                all_chunks.append({
                    "url": url,
                    "headline": headline,
                    "paragraph_index": idx,
                    "chunk_index": chunk_idx,
                    "text": chunk
                })

        return all_chunks

    except Exception as e:
        print(f"Requests scraping failed for {url}, trying Selenium... {e}")
        return scrape_with_selenium(url)


# ------------------- Selenium Fallback -------------------
def scrape_with_selenium(url, max_tokens=300):
    bot = SeleniumBot(headless=True)
    try:
        bot.open_site(url)
        time.sleep(3)
        paragraphs = bot.extract_text("p", limit=15)
        all_chunks = []
        for idx, text in enumerate(paragraphs):
            chunks = chunk_text(text, max_tokens=max_tokens)
            for chunk_idx, chunk in enumerate(chunks):
                all_chunks.append({
                    "url": url,
                    "headline": "",
                    "paragraph_index": idx,
                    "chunk_index": chunk_idx,
                    "text": chunk
                })
        return all_chunks
    except Exception as e:
        print(f"Selenium scraping failed for {url}: {e}")
        return []
    finally:
        bot.close()


# ------------------- OCR Helper -------------------
def extract_text_from_image(url):
    try:
        r = requests.get(url, stream=True, timeout=7)
        img = Image.open(BytesIO(r.content))
        text = pytesseract.image_to_string(img)
        return text.strip()
    except Exception as e:
        print(f"OCR failed for {url}: {e}")
        return ""


# ------------------- DuckDuckGo URLs -------------------
def get_top_duckduckgo_urls(query, num_results=10):
    urls = []
    try:
        with DDGS() as ddgs:
            results = ddgs.text(query, max_results=num_results)
            for r in results:
                if "href" in r:
                    urls.append(r["href"])
    except Exception as e:
        print(f"DuckDuckGo search failed: {e}")
    return urls


# ------------------- Stage-Based Scraper -------------------
def staged_scrape(query, llm_client, max_tokens=300):
    # Collect pro + con URLs via DuckDuckGo
    pro_urls = get_top_duckduckgo_urls(f"{query} pros", num_results=10)
    con_urls = get_top_duckduckgo_urls(f"{query} cons", num_results=10)
    urls = pro_urls + con_urls

    all_chunks = []

    # Stage 1: first 5+5
    stage1_urls = urls[:10]
    for url in stage1_urls:
        chunks = scrape_site(url, max_tokens=max_tokens)
        all_chunks.extend(chunks)

    # Ask LLM if this is enough
    decision = ask_llm_if_enough(query, all_chunks, llm_client)
    if decision == "enough":
        return all_chunks

    # Stage 2: remaining URLs
    stage2_urls = urls[10:]
    for url in stage2_urls:
        chunks = scrape_site(url, max_tokens=max_tokens)
        all_chunks.extend(chunks)

    return all_chunks


# ------------------- LLM Decision -------------------
def ask_llm_if_enough(query, chunks, llm_client):
    context = "\n".join([c["text"] for c in chunks[:20]])
    prompt = f"""
    User query: {query}
    Current scraped context:
    {context}

    Based on this, do you have enough information to answer the question? 
    Reply with only one word: "enough" or "more".
    """
    resp = llm_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )
    return resp.choices[0].message.content.strip().lower()