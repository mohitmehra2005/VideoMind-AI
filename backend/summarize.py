from backend.cache import (
    create_cache_key,
    save_cached_answer,
    load_cached_answer
)


# Create summaries from the transcript
def summarize_video(chunks, llm, video_id):

    # Create a unique key for this video's summary
    cache_key = create_cache_key(
        video_id,
        "video_summary"
    )

    # Check whether this video already has a summary
    cached_summary = load_cached_answer(cache_key)

    # Return the cached summary if it exists
    if cached_summary is not None:

        print("Summary cache hit - returning cached summary.")

        return cached_summary["summary"]

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

        Create a clear and factual summary of the content below.
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

                # Store the generated summary
                partial_summaries.append(content)

            else:

                # Gemini returned an empty response,
                # possibly because of a safety filter
                partial_summaries.append(
                    "This section could not be summarized."
                )

        except Exception as e:

            # Convert the error to text
            error_message = str(e)

            # Handle Gemini quota/rate-limit errors
            if (
                "429" in error_message
                or "RESOURCE_EXHAUSTED" in error_message
            ):

                # Stop instead of making more failed requests
                return (
                    "The AI generation limit has been reached "
                    "temporarily. Please try again later."
                )

            # Handle other Gemini errors
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

    Combine the section summaries below into one clear,
    well-structured summary.

    Include:
    - The main topic
    - The most important ideas
    - Important arguments or explanations
    - Major takeaways

    Do not add information that is not supported by the summaries.

    Section summaries:

    {combined_summaries}

    Final summary:
    """

    try:

        # Ask Gemini to create the final summary
        final_response = llm.invoke(final_prompt)

        # Return the final text
        result = {
            "summary": final_response.content
        }

        # Save the summary to the cache
        save_cached_answer(
            cache_key,
            result
        )

        # Return the summary
        return final_response.content

    except Exception as e:

        # Convert the error to text
        error_message = str(e)

        # Handle Gemini quota/rate-limit errors
        if (
            "429" in error_message
            or "RESOURCE_EXHAUSTED" in error_message
        ):

            return (
                "The AI generation limit has been reached "
                "temporarily. Please try again later."
            )

        # Handle other Gemini errors
        return (
            "Sorry, I couldn't generate the video summary "
            "right now."
        )