from backend.embeddings import create_embeddings
from backend.vector_store import create_vector_store
from backend.retriever import create_retriever
from backend.prompts import create_prompt
from backend.llm import create_llm


# Create the RAG components
def create_rag(chunks):

    # Create the embedding model
    embeddings = create_embeddings()

    # Store the chunks as vectors
    vector_store = create_vector_store(
        chunks,
        embeddings
    )

    # Create the retriever
    retriever = create_retriever(vector_store)

    # Create the Gemini language model
    llm = create_llm()

    return retriever, llm


# Ask a question using the RAG components
def ask_question(retriever, llm, question):

    # Find the most relevant chunks
    relevant_chunks = retriever.invoke(question)

    # Extract the text from those chunks
    context = "\n\n".join(
        chunk.page_content
        for chunk in relevant_chunks
    )

    # Create the augmented prompt
    prompt = create_prompt(
        question,
        context
    )

    # Ask Gemini to generate the answer
    response = llm.invoke(prompt)

    return response.content
