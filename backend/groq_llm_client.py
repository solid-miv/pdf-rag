"""
Check https://console.groq.com/docs/models for the list of available models.
"""
# TODO: how to implement streaming?
import os
import time
from dotenv import load_dotenv

from llama_index.llms.groq import Groq
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings
from llama_index.core import SimpleDirectoryReader
from llama_index.core import VectorStoreIndex
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.core.chat_engine import CondensePlusContextChatEngine


load_dotenv()


llm = Groq(model="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY"))
embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")  # speed/size tradeoff
# embed_model = HuggingFaceEmbedding(model_name="mixedbread-ai/mxbai-embed-large-v1")
# embed_model = HuggingFaceEmbedding(model_name="ibm-granite/granite-embedding-278m-multilingual")

Settings.llm = llm
Settings.embed_model = embed_model

chat_engine = None
memory = ChatMemoryBuffer.from_defaults(token_limit=3900)


def setup_rag_system():
    global chat_engine, memory
    docs_path = "/app/storage/docs"
    os.makedirs(docs_path, exist_ok=True)
    
    try:
        documents = SimpleDirectoryReader(docs_path, required_exts=[".pdf", ".docx"]).load_data()
        print(f"Loaded {len(documents)} documents")
        index = VectorStoreIndex.from_documents(documents)
    except ValueError:
        print("No documents found. Using empty index.")
        documents = []
        index = VectorStoreIndex.from_documents([])
        
    memory = ChatMemoryBuffer.from_defaults(token_limit=3900)
    system_prompt = "Search for an answer in the documents. Specify the name of the document if you found an answer and stop the response. Otherwise, use general knowledge and explicitly say that the answer is based on the general knowledge and not the docs. Do not name all the docs in this case."
    
    chat_engine = CondensePlusContextChatEngine.from_defaults(
        retriever=index.as_retriever(),
        memory=memory,
        llm=llm,
        system_prompt=system_prompt,
        verbose=True
    )

    return chat_engine


def query_documents(query):
    if chat_engine is None:
        setup_rag_system()

    streaming_response = chat_engine.stream_chat(query)

    for chunk in streaming_response.response_gen:
        if isinstance(chunk, str) and chunk.strip():
            yield chunk