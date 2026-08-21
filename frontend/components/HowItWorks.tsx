"use client";

import React, { useState, useEffect } from "react";
import { Link2, Cpu, FileCheck2, MessageSquare, HelpCircle, Check, ArrowRight } from "lucide-react";

export const HowItWorks: React.FC = () => {
  // Default active stage is strictly 0 (Stage 01 - Paste a YouTube Link)
  const [activeStage, setActiveStage] = useState(0);

  // Reset to Stage 01 if navigated to via #how-it-works link
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#how-it-works") {
        setActiveStage(0);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const steps = [
    {
      num: "01",
      title: "Paste a YouTube Link",
      desc: "Input any lecture, tutorial, or technical video URL.",
      icon: Link2,
      accent: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/25",
      detail: "OpticAI verifies transcripts and captures English subtitles immediately.",
    },
    {
      num: "02",
      title: "AI Understands Video",
      desc: "Transcript is segmented into semantic chunks and embedded in vector space.",
      icon: Cpu,
      accent: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/25",
      detail: "Dense embeddings indexed in a high-speed FAISS vector store.",
    },
    {
      num: "03",
      title: "Explore Summaries & Insights",
      desc: "Structured bullet points, key takeaways, and core thesis distilled.",
      icon: FileCheck2,
      accent: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/25",
      detail: "Eliminates repetitive fluff and delivers high-density knowledge.",
    },
    {
      num: "04",
      title: "Ask Questions",
      desc: "Chat conversationally with citations linked to exact video moments.",
      icon: MessageSquare,
      accent: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/25",
      detail: "Answers grounded in speaker words with jumpable timestamp markers.",
    },
    {
      num: "05",
      title: "Test Yourself with Quizzes",
      desc: "AI synthesizes personalized quizzes to cement long-term retention.",
      icon: HelpCircle,
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/25",
      detail: "Automated multiple-choice questions with instant scoring feedback.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050608] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <span>5-Stage Neural Journey</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            How It Works.
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Follow the automated pathway from a raw YouTube link to complete cognitive retention.
          </p>
        </div>

        {/* Continuous Connected Flow */}
        <div className="space-y-8">
          
          {/* 5-Step Connected Progress Bar */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStage === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveStage(idx)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? "bg-slate-900/90 border-cyan-500/40 shadow-xl shadow-cyan-950/40 transform -translate-y-1"
                      : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                  }`}
                >
                  <div>
                    {/* Top Step Number & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                        isSelected ? "bg-cyan-500/20 text-cyan-300" : "bg-white/5 text-slate-500"
                      }`}>
                        STAGE {step.num}
                      </span>
                      
                      <div className={`w-8 h-8 rounded-lg ${step.bg} border flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${step.accent}`} />
                      </div>
                    </div>

                    <h3 className={`font-display text-sm font-bold mb-1.5 transition-colors ${
                      isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                    }`}>
                      {step.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Bottom Indicator Bar */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{isSelected ? "Active Stage" : "Click to view"}</span>
                    <span className={isSelected ? "text-cyan-400" : "text-slate-600"}>
                      {idx + 1}/5
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Highlight Detail Banner */}
          <div className="glass-panel p-6 sm:p-7 border-cyan-500/20 bg-gradient-to-r from-[#0b101c] via-[#090d16] to-[#06080d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold shrink-0">
                {steps[activeStage].num}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Stage {steps[activeStage].num}: {steps[activeStage].title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {steps[activeStage].detail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium shrink-0">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Next-Gen RAG Architecture</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
