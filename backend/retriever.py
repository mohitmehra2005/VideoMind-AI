# Create a retriever from our vector store
def create_retriever(vector_store):

    # The retriever will search the vector store
    # and return the 4 most relevant chunks
    retriever = vector_store.as_retriever(
        search_kwargs = {"k":4}
    )

    return retriever
