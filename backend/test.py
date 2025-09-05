from fastapi import FastAPI
from pydantic import BaseModel
from groq import Groq
import os

# Initialize Groq client (set GROQ_API_KEY in your environment)
client = Groq(api_key=os.getenv("key"))

app = FastAPI()

class ClaimRequest(BaseModel):
    claim: str

@app.post("/support-claim")
def support_claim(request: ClaimRequest):
    prompt = f"""
    The following is a claim: "{request.claim}".
    Write supportive arguments and evidence for this claim, as if you are defending it in a debate.
    """

    completion = client.chat.completions.create(
        model="llama3-8b-8192",  # You can also try "mixtral-8x7b-32768" for bigger responses
        messages=[
            {"role": "system", "content": "You are a debate assistant."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=500,
    )

    return {"supportive_arguments": completion.choices[0].message.content}
