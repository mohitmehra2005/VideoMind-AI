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
        "video_summary_v2"
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
    You are summarizing a YouTube video transcript.

Create a comprehensive, factual, and well-structured summary
of the ENTIRE transcript.

IMPORTANT RULES:

1. Cover the video from the beginning to the end.
2. Include all major topics, arguments, events, and important ideas.
3. Do not focus only on the first part of the transcript.
4. Do not stop summarizing halfway through the video.
5. For long videos, provide BETWEEN 8 AND 15 meaningful summary points.
6. Do not return fewer than 8 points unless the transcript genuinely
   contains fewer than 8 distinct meaningful topics.
7. Each bullet point must cover a distinct important topic, idea,
   argument, event, or conclusion.
8. Keep each point concise but informative.
9. Use bullet points starting with "* ".
10. Use **bold headings** at the beginning of each point when helpful.
11. Only use information supported by the transcript.
12. Do not invent information.
13. Do not make assumptions.

IMPORTANT:
The goal is to help the user understand the FULL video, not just
give a short overview. Make sure important topics from the middle
and final parts of the transcript are also included.

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
    
    print("NUMBER OF CHUNKS:", len(chunks))
    print("TRANSCRIPT LENGTH:", len(transcript_text))
    print("LAST PART OF TRANSCRIPT:")
    print(transcript_text[-1000:])

    prompt = f"""
You are an expert AI analyzing a YouTube video transcript.

Your task is to create a structured chronological breakdown of the ENTIRE video.

Return a JSON object with exactly these fields:

{{
  "executive_summary": "A concise 2-3 sentence overview of the entire video.",
  "structured_summary": [
    {{
      "id": 1,
      "title": "Section title",
      "explanation": "Clear explanation of this part of the video.",
      "key_points": [
        "Important point 1",
        "Important point 2",
        "Important point 3"
      ],
      "start_timestamp": "MM:SS",
      "end_timestamp": "MM:SS"
    }}
  ]
}}

IMPORTANT RULES:

1. Create BETWEEN 8 AND 12 sections for a video longer than 40 minutes.
2. Cover the ENTIRE transcript from the beginning to the final part.
3. Do NOT combine large portions of the video into one section.
4. Each section should represent a distinct chronological topic or discussion.
5. The sections must be in chronological order.
6. The first section must start near 00:00.
7. The final section MUST cover the final portion of the transcript.
8. Distribute timestamps across the FULL duration of the video.
9. Do not stop at the middle of the transcript.
10. Do not create only 4 or 5 large sections.
11. Prefer smaller, meaningful sections rather than combining unrelated topics.
12. Every section must contain:
   - id
   - title
   - explanation
   - key_points
   - start_timestamp
   - end_timestamp

TIMESTAMP RULES:

- Use timestamps that reflect the chronological position of the topic.
- Timestamps must progressively move forward.
- Do not repeatedly use 00:00.
- Do not place most of the video content inside the final section.
- The last section should end near the actual end of the video.

OUTPUT ONLY VALID JSON.
Do not include markdown.
Do not include ```json.
Do not include explanations outside the JSON.

TRANSCRIPT:

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