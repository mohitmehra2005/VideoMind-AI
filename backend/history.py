import json
import os
from datetime import datetime


# Folder where analysis history will be stored
HISTORY_DIR = "data/history"


def _ensure_history_dir():
    """Create the history directory if it does not exist."""
    os.makedirs(HISTORY_DIR, exist_ok=True)


def _get_history_file(video_id: str):
    """Return the file path for a video's analysis history."""
    _ensure_history_dir()

    safe_video_id = "".join(
        char if char.isalnum() or char in ("-", "_") else "_"
        for char in video_id
    )

    return os.path.join(
        HISTORY_DIR,
        f"{safe_video_id}.json"
    )


def save_analysis(
    video_id: str,
    title: str = None,
    thumbnail: str = None,
    duration: str = None,
    summary=None,
    structured_summary=None,
    transcript=None,
    quiz=None,
):
    """
    Save or update an analyzed video's data.
    """

    file_path = _get_history_file(video_id)

    # Load existing data if this video was already saved
    existing_data = {}

    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                existing_data = json.load(file)
        except Exception as e:
            print(f"Could not load existing history: {e}")

    # Only overwrite values that are actually provided
    analysis_data = {
        **existing_data,
        "video_id": video_id,
        "title": title if title is not None else existing_data.get("title"),
        "thumbnail": thumbnail if thumbnail is not None else existing_data.get("thumbnail"),
        "duration": duration if duration is not None else existing_data.get("duration"),
        "summary": summary if summary is not None else existing_data.get("summary"),
        "structured_summary": (
            structured_summary
            if structured_summary is not None
            else existing_data.get("structured_summary")
        ),
        "transcript": (
            transcript
            if transcript is not None
            else existing_data.get("transcript")
        ),
        "quiz": quiz if quiz is not None else existing_data.get("quiz"),
        "created_at": existing_data.get(
            "created_at",
            datetime.utcnow().isoformat()
        ),
        "updated_at": datetime.utcnow().isoformat(),
    }

    try:
        with open(file_path, "w", encoding="utf-8") as file:
            json.dump(
                analysis_data,
                file,
                ensure_ascii=False,
                indent=2,
                default=str
            )

        print(f"Analysis history saved: {video_id}")

        return analysis_data

    except Exception as e:
        print(f"Error saving analysis history: {e}")
        return None


def get_analysis(video_id: str):
    """Get the complete saved analysis for one video."""

    file_path = _get_history_file(video_id)

    if not os.path.exists(file_path):
        return None

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return json.load(file)

    except Exception as e:
        print(f"Error loading analysis history: {e}")
        return None


def get_all_analyses():
    """
    Return all saved analyses.
    Only lightweight metadata is returned for the sidebar.
    """

    _ensure_history_dir()

    analyses = []

    try:
        for filename in os.listdir(HISTORY_DIR):

            if not filename.endswith(".json"):
                continue

            file_path = os.path.join(HISTORY_DIR, filename)

            try:
                with open(file_path, "r", encoding="utf-8") as file:
                    data = json.load(file)

                analyses.append({
                    "video_id": data.get("video_id"),
                    "title": data.get("title") or "Untitled Video",
                    "thumbnail": data.get("thumbnail"),
                    "duration": data.get("duration"),
                    "created_at": data.get("created_at"),
                    "updated_at": data.get("updated_at"),
                })

            except Exception as e:
                print(
                    f"Error reading history file {filename}: {e}"
                )

        # Most recently updated videos first
        analyses.sort(
            key=lambda item: item.get("updated_at") or "",
            reverse=True
        )

        return analyses

    except Exception as e:
        print(f"Error loading analysis history: {e}")
        return []


def delete_analysis(video_id: str):
    """Delete a saved video's analysis history."""

    file_path = _get_history_file(video_id)

    if not os.path.exists(file_path):
        return False

    try:
        os.remove(file_path)

        print(f"Analysis deleted: {video_id}")

        return True

    except Exception as e:
        print(f"Error deleting analysis: {e}")
        return False