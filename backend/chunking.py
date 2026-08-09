# Import the RecursiveCharacterTextSplitter from LangChain.
# This class is responsible for splitting large documents
# into smaller chunks.
from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_documents(documents):
    """
    Split langChain Documents into chunks.
    
    Parameters:
    documents (list): a list of LangChain Document objects.
    
    Returns:
    list: A list containing the smaller socument chunks.

    """
    
    # Create the text splitter.
    text_splitter = RecursiveCharacterTextSplitter(
        
        # Try to keep each chunk around 1000 characters.
        chunk_size = 1000,
        
        # Keep around 200 characters from the previous
        # Chunk to preserve context between chunks.
        chunk_overlap = 200
    )
    
    # Split the document into smaller chunks.
    chunks = text_splitter.split_documents(documents)
    
    # Return the generated chunks.
    return chunks