from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os

# Initialize Groq support
support = Groq(api_key="key")
against = Groq(api_key="key")

app = FastAPI()

# ✅ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] for stricter
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClaimRequest(BaseModel):
    claim: str

@app.post("/support-claim")
def support_claim(request: ClaimRequest):
    prompt = f"""
    The following is a claim: "{request.claim}".
    Write supportive arguments and evidence for this claim, as if you are defending it in a debate.
    """

    completion = support.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a debate assistant."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=500,
    )

    return {"supportive_arguments": completion.choices[0].message.content}
@app.post("/oppose-claim")
def oppose_claim(request: ClaimRequest):
    prompt = f"""
    The following is a claim: "{request.claim}".
    Write opposing arguments and evidence for this claim, as if you are opposing it in a debate.
    """

    completion = against.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a debate assistant."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=500,
    )

    return {"opposing_arguements": completion.choices[0].message.content}