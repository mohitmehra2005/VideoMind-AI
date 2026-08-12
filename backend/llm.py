import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

# Load variables from the .env file
load_dotenv()

# Create the Gemini language model
def create_llm():

    llm = ChatGoogleGenerativeAI(
        model = "gemini-2.5-flash",
        google_api_key = os.getenv("GEMINI_API_KEY"),
        model_kwargs = {
            "temperature": 0.2
        }

    )

    return llm
