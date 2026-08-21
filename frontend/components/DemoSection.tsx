"use client";

import React, { useState } from "react";
import { 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  MessageSquare, 
  CheckSquare, 
  Youtube, 
  Cpu, 
  FileText,
  Clock,
  Send,
  RefreshCw
} from "lucide-react";

export const DemoSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "user",
      text: "Why do deep neural networks use non-linear activation functions like ReLU?"
    },
    {
      role: "ai",
      timestamp: "⏱️ 08:24",
      text: "Without non-linear activations, composing multiple linear layers (W2 * W1 * x) mathematically collapses into a single linear matrix transformation. Non-linearities like ReLU allow networks to approximate arbitrary non-linear decision boundaries."
    }
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    
    const newMsg = { role: "user", text: customQuestion };
    setChatMessages((prev) => [...prev, newMsg]);
    setCustomQuestion("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          timestamp: "⏱️ 11:05",
          text: `Based on the transcript: "${newMsg.text}" is directly addressed in section 3 where gradient propagation is analyzed.`
        }
      ]);
    }, 600);
  };

  const demoStages = [
    {
      id: "paste",
      title: "1. Paste YouTube URL",
      icon: Youtube,
      label: "Input Video",
      desc: "Provide any technical lecture or tutorial URL.",
    },
    {
      id: "processing",
      title: "2. Neural Processing",
      icon: Cpu,
      label: "RAG Pipeline",
      desc: "Extract transcripts, chunk tokens, and build vector embeddings.",
    },
    {
      id: "summary",
      title: "3. Structured Summary",
      icon: FileText,
      label: "AI Synthesis",
      desc: "Extract core arguments, math proofs, and takeaways.",
    },
    {
      id: "ask-ai",
      title: "4. Ask AI (Grounded)",
      icon: MessageSquare,
      label: "Video Chat",
      desc: "Conversational Q&A grounded with exact timestamp links.",
    },
    {
      id: "quiz",
      title: "5. Interactive Quiz",
      icon: CheckSquare,
      label: "Knowledge Check",
      desc: "Adaptive multiple-choice test synthesized from transcript.",
    },
  ];

  return (
    <section id="demo" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050608] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <span>Live Interactive Preview</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            See OpticAI in Action.
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Test-drive the simulated OpticAI workspace below. Click through each phase to experience the workflow.
          </p>
        </div>

        {/* Master Workspace Container Frame */}
        <div className="glass-panel overflow-hidden border-cyan-500/20 shadow-2xl shadow-cyan-950/40">
          
          {/* Top Browser / App Chrome Bar */}
          <div className="px-6 py-4 bg-[#080c14] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-xs text-slate-400 font-mono ml-3 hidden sm:inline">
                https://opticai.app/workspace/kCc8FmEb1nY
              </span>
            </div>

            {/* Quick Stage Indicator Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {demoStages.map((stage, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                    activeStep === idx
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                      : "bg-white/[0.04] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08]"
                  }`}
                >
                  {stage.title.split(". ")[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Workspace Body Area */}
          <div className="p-6 sm:p-9 bg-gradient-to-b from-[#0a0f1b] via-[#080c16] to-[#05070d] min-h-[460px] flex flex-col justify-between">
            
            {/* Active Workspace View Rendering */}
            <div className="space-y-6">
              
              {/* Active Stage Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
                    0{activeStep + 1}
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-white">
                      {demoStages[activeStep].title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {demoStages[activeStep].desc}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md self-start sm:self-auto">
                  Step {activeStep + 1} of 5
                </span>
              </div>

              {/* ================= STAGE 1: PASTE LINK ================= */}
              {activeStep === 0 && (
                <div className="space-y-6 max-w-2xl mx-auto py-4">
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                      YouTube Video URL
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex-1 w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-slate-200 font-mono">
                        <span className="text-red-500 font-bold">▶</span>
                        <input
                          type="text"
                          readOnly
                          value="https://www.youtube.com/watch?v=kCc8FmEb1nY"
                          className="bg-transparent border-none outline-none flex-1 text-slate-200"
                        />
                      </div>
                      <button
                        onClick={() => setActiveStep(1)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:brightness-110 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all shrink-0"
                      >
                        Analyze Video →
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                    <div className="w-14 h-10 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-lg">
                      🎬
                    </div>
                    <div className="text-xs space-y-0.5">
                      <p className="font-semibold text-white">Neural Networks from Scratch (Lecture Series)</p>
                      <p className="text-slate-500">Duration: 18:45 · 1080p HD · Transcript Available</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= STAGE 2: NEURAL PROCESSING ================= */}
              {activeStep === 1 && (
                <div className="space-y-4 max-w-2xl mx-auto py-4">
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span>AI Video Processing Pipeline</span>
                      </span>
                      <span className="font-mono text-cyan-400 font-bold">100% Ready</span>
                    </div>

                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 w-full animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Transcript Ingestion (1,480 English tokens captured)</span>
                      </span>
                      <span className="font-mono text-[11px]">0.3s</span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Semantic Chunking (512 token recursive windows)</span>
                      </span>
                      <span className="font-mono text-[11px]">0.2s</span>
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        <span>Vector Index Generation (FAISS Vector Store Loaded)</span>
                      </span>
                      <span className="font-mono text-[11px]">0.4s</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= STAGE 3: STRUCTURED SUMMARY ================= */}
              {activeStep === 2 && (
                <div className="space-y-4 max-w-3xl mx-auto py-2">
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    <div className="border-l-3 border-cyan-400 pl-3.5">
                      <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        Executive Overview
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed">
                        The video explores the fundamental mechanics of artificial neural networks, detailing forward propagation, loss calculation, and weight optimization through backpropagation and gradient descent.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 space-y-1">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>00:00 - 05:30 · Foundation</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          Matrix dot products and bias additions across linear layer units.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 space-y-1">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>05:31 - 12:45 · Activation</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          Why non-linear functions (ReLU, Sigmoid) prevent linear collapse.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= STAGE 4: ASK AI ================= */}
              {activeStep === 3 && (
                <div className="space-y-4 max-w-3xl mx-auto py-2">
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 min-h-[220px] max-h-[260px] overflow-y-auto space-y-3.5 pr-2">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-white/[0.06] text-white ml-auto max-w-[80%]"
                            : "bg-cyan-950/40 border border-cyan-500/20 text-slate-200 max-w-[90%]"
                        }`}
                      >
                        {msg.role === "ai" && (
                          <div className="flex items-center gap-2 mb-1.5 font-semibold text-cyan-300">
                            <span>OpticAI RAG</span>
                            {msg.timestamp && (
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                                {msg.timestamp}
                              </span>
                            )}
                          </div>
                        )}
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input Bar */}
                  <form onSubmit={handleSendChat} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      placeholder="Ask any question about this video..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      className="p-2.5 rounded-xl bg-cyan-500 hover:brightness-110 text-slate-950 font-bold transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* ================= STAGE 5: INTERACTIVE QUIZ ================= */}
              {activeStep === 4 && (
                <div className="space-y-4 max-w-2xl mx-auto py-2">
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      Question: What role does backpropagation play in training a neural network?
                    </p>

                    <div className="space-y-2.5">
                      {[
                        { id: 0, text: "A. It computes partial derivatives of the cost function with respect to weights using the chain rule.", correct: true },
                        { id: 1, text: "B. It removes the need for training data.", correct: false },
                        { id: 2, text: "C. It converts audio frequencies into video frames.", correct: false },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setQuizSelected(opt.id);
                            setQuizSubmitted(true);
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                            quizSubmitted && opt.correct
                              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-medium"
                              : quizSelected === opt.id && !opt.correct
                              ? "bg-red-500/15 border-red-500/40 text-red-300"
                              : "bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.05]"
                          }`}
                        >
                          <span>{opt.text}</span>
                          {quizSubmitted && opt.correct && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                          )}
                        </button>
                      ))}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                        <span>✓ Correct! The chain rule propagates error gradients backward through all layers.</span>
                        <button
                          onClick={() => {
                            setQuizSubmitted(false);
                            setQuizSelected(null);
                          }}
                          className="underline hover:text-white ml-2 shrink-0"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Controls inside Workspace */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                ← Previous Stage
              </button>

              <span className="font-mono text-[11px] text-slate-500">
                Simulated OpticAI Workspace
              </span>

              <button
                onClick={() => setActiveStep((prev) => Math.min(demoStages.length - 1, prev + 1))}
                disabled={activeStep === demoStages.length - 1}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold hover:brightness-110 disabled:opacity-30 transition-all shadow-md shadow-indigo-500/20"
              >
                Next Stage →
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
