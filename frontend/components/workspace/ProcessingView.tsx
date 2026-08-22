"use client";

import React, { useEffect } from "react";
import { Check, AlertCircle, RefreshCw, Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";

export const ProcessingView: React.FC = () => {
  const {
    processingStage,
    setProcessingStage,
    processingError,
    startAnalysis,
  } = useWorkspace();

  const stages = [
    { title: "Video received", detail: "Connecting to video stream & validating metadata" },
    { title: "Extracting transcript", detail: "Capturing timestamped speech segments" },
    { title: "Chunking video content", detail: "Structuring transcript into semantic passages" },
    { title: "Creating embeddings", detail: "Vectorizing concepts for intelligent retrieval" },
    { title: "Building knowledge base", detail: "Indexing vectors into FAISS semantic memory" },
    { title: "Preparing workspace", detail: "Generating structured summaries & interactive quiz" },
  ];

  useEffect(() => {
    if (processingError) return;

    const timer = setInterval(() => {
      setProcessingStage((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        } 
      });
    }, 850);

    return () => clearInterval(timer);
  }, [processingError, setProcessingStage, stages.length]);

  const currentStepNumber = Math.min(processingStage + 1, stages.length);
  const progressPercent = Math.round((currentStepNumber / stages.length) * 100);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 max-w-2xl mx-auto w-full py-12 sm:py-16 relative overflow-hidden">
      
      {/* Background Soft Glow Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[320px] bg-gradient-to-tr from-cyan-500/12 via-indigo-500/10 to-transparent blur-[90px] pointer-events-none" />

      {/* Main Glass Workspace Card */}
      <div className="relative z-10 w-full rounded-3xl bg-[#090d16]/90 backdrop-blur-2xl border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(56,189,248,0.06),inset_0_1px_1px_rgba(255,255,255,0.12)] p-6 sm:p-9 space-y-7">
        
        {/* ================= 1. HEADER SECTION ================= */}
        <div className="text-center space-y-2">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#38BDF8]" />
            </span>
            <span>AI Processing Pipeline</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Understanding Video Content
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            OpticAI is analyzing the video and building your searchable knowledge workspace.
          </p>
        </div>

        {/* ================= 2. OVERALL PROGRESS SECTION ================= */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">Processing video</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-cyan-400 font-medium font-mono text-[11px]">
                Step {currentStepNumber} of {stages.length}
              </span>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-300">
              {progressPercent}%
            </span>
          </div>
          
          {/* Thin Smooth Gradient Progress Bar */}
          <div className="w-full h-2 rounded-full bg-black/60 border border-white/[0.08] overflow-hidden p-0.5 relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(56,189,248,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ================= 3. DISTINCT STATUS ROWS & TIMELINE ================= */}
        <div className="space-y-2.5 relative">
          
          {/* Timeline Background Track Line */}
          <div className="absolute left-[27px] top-6 bottom-6 w-[1.5px] bg-white/[0.07]" />
          
          {/* Animated Cyan Highlighted Timeline */}
          <div
            className="absolute left-[27px] top-6 w-[1.5px] bg-gradient-to-b from-cyan-400 via-sky-400 to-cyan-500 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(56,189,248,0.6)]"
            style={{
              height: `${Math.min(
                100,
                (processingStage / (stages.length - 1)) * 100
              )}%`,
            }}
          />

          {stages.map((stage, idx) => {
            const isCompleted = idx < processingStage;
            const isCurrent = idx === processingStage;
            const isPending = idx > processingStage;

            return (
              <div
                key={idx}
                className={`relative z-10 flex items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-300 ${
                  isCurrent
                    ? "bg-cyan-500/[0.07] border border-cyan-500/30 shadow-[0_0_24px_rgba(56,189,248,0.1),inset_0_1px_1px_rgba(255,255,255,0.12)] scale-[1.01]"
                    : isCompleted
                    ? "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.035]"
                    : "bg-transparent border border-transparent opacity-50"
                }`}
              >
                {/* Left Side: Node Indicator & Info */}
                <div className="flex items-center gap-3.5 min-w-0 pr-3">
                  
                  {/* Status Icon Indicator */}
                  <div className="shrink-0">
                    {isCompleted && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.25)]">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                    {isCurrent && (
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center shadow-[0_0_14px_rgba(56,189,248,0.45)] relative">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute" />
                        <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_6px_#38BDF8]" />
                      </div>
                    )}
                    {isPending && (
                      <div className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/10 text-slate-500 flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold truncate ${
                          isCurrent
                            ? "text-white font-bold tracking-tight"
                            : isCompleted
                            ? "text-slate-200"
                            : "text-slate-400"
                        }`}
                      >
                        {stage.title}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] truncate mt-0.5 ${
                        isCurrent
                          ? "text-cyan-200/80"
                          : isCompleted
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      {stage.detail}
                    </p>
                  </div>

                </div>

                {/* Right Side: Status Badge */}
                <div className="shrink-0 pl-2">
                  {isCompleted && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                      Complete
                    </span>
                  )}
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span>Analyzing...</span>
                    </span>
                  )}
                  {isPending && (
                    <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-mono text-slate-500">
                      Waiting
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* ================= 4. FOOTER STATUS BAR ================= */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-center gap-2 text-center text-slate-400 text-[11px] sm:text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>This may take a moment depending on video length · You can safely stay on this page</span>
        </div>

        {/* ================= ERROR FALLBACK ================= */}
        {processingError && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Analysis Interrupted</span>
            </div>
            <p className="text-slate-300 text-[11px]">{processingError}</p>
            <button
              onClick={() => startAnalysis("https://www.youtube.com/watch?v=kCc8FmEb1nY")}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors text-xs cursor-pointer shadow-md"
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
