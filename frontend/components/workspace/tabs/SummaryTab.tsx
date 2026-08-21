"use client";

import React, { useState } from "react";
import { 
  Copy, 
  Check, 
  BookOpen, 
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  Play, 
  Sparkles,
  Layers,
  ChevronRight 
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { MathRenderer } from "@/components/workspace/MathRenderer";
import { openYouTubeAtTimestamp } from "@/utils/mockVideoData";

export const SummaryTab: React.FC = () => {
  const { activeVideo, jumpToTranscript, sendToAskOptic } = useWorkspace();
  const [copied, setCopied] = useState(false);

  if (!activeVideo) return null;

  const executiveSummaryText = activeVideo.executiveSummary || 
    "This video establishes the architectural and mathematical foundations of artificial neural networks. It proves why stacked linear matrix multiplications mathematically collapse without non-linear activation functions, formalizes cost surfaces for error measurement, and derives backpropagation via the multivariate calculus chain rule.";

  const structuredSections = activeVideo.structuredSummary || [
    {
      id: 1,
      title: "Foundations of Representation & Single Neurons",
      explanation: "An artificial neuron evaluates affine transformations by computing weighted sums $z = \\sum (w_i x_i) + b$. Without non-linear activation functions, multiple layered compositions algebraically collapse into a single affine transformation ($W_2(W_1 x) = W_{combined} x$).",
      keyPoints: [
        "Linear layer stacking without activations loses all functional depth benefits.",
        "Weights determine connection strengths while bias thresholds determine baseline firing sensitivity.",
        "Neurons represent multidimensional input vectors as singular scalar activations."
      ],
      startTimestamp: "02:15",
      endTimestamp: "05:30",
      startSeconds: 135
    },
    {
      id: 2,
      title: "Activation Dynamics & Non-Linearity",
      explanation: "Non-linear activations like ReLU ($max(0, x)$) and Sigmoid curve decision boundaries across hyperplanes, preventing gradient saturation in deep multi-layer architectures.",
      keyPoints: [
        "ReLU sets negative activations to zero while preserving a constant gradient of 1 for positive inputs.",
        "Non-linearities empower networks to solve non-linearly separable partitions such as the XOR problem.",
        "Vanishing gradients are mitigated by avoiding saturated flat regions."
      ],
      startTimestamp: "06:10",
      endTimestamp: "10:45",
      startSeconds: 370
    },
    {
      id: 3,
      title: "Loss Formulation & Cost Minimization",
      explanation: "Divergence between model predictions $\\hat{y}$ and ground truth observations $y$ is evaluated via differentiable loss functions such as Mean Squared Error and Cross-Entropy.",
      keyPoints: [
        "Cost functions must be continuous and differentiable to permit gradient computation.",
        "High-dimensional cost surfaces are navigated using parameter step optimization.",
        "Error magnitude dictates the scale of required weight adjustments."
      ],
      startTimestamp: "11:05",
      endTimestamp: "13:30",
      startSeconds: 665
    },
    {
      id: 4,
      title: "Backpropagation via Multivariate Chain Rule",
      explanation: "Error gradients $\\frac{\\partial C}{\\partial w_{ij}}$ are iteratively computed backward from final outputs to early layers, enabling Gradient Descent parameter updates: $w \\leftarrow w - \\eta \\nabla C$.",
      keyPoints: [
        "The multivariate calculus chain rule enables recursive gradient calculation without redundant matrix recalculation.",
        "Learning rate ($\\eta$) governs step length across the negative gradient vector.",
        "Iterative parameter updates converge weights toward minimal empirical error."
      ],
      startTimestamp: "13:40",
      endTimestamp: "18:10",
      startSeconds: 820
    }
  ];

  const handleCopyAll = () => {
    const fullText = `OpticAI Summary: ${activeVideo.title}\n\nEXECUTIVE SUMMARY:\n${executiveSummaryText}\n\nSTRUCTURED BREAKDOWN:\n` +
      structuredSections.map((s) => `${s.id}. ${s.title} (${s.startTimestamp})\n${s.explanation}\nKey Points:\n` + (s.keyPoints || []).map((p) => `- ${p}`).join("\n")).join("\n\n");
    
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full py-6 px-4 sm:px-6 space-y-8">
      
      {/* Top Header & Copy Action */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-tight">
              Hybrid Knowledge Summary
            </h2>
            <p className="text-[11px] text-slate-400">
              Executive thesis + structured conceptual breakdown
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm group"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>

      {/* ================= 1. EXECUTIVE SUMMARY ================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38BDF8]" />
            <span>Executive Summary</span>
            <span className="text-slate-500 font-normal">· 20–30 Second Overview</span>
          </span>

          <button
            onClick={() => openYouTubeAtTimestamp(activeVideo.id, "00:00")}
            className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 bg-white/[0.03] hover:bg-white/[0.06] px-2.5 py-0.5 rounded-md border border-white/5 transition-colors"
          >
            <Play className="w-2.5 h-2.5 fill-current text-cyan-400" />
            <span>Play from start 00:00</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0c1322] via-[#090e18] to-[#060910] border border-cyan-500/25 shadow-lg shadow-cyan-950/30">
          <MathRenderer
            content={executiveSummaryText}
            className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal"
          />
        </div>
      </div>

      {/* ================= 2. STRUCTURED CONCEPTUAL BREAKDOWN ================= */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Structured Conceptual Breakdown</span>
            <span className="text-slate-500 font-normal">· {structuredSections.length} Core Modules</span>
          </span>
        </div>

        <div className="space-y-4">
          {structuredSections.map((section, idx) => (
            <div
              key={section.id || idx}
              className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.035] border border-white/[0.07] hover:border-cyan-500/30 transition-all space-y-4 group shadow-md shadow-black/30"
            >
              {/* Section Header with Timing */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.15)]">
                    0{idx + 1}
                  </span>
                  <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-tight">
                    {section.title}
                  </h3>
                </div>

                {/* Connected Timestamp Link */}
                <button
                  onClick={() => openYouTubeAtTimestamp(activeVideo.id, section.startTimestamp)}
                  title={`Play on YouTube at ${section.startTimestamp}`}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold transition-all shrink-0 shadow-sm"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Discussed at {section.startTimestamp}</span>
                </button>
              </div>

              {/* Conceptual Explanation with Math */}
              <MathRenderer
                content={section.explanation}
                className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal pl-0.5"
              />

              {/* Key Points Bullet List */}
              {section.keyPoints && section.keyPoints.length > 0 && (
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.05] space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                    Key Insights:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {section.keyPoints.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Interactive Connected Actions Bar */}
              <div className="pt-2 border-t border-white/[0.04] flex flex-wrap items-center gap-2 text-xs">
                {/* Ask OpticAI */}
                <button
                  onClick={() => sendToAskOptic(`Explain the "${section.title}" section from this video in simpler terms.`)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-indigo-500/15 border border-white/10 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-200 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Ask OpticAI</span>
                </button>

                {/* View Related Transcript */}
                <button
                  onClick={() => jumpToTranscript(section.startTimestamp)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-200 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Transcript</span>
                </button>

                {/* Review in Video */}
                <button
                  onClick={() => openYouTubeAtTimestamp(activeVideo.id, section.startTimestamp)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-200 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                  <span>Review in Video</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Grounding Footer */}
      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Grounded in speech transcript with timestamp verification</span>
        </div>
        <span>OpticAI Neural RAG</span>
      </div>

    </div>
  );
};
