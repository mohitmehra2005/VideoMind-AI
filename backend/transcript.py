from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi


# Extract the Video ID from a YouTube URL
def extract_video_id(url):
    parsed_url = urlparse(url)

    # Normal YouTube URL
    if parsed_url.hostname in ["www.youtube.com", "youtube.com"]:
        query_parameters = parse_qs(parsed_url.query)

        if "v" in query_parameters:
            return query_parameters["v"][0]

    # Short YouTube URL
    elif parsed_url.hostname == "youtu.be":
        return parsed_url.path.lstrip("/")

    return None


# Fetch the English transcript
def get_transcript(url):
    video_id = extract_video_id(url)

    if not video_id:
        raise ValueError("Invalid YouTube URL.")

    try:
        # Create YouTube Transcript API client
        ytt_api = YouTubeTranscriptApi()

        # Fetch English transcript
        transcript = ytt_api.fetch(
            video_id,
            languages=["en"]
        )

        # Combine all transcript snippets into one text
        transcript_text = " ".join(
            snippet.text
            for snippet in transcript
        )

        return transcript_text

    except Exception as e:
        raise Exception(
            f"Error fetching transcript: {e}"
        )