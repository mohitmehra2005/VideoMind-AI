from fastapi import FastAPI
from pydantic import BaseModel

from backend.rag import process_video

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
    retriever, llm = process_video(
        request.video_url
    )
    
    # Extract the YouTube video ID
    video_id = request.video_url.split("v=")[1].split("&")[0]
    
    # Store the RAG components for this video
    video_sessions[video_id] = {
        "retriever": retriever,
        "llm": llm
    }  
    return{
        "message": "Video processed successfully.",
        "video_id": video_id
    }