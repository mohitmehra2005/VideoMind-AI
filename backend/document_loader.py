# Import the Document class from LangChain.
# Document is the standard format LangChain uses
# to represent a piece of text.
from langchain_core.documents import Document

def create_document(transcript):
    """
    Purpose:
    Convert the YouTube transcript string
    into a langchain document.
    
    Parameters:
    transcript (str): Complete YouTube transcript.
    
    returns:
    list: A list containing one langchain Document

    """
    
    # Create a langchain document from the transcript.
    document = Document(
        page_content = transcript
    )
    
    # Return the document inside the list.
    # LangChain's document processing components
    # Generally work with list of documents.
    return[document]