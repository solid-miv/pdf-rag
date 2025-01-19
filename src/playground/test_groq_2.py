"""
Run the file using the command: python src/playground/test_groq_2.py from the root directory of the project.
"""
import os
import sys
import asyncio

from dotenv import load_dotenv
from groq import AsyncGroq

# set the event loop policy for Windows
if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# load environment variables from .env file
load_dotenv()


client = AsyncGroq(
    api_key=os.getenv("GROQ_API_KEY")
)

async def main():
    chat_streaming = await client.chat.completions.create(
        messages = [{"role": "system", "content": "You are a psychiatrist helping young minds"},
                    {"role": "user", "content": "I panicked during the test, even though I knew everything on the test paper"},
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=360,
        top_p=1.0,
        stop=None,
        stream=True,
    )

    async for chunk in chat_streaming:
        print(chunk.choices[0].delta.content, end="")


if __name__ == "__main__":
    asyncio.run(main())
