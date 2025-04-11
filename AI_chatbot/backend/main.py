# uvicorn main:app or uvicorn main:app --reload to run backend for SwissHacks chatbot

# import backend modules
import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from decouple import config
import openai
import json


# customer function imports
from functions.text_to_speech import convert_text_to_speech
from functions.openai_requests import convert_audio_to_text, get_chat_response
from functions.database import store_messages, reset_messages