"""
Run the file using the command: python src/playground/test_groq.py from the root directory of the project.

Check https://console.groq.com/docs/models for the list of available models.
"""
import asyncio
import os

from dotenv import load_dotenv
from groq import Groq

# load environment variables from .env file
load_dotenv()


async def call_groq_async(prompt, api_key, model="llama-3.3-70b-versatile"):
    client = Groq(api_key=api_key)
    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return prompt, completion.choices[0].message.content
    except Exception as e:
        print(f"An error occurred: {e}")
        return prompt, None


async def _asyncmain():
    api_key = os.getenv("GROQ_API_KEY")
    prompts = [
        "What is the capital of Ukraine?",
        "Generate a basic html code for a to-do list. Just code, no explanation.",
        "What is the capital of Bulgaria?"
    ]
    
    tasks = [call_groq_async(prompt, api_key) for prompt in prompts]
    
    # NOTE: asyncio.as_completed() returns tasks as they finish, regardless of the order they were started
    for task in asyncio.as_completed(tasks):
        prompt, response = await task
        if response:
            print(f"Prompt: {prompt}\nResponse: {response}\n")


if __name__ == "__main__":
    asyncio.run(_asyncmain())