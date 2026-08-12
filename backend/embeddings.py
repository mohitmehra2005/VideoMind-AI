import os

from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Load variables from the .env file
load_dotenv()

# Create the Gemini embedding model
def create_embeddings():

    embeddings = GoogleGenerativeAIEmbeddings(
        model = "gemini-embedding-2",
        google_api_key = os.getenv("GEMINI_API_KEY")
    )

    return embeddings
