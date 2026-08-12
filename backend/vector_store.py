from langchain_community.vectorstores import FAISS

# Create a vector store from our transcript chunks
def create_vector_store(chunks, embeddings):

    #Convert the chunks into vectors
    #and dtores them inside FAISS
    vector_store = FAISS.from_documents(
        chunks,
        embeddings
    )

    return vector_store
