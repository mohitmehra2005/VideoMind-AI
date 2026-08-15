from backend.cache import (
    create_cache_key,
    save_cached_answer,
    load_cached_answer
)
from backend.transcript import get_transcript, extract_video_id
from backend.document_loader import load_transcript
from backend.chunking import chunk_documents
from backend.embeddings import create_embeddings
from backend.vector_store import (
    create_vector_store,
    save_vector_store,
    load_vector_store,
    vector_store_exists
)
from backend.retriever import create_retriever
from backend.prompts import create_prompt
from backend.llm import create_llm

# Process a YouTube video and prepare it for RAG
def process_video(video_url):
    
    # Extract the YouTube video ID first
    video_id = extract_video_id(video_url)
    
    # Stop if the url is invalid
    if not video_id:
        raise ValueError("invalid YouTube URL.")
    
    # Check whether this video has already been processed
    if vector_store_exists(video_id):
        
        # The FAISS store already exists:
        # so we don't need to download the transcript again
        retriever, llm = create_rag(video_id)
    else:

        # Get the transcript from YouTube
        transcript = get_transcript(video_url)

        # Convert the transcript into LangChain Documents
        # while preserving video ID and timestamp metadata
        document = load_transcript(
            transcript,
            video_id
        )

        # Split the documents into smaller chunks
        chunks = chunk_documents(document)

        # Create and save the new FAISS store
        retriever, llm = create_rag(
            video_id,
            chunks
        )


    # Return the retriever and LLM
    return retriever, llm
        
 
        
# Create the RAG components
def create_rag(video_id, chunks = None):

    # Create the embedding model
    embeddings = create_embeddings()

    # Check if we already have a saved FAISS store
    if vector_store_exists(video_id):
        
        # If it exists, load it from disk
        vector_store = load_vector_store(
            video_id,
            embeddings
        )
        
    else:
        
        # If it doesn't exist, create a new FAISS store
        vector_store = create_vector_store(
            chunks,
            embeddings
        )
        
        # Sve it so we can reuse it later
        save_vector_store(
            vector_store,
            video_id
        )
        
    # Create the retriever
    retriever = create_retriever(vector_store)

    # Create the Gemini language model
    llm = create_llm()

    return retriever, llm


# Ask a question using the RAG components
def ask_question(retriever, llm, question, video_id):
    
    # Create a unique cache key for this video and question
    cache_key = create_cache_key(
        video_id,
        question
    )

    # Check whether this question was already answered
    cached_result = load_cached_answer(cache_key)

    # Return the cached answer if it exists
    if cached_result is not None:
        
        # Show that the cache is being used
        print("Cache hit - returning cached answer.")
        
        return cached_result
    
    # No cached answer was found
    print("Cache miss - calling Gemini.")
    
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
    try:
        
        response = llm.invoke(prompt)
        
        # Get the generated answer
        answer = response.content
    except Exception as e:
        
        # Convert the error to text
        error_message = str(e)
        
        # Handle Gemini quota/rate-limit errors
        if "429" in error_message or "RESOURCE_EXHAUSTED" in error_message:
            
            answer = (
                "The AI generation limit has been reached temporarily. "
                "Plese try again later."
            )
        
        else:
            # Handle other Gemini errors
            answer = (
                "Sorry, I couldn't generate an answer right now."
            )
            
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
    
    # Create the final answer
    result = {
        "answer": answer,
        "sources": sources
    }
    
    # Save the result so the same question
    # doesn't need another Gemini call
    save_cached_answer(
        cache_key,
        result
    )
    
    return result