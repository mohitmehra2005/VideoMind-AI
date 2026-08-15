from langchain_core.documents import Document


# Convert the transcript into larger LangChain Documents
def load_transcript(transcript, video_id):

    # Create an empty list to store our Documents
    documents = []

    # Temporary storage for transcript text
    current_text = []

    # Timestamp for the beginning of the current Document
    current_start = None

    # Timestamp for the end of the current Document
    current_end = None

    # Target size before creating a Document
    document_size = 3000

    # Go through every transcript segment
    for segment in transcript:

        # Get the spoken text
        text = segment.text.strip()

        # Skip empty segments
        if not text:
            continue

        # Remember when this Document started
        if current_start is None:
            current_start = segment.start

        # Add this transcript segment to our temporary text
        current_text.append(text)

        # Update the ending timestamp
        current_end = segment.start + segment.duration

        # Combine all the collected transcript segments
        # into one large string
        combined_text = " ".join(current_text)

        # If we have collected enough text,
        # create a LangChain Document
        if len(combined_text) >= document_size:

            document = Document(

                # Store the combined transcript text
                page_content=combined_text,

                # Store useful metadata
                metadata={
                    "video_id": video_id,
                    "start_time": current_start,
                    "end_time": current_end
                }
            )

            # Add the Document to our list
            documents.append(document)

            # Clear the temporary text
            # so we can start building the next Document
            current_text = []

            # Reset the timestamp
            current_start = None
            current_end = None

    # IMPORTANT:
    # The for loop is finished here.
    # There may still be some transcript text left
    # that hasn't reached 3000 characters.
    # We still need to save that final piece.
    if current_text:

        # Create a Document from the remaining transcript
        document = Document(

            # Store the remaining transcript text
            page_content=" ".join(current_text),

            # Store useful metadata
            metadata={
                "video_id": video_id,
                "start_time": current_start,
                "end_time": current_end
            }
        )

        # Add the final Document to our list
        documents.append(document)

    # Return all the larger Documents
    return documents