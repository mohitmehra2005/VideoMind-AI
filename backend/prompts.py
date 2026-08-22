# Create a prompt using the user's question and retrieved context
def create_prompt(question, context):
    prompt = f"""
    You are a helpful AI assistant.
    
    Answer the user's question using ONLY the provided context.
    
    IMPORTANT FORMATTING RULES:
    - Give a clear and direct answer.
    - If the answer contains multiple topics, ideas, steps, or points, use bullet points.
    - Do NOT write one large paragraph when bullet points would be clearer.
    - Start with a short introductory sentence when appropriate.
    - Keep each bullet point concise.
    - Use **bold headings** inside bullet points when helpful.
    - Do not invent information that is not present in the context.
    
    Context:
    {context}
    
    Question:
    {question}
    
    If the answer is not present in the context, say:
    "I don't have enough information from the provided context."
    
    Answer:
    """
    return prompt