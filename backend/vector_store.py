# Import Chroma from LangChain.
# Chroma will store our document embeddings.
from langchain_chroma import Chroma

def create_vector_store(chunks, embedding_model):
    """
    Create a Chroma vector store from document chunks.
    
    Parameters:
    chunks (list): List of document chunks.
    embedding_model: Embedding model used to create vectors.
    
    Returns:
    Chroma: The created vector store.

    """
    
    # Create the Chroma vector store.
    # Chroma will use the embedding model to convert
    # our document chunks into vectors.
    vector_store = Chroma.from_documents(
        documents = chunks,
        embedding = embedding_model,
        collection_name = "videomind"
    )
    
    # Return the vector store.
    return vector_store