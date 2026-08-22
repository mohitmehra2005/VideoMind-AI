"use client";

import React from "react";
import { AuthCard } from "./AuthCard";
import { Sparkles, Play, Brain, CheckSquare, ArrowDown } from "lucide-react";

interface HeroProps {
  onGuestMode?: () => void;
  onSuccess?: (user: { name: string; email: string; isGuest: boolean }) => void;
}

export const Hero: React.FC<HeroProps> = ({ onGuestMode, onSuccess }) => {
  const scrollToDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    const demo = document.getElementById("demo");
    if (demo) {
      demo.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="lunar-hero-bg min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* ================= LEFT COLUMN: INTRODUCTION ================= */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Lunar Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38BDF8]" />
              <span>OpticAI · Video Intelligence Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              See More. <br />
              <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                Understand More.
              </span>
            </h1>

            {/* Short Product Explanation */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Transform long YouTube tutorials, lectures, and technical breakdowns into structured summaries, video-grounded AI conversations, and interactive quizzes.
            </p>

            {/* 3 Compact Benefit Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-200">AI Summaries</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-200">Video-Grounded Q&A</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-200">Interactive Quizzes</span>
              </div>
            </div>

            {/* High-Contrast Visible Secondary Exploration Action Area */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-5 text-xs">
              {/* Watch Interactive Demo Button */}
              <button
                onClick={scrollToDemo}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-cyan-500/[0.12] backdrop-blur-xl border border-white/20 hover:border-cyan-400/50 text-slate-100 hover:text-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.35),0_0_15px_rgba(56,189,248,0.12),inset_0_1px_1px_rgba(255,255,255,0.22)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.4),0_0_24px_rgba(56,189,248,0.28),inset_0_1px_1px_rgba(255,255,255,0.38)] group shrink-0"
              >
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shadow-[0_0_8px_rgba(56,189,248,0.35)] group-hover:scale-110 group-hover:bg-cyan-500/30 transition-all">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </span>
                <span className="font-semibold tracking-tight">Watch Interactive Demo</span>
                <ArrowDown className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
              </button>

              {/* Connected Visible Supporting Context */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/15 text-slate-300 font-medium shadow-[0_4px_16px_rgba(0,0,0,0.25),0_0_12px_rgba(56,189,248,0.08),inset_0_1px_1px_rgba(255,255,255,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0 animate-pulse" />
                <span className="text-slate-200 font-semibold">Free guest preview</span>
                <span className="text-slate-500 hidden sm:inline">•</span>
                <span className="text-slate-400 hidden sm:inline text-[11px]">Explore before getting started</span>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: CLEAN AUTHENTICATION CARD ================= */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <AuthCard onGuestMode={onGuestMode} onSuccess={onSuccess} />
          </div>

        </div>
      </div>
    </section>
  );
};
