# Import Hugging Face embeddings from langchain.
from langchain_huggingface import HuggingFaceEmbeddings

def get_embeddings_model():
    """
    Creste and return the embedding model.
    
    Returns:
    HuggingFaceEmbeddings: The embedding model.

    """
    
    # Create the Hugging Face embedding model.
    embedding_model = HuggingFaceEmbeddings(
        model_name = "sentence-transformers/all-MiniLM-L6-v2"
    )
    
    # Return the embedding model.
    return embedding_model