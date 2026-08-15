import json

from backend.cache import(
    create_cache_key,
    save_cached_answer,
    load_cached_answer
)

# Generate a quiz from the transcript chunks
def generate_quiz(chunks, llm, video_id):
    
    # Create a unique chache key for this video's quiz
    cache_key = create_cache_key(
        video_id,
        "video_quiz"
    )
    
    # Check whether this video already has a quiz
    cached_quiz = load_cached_answer(cache_key)
    
    # Return the cached quiz if it exists
    if cached_quiz is not None:
        
        print("Quiz cache hit - returning cached quiz. ")
        
        return cached_quiz["quiz"]
    
    # Use a limited number of chunks for quiz generation
    quiz_chunks = chunks[:20]

    # Combine the selected chunks into one text
    quiz_text = "\n\n".join(
        chunk.page_content
        for chunk in quiz_chunks
    )
    
    # Create the quiz generation prompt
    prompt = f"""
    
    You are creating a quiz from a video transcript.
    
    Create 5 multiple-choice questions based ONLY
    on the transcript below
    
    Each question must contain:
    - question
    - exactly 4 options
    - correct_answer
    - explanation
    
    Return ONLY valid JSON in this format
    
    {{
        "questions": [
            {{
                "question": "Question text",
                "options" :[
                    "Option A",
                    "Option B",
                    "Option C",
                    "Option D"
                ],
                "correct_answer": "Option A",
                "explanation": "Explanation based on the transcript."
            }}
        ]
    }}
    
    Do not add information that is not supported
    by the transcript
    
    Transcript:
    
    {quiz_text}
    """
    try:
        
        # Ask Gemini to genrate the quiz
        response = llm.invoke(prompt)
        
        # Get the genrated response
        content = response.content
        
        # Check whether Gemini returned anything
        if  not content:
            
            return(
                "Sorry, I couldn't generate the quiz "
                "right now."
            )
            
        # Remove Markdown code fences if Gemini adds them
        content = content.strip()

        if content.startswith("```json"):
            content = content[7:]

        if content.endswith("```"):
            content = content[:-3]

        # Convert the JSON text into Python data
        quiz = json.loads(content.strip())
        
        # Save the generated quiz to the cache
        save_cached_answer(
            cache_key,
            {
                "quiz": quiz
            }
        )

        # Return the quiz
        return quiz
    except Exception as e:
        
        # Convert the error to text
        error_message = str(e)
        
        # Handle Gemini quota/rate-limit error
        if(
            "429" in error_message
            or "RESOURCE_EXHAUSTED" in error_message
        ):
            
            return(
                "The AI generation limit has been reached "
                "temorarily. PLease try again later."
            )
            
        # Handle other errors
        return(
            "Sorry, I couldn't generate the quiz "
            "right now."
        )
    