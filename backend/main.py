from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from backend.rag import process_video, ask_question
from backend.summarize import summarize_video
from backend.quiz import generate_quiz

# Create the FastAPI application
app = FastAPI(
    title = "VideoMind AI"
)

# Store the RAG system for processed videos
video_sessions = {}

# Request body for processing a video
class VideoRequest(BaseModel):
    
    # YouTube video URL
    video_url: str
    
# Request body for asking a question
class AskRequest(BaseModel):
    
    # YouTube video ID
    video_id: str
    
    # User's question
    question: str
    
# Health-check endpoint
@app.get("/")
def root():
    
    return{
        "message": "VideoMind AI backend is running!"
    }
    
# Process a YouTube video
@app.post("/video")
def process_video_endpoint(request: VideoRequest):
    
    # Proces the video and create the RAG system
    retriever, llm, chunks = process_video(
        request.video_url
    )
    
    # Extract the YouTube video ID
    video_id = request.video_url.split("v=")[1].split("&")[0]
    
    # Store the RAG components for this video
    video_sessions[video_id] = {
        "retriever": retriever,
        "llm": llm,
        "chunks": chunks
    }  
    
    return{
        "message": "Video processed successfully.",
        "video_id": video_id
    }
    
# Ask a question about a processed video
@app.post("/ask")
def ask_video_question(request: AskRequest):
    
    # Check whether the video has been processed
    if request.video_id not in video_sessions:
        
       raise HTTPException(
           status_code = 404,
           detail = "Video has not been processed yet."
       )
        
    # Get th RAG components for this video
    session = video_sessions[request.video_id]
    
    retriever = session["retriever"]
    llm = session["llm"]
    
    # Ask the RAG system the question
    result = ask_question(
        retriever,
        llm,
        request.question,
        request.video_id
    )
    
    # Return the RAG response
    return result

# Create a summary of a processed video
@app.post("/summary")
def summarize_video_endpoint(request: VideoRequest):
    
    # Extract the video ID from the URL
    video_id = request.video_url.split("v=")[1].split("&")[0]
    
    # Check whether the video has been processed
    if video_id not in video_sessions:
        
        raise HTTPException(
            status_code = 404,
            detail = "Video has not been processed yet."
        )
        
    # Get the RAG components and chunks for this video
    session = video_sessions[video_id]
    
    llm = session["llm"]
    chunks = session["chunks"]
    
    # Generate the video summary
    summary = summarize_video(
        chunks,
        llm,
        video_id
    )
    
    # Handle Gemini quota errors
    if isinstance(summary, str) and "AI generation limit" in summary:
        
        raise HTTPException(
            status_code = 429,
            detail = summary
        )
    
    # Return the summary
    return{
        "video_id": video_id,
        "summary": summary
    }
    
# Generate a quiz for a processed video
@app.post("/quiz")
def generate_quiz_endpoint(request: VideoRequest):
    
    # Extract the videoID from the URL
    video_id = request.video_url.split("v=")[1].split("&")[0]
    
    # Check whether the video has been processed
    if video_id not in video_sessions:
        
        raise HTTPException(
            status_code = 404,
            detail = "Video has not been processed yet."
        )
    
    # Get the session for this video
    session = video_sessions[video_id]
    
    # Fet the LLM and transcript chunks
    llm = session["llm"]
    chunks = session["chunks"]
    
    # Generate the quiz
    quiz = generate_quiz(
        chunks,
        llm,
        video_id
    )
    
    # Handle Gemini quota errors
    if isinstance(quiz, str) and "AI generation limit" in quiz:
        
        raise HTTPException(
            status_code = 429,
            detail = quiz
        )
        
    # Return the quiz
    return{
        "video_id": video_id,
        "quiz": quiz
    }