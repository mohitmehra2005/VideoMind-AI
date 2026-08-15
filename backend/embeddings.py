from langchain_huggingface import HuggingFaceEmbeddings

# Create a local embedding model
def create_embeddings():
    
    # Load the MiniLM embedding model locally.
    #
    # This model converts text into numerical vectors
    # that FAISS can use for similarity search.
    #
    # Unlike Gemini embeddings, this runs on our machine
    # and does not require an API key or API quota.
    embeddings = HuggingFaceEmbeddings(
        model_name = "sentence-transformers/all-MiniLM-L6-v2"
    )
    
    return embeddings