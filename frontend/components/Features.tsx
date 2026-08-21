"use client";

import React from "react";
import { Sparkles, MessageSquareCode, KeyRound, BrainCircuit, Activity, Clock, ShieldCheck } from "lucide-react";

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050608] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <span>Product Capabilities</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Engineered for Deep Learning.
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Five focused AI tools built specifically around how engineers, researchers, and students absorb video content.
          </p>
        </div>

        {/* Asymmetric Editorial Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ================= HERO FEATURE 1: AI SUMMARIES (Large 7-Col Card) ================= */}
          <div className="lg:col-span-7 glass-panel p-8 sm:p-9 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#0c1322] via-[#080d17] to-[#050608] border-cyan-500/20 group">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                  FLAGSHIP ENGINE
                </span>
              </div>

              <div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  Structured AI Summaries
                </h3>
                <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                  Generate concise, multi-level hierarchical summaries that distill 60-minute technical talks into clear thesis statements, core proofs, and actionable takeaways in seconds.
                </p>
              </div>

              {/* Visual Micro-Preview inside Hero Card */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2.5 text-xs text-slate-300 font-sans">
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pb-1 border-b border-white/5">
                  <span>AI Synthesis Output</span>
                  <span className="text-emerald-400">✓ 80% Watching Time Saved</span>
                </div>
                <p className="text-slate-200">
                  • <b>Primary Thesis:</b> Eliminates redundant preamble to highlight core architecture.
                </p>
                <p className="text-slate-400">
                  • <b>Key Formula:</b> Attention weights computed via scaled dot products: Softmax(QKᵀ / √d) · V
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Automatic synthesis</span>
              <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">Instant Overview →</span>
            </div>
          </div>

          {/* ================= FEATURE 2: ASK AI (5-Col Card) ================= */}
          <div className="lg:col-span-5 glass-panel p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#0e121e] to-[#06080d] group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                <MessageSquareCode className="w-5 h-5" />
              </div>

              <h3 className="font-display text-xl font-bold text-white">
                Ask AI (Grounded Q&A)
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">
                Chat conversationally about any specific moment in the video. All answers cite verified timestamps directly from the speaker's transcript.
              </p>

              {/* Chat snippet preview */}
              <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-1">
                <div className="flex items-center gap-2 font-semibold text-indigo-300">
                  <span>OpticAI Engine</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20">⏱️ 06:14</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  "Here the author demonstrates the matrix multiplication step..."
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-xs text-slate-500 font-mono">
              Timestamp citations included
            </div>
          </div>

          {/* ================= FEATURE 3: KEY INSIGHTS (4-Col Card) ================= */}
          <div className="lg:col-span-4 glass-panel p-7 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                Key Insights Extraction
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Surfaces critical definitions, trade-offs, and conceptual breakthroughs automatically without scrubbing.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 text-xs text-amber-400 font-mono">
              01 / Core Concepts
            </div>
          </div>

          {/* ================= FEATURE 4: INTERACTIVE QUIZZES (4-Col Card) ================= */}
          <div className="lg:col-span-4 glass-panel p-7 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                Interactive Quizzes
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Personalized multiple-choice questions automatically generated from video concepts to test active retention.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 text-xs text-emerald-400 font-mono">
              02 / Active Recall
            </div>
          </div>

          {/* ================= FEATURE 5: SMART VIDEO ANALYSIS (4-Col Card) ================= */}
          <div className="lg:col-span-4 glass-panel p-7 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                Smart Video Analysis
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Vector chunking partitions speech into topic-indexed semantic zones for instantaneous search.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 text-xs text-purple-400 font-mono">
              03 / Semantic Map
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
