import json
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
    
    # Create one summary prompt
    prompt = f"""
    You are summarizing a video transcript.
    
    Create a clear, factual and well-structured summary of the transcript below.
    
    Include:
    - The main topic
    - The most important ideas
    - Important arguments or explanation
    - Major takeaways
    
    Only use information supported by the transcript.
    Do not invent information.
    Do not make assumptions.
    
    Transcript:
    {transcript_text}
    
    Summary:
    """
    
    try:
        print("Summary cache miss - calling Gemini once.")
        response = llm.invoke(prompt)
        content = response.content
        
        if not content:
            return "Sorry. I couldn't generate the video summary right now."
            
        result = {
            "summary": content
        }
        
        save_cached_answer(cache_key, result)
        return content
    
    except Exception as e:
        error_message = str(e)
        if "429" in error_message or "RESOURCE_EXHAUSTED" in error_message:
            return "The AI generation limit has been reached temporarily. Please try again later."
        print(f"Summary generation error: {error_message}")
        return "Sorry, I couldn't generate the video summary right now."


# Create hybrid structured summary from transcript
def summarize_video_structured(chunks, llm, video_id):
    cache_key = create_cache_key(
        video_id,
        "video_structured_summary"
    )

    cached_summary = load_cached_answer(cache_key)
    if cached_summary is not None:
        return cached_summary["data"]

    transcript_text = "\n\n".join(
        chunk.page_content
        for chunk in chunks
    )

    prompt = f"""
    You are an expert AI synthesizing an educational YouTube video transcript into a Hybrid Knowledge Breakdown.
    
    Generate a JSON object with:
    1. "executive_summary": A concise 2-3 sentence overview explaining the core thesis and purpose of the video in 20-30 seconds.
    2. "structured_summary": A list of 3-5 logical chronological sections. Each section must have:
       - "id": integer (1, 2, 3...)
       - "title": concise conceptual heading
       - "explanation": clear factual explanation
       - "key_points": array of 2-3 bullet point strings
       - "start_timestamp": mm:ss string (e.g. "02:15")
       - "end_timestamp": mm:ss string (e.g. "05:30")
    
    Output ONLY valid JSON.
    
    Transcript:
    {transcript_text}
    """

    try:
        response = llm.invoke(prompt)
        raw_text = response.content.strip()
        
        # Clean JSON fences if any
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
        raw_text = raw_text.strip()

        data = json.loads(raw_text)
        save_cached_answer(cache_key, {"data": data})
        return data
    except Exception as e:
        print(f"Structured summary error: {e}")
        # Fallback to plain summary
        plain_summary = summarize_video(chunks, llm, video_id)
        return {
            "executive_summary": plain_summary if isinstance(plain_summary, str) else "Video summary",
            "structured_summary": []
        }