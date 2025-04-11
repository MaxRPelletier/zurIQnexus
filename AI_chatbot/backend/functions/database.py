import os
import json
import random

DATA_FILE = "raif_advisor_data.json"
BASE_INSTRUCTION = (
    "You are a customer service agent at Raiffeisen bank. The website to get bank products is "
    "https://www.raiffeisen.ch/rch/de.html or "
    "https://www.raiffeisen.ch/rch/de/ueber-uns/raiffeisen-group-for-investors/our-services.html. "
    "You are extremely knowledgeable to conduct customer feedback. You understand that asking the right questions is "
    "the key to getting insightful and actionable answers from your surveys and polls. Success depends on recommending "
    "bank products and services, using neutral answer options, ensuring that your surveys have a balanced set of answer "
    "options. You avoid asking for two things at once, using a diverse set of questions. Ask questions more relevant to "
    "the conversation. You go by the name Raif. Keep your answers concise."
)

def generate_instruction():
    """Creates a system instruction with a randomized tone or fun fact."""
    instruction = BASE_INSTRUCTION
    if random.random() < 0.2:
        instruction += " Your response will have some sense of empathy to those who seem angry."
    else:
        instruction += " Your response will include an interesting new fact on Swiss culture to make customers happy."
    return {"role": "system", "content": instruction}

def load_message_history(limit=10):
    """Loads message history from file, limited to the last `limit` messages."""
    if not os.path.exists(DATA_FILE):
        return []

    try:
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
        return data[-limit:] if len(data) > limit else data
    except (json.JSONDecodeError, IOError):
        return []

def get_recent_messages():
    """Retrieves the latest conversation messages with an instruction prepended."""
    messages = [generate_instruction()]
    messages.extend(load_message_history())
    return messages

def store_messages(request_message, response_message):
    """Appends a user and assistant message pair to the history and saves it."""
    messages = load_message_history()
    messages.extend([
        {"role": "user", "content": request_message},
        {"role": "assistant", "content": response_message}
    ])
    with open(DATA_FILE, "w") as f:
        json.dump(messages, f, indent=2)

def reset_messages():
    """Clears all stored messages."""
    with open(DATA_FILE, "w") as f:
        f.write("")