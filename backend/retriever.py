# Create a retriever from our vector store.
def create_retriever(vector_store):
    
    # Convert the vector store into a retriever.
    # k=3 means the retriever will return the 3 most relevant chunks.
    retriever = vector_store.as_retriever(
        search_kwargs = {"k": 3}
    )
    
    # Return the retriever.
    return retriever