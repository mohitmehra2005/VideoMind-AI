"use client";

import React, { useEffect } from "react";
import { Check, AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { getMockVideoAnalysis } from "@/utils/mockVideoData";

export const ProcessingView: React.FC = () => {
  const {
    processingStage,
    setProcessingStage,
    processingError,
    setProcessingError,
    setActiveVideo,
    addToHistory,
    setIsAnalyzing,
    startAnalysis,
  } = useWorkspace();

  const stages = [
    { title: "Video received", detail: "Connecting to video stream" },
    { title: "Extracting transcript", detail: "Capturing timestamped speech segments" },
    { title: "Chunking video content", detail: "Structuring transcript into semantic passages" },
    { title: "Creating embeddings", detail: "Vectorizing concepts for intelligent retrieval" },
    { title: "Building the video knowledge base", detail: "Indexing into FAISS semantic memory" },
    { title: "Preparing your OpticAI workspace", detail: "Generating summary and interactive quiz" },
  ];

  useEffect(() => {
    if (processingError) return;

    const timer = setInterval(() => {
      setProcessingStage((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          // Complete processing
          const analyzed = getMockVideoAnalysis("https://www.youtube.com/watch?v=kCc8FmEb1nY");
          setActiveVideo(analyzed);
          addToHistory(analyzed);
          setIsAnalyzing(false);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(timer);
  }, [processingError, setProcessingStage, setActiveVideo, addToHistory, setIsAnalyzing, stages.length]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 max-w-lg mx-auto w-full py-20 relative overflow-hidden">
      
      {/* Background Soft Glow Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-cyan-500/10 blur-[80px] pointer-events-none" />

      <div className="glass-panel p-8 sm:p-10 w-full relative z-10 border-cyan-500/20 bg-[#0a0e18]/90 shadow-2xl shadow-cyan-950/40 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_15px_rgba(56,189,248,0.25)]">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Understanding Video Content
          </h2>
          <p className="text-xs text-slate-400">
            OpticAI is extracting knowledge and building your workspace
          </p>
        </div>

        {/* Clean Vertical Progress Journey */}
        <div className="space-y-4 relative pl-2">
          
          {/* Vertical Connecting Line */}
          <div className="absolute left-[21px] top-3 bottom-3 w-[1.5px] bg-white/[0.08]" />

          {stages.map((stage, idx) => {
            const isCompleted = idx < processingStage;
            const isCurrent = idx === processingStage;
            const isPending = idx > processingStage;

            return (
              <div
                key={idx}
                className={`flex items-start gap-4 relative z-10 transition-all ${
                  isCurrent ? "scale-[1.02]" : ""
                }`}
              >
                {/* Node Indicator */}
                <div className="shrink-0 mt-0.5">
                  {isCompleted && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {isCurrent && (
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.4)]">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    </div>
                  )}
                  {isPending && (
                    <div className="w-6 h-6 rounded-full bg-slate-900 border border-white/10 text-slate-600 flex items-center justify-center text-[10px] font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>

                {/* Stage Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${
                      isCompleted ? "text-slate-300" : isCurrent ? "text-cyan-300 font-bold" : "text-slate-500"
                    }`}>
                      {stage.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-cyan-400 animate-pulse">Analyzing...</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {stage.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Fallback */}
        {processingError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Analysis Interrupted</span>
            </div>
            <p className="text-slate-300 text-[11px]">{processingError}</p>
            <button
              onClick={() => startAnalysis("https://www.youtube.com/watch?v=kCc8FmEb1nY")}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
