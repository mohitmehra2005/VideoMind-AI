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

        # Convert transcript into a normal list
        # while preserving text and timestamps
        segments = []

        for item in transcript:
            segments.append({
                "text": item.text,
                "start": item.start,
                "duration": item.duration
            })

        return segments

    except Exception as e:

        # Show a clear error if something goes wrong
        raise Exception(
            f"Error fetching transcript: {e}"
        )