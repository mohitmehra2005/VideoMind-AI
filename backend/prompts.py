# Create a rompt using the user's questions and retrieved context
def create_prompt(question, context):
    prompt = f"""
    You are a helpful AI assistant
    Answer the user's question using the provided context.
    Context:
    {context}
    Question:
    {question}
    If the answer is not present in the context, say that
    you don't have enough information from the provided context
    Answer:
    """
    return prompt
