"""
Run the script using the command: python src/playground/groq_llm_client.py from the root directory of the project.
"""
# TODO: how to implement streaming?
# TODO: how to control temperature, max_tokens, top_p, and stop?
# TODO: test different embedding models
import os
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
embed_model = HuggingFaceEmbedding(model_name="mixedbread-ai/mxbai-embed-large-v1")
# embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")  # speed/size tradeoff
# embed_model = HuggingFaceEmbedding(model_name="ibm-granite/granite-embedding-278m-multilingual")

Settings.llm = llm
Settings.embed_model = embed_model

docs_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../storage/docs"))
de_tools_blog = SimpleDirectoryReader(docs_path, required_exts=[".pdf", ".docx"]).load_data()

index = VectorStoreIndex.from_documents(de_tools_blog)
memory = ChatMemoryBuffer.from_defaults(token_limit=3900)
system_prompt = "Search for an answer in the documents. Specify the name of the document if you found an answer and stop the response. Otherwise, use general knowledge and explicitly say that the answer is based on the general knowledge and not the docs. Do not name all the docs in this case."

chat_engine = CondensePlusContextChatEngine(
    index.as_retriever(),
    memory=memory,
    llm=llm,
    system_prompt=system_prompt,
)

response = chat_engine.chat(
    # "Who was elected as a president of Ukraine in 2019?",
    "What vitamin is essential for the absorption of calcium?",
)

print(str(response))