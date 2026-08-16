from backend.cache import (
    create_cache_key,
    save_cached_answer,
    load_cached_answer
)


# Create summaries from the transcript
def summarize_video(chunks, llm, video_id):

    # Create a unique key for this video's summary
    cache_key = create_cache_key(
        video_id,
        "video_summary"
    )

    # Check whether this video already has a summary
    cached_summary = load_cached_answer(cache_key)

    # Return the cached summary if it exists
    if cached_summary is not None:

        print("Summary cache hit - returning cached summary.")

        return cached_summary["summary"]
    
    # Combine the transcript chunks into one text
    transcript_text = "\n\n".join(
        chunk.page_content
        for chunk in chunks
    )
    
    # Create one sumar prompt
    prompt = f"""
    
    You are summarizing a video transcript
    
    Create a clear, factual and well-structured summary
    of the transcript below
    
    Include:
    - The main topic
    - The most important ideas
    - Important arguments or explanation
    - Major takeaways
    
    Only use information supported by the transcript
    
    Do not invent information.
    Do not make assumptions.
    Do not discuss information that is not present
    in the transcript
    
    Treanscript:
    
    {transcript_text}
    
    Summary:
    """
    
    try:
        
        print("Summary chache miss - calling Gemini once.")
        
        # Ask Gemini to summarize the transcript
        response = llm.invoke(prompt)
        
        # Get the generated text
        content = response.content
        
        # Check whether Gemini returned usable text
        if not content:
            
            print("Gemini returned an empty summary.")
            
            return(
                "Sorry. I coludn't generate the video "
                "summary right now"
            )
            
        # Save the summary in the cache
        result = {
            "summary": content
        }
        
        save_cached_answer(
            cache_key,
            result
        )
        
        # Return the generated summary
        return content
    
    except Exception as e:
        
        # Convert the error to text
        error_message = str(e)
        
        # Handle Gemini quota/rate-limit errors
        if(
            "429" in error_message
            or "RESOURCE_EXHAUSTED" in error_message
        ):
            
            return(
                "The AI genration limit has been reached "
                "temporarily. Please try gain later."
            )
            
        # Handle other Gemini errors
        print(f"Summary generation error: {error_message}")
        
        return(
            "Sorry, I couldn't generate the video "
            "summary right now."
        )