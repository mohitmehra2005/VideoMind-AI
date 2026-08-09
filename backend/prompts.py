# Import ChatPromptTemplate from LangChain.
# It allows us to create a reusable prompt template.
from lagnchain_core.prompts import ChatPTromptTemplete

# Create the prompt templete for our RAG syatem.
prompt = ChatPromptTemplete.from_templete(
    """
    Answer the user's questions based only on the provided context.
    
    If the answer cannot be found in the context, say that you
    don't know the answer based on the provided information
    
    Context:
    {context}
    
    Question;
    {questions}
    
    Answer:
    """
)