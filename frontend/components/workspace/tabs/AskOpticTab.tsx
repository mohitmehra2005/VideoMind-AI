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
  sources?: { time: string; seconds: number }[];
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

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    // Track exploration progress
    setExplorationProgress((p) => ({ ...p, questionsCount: p.questionsCount + 1 }));

    setTimeout(() => {
      let answerText = "";
      let timestampCitation = "04:30";
      let sourceList: { time: string; seconds: number }[] = [];

      if (query.toLowerCase().includes("thesis") || query.toLowerCase().includes("main idea")) {
        answerText = "The main thesis is that artificial neural networks model complex functional relationships by combining weighted linear matrix multiplications ($W_2 W_1 x$) with non-linear activation functions like ReLU ($max(0, x)$).";
        timestampCitation = "02:15";
        sourceList = [
          { time: "02:15", seconds: 135 },
          { time: "04:30", seconds: 270 }
        ];
      } else if (query.toLowerCase().includes("first 5") || query.toLowerCase().includes("first few")) {
        answerText = "In the opening section (00:00 - 05:30), the speaker establishes the mathematical formulation of an artificial neuron: $z = \\sum(w_i x_i) + b$, showing how inputs are weighted and combined with bias offsets.";
        timestampCitation = "01:20";
        sourceList = [
          { time: "00:45", seconds: 45 },
          { time: "02:15", seconds: 135 }
        ];
      } else if (query.toLowerCase().includes("example")) {
        answerText = "The speaker uses an image classification problem (recognizing handwritten digits 0-9) as the primary concrete visual intuition throughout the derivations.";
        timestampCitation = "06:10";
        sourceList = [
          { time: "06:10", seconds: 370 },
          { time: "08:24", seconds: 504 }
        ];
      } else if (query.toLowerCase().includes("backpropagation") || query.toLowerCase().includes("formula")) {
        answerText = "Backpropagation calculates partial derivatives of the cost function layer-by-layer using the multivariate calculus chain rule: $\\frac{\\partial C}{\\partial w_{ij}} = \\frac{\\partial C}{\\partial a_j} \\cdot \\frac{\\partial a_j}{\\partial z_j} \\cdot \\frac{\\partial z_j}{\\partial w_{ij}}$, allowing gradient descent updates.";
        timestampCitation = "13:40";
        sourceList = [
          { time: "11:05", seconds: 665 },
          { time: "13:40", seconds: 820 },
          { time: "16:20", seconds: 980 }
        ];
      } else {
        answerText = `Regarding "${query}": The video explains that neural networks optimize weights by minimizing cost discrepancies through gradient descent.`;
        timestampCitation = "08:24";
        sourceList = [
          { time: "08:24", seconds: 504 },
          { time: "11:05", seconds: 665 }
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answerText,
          timestamp: timestampCitation,
          sources: sourceList
        }
      ]);
      setIsLoading(false);
    }, 600);
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
