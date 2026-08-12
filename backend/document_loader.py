from langchain_core.documents import Document

# Convert the transcript into a LangChain Document
def load_transcript(transcript):

    document = Document(
        page_content = transcript

    )

    return document
