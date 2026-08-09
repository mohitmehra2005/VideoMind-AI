# Load variables from the .env file.
from dotenv import load_dotenv

# Import Gemini form LangChain.
from langchain_google_genai import ChatGoogleGenerativeAI

# Load the .env file.
load_dotenv()

def get_llm():
    """
    Create and return the Gemini LLM

    """
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.6-flash",
        teperature = 0
    )
    
    return llm