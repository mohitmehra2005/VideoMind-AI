from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi


# Extract the YouTube video ID from the URL
def extract_video_id(url):

    # Break the URL into different parts
    parsed_url = urlparse(url)

    # Example:
    # https://www.youtube.com/watch?v=abc123
    if parsed_url.hostname in ["www.youtube.com", "youtube.com"]:

        # Get the values from the URL query
        # In this case, we want the "v" value
        query = parse_qs(parsed_url.query)

        # If "v" exists, return its value
        if "v" in query:
            return query["v"][0]

    # Short YouTube URL
    elif parsed_url.hostname == "youtu.be":

        # The video ID is after /
        return parsed_url.path.lstrip("/")

    # If the URL isn't recognised
    return None


# Get transcript from YouTube
def get_transcript(url):

    # First, get the video ID
    video_id = extract_video_id(url)

    # Stop if we couldn't find a video ID
    if not video_id:
        raise ValueError("Invalid YouTube URL.")

    try:

        # Create the YouTube Transcript API object
        ytt_api = YouTubeTranscriptApi()

        # Fetch the English transcript
        transcript = ytt_api.fetch(
            video_id,
            languages=["en"]
        )
        
        # Return the transcript segments directly
        #
        # We dont't combine them into one big string anymore.
        #
        # We keep each segment because every segment contains
        # Useful information such as:
        #
        # text     -- what is said
        # start    -- when it is started
        # duration -- how long it is
        # 
        # We need this information later for timestamps.
        return transcript

    except Exception as e:

        # Show a clear error if something goes wrong
        raise Exception(
            f"Error Fetching transcript: {e}"
        )
