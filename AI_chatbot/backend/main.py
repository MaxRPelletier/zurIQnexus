# Run with:
# uvicorn main:app --reload
# or for production:
# uvicorn main:app --host 0.0.0.0 --port $PORT

import os
import json
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from decouple import config
import openai

# Internal Imports
from functions.text_to_speech import convert_text_to_speech
from functions.openai_requests import convert_audio_to_text, get_chat_response
from functions.database import store_messages, reset_messages

# Load API keys from environment
openai.organization = config("OPEN_AI_ORG")
openai.api_key = config("OPEN_AI_KEY")

# Initialize FastAPI app
app = FastAPI()

# Add GZip compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000, compresslevel=5)

# Allowed CORS origins
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://localhost:3000",
    #"https://pc.onrender.com",
    #"https://domain""
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- API Routes ----------

@app.get("/health")
async def check_health():
    """Health check endpoint."""
    return {"response": "healthy"}


@app.get("/reset")
async def reset_conversation():
    """Reset stored conversation history."""
    reset_messages()
    return {"response": "conversation reset"}


@app.get("/message_api/")
async def get_message_data():
    """Return stored message data from JSON file using `json.loads`."""
    file_name = "raif_advisor_data.json"
    with open(file_name, "r") as file:
        data = json.loads(file.read())
    return json.dumps(data)


@app.get("/swisshacks_message_api/")
async def get_swisshacks_message_data():
    """Return stored message data from JSON file using `json.load`."""
    file_name = "raif_advisor_data.json"
    with open(file_name, "r") as file:
        data = json.load(file)
    return json.dumps(data)


@app.post("/post-audio/")
async def post_audio(file: UploadFile = File(...)):
    """
    Accepts an audio file, transcribes it using OpenAI Whisper,
    generates a chat response, converts the response to speech,
    and streams back the audio.
    """
    # Save uploaded audio file temporarily
    with open(file.filename, "wb") as buffer:
        buffer.write(await file.read())

    with open(file.filename, "rb") as audio_input:
        # Convert audio to text
        message_decoded = convert_audio_to_text(audio_input)

    # Clean up temp file
    os.remove(file.filename)

    if not message_decoded:
        raise HTTPException(status_code=400, detail="Failed to decode audio")

    # Get chat response
    chat_response = get_chat_response(message_decoded)

    if not chat_response:
        raise HTTPException(status_code=400, detail="Failed chat response")

    # Store the conversation
    store_messages(message_decoded, chat_response)

    # Convert response to audio
    audio_output = convert_text_to_speech(chat_response)

    if not audio_output:
        raise HTTPException(status_code=400, detail="Failed audio output")

    # Stream audio back to client
    return StreamingResponse(
        content=iter([audio_output]),
        media_type="application/octet-stream"
    )
