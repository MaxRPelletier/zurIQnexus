import os
import json
import random

# save messages from retrieval later on
def get_recent_messages():

    # define the file name
    file_name = "stored_data.json"
    learn_instruction = {"role": "system",
                         "content": "You are helping the user as a customer service agent at Raffeissen Bank.  You are extremely knowledgeable in all of the bank products and services. Success first depends on understanding and recommending the bank products and services. You speak very clearly and pause between sentences. You go by the name Raif. Keep your answer concise and under 30 seconds."}

    # initialize messages
    messages = []

    # add random element
    x = random.uniform(0, 1)
    if x < 0.7:
        learn_instruction["content"] = learn_instruction["content"] + "Your response will have show empathy. Do not ramble sentences. Speak only one sentence at a time."
    else:
        learn_instruction["content"] = learn_instruction["content"] + "Your response will include an interesting new fact on Switzerland in Swiss German about making customers happy. "

    # Append instruction to message
    messages.append(learn_instruction)

    # get last messages
    try:
        with open(file_name) as user_file:
            data = json.load(user_file)

            # append last 5 rows of data
            if data:
                if len(data) < 5:
                    for item in data:
                        messages.append(item)
                else:
                    for item in data[-5:]:
                        messages.append(item)
    except:
        pass

    #return messages
    return messages


# save messages for retrieval later on
def store_messages(request_message, response_message):

    # define the file name
    file_name = "stored_data.json"

    # get recent messages
    messages = get_recent_messages()[1:]

    # add messages to data
    user_message = {"role": "user", "content": request_message}
    assistant_message = {"role": "assistant", "content": response_message}
    messages.append(user_message)
    messages.append(assistant_message)

    # sae the updated file
    with open(file_name, "w") as f:
        json.dump(messages, f)


# save messages to json file
def reset_messages():

    file_name = "stored_data.json"

    # write an empty file
    open(file_name, "w")

# to api
#def message_to_api():

#    file_name = "stored_data.json"

#    f = open(file_name)
#    data = json.loads(f)
#    print(data)