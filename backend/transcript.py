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
        

