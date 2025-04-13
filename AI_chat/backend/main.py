# uvicorn main:app
# uvicorn main:app --reload

#import backend modules
import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from decouple import config
import openai
import json


# Customer function imports
from functions.text_to_speech import convert_text_to_speech
from functions.openai_requests import convert_audio_to_text, get_chat_response
from functions.database import store_messages, reset_messages


# Get Environment Vars
openai.organization = config("OPEN_AI_ORG")
openai.api_key = config("OPEN_AI_KEY")


#set variable to function
app = FastAPI()

app.add_middleware(GZipMiddleware, minimum_size=1000, compresslevel=5)

# Run for production: uvicorn main:app --host 0.0.0.0 --port $PORT
# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://localhost:3000"
]


# CORS - Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

########### CONFIG TEST ##############
# api routes

# Config Routes
# Check health route as test
@app.get("/health")
async def check_health():
    return {"response": "healthy"}

#######################################

# Reset Conversation
@app.get("/reset")
async def reset_conversation():
    reset_messages()
    return {"response": "conversation reset"}


# api to send data to app
@app.get("/message_api/")
async def message_api_json():
    #message_to_api()
    file_name = "stored_data.json"

    f = open(file_name)
    data = json.loads(f) #loads is string to object (load is json file to object)
    #return {"data_in_file": data}
    return json.dumps(data) #dumps is object to string (dump is object to json file)


# api to send data to app test using load and not loads
# https://stackoverflow.com/questions/78377343/converting-json-data-to-vector-for-better-langchain-chatbot-results
@app.get("/forvava_message_api/")
async def forvava_message_api_json():
    #message_to_api()
    file_name = "stored_data.json"

    f = open(file_name)
    data = json.load(f) #loads is string to object (load is json file to object)
    #return {"data_in_file": data}

    return json.dumps(data)  #dumps is object to string (dump is object to json file)


@app.post("/post-audio/")
async def post_audio(file: UploadFile = File(...)):

    # Convert audio to text
    # Save the file temporarily
    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())
    audio_input = open(file.filename, "rb")

    # decode audio by converting audio into text format
    message_decoded = convert_audio_to_text(audio_input)

    # guard: ensure output
    if not message_decoded:
        raise HTTPException(status_code=400, detail="Failed to decode audio")

    # get chat response by taking audio input into text
    chat_response = get_chat_response(message_decoded)

    # store messages of input text converted from audio and chatgpt response
    store_messages(message_decoded, chat_response)

    # guard: ensure output
    if not chat_response:
        raise HTTPException(status_code=400, detail="Failed chat response")

    # convert chat response to audio voice
    audio_output = convert_text_to_speech(chat_response)

    # guard to ensure output
    if not audio_output:
        raise HTTPException(status_code=400, detail="Failed audio output")

    # create a generator that yields chuncks of data
    def iterfile():
        yield audio_output

    # Use for post: return output audio
    return StreamingResponse(iterfile(), media_type="application/octet-stream")
