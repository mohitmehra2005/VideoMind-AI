from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.auth import router as auth_router
from backend.rag import process_video, ask_question
from backend.summarize import summarize_video, summarize_video_structured
from backend.quiz import generate_quiz
from backend.transcript import extract_video_id

# Create the FastAPI application
app = FastAPI(
    title="OpticAI Backend"
)

# Enable CORS for frontend communication (localhost:3000, 3001)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Authentication Router (/auth/google/login, /auth/google/callback, /auth/me, /auth/logout)
app.include_router(auth_router)

# Store the RAG system for processed videos
video_sessions = {}

# Request body for processing a video
class VideoRequest(BaseModel):
    video_url: str

# Request body for asking a question
class AskRequest(BaseModel):
    video_id: str
    question: str

# Health-check endpoint
@app.get("/")
def root():
    return {
        "message": "OpticAI backend is running!",
        "status": "online"
    }

# Process a YouTube video
@app.post("/video")
def process_video_endpoint(request: VideoRequest):
    retriever, llm, chunks = process_video(
        request.video_url
    )
    
    video_id = extract_video_id(request.video_url) or request.video_url.split("v=")[1].split("&")[0]
    
    video_sessions[video_id] = {
        "retriever": retriever,
        "llm": llm,
        "chunks": chunks,
        "url": request.video_url
    }
    
    return {
        "message": "Video processed successfully.",
        "video_id": video_id
    }

# Ask a question about a processed video
@app.post("/ask")
def ask_video_question(request: AskRequest):
    if request.video_id not in video_sessions:
        raise HTTPException(
            status_code=404,
            detail="Video has not been processed yet."
        )
        
    session = video_sessions[request.video_id]
    retriever = session["retriever"]
    llm = session["llm"]
    
    result = ask_question(
        retriever,
        llm,
        request.question,
        request.video_id
    )
    
    return result

# Create a summary of a processed video
@app.post("/summary")
def summarize_video_endpoint(request: VideoRequest):
    video_id = extract_video_id(request.video_url) or request.video_url.split("v=")[1].split("&")[0]
    
    if video_id not in video_sessions:
        raise HTTPException(
            status_code=404,
            detail="Video has not been processed yet."
        )
        
    session = video_sessions[video_id]
    llm = session["llm"]
    chunks = session["chunks"]
    
    summary = summarize_video(chunks, llm, video_id)
    
    if isinstance(summary, str) and "AI generation limit" in summary:
        raise HTTPException(status_code=429, detail=summary)
    
    return {
        "video_id": video_id,
        "summary": summary
    }

# Full structured analysis endpoint for OpticAI workspace
@app.post("/analysis")
def full_analysis_endpoint(request: VideoRequest):
    video_id = extract_video_id(request.video_url) or request.video_url.split("v=")[1].split("&")[0]
    
    if video_id not in video_sessions:
        # Auto-process if not yet in memory
        try:
            retriever, llm, chunks = process_video(request.video_url)
            video_sessions[video_id] = {
                "retriever": retriever,
                "llm": llm,
                "chunks": chunks,
                "url": request.video_url
            }
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to process video: {str(e)}")
            
    session = video_sessions[video_id]
    llm = session["llm"]
    chunks = session["chunks"]
    
    # Generate structured summary
    structured_data = summarize_video_structured(chunks, llm, video_id)
    
    # Generate quiz
    try:
        quiz_data = generate_quiz(chunks, llm, video_id)
    except Exception:
        quiz_data = []
        
    return {
        "video": {
            "id": video_id,
            "url": request.video_url,
            "title": f"Video {video_id}",
            "channel": "YouTube Creator",
            "duration": "Indexed Duration",
            "thumbnail": f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
        },
        "executive_summary": structured_data.get("executive_summary", ""),
        "structured_summary": structured_data.get("structured_summary", []),
        "key_takeaways": structured_data.get("key_takeaways", []),
        "quiz": quiz_data
    }

# Generate a quiz for a processed video
@app.post("/quiz")
def generate_quiz_endpoint(request: VideoRequest):
    video_id = extract_video_id(request.video_url) or request.video_url.split("v=")[1].split("&")[0]
    
    if video_id not in video_sessions:
        raise HTTPException(
            status_code=404,
            detail="Video has not been processed yet."
        )
    
    session = video_sessions[video_id]
    llm = session["llm"]
    chunks = session["chunks"]
    
    quiz = generate_quiz(chunks, llm, video_id)
    
    if isinstance(quiz, str) and "AI generation limit" in quiz:
        raise HTTPException(status_code=429, detail=quiz)
        
    return {
        "video_id": video_id,
        "quiz": quiz
    }