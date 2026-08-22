"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  User, 
  Play, 
  FileText 
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { MathRenderer } from "@/components/workspace/MathRenderer";
import { openYouTubeAtTimestamp } from "@/utils/mockVideoData";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  sources?: {
    time: string;
    seconds: number;
    endSeconds?: number;
  }[];
}

export const AskOpticTab: React.FC = () => {
  const { 
    activeVideo, 
    pendingChatMessage, 
    setPendingChatMessage, 
    jumpToTranscript, 
    setExplorationProgress 
  } = useWorkspace();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `I've analyzed and indexed "${activeVideo?.title || "this video"}". You can ask me to explain any proof, summarize specific timestamps, or clarify concepts.`,
      timestamp: "00:00",
      sources: [{ time: "00:00", seconds: 0 }, { time: "02:15", seconds: 135 }]
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What is the main thesis of this video?",
    "Summarize the first 5 minutes",
    "What examples does the speaker use?",
    "Explain the backpropagation formula",
  ];

  // Auto-send query if user navigated from Summary or Takeaways
  useEffect(() => {
    if (pendingChatMessage) {
      handleSend(pendingChatMessage);
      setPendingChatMessage(null);
    }
  }, [pendingChatMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

const handleSend = async (textToSend?: string) => {
  const query = textToSend || input;

  if (!query.trim() || isLoading) return;

  // Add the user's message
  const userMessage: Message = {
    role: "user",
    content: query,
  };

  setMessages((prev) => [...prev, userMessage]);

  if (!textToSend) {
    setInput("");
  }

  setIsLoading(true);

  try {
    // Get the current video ID
    const videoId = activeVideo?.id;

    if (!videoId) {
      throw new Error("No active video found.");
    }

    // Send the question to the FastAPI backend
    const response = await fetch("http://127.0.0.1:8000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_id: videoId,
        question: query,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.detail || "Failed to get an answer."
      );
    }

    const data = await response.json();

    // Convert seconds into a readable timestamp
    const formatTime = (seconds: number) => {
      const totalSeconds = Math.floor(seconds);

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor(
        (totalSeconds % 3600) / 60
      );
      const secs = totalSeconds % 60;

      if (hours > 0) {
        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${secs
          .toString()
          .padStart(2, "0")}`;
      }

      return `${minutes
        .toString()
        .padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    };

    // Convert backend sources into frontend sources
    const sources = (data.sources || []).map(
      (source: {
        start_time: number;
        end_time?: number;
      }) => ({
        time: formatTime(source.start_time),
        seconds: source.start_time,
        endSeconds: source.end_time,
      })
    );

    // Add the AI response
    const assistantMessage: Message = {
      role: "assistant",
      content: data.answer,
      timestamp: sources[0]?.time,
      sources,
    };

    setMessages((prev) => [
      ...prev,
      assistantMessage,
    ]);

  } catch (error) {
    console.error("Ask OpticAI error:", error);

    const errorMessage: Message = {
      role: "assistant",
      content:
        error instanceof Error
          ? error.message
          : "Sorry, something went wrong while asking OpticAI.",
    };

    setMessages((prev) => [
      ...prev,
      errorMessage,
    ]);

  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto w-full py-6 px-4 sm:px-6 flex flex-col h-[calc(100vh-170px)] min-h-[500px]">
      
      {/* Top Subtle Grounding Bar */}
      <div className="pb-3 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-display text-sm font-bold text-white">
            Ask OpticAI (Video Grounded)
          </h2>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Grounded in speech transcript</span>
        </div>
      </div>

      {/* Suggestion Chips */}
      {messages.length <= 2 && (
        <div className="py-2.5 flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-xs text-slate-300 hover:text-cyan-200 transition-all text-left shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0 text-xs font-bold shadow-[0_0_10px_rgba(56,189,248,0.15)]">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            )}

            <div
              className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] space-y-2.5 ${
                msg.role === "user"
                  ? "bg-slate-800 text-white border border-white/10"
                  : "bg-gradient-to-br from-[#0c121e] to-[#070a11] border border-white/[0.08] text-slate-200 shadow-lg shadow-black/40"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center justify-between text-xs pb-1 border-b border-white/[0.04]">
                  <span className="font-semibold text-cyan-300">OpticAI RAG Engine</span>
                  {msg.timestamp && (
                    <button
                      onClick={() => activeVideo && openYouTubeAtTimestamp(activeVideo.id, msg.timestamp || "00:00")}
                      className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-2 h-2 fill-current" />
                      <span>{msg.timestamp}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Message Content with Math Rendering */}
              <MathRenderer
                content={msg.content}
                className="text-slate-200 leading-relaxed font-normal"
              />

              {/* Clickable Sources References from this video */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-white/[0.05] space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                    Sources from this video:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {msg.sources.map((src, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-1">
                        <button
                          onClick={() => activeVideo && openYouTubeAtTimestamp(activeVideo.id, src.time)}
                          className="px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-cyan-300 text-[11px] font-mono flex items-center gap-1 transition-all"
                        >
                          <Play className="w-2 h-2 fill-current" />
                          <span>▶ {src.time}</span>
                        </button>
                        <button
                          onClick={() => jumpToTranscript(src.time)}
                          title="View in transcript"
                          className="p-1 rounded-md text-slate-500 hover:text-cyan-400 hover:bg-white/[0.04] transition-colors text-[10px]"
                        >
                          <FileText className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 shrink-0 text-xs font-bold">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-[#0c121e] border border-white/[0.08] text-slate-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Querying video vector index & retrieving citations...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field Fixed Bottom */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="pt-2">
        <div className="p-2 rounded-2xl flex items-center gap-2 bg-[#0c121e] border border-white/15 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about this video..."
            className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 hover:brightness-110 text-white font-bold transition-all disabled:opacity-30 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
};
