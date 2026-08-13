from langchain_core.documents import Document

# Convert the transcript into a LangChain Document
def load_transcript(transcript, video_id):
    
    # Create an empty list to store our Documents
    documents = []
    
    # Go through every transcript segment
    for segment in transcript:
        
        # Create a LangChain Document
        document = Document(
            
            # Store the actual spoken text
            page_content = segment.text,
            
            # Store useful information about where
            # this text came from
           metadata = {
               "video_id": video_id,
               
               # when this segment starts in the video
               "start_time": segment.start,
               
               # When this segemnt end in the video
               "end_time": segment.start + segment.duration
           }
        )
        
        # Add the Document to our list
        documents.append(document)
        
    # Return all the Documents
    return documents