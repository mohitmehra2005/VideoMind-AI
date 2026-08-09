"""
VideoMind AI — UI/UX Layer (Streamlit only)
=============================================
Interface only — no transcript extraction, chunking, embeddings, vector DB,
or LLM calls. All data is placeholder/dummy, and every point where real
logic would plug in is marked with a comment.

Vibe: polished early-stage MVP / strong student project — clean, dark,
rounded cards, one soft accent gradient used sparingly. Not an enterprise
SaaS dashboard.

App flow (all handled as view-states inside one script via
st.session_state.page, not separate multipage files):
    landing  ->  processing  ->  dashboard

Run with: streamlit run videomind_app.py
"""
from backend.transcript import get_transcript
from backend.chunking import split_documents
from backend.embeddings import get_embeddings_model
from backend.vector_store import create_vector_store
from langchain_core.documents import Document
from backend.retriever import create_retriever
from backend.llm import get_llm
from backend.prompts import prompt
import time
import random
from datetime import datetime

import streamlit as st

# =========================================================================
# 1. PAGE CONFIG
# =========================================================================
st.set_page_config(
    page_title="VideoMind AI",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded",
)

# =========================================================================
# 2. GLOBAL STYLE
#    Fonts: Sora (headings) + Inter (body). One accent gradient, used only
#    on the logo mark and the primary CTA — kept deliberately restrained.
# =========================================================================
st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

    :root{
        --bg:#0F1117;
        --surface:#171A21;
        --card:#1B1F27;
        --border:#2A2E38;
        --text:#E7E9EE;
        --text-dim:#9BA1AE;
        --text-faint:#666C79;
        --accent1:#7C6FF0;
        --accent2:#4EA8FF;
        --accent-soft:rgba(124,111,240,0.12);
        --success:#4ADE80;
    }

    html, body, [class*="css"]{ font-family:'Inter', sans-serif; color:var(--text); }
    .stApp{ background:var(--bg) !important; }
    h1, h2, h3, h4{ font-family:'Sora', sans-serif !important; letter-spacing:-0.01em; }
    #MainMenu, footer, header{ visibility:hidden; }

    /* sidebar */
    [data-testid="stSidebar"]{ background:var(--surface) !important; border-right:1px solid var(--border); }

    /* inputs */
    .stTextInput input, .stSelectbox div[data-baseweb="select"] > div, .stTextArea textarea{
        background:var(--card) !important; border:1px solid var(--border) !important;
        border-radius:12px !important; color:var(--text) !important;
    }
    .stTextInput input:focus{ border-color:var(--accent1) !important; box-shadow:0 0 0 1px var(--accent1) !important; }

    /* buttons — plain by default */
    .stButton>button{
        border-radius:10px !important; font-weight:500 !important;
        border:1px solid var(--border) !important; background:var(--card) !important;
        color:var(--text) !important; transition:all .15s ease;
    }
    .stButton>button:hover{ border-color:var(--accent1) !important; color:var(--accent1) !important; }
    /* primary CTA gets the one gradient in the whole app */
    .stButton>button[kind="primary"]{
        background:linear-gradient(135deg, var(--accent1), var(--accent2)) !important;
        color:#fff !important; border:none !important; font-weight:600 !important;
    }
    .stButton>button[kind="primary"]:hover{ filter:brightness(1.08); color:#fff !important; }

    /* tabs */
    .stTabs [data-baseweb="tab-list"]{ gap:4px; border-bottom:1px solid var(--border); }
    .stTabs [data-baseweb="tab"]{ color:var(--text-dim); font-weight:500; }
    .stTabs [aria-selected="true"]{ color:var(--accent2) !important; }

    /* chat */
    [data-testid="stChatMessage"]{ background:var(--card) !important; border:1px solid var(--border) !important; border-radius:14px !important; }
    [data-testid="stChatInput"]{ background:var(--card) !important; border:1px solid var(--border) !important; border-radius:14px !important; }

    /* --- reusable custom classes --- */
    .card{ background:var(--card); border:1px solid var(--border); border-radius:16px; padding:20px 22px; }
    .card-tight{ background:var(--card); border:1px solid var(--border); border-radius:14px; padding:14px 16px; }

    .logo-row{ display:flex; align-items:center; gap:10px; }
    .logo-mark{
        width:38px; height:38px; border-radius:11px;
        background:linear-gradient(135deg, var(--accent1), var(--accent2));
        display:flex; align-items:center; justify-content:center; font-size:18px;
    }
    .logo-text{ font-family:'Sora', sans-serif; font-weight:700; font-size:1.15rem; }

    .eyebrow{ text-transform:uppercase; letter-spacing:.08em; font-size:.7rem; color:var(--text-faint); font-weight:600; margin-bottom:6px;}
    .muted{ color:var(--text-dim); }
    .faint{ color:var(--text-faint); font-size:.8rem; }

    .example-card{
        background:var(--card); border:1px solid var(--border); border-radius:14px;
        padding:14px; height:100%;
    }
    .example-thumb{
        width:100%; aspect-ratio:16/9; border-radius:10px; margin-bottom:10px;
        display:flex; align-items:center; justify-content:center; font-size:26px;
        background:linear-gradient(135deg, var(--accent-soft), rgba(78,168,255,0.08));
        border:1px solid var(--border);
    }

    .step-row{ display:flex; align-items:center; gap:10px; padding:8px 0; }
    .step-icon{ width:22px; text-align:center; }
    .step-pending{ color:var(--text-faint); }
    .step-active{ color:var(--accent2); font-weight:600; }
    .step-done{ color:var(--success); }

    .pill{
        display:inline-flex; align-items:center; gap:6px; font-size:.72rem;
        padding:4px 10px; border-radius:999px; border:1px solid var(--border);
        background:var(--card); color:var(--text-dim);
    }

    .takeaway-row{ display:flex; gap:10px; padding:10px 0; border-bottom:1px solid var(--border); }
    .takeaway-row:last-child{ border-bottom:none; }

    .suggested-q{
        display:inline-block; background:var(--card); border:1px solid var(--border);
        border-radius:999px; padding:6px 14px; font-size:.82rem; color:var(--text-dim); margin:4px 6px 4px 0;
    }

    .transcript-line{ display:flex; gap:12px; padding:6px 0; border-bottom:1px solid var(--border); font-size:.88rem; }
    .transcript-time{ color:var(--accent2); font-size:.78rem; min-width:48px; }

    hr{ border-color:var(--border) !important; }
    </style>
    """,
    unsafe_allow_html=True,
)

# =========================================================================
# 2b. NAVBAR STYLE (new — added on top of the existing design system)
#     Uses the same tokens (--bg, --card, --border, --accent1/2, --text,
#     --text-dim) defined above. No existing rule is changed or removed.
# =========================================================================
st.markdown(
    """
    <style>
    /* Fixed, glassmorphism top navbar */
    .navbar-fixed{
        position:fixed; top:0; left:0; right:0; z-index:999;
        display:flex; align-items:center; justify-content:space-between;
        padding:14px 34px;
        background:rgba(15,17,23,0.62);           /* var(--bg) at ~62% opacity */
        backdrop-filter:blur(14px);
        -webkit-backdrop-filter:blur(14px);
        border-bottom:1px solid var(--border);
    }
    .navbar-left{ display:flex; align-items:center; gap:10px; }
    .navbar-logo-mark{
        width:30px; height:30px; border-radius:9px;
        background:linear-gradient(135deg, var(--accent1), var(--accent2));
        display:flex; align-items:center; justify-content:center; font-size:15px;
    }
    .navbar-brand{ font-family:'Sora', sans-serif; font-weight:700; font-size:1rem; color:var(--text); }

    .navbar-right{ display:flex; align-items:center; gap:4px; }
    .nav-item{
        position:relative; display:inline-flex; align-items:center; gap:6px;
        padding:7px 14px; border-radius:8px; font-size:.86rem; font-weight:500;
        color:var(--text-dim) !important; text-decoration:none !important;
        transition:color .18s ease, background .18s ease, transform .18s ease;
    }
    .nav-item:hover{
        color:var(--text) !important;
        background:rgba(255,255,255,0.05);
        transform:translateY(-1px);
    }
    .nav-item.active{
        color:var(--accent2) !important;
        background:var(--accent-soft);
    }
    .nav-badge-new{
        font-size:.6rem; font-weight:700; letter-spacing:.03em; color:#fff;
        background:linear-gradient(135deg, var(--accent1), var(--accent2));
        padding:1px 6px; border-radius:999px; line-height:1.5;
    }

    /* Pushes page content below the fixed navbar so nothing is hidden under it */
    .navbar-spacer{ height:70px; }
    </style>
    """,
    unsafe_allow_html=True,
)


def render_navbar(active: str = "home"):
    """
    Renders the fixed glassmorphism navbar.
    `active` should be one of: "home", "features", "about" — controls the
    highlighted nav item. Reads/writes the `nav` URL query param so the
    highlight survives a rerun without touching st.session_state.page.
    """
    st.markdown(
        f"""
        <div class="navbar-fixed">
            <div class="navbar-left">
                <div class="navbar-logo-mark">🧠</div>
                <div class="navbar-brand">VideoMind AI</div>
            </div>
            <div class="navbar-right">
                <a href="?nav=home" target="_self" class="nav-item {'active' if active == 'home' else ''}">Home</a>
                <a href="?nav=features" target="_self" class="nav-item {'active' if active == 'features' else ''}">
                    Features <span class="nav-badge-new">New</span>
                </a>
                <a href="https://github.com/" target="_blank" class="nav-item">GitHub</a>
                <a href="?nav=about" target="_self" class="nav-item {'active' if active == 'about' else ''}">About</a>
            </div>
        </div>
        <div class="navbar-spacer"></div>
        """,
        unsafe_allow_html=True,
    )


# =========================================================================
# 3. SESSION STATE (placeholder data only)
# =========================================================================
defaults = {
    "page": "landing",                # landing | processing | dashboard
    "active_video": None,
    "recent_videos": [
        {"title": "How Transformers Work", "channel": "AI Simplified", "duration": "12:04", "emoji": "🧠"},
        {"title": "Intro to Vector Databases", "channel": "Data Made Easy", "duration": "08:47", "emoji": "🗂️"},
    ],
    "saved_videos": [
        {"title": "Building RAG Apps in Python", "channel": "CodeStack", "duration": "21:15", "emoji": "🔗"},
    ],
    "history": [],
    "chat_history": [],
    "quiz_submitted": False,
}
for key, value in defaults.items():
    if key not in st.session_state:
        st.session_state[key] = value

EXAMPLE_VIDEOS = [
    {"title": "Neural Networks Explained Simply", "channel": "TechBits", "duration": "10:32", "emoji": "🧬"},
    {"title": "What Is RAG? (Retrieval-Augmented Gen)", "channel": "ML Weekly", "duration": "14:20", "emoji": "📚"},
    {"title": "YouTube Transcripts + LLMs", "channel": "BuildWithAI", "duration": "07:58", "emoji": "🎥"},
]

PIPELINE_STEPS = [
    "Extracting transcript",
    "Chunking text",
    "Creating embeddings",
    "Building vector database",
]

SUGGESTED_QUESTIONS = [
    "What's the main idea of this video?",
    "Summarize the first 5 minutes",
    "What examples does the speaker use?",
    "What are the key takeaways?",
]


def start_analysis(title, channel="Unknown channel", duration="--:--", emoji="🎬"):
    """Set the active video and move to the processing view."""
    st.session_state.active_video = {"title": title, "channel": channel, "duration": duration, "emoji": emoji}
    st.session_state.page = "processing"
    st.session_state.chat_history = []
    st.session_state.quiz_submitted = False
    st.rerun()


# =========================================================================
# 4. SIDEBAR — Recent Videos, Saved Videos, History, Settings, About
#    (Always visible, regardless of which view is active.)
# =========================================================================
with st.sidebar:
    st.markdown(
        """
        <div class="logo-row">
            <div class="logo-mark">🧠</div>
            <div class="logo-text">VideoMind AI</div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.caption("Chat with any YouTube video")
    st.markdown("<div style='height:6px'></div>", unsafe_allow_html=True)

    if st.button("➕ New video", use_container_width=True):
        st.session_state.page = "landing"
        st.rerun()

    st.markdown("<hr/>", unsafe_allow_html=True)

    # --- Recent Videos ---
    st.markdown('<div class="eyebrow">Recent Videos</div>', unsafe_allow_html=True)
    if st.session_state.recent_videos:
        for i, vid in enumerate(st.session_state.recent_videos):
            if st.button(f"{vid['emoji']} {vid['title']}", key=f"recent_{i}", use_container_width=True):
                start_analysis(**vid)
    else:
        st.caption("Nothing here yet.")

    st.markdown("<div style='height:4px'></div>", unsafe_allow_html=True)

    # --- Saved Videos ---
    st.markdown('<div class="eyebrow">Saved Videos</div>', unsafe_allow_html=True)
    if st.session_state.saved_videos:
        for i, vid in enumerate(st.session_state.saved_videos):
            if st.button(f"⭐ {vid['title']}", key=f"saved_{i}", use_container_width=True):
                start_analysis(**vid)
    else:
        st.caption("Bookmark a video to see it here.")

    st.markdown("<div style='height:4px'></div>", unsafe_allow_html=True)

    # --- History (past questions asked, across videos) ---
    with st.expander("🕘 History"):
        if st.session_state.history:
            for h in st.session_state.history[-8:][::-1]:
                st.markdown(f"<div class='faint'>• {h}</div>", unsafe_allow_html=True)
        else:
            st.caption("Your past questions will show up here.")

    # --- Settings ---
    with st.expander("⚙️ Settings"):
        st.selectbox("Answer model", ["Gemini 1.5 Flash", "Gemini 1.5 Pro", "GPT-4o mini"], index=0)
        st.slider("Chunk size (tokens)", 128, 1024, 512, step=64)
        st.slider("Chunks retrieved (top-k)", 1, 10, 4)
        st.toggle("Show timestamps in chat", value=True)

    # --- About ---
    with st.expander("ℹ️ About"):
        st.markdown(
            "<span class='faint'>VideoMind AI turns any YouTube video into a searchable, "
            "chattable knowledge base using Retrieval-Augmented Generation. "
            "Built as a student/MVP project — UI shown here uses placeholder data.</span>",
            unsafe_allow_html=True,
        )

# =========================================================================
# 5. LANDING PAGE
# =========================================================================
def render_landing():
    # Active nav item comes from the URL query param set by the navbar links
    active_nav = st.query_params.get("nav", "home")
    render_navbar(active=active_nav)

    st.markdown("<div style='height:40px'></div>", unsafe_allow_html=True)

    # Logo + title, centered
    col_a, col_b, col_c = st.columns([1, 2, 1])
    with col_b:
        st.markdown(
            """
            <div style="text-align:center;">
                <div style="display:flex; justify-content:center; margin-bottom:14px;">
                    <div class="logo-mark" style="width:52px; height:52px; font-size:24px; border-radius:14px;">🧠</div>
                </div>
                <h1 style="margin-bottom:4px;">VideoMind AI</h1>
                <p class="muted" style="font-size:1rem; margin-bottom:28px;">
                    Paste a YouTube link and chat with the video — powered by RAG.
                </p>
            </div>
            """,
            unsafe_allow_html=True,
        )

        url = st.text_input("YouTube URL", placeholder="https://www.youtube.com/watch?v=…", label_visibility="collapsed")
        analyze = st.button("Analyze video →", type="primary", use_container_width=True)
        st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)

        if analyze:
            if url.strip():
                transcript_text = get_transcript(url)
                
                print("TRANSCRIPT PREVIEW:")
                print(transcript_text[:500])

                document = Document(page_content=transcript_text)

                chunks = split_documents([document])

                print("Number of chunks:", len(chunks))

                embedding_model = get_embeddings_model()

                vector_store = create_vector_store(
                chunks,
                embedding_model
                )
                
                retriever = create_retriever(vector_store)
                
                st.session_state["retriever"] = retriever
                
                test_results = retriever.invoke("What is this video about?")

                print("RETRIEVER TEST:")
                for result in test_results:
                    print(result.page_content[:300])
                    print("---")

                start_analysis(
                    title="Newly analyzed video",
                    channel="Unknown channel",
                    duration="--:--",
                    emoji="🎞️"
                )
    st.markdown("<div style='height:34px'></div>", unsafe_allow_html=True)
    st.markdown('<div class="eyebrow" style="text-align:center;">Or try an example</div>', unsafe_allow_html=True)
    st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)

    # Example video cards
    cols = st.columns(3)
    for col, vid in zip(cols, EXAMPLE_VIDEOS):
        with col:
            st.markdown(
                f"""
                <div class="example-card">
                    <div class="example-thumb">{vid['emoji']}</div>
                    <div style="font-weight:600; font-size:0.9rem; margin-bottom:2px;">{vid['title']}</div>
                    <div class="faint">{vid['channel']} · {vid['duration']}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
            if st.button("Try this video", key=f"example_{vid['title']}", use_container_width=True):
                start_analysis(**vid)


# =========================================================================
# 6. PROCESSING STATE
#    Simple, native-feeling checklist with a progress bar. Replace the
#    time.sleep() calls with real pipeline calls.
# =========================================================================
def render_processing():
    st.markdown("<div style='height:60px'></div>", unsafe_allow_html=True)
    col_a, col_b, col_c = st.columns([1, 2, 1])
    with col_b:
        video = st.session_state.active_video
        st.markdown(
            f"""
            <div style="text-align:center; margin-bottom:24px;">
                <div style="font-size:30px;">{video['emoji']}</div>
                <h3 style="margin:6px 0 2px 0;">Analyzing "{video['title']}"</h3>
                <p class="faint">This usually takes a few seconds…</p>
            </div>
            """,
            unsafe_allow_html=True,
        )

        progress_bar = st.progress(0)
        checklist = st.empty()

        for i, step in enumerate(PIPELINE_STEPS):
            rows = ""
            for j, s in enumerate(PIPELINE_STEPS):
                if j < i:
                    rows += f'<div class="step-row step-done"><span class="step-icon">✓</span>{s}</div>'
                elif j == i:
                    rows += f'<div class="step-row step-active"><span class="step-icon">◐</span>{s}…</div>'
                else:
                    rows += f'<div class="step-row step-pending"><span class="step-icon">○</span>{s}</div>'
            checklist.markdown(f'<div class="card">{rows}</div>', unsafe_allow_html=True)
            progress_bar.progress(int(((i) / len(PIPELINE_STEPS)) * 100) + 5)
            time.sleep(0.6)  # simulated latency — replace with the real step

        # final "all done" state
        rows = "".join(
            f'<div class="step-row step-done"><span class="step-icon">✓</span>{s}</div>' for s in PIPELINE_STEPS
        )
        checklist.markdown(f'<div class="card">{rows}</div>', unsafe_allow_html=True)
        progress_bar.progress(100)
        time.sleep(0.4)

        # Add to recent videos (avoid duplicate titles) and move to dashboard
        if video["title"] not in [v["title"] for v in st.session_state.recent_videos]:
            st.session_state.recent_videos.insert(0, video)
        st.session_state.page = "dashboard"
        st.rerun()


# =========================================================================
# 7. DASHBOARD
# =========================================================================
def render_dashboard():
    video = st.session_state.active_video or {"title": "Untitled video", "channel": "—", "duration": "--:--", "emoji": "🎬"}

    # --- Video info card ---
    info_col, action_col = st.columns([4, 1])
    with info_col:
        st.markdown(
            f"""
            <div class="card" style="display:flex; align-items:center; gap:16px;">
                <div style="font-size:34px;">{video['emoji']}</div>
                <div>
                    <div style="font-weight:600; font-size:1.05rem;">{video['title']}</div>
                    <div class="faint">{video['channel']} · {video['duration']} · indexed just now</div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with action_col:
        if st.button("⭐ Save video", use_container_width=True):
            if video["title"] not in [v["title"] for v in st.session_state.saved_videos]:
                st.session_state.saved_videos.append(video)
                st.toast("Saved to your library")

    st.markdown("<div style='height:16px'></div>", unsafe_allow_html=True)

    tab_summary, tab_takeaways, tab_chat, tab_transcript, tab_quiz = st.tabs(
        ["📋 Summary", "🔑 Key Takeaways", "💬 Chat", "📄 Transcript", "🧠 Quiz"]
    )

    # --- Summary tab ---
    with tab_summary:
        st.markdown(
            """
            <div class="card">
                <div class="eyebrow">AI-generated summary</div>
                <p class="muted" style="line-height:1.6;">
                This video walks through the core idea in three parts: first framing the problem,
                then introducing the proposed approach with a couple of worked examples, and finally
                discussing trade-offs and where the method tends to break down. The speaker keeps
                things practical, favoring intuition over heavy notation.
                </p>
            </div>
            """,
            unsafe_allow_html=True,
        )

    # --- Key Takeaways tab ---
    with tab_takeaways:
        takeaways = [
            "The core problem is framed within the first two minutes.",
            "A simple worked example is used to build intuition before formal detail.",
            "Trade-offs are discussed near the end — worth a rewatch if skimming.",
            "No prior background is assumed; the explanation builds from first principles.",
        ]
        rows = "".join(
            f'<div class="takeaway-row"><span>✅</span><span class="muted">{t}</span></div>' for t in takeaways
        )
        st.markdown(f'<div class="card">{rows}</div>', unsafe_allow_html=True)

    # --- Chat tab ---
    with tab_chat:
        st.markdown('<div class="eyebrow">Suggested questions</div>', unsafe_allow_html=True)
        chip_cols = st.columns(len(SUGGESTED_QUESTIONS))
        clicked_question = None
        for c, q in zip(chip_cols, SUGGESTED_QUESTIONS):
            with c:
                if st.button(q, key=f"sugg_{q}", use_container_width=True):
                    clicked_question = q

        st.markdown("<div style='height:6px'></div>", unsafe_allow_html=True)
        chat_box = st.container(height=340, border=False)
        with chat_box:
            if not st.session_state.chat_history:
                st.markdown("<span class='faint'>Ask anything about the video to get started.</span>", unsafe_allow_html=True)
            for msg in st.session_state.chat_history:
                avatar = "🧑" if msg["role"] == "user" else "🧠"
                with st.chat_message(msg["role"], avatar=avatar):
                    st.markdown(msg["content"])

        typed_question = st.chat_input("Ask a question about the video…")
        question = typed_question or clicked_question

        if question:
            st.session_state.chat_history.append({"role": "user", "content": question})
            st.session_state.history.append(question)
            # ---- Real RAG question answering ----

        # Check whether a retriever has been created for the analyzed video.
        if "retriever" not in st.session_state:
            st.warning("Please analyze a YouTube video first.")
        else:

           with st.spinner("Thinking..."):

                # Get the retriever belonging to the current video.
                retriever = st.session_state["retriever"]

                # Search the video for the 3 most relevant chunks.
                relevant_documents = retriever.invoke(question)

                # Combine the retrieved chunks into one context string.
                context = "\n\n".join(
                    document.page_content
                    for document in relevant_documents
                )

                # Get the Gemini model.
                llm = get_llm()

                # Create the prompt using the retrieved video context
                # and the user's question.
                messages = prompt.format_messages(
                    context=context,
                    questions=question
                )

                # Send the prompt to Gemini.
                response = llm.invoke(messages)

                # Get Gemini's actual answer.
                answer = response.content

        # Save the real answer in chat history.
        st.session_state.chat_history.append(
            {
                "role": "assistant",
                "content": answer
            }
        )

        # Refresh the page so the answer appears.
        st.rerun()
           
           
    # --- Transcript tab ---
    with tab_transcript:
        st.markdown('<div class="eyebrow">Full transcript</div>', unsafe_allow_html=True)
        transcript_lines = [
            ("00:00", "Welcome back to the channel — today we're breaking down a topic a lot of you asked about."),
            ("00:42", "Let's start with the problem this actually solves, and why it matters."),
            ("02:15", "Here's a simple example to build intuition before we go further."),
            ("05:30", "Now, the trade-offs — this is the part most tutorials skip."),
            ("09:10", "Quick recap, and where to go next if you want to dig deeper."),
        ]
        rows = "".join(
            f'<div class="transcript-line"><div class="transcript-time">{t}</div><div class="muted">{line}</div></div>'
            for t, line in transcript_lines
        )
        st.markdown(f'<div class="card">{rows}</div>', unsafe_allow_html=True)

    # --- Quiz tab ---
    with tab_quiz:
        st.markdown('<div class="eyebrow">Test your understanding</div>', unsafe_allow_html=True)
        st.markdown("<div class='card'>", unsafe_allow_html=True)

        q1 = st.radio(
            "1. What does the speaker use to build intuition before formal detail?",
            ["A mathematical proof", "A simple worked example", "A live demo", "A historical anecdote"],
            index=None,
        )
        st.markdown("<div style='height:10px'></div>", unsafe_allow_html=True)
        q2 = st.radio(
            "2. What topic is covered near the end of the video?",
            ["Trade-offs of the approach", "Speaker's biography", "Unrelated news", "Sponsor message"],
            index=None,
        )

        st.markdown("<div style='height:6px'></div>", unsafe_allow_html=True)
        if st.button("Check answers", type="primary"):
            st.session_state.quiz_submitted = True

        if st.session_state.quiz_submitted:
            score = int(q1 == "A simple worked example") + int(q2 == "Trade-offs of the approach")
            st.markdown(f"<p class='muted'>Score: <b>{score}/2</b></p>", unsafe_allow_html=True)
            if score == 2:
                st.success("Nice — you were paying attention!")
            else:
                st.info("Close! Try rewatching the flagged sections.")

        st.markdown("</div>", unsafe_allow_html=True)


# =========================================================================
# 8. VIEW ROUTER
# =========================================================================
if st.session_state.page == "landing":
    render_landing()
elif st.session_state.page == "processing":
    render_processing()
elif st.session_state.page == "dashboard":
    render_dashboard()