# main.py
import os

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import MarianTokenizer, MarianMTModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslationRequest(BaseModel):
    text: str
    source_lang: str  # e.g., "en" for English
    target_lang: str  # e.g., "es" for Spanish

@app.post("/api/translate")
async def translate_text(req: TranslationRequest):
    # Dynamically construct the model name based on the source and target language codes
    model_name = f"Helsinki-NLP/opus-mt-{req.source_lang}-{req.target_lang}"
    print(f"{model_name=}")
    try:
        tokenizer = MarianTokenizer.from_pretrained(model_name)
        model = MarianMTModel.from_pretrained(model_name)
    except Exception as e:
        # If the model doesn't exist for the provided language pair, return a 400 error
        raise HTTPException(
            status_code=400,
            detail=f"Language pair '{req.source_lang}-{req.target_lang}' not supported or model not found."
        )

    inputs = tokenizer([req.text], return_tensors="pt", truncation=True)
    translated_tokens = model.generate(**inputs)
    translated_text = tokenizer.decode(translated_tokens[0], skip_special_tokens=True)

    return {"original": req.text, "translated": translated_text}
