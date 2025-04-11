import openai
from decouple import config
from functions.database import get_recent_messages

# Initialize OpenAI credentials
openai.organization = config("OPEN_AI_ORG")
openai.api_key = config("OPEN_AI_KEY")


def convert_audio_to_text(audio_file):
    """
    Transcribe audio using OpenAI Whisper.

    Args:
        audio_file: Binary file-like object containing audio.

    Returns:
        Transcribed text if successful, None otherwise.
    """
    try:
        transcript = openai.Audio.transcribe("whisper-1", audio_file)
        return transcript.get("text")
    except Exception as e:
        print(f"[ERROR] Failed to transcribe audio: {e}")
        return None


def get_chat_response(message_input):
    """
    Generate a response from ChatGPT based on user input.

    Args:
        message_input (str): User's input message.

    Returns:
        Response text from ChatGPT if successful, None otherwise.
    """
    messages = get_recent_messages()
    messages.append({"role": "user", "content": message_input})

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=messages
        )
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[ERROR] Failed to get chat response: {e}")
        return None
