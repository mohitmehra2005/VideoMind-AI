"use client";

import React from "react";
import { 
  ListChecks, 
  MessageSquare, 
  FileText, 
  Play, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { openYouTubeAtTimestamp } from "@/utils/mockVideoData";

export const TakeawaysTab: React.FC = () => {
  const { activeVideo, jumpToTranscript, sendToAskOptic } = useWorkspace();

  if (!activeVideo?.takeaways) return null;

  const takeaways = activeVideo.takeawaysWithMeta || [
    {
      id: 1,
      title: "Linear Collapse without Activations",
      text: "Linear layer stacking without non-linear activations mathematically collapses into a single-layer matrix multiplication.",
      timestamp: "04:30",
      seconds: 270
    },
    {
      id: 2,
      title: "Curvature & Non-Linear Mapping",
      text: "Activation functions introduce curvature and non-linearity, allowing neural networks to solve complex boundary partitions.",
      timestamp: "06:10",
      seconds: 370
    },
    {
      id: 3,
      title: "Differentiable Cost Formulation",
      text: "Cost functions measure prediction discrepancy and must be differentiable to permit gradient descent updates.",
      timestamp: "11:05",
      seconds: 665
    },
    {
      id: 4,
      title: "Chain Rule Backpropagation",
      text: "Backpropagation applies the multivariate chain rule to systematically calculate weight derivatives from output to input.",
      timestamp: "13:40",
      seconds: 820
    },
    {
      id: 5,
      title: "Learning Rate Optimization",
      text: "The learning rate (η) governs step size in parameter space; too large oscillates, too small stalls convergence.",
      timestamp: "16:20",
      seconds: 980
    }
  ];

  return (
    <div className="max-w-4xl mx-auto w-full py-6 px-4 sm:px-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
            <ListChecks className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-tight">
            Key Takeaways & Concept Grounding
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-500">
          {takeaways.length} Key Insights
        </span>
      </div>

      {/* Editorial Numbered Takeaways List with Video Anchors */}
      <div className="space-y-4">
        {takeaways.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.035] border border-white/[0.06] hover:border-cyan-500/20 transition-all space-y-3 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                {/* Number Anchor */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/15 to-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-mono font-bold text-xs shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(56,189,248,0.15)]">
                  0{idx + 1}
                </div>

                {/* Concept Text */}
                <div className="space-y-1 text-left flex-1">
                  <h3 className="text-xs sm:text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-normal text-slate-300 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>

              {/* Timestamp Anchor */}
              <button
                onClick={() => openYouTubeAtTimestamp(activeVideo.id, item.timestamp)}
                title={`Open YouTube at ${item.timestamp}`}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold transition-all shrink-0 shadow-sm"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>{item.timestamp}</span>
              </button>
            </div>

            {/* Contextual Action Buttons */}
            <div className="pt-2 border-t border-white/[0.04] flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => sendToAskOptic(`Explain the takeaway "${item.title}" in depth using details from the video.`)}
                className="px-3 py-1 rounded-lg bg-white/[0.03] hover:bg-indigo-500/15 border border-white/10 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-200 flex items-center gap-1.5 transition-all"
              >
                <MessageSquare className="w-3 h-3 text-indigo-400" />
                <span>Ask about this</span>
              </button>

              <button
                onClick={() => jumpToTranscript(item.timestamp)}
                className="px-3 py-1 rounded-lg bg-white/[0.03] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-200 flex items-center gap-1.5 transition-all"
              >
                <FileText className="w-3 h-3 text-cyan-400" />
                <span>Transcript</span>
              </button>

              <button
                onClick={() => openYouTubeAtTimestamp(activeVideo.id, item.timestamp)}
                className="px-3 py-1 rounded-lg bg-white/[0.03] hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-200 flex items-center gap-1.5 transition-all"
              >
                <Play className="w-3 h-3 text-emerald-400 fill-current" />
                <span>▶ {item.timestamp}</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
