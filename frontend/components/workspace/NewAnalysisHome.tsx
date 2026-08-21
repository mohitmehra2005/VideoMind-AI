"use client";

import React, { useState } from "react";
import { Link2, ArrowRight, AlertCircle, Sparkles, Compass } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { isValidYouTubeUrl } from "@/utils/mockVideoData";

export const NewAnalysisHome: React.FC = () => {
  const { startAnalysis } = useWorkspace();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a YouTube video URL.");
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL (e.g. https://www.youtube.com/watch?v=...)");
      return;
    }

    setError(null);
    startAnalysis(url);
  };

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl);
    setError(null);
    startAnalysis(exampleUrl);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 max-w-4xl mx-auto w-full py-20 text-center relative overflow-hidden">
      
      {/* Background Soft Glow Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[260px] bg-gradient-to-r from-indigo-500/15 via-cyan-500/15 to-transparent blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl space-y-8">
        
        {/* Main Eyebrow & Headline */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38BDF8]" />
            <span>OpticAI Neural Workspace</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Turn any video into <br />
            <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              knowledge you can explore.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg mx-auto font-normal">
            Paste a YouTube link and OpticAI will extract, chunk, and index its transcript into an interactive workspace with summaries, grounded Q&A, and quizzes.
          </p>
        </div>

        {/* High-Impact Interactive URL Input Card */}
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <div className="glass-panel p-2.5 flex flex-col sm:flex-row items-center gap-2.5 border-white/15 focus-within:border-cyan-400 focus-within:shadow-[0_0_30px_rgba(56,189,248,0.25)] transition-all bg-[#0d121c]/90">
            <div className="flex items-center gap-3.5 px-3.5 py-2 w-full">
              <Link2 className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-slate-500 outline-none font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:brightness-110 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 shrink-0 transform hover:-translate-y-0.5"
            >
              <span>Analyze</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Validation Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-center gap-2 text-left animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Suggestion Chips */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-500 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Try an example:</span>
          </span>
          <button
            onClick={() => handleExampleClick("https://www.youtube.com/watch?v=kCc8FmEb1nY")}
            className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-xs text-slate-300 hover:text-cyan-200 transition-all"
          >
            Neural Networks from Scratch
          </button>
          <button
            onClick={() => handleExampleClick("https://www.youtube.com/watch?v=aircAruvnKk")}
            className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-xs text-slate-300 hover:text-cyan-200 transition-all"
          >
            Attention Is All You Need
          </button>
        </div>

      </div>

    </div>
  );
};
