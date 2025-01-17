import os
from dotenv import load_dotenv

from llama_index.llms.groq import Groq
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings
from llama_index.core import SimpleDirectoryReader
from llama_index.core import VectorStoreIndex


load_dotenv()


llm = Groq(model="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY"))
embed_model = HuggingFaceEmbedding(model_name="mixedbread-ai/mxbai-embed-large-v1")

Settings.llm = llm
Settings.embed_model = embed_model

docs_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../docs"))
de_tools_blog = SimpleDirectoryReader(docs_path, required_exts=[".pdf", ".docx"]).load_data()

index = VectorStoreIndex.from_documents(de_tools_blog)
query_engine = index.as_query_engine(similiarity_top_k=3)

response = query_engine.query("What's a transformer model?")
print(response)