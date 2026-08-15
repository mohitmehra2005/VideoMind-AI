from langchain_text_splitters import RecursiveCharacterTextSplitter

# Split Documents into smaller chunks
def chunk_documents(documents):
    
    # Create the text splitter
    splitter = RecursiveCharacterTextSplitter(
        chunk_size = 1200,
        chunk_overlap = 300
    )
    
    # Split the Documents into chunks
    chunks = splitter.split_documents(documents)
    
    return chunks