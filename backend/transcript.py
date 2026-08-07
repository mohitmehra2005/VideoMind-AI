"""
==========================================================
Module Name : transcript.py

Project     : VideoMind AI

Purpose:
This module extracts the transcript from a YouTube video.

Workflow:
1. Receive YouTube URL.
2. Extract Video ID.
3. Fetch transcript from YouTube.
4. Return transcript.

==========================================================
"""
# urllib is used for working with url's 
from urllib.parse import urlparse, parse_qs
#This imports the YouTube Transcript API library.
from youtube_transcript_api import YouTubeTranscriptApi

def extract_video_id(url):
    """
    Purpose:
        Extract the YouTube Video ID from a YouTube URL.

    Parameters:
        url (str): Complete YouTube URL.

    Returns:
        str: YouTube Video ID.
    """
    #urlparse() breaks the complete YouTube URL into parts
    #such as scheme, hostname, path and query.
    parsed_url = urlparse(url)
    
    #Check whether the URL belongs to YouTube
    if parsed_url.hostname in ["www.youtube.com", "youtube.com"]: 
          
        #Extract the query part from the URL
        query = parse_qs(parsed_url.query)
        
        #Return the YouTubevideo ID
        return query.get("v", [None])[0]
    
    #Check whether the URL is in the short YouTube format
    elif parsed_url.hostname == "youtu.be":
        
        ## Extract the Video ID from the URL path
        return parsed_url.path[1:]
    
    # Return None if the URL is not a valid YouTube URL
    else:
        return None
        
def get_transcript(url):
    """
    Purpose:
        Fetch the transcript from a YouTube video.

    Parameters:
        url (str): Complete YouTube URL.

    Returns:
        str: Complete transcript as a single string.
    """

    # Extract the Video ID from the YouTube URL.
    # Example:
    # https://www.youtube.com/watch?v=abcd1234
    # becomes
    # abcd1234
    video_id = extract_video_id(url)
    
    # Print the extracted Video ID (for debugging).
    print(f"Video ID: {video_id}")

    # Check whether a valid Video ID was extracted.
    # If not, stop the program and show an error.
    if not video_id:
        raise ValueError("Invalid YouTube URL.")
    
    # Try to fetch the transcript from YouTube.
    # If any error occurs (for example, transcript not available),
    # the except block will handle it.
    try:
        
        # Fetch the transcript from YouTube using the Video ID.
        # The API returns the transcript as a list of dictionaries.
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        
        # Extract only the spoken text from each transcript entry.
        # Each entry is a dictionary containing:
        # text, start time and duration.
        transcript_text = " ".join(
            entry["text"] for entry in transcript
        )
        
        #Return the complete transcript as one string
        return transcript_text
    
    #Catch any exception raised while fetching the trancript.
    except Exception as e:
        
        #Raise a new exception while a meaningful error message.
        raise Exception(f"Error fetching transcript: {e}")

            
        
            
        

        