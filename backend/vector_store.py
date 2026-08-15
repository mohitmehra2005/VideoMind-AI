from pathlib import Path

from langchain_community.vectorstores import FAISS

# Folder where we will store all FAISS indexes
VECTOR_STORE_DIR = Path("vector_stores")

# Create a vector store from transcript chunks
def create_vector_store(chunks, embeddings):
    
    # Convert the chunks into vectors
    #and store them inside FAISS
    vector_store = FAISS.from_documents(
        chunks,embeddings
    )
    
    # Return the newly created FAISS vector store
    return vector_store

# Save a FAISS vector store to disk
def save_vector_store(vector_store, video_id):
    
    # Create the main vector_stores folder
    # if it doesn't already exist
    VECTOR_STORE_DIR.mkdir(
        parents = True,
        exist_ok = True
    )
    
    # Create a separate folder fot this video
    video_folder = VECTOR_STORE_DIR / video_id
    
    # Create the video folder
    video_folder.mkdir(
        parents = True,
        exist_ok = True
    )
    
    # Save the FAISS index inside the video folder
    vector_store.save_local(
        str(video_folder)
    )
    
# Load an existing FAISS vector store
def load_vector_store(video_id, embeddings):
    
    # Find the folder belonging to this video
    video_folder = VECTOR_STORE_DIR / video_id
    
    # Load the FAISS vector store from disk
    loaded_vector_store = FAISS.load_local(
        str(video_folder),
        embeddings,
        allow_dangerous_deserialization = True
    )
    
    # Return the loaded FAISS store
    return loaded_vector_store

# Check whether a saved vector store exists for a video
def vector_store_exists(video_id):

    # Find the folder belonging to this video
    video_folder = VECTOR_STORE_DIR / video_id

    # Check whether the folder exists
    # and contains the FAISS index
    return (
        video_folder.exists()
        and (video_folder / "index.faiss").exists()
    )