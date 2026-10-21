# Using an LLM (Gemini)

## Why call an LLM from Python?

Until now, talking to a chatbot meant opening a website and typing. But the same large language models (LLMs) can also be called **from our own Python programs**. Our code sends the model a message, and gets its answer back as a string that we can print, save or use.

This opens a lot of doors: a program that summarises a file, a bot with its own personality, a helper that looks at a picture, or an assistant that can run our own Python functions.

Here we use **Google Gemini**, because it has a free tier and a simple Python library. The ideas (a client, a chat, messages and responses) look almost the same with other providers.

## Setup

**Step 1:** Go to [aistudio.google.com](https://aistudio.google.com) and create an **API key**.

**Step 2:** In your project folder, create a file named `.env`, and put in it a variable named `GEMINI_API_KEY` with your API key:

```
GEMINI_API_KEY=your-key-here
```

> The key is like a password. Never share it and never put it inside your code. If you use Git, add `.env` to your `.gitignore`.

**Step 3:** Install the libraries we need with pip:

```bash
pip install google-genai python-dotenv
```

## The most basic example

A simple chat, with automatic memory of the conversation:

```python
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client()
chat = client.chats.create(model="gemini-3.1-flash-lite")
response = chat.send_message("Hello, how are you?")
print(response.text)
```

```
>> Hi, I'm great! How can I help you today?
```

- `load_dotenv()` reads the `.env` file, so the client can find `GEMINI_API_KEY`.
- `client.chats.create(...)` opens a chat with a specific model.
- Every `chat.send_message(...)` remembers the earlier messages in the same chat.

## Using a system instruction

Basic bot settings, which let us give the bot a character when we create it:

```python
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
client = genai.Client()
config = types.GenerateContentConfig(
        system_instruction="You are a helpful assistant that translates English to French.")
chat = client.chats.create(
        model="gemini-3.1-flash-lite",
        config=config)

response = chat.send_message("Hello, how are you?")
print(response.text)
```

```
>> Ciao, come stai?
```

## Working with an image

```python
import PIL.Image
my_image = PIL.Image.open('test_image.png')
response = chat.send_message(["What is in this loaded image?", my_image])
```

## Working with tools

```python
temperature = 20
def make_warm() -> str:
    ''' This tool warms the room by one degree, and should be used if the user is feeling cold.'''
    global temperature
    temperature += 1
    return f"The temperature is now {temperature} degrees." # this goes to the LLM

config = types.GenerateContentConfig(
    system_instruction="You are a helpful assistant",
    tools = [make_warm]
)
chat = client.chats.create(
        model="gemini-3.1-flash-lite",
        config=config)
response = chat.send_message("Hi, I'm a bit cold")
print(response.text)
```
