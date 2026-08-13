from backend.transcript import get_transcript, extract_video_id
from backend.document_loader import load_transcript
from backend.chunking import chunk_documents
from backend.embeddings import create_embeddings
from backend.vector_store import create_vector_store
from backend.retriever import create_retriever
from backend.prompts import create_prompt
from backend.llm import create_llm

# Process a YouTube video and prepare it for RAG
def process_video(video_url):
    
    # Get the transcript from YouTube
    transcript = get_transcript(video_url)
    
    #Extract the YouTube video ID
    video_id = extract_video_id(video_url)
    
    # Convert the transcript into LangChain Documents
    # while preserving video ID and timestamp metadata
    document = load_transcript(
        transcript,
        video_id
    )
    
    # Split the documents into smaller chunks
    chunks = chunk_documents(document)
    
    # Create the retriever and Gemini LLM
    retriever, llm = create_rag(chunks)
    
    # Return them so we can ask questions
    return retriever, llm
    
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
    
    # Store information about the source
    sources = []
    
    # Go through every chunk retrieved by the retriever
    for chunk in relevant_chunks:
        
        # Get the metadata attached to this chunk
        metadata = chunk.metadata
        
        # Create a source object conataining 
        # the location of the information
        source = {
            "video_id": metadata.get("video_id"),
            "start_time": metadata.get("start_time"),
            "end_time": metadata.get("end_time")
        }
        
        #Add the source to our list
        sources.append(source)
    
    # Return both the AI answer and it's source
    return{
        "answer": response.content,
        "sources": sources
    }