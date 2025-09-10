# pip install googlesearch-python requests beautifulsoup4 tiktoken
from googlesearch import search
import requests
from bs4 import BeautifulSoup
import tiktoken

# ------------------- Token-based Chunking -------------------
encoding = tiktoken.encoding_for_model("gpt-4")  # or "gpt-3.5-turbo"

def chunk_text(text, max_tokens=300):
    tokens = encoding.encode(text)
    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk_tokens = tokens[i:i+max_tokens]
        chunk_text = encoding.decode(chunk_tokens)
        chunks.append(chunk_text)
    return chunks

# ------------------- Scraper -------------------
def scrape_site(url, max_paragraphs=10, max_tokens=300):
    """
    Scrape a site: headline + paragraphs, then token-chunk paragraphs.
    Returns a list of chunks with metadata.
    """
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        r = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(r.text, "html.parser")

        # Extract headline
        headline_tag = soup.find(["h1", "h2"])
        headline = headline_tag.get_text(strip=True) if headline_tag else ""

        # Extract paragraphs
        paragraphs = soup.find_all("p")[:max_paragraphs]

        all_chunks = []
        for idx, p in enumerate(paragraphs):
            text = p.get_text(strip=True)
            if not text:
                continue
            # Token-based chunking
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
        print(f"Error scraping {url}: {e}")
        return []

# ------------------- Google Top URLs -------------------
def get_top_google_urls(query, num_results=10):
    return [url for url in search(query, num_results=num_results)]

# ------------------- Scrape Top Sites in Batches -------------------
def scrape_google_top_sites(query, batch_size=3, max_tokens=300):
    urls = get_top_google_urls(query)
    batches = [urls[i:i+batch_size] for i in range(0, len(urls), batch_size)]

    all_site_chunks = []
    for batch in batches:
        print(f"Scraping batch: {batch}")
        for url in batch:
            chunks = scrape_site(url, max_tokens=max_tokens)
            all_site_chunks.extend(chunks)
    return all_site_chunks

