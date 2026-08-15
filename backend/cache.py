import hashlib
import json
from pathlib import Path


# Folder where cached answers will be stored
CACHE_DIR = Path("cache")


# Create a unique key for each video + question combination
def create_cache_key(video_id, question):

    # Combine the video ID and question
    raw_key = f"{video_id}:{question.strip().lower()}"

    # Convert the combined text into a SHA-256 hash
    return hashlib.sha256(
        raw_key.encode("utf-8")
    ).hexdigest()


# Save an answer to the cache
def save_cached_answer(cache_key, result):

    # Create the cache folder if it doesn't exist
    CACHE_DIR.mkdir(
        parents = True,
        exist_ok = True
    )

    # Create the file path for this cached answer
    cache_file = CACHE_DIR / f"{cache_key}.json"

    # Save the result as JSON
    cache_file.write_text(
        json.dumps(result, indent=2),
        encoding = "utf-8"
    )


# Load an answer from the cache
def load_cached_answer(cache_key):

    # Find the cached answer file
    cache_file = CACHE_DIR / f"{cache_key}.json"

    # If the file doesn't exist, there is no cached answer
    if not cache_file.exists():
        return None

    # Read the cached JSON and convert it back to a Python object
    return json.loads(
        cache_file.read_text(
            encoding = "utf-8"
        )
    )