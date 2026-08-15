# Create summaries from the transcript
def summarize_video(chunks, llm):

    # Store the summaries of each group of chunks
    partial_summaries = []

    # Number of chunks to process in one group
    batch_size = 8

    # Process the chunks in small groups
    for i in range(0, len(chunks), batch_size):

        # Get one group of chunks
        batch = chunks[i:i + batch_size]

        # Combine the text from the current group
        batch_text = "\n\n".join(
            chunk.page_content
            for chunk in batch
        )

        # Create a prompt for this group
        prompt = f"""
        You are summarizing part of a video transcript.

        Create a clear and facual sumary of the content below.
        Include the main ideas, important arguments, and key information.
        Do not add information that is not present in the transcript.

        Transcript section:

        {batch_text}

        Summary:
        """

        try:

            # Ask Gemini to summarize this group
            response = llm.invoke(prompt)
            
            # Get the generated text
            content = response.content
           
            # Check whether Gemini returned usable text  
            if content:
                
                # Stores the generated summary
                partial_summaries.append(content)
                
            else:
                
                # Gemini returned an empty response,
                # possibly because of a safety filter
                partial_summaries.append(
                    "this section could not be summarized."
                )  
                
        except Exception:
            
            # Keep going if Gemini returns an error
            partial_summaries.append(
                "This section could not be summarized."
            )    
                      
    # Combine all partial summaries
    combined_summaries = "\n\n".join(
        partial_summaries
    )

    # Create the final summary prompt
    final_prompt = f"""
    You are creating the final summary of a video.

    Combines the section summaries below into one clear,
    well - structured summary.

    Include:
    - The main topic
    - The most important idea
    - Important arguments or explanation
    - Major takeaways

    Do not add information that is not supported by the summaries

    Seclection summaries:

    {combined_summaries}

    Fial summary:
    """

    try:

        # Ask Gemini to create the final summary
        final_response = llm.invoke(final_prompt)

        # Return the final text
        return final_response.content

    except Exception:

        # Return a friendly message if generation fails
        return (
            "Sorry, I couldn't generate the video summary "
            "right now."
        )