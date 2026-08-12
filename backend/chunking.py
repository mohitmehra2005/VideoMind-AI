from langchain_text_splitters import RecursiveCharacterTextSplitter


# Split Documents into smaller chunks
def chunk_documents(documents):

    # Create the text splitter
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    # Split the existing Documents into smaller Documents
    chunks = splitter.split_documents(documents)

    return chunks
