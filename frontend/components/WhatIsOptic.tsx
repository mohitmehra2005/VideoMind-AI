"use client";

import React from "react";
import { Sparkles, Brain, CheckCircle2, ArrowRight, EyeOff, Zap } from "lucide-react";

export const WhatIsOptic: React.FC = () => {
  return (
    <section id="what-is-optic" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050608] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <span>Core Philosophy</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Turn Watching Into Understanding.
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Passive video watching often causes viewers to lose up to 80% of critical technical nuances. OpticAI turns hours of linear video into an active, searchable, and verifiable knowledge engine.
          </p>
        </div>

        {/* Dynamic Split Layout: Passive Watching vs Active Cognition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Block: The Contrast & Impact */}
          <div className="lg:col-span-5 glass-panel p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#0a0e17] to-[#06080d]">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span>The Cognitive Problem</span>
              </div>

              <h3 className="font-display text-2xl font-bold text-white leading-snug">
                Why scrubbing through 2-hour lectures breaks deep learning.
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                    <EyeOff className="w-3.5 h-3.5" />
                  </div>
                  <span><b>Passive Retention Decay:</b> Key formulas and definitions disappear into background audio noise.</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                    <EyeOff className="w-3.5 h-3.5" />
                  </div>
                  <span><b>Wasted Time:</b> Re-watching entire sections just to find one timestamped explanation.</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                    <EyeOff className="w-3.5 h-3.5" />
                  </div>
                  <span><b>Zero Active Recall:</b> No immediate feedback to verify if you truly comprehended the lecture.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-cyan-400 font-medium">
              <span>OpticAI Solution Engine</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Right Block: The Neural Transformation Pipeline */}
          <div className="lg:col-span-7 glass-panel p-8 flex flex-col justify-between relative overflow-hidden border-cyan-500/20 bg-gradient-to-b from-[#0e1524] to-[#070a12]">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>The OpticAI Transformation</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Autonomous RAG</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Node 1 */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-mono font-bold">
                    01
                  </div>
                  <h4 className="text-sm font-semibold text-white">Semantic Ingestion</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Auto-fetches high-accuracy transcripts and aligns time-indexes.
                  </p>
                </div>

                {/* Node 2 */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-mono font-bold">
                    02
                  </div>
                  <h4 className="text-sm font-semibold text-white">Neural Indexing</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Splits concepts into 512-token chunks embedded in vector space.
                  </p>
                </div>

                {/* Node 3 */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">
                    03
                  </div>
                  <h4 className="text-sm font-semibold text-white">Active Mastery</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Instantly queries context, summarizes takeaways, and tests knowledge.
                  </p>
                </div>

              </div>

              {/* Live Status Bar */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>OpticAI Comprehension Accelerator</span>
                  </span>
                  <span className="text-cyan-400 font-mono font-bold">5x Faster Learning</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 w-full animate-pulse" />
                </div>
              </div>

            </div>

            <p className="text-xs text-slate-500 mt-4">
              All processing happens autonomously in seconds without manual note-taking.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
