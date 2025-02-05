"""
Check https://console.groq.com/docs/models for the list of available models.
"""
# TODO: how to implement streaming?
import os
from dotenv import load_dotenv

from llama_index.llms.groq import Groq
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings, SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.core.chat_engine import CondensePlusContextChatEngine


load_dotenv()

# available models in the app
MODELS = {
    "llama": "llama-3.3-70b-versatile",
    "mixtral": "mixtral-8x7b-32768",
    "gemma": "gemma2-9b-it"
}

SYSTEM_PROMPT = "Search for an answer in the documents. If you found an answer, specify the name of the document in format name.extension, mention that you found the asnwer in this document, stop the response. Otherwise, use your general knowledge and explicitly say that the answer is based on the it and not the docs. Do not name documents names in this case. Also do not mention document's name in case when only one document is uploaded"
        
llm = None
chat_engine = None
memory = None
current_model = None


def initialize_llm(model_key="llama"):
    global llm, current_model
    model_name = MODELS.get(model_key, MODELS["llama"])
    
    if current_model != model_name:
        llm = Groq(model=model_name, api_key=os.getenv("GROQ_API_KEY"))
        Settings.llm = llm
        current_model = model_name
        return True
    return False


def setup_rag_system(model_key="llama"):
    global chat_engine, memory
    model_changed = initialize_llm(model_key)
    docs_path = "/app/storage/docs"
    os.makedirs(docs_path, exist_ok=True)
    
    chat_engine = None  # rebuild
    
    if chat_engine is None or model_changed:
        try:
            documents = SimpleDirectoryReader(docs_path, required_exts=[".pdf", ".docx"]).load_data()
            print(f"Loaded {len(documents)} documents")
        except ValueError:
            print("No documents found. Using empty index.")
            documents = []
        
        embed_model = HuggingFaceEmbedding(model_name="all-MiniLM-L6-v2")  # size/time tradeoff
        Settings.embed_model = embed_model
        
        index = VectorStoreIndex.from_documents(
            documents,
            embed_model=embed_model
        )
        
        memory = ChatMemoryBuffer.from_defaults(token_limit=3900)
        chat_engine = CondensePlusContextChatEngine.from_defaults(
            retriever=index.as_retriever(),
            memory=memory,
            llm=llm,
            system_prompt=SYSTEM_PROMPT,
            verbose=True
        )

    return chat_engine


def query_documents(query):
    docs_path = "/app/storage/docs"
    if not os.listdir(docs_path):  # check whether the docs directory is empty
        yield "Please upload some documents first. I cannot answer questions without any documents to reference."
        return
        
    if chat_engine is None:
        setup_rag_system()
    response = chat_engine.stream_chat(query)
    for chunk in response.response_gen:
        if chunk:
            yield chunk