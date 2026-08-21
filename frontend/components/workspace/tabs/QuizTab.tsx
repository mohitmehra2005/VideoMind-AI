"use client";

import React, { useState } from "react";
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RefreshCw, 
  Play, 
  FileText, 
  Sparkles, 
  Youtube, 
  BookOpen 
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { MathRenderer } from "@/components/workspace/MathRenderer";
import { openYouTubeAtTimestamp } from "@/utils/mockVideoData";

export const QuizTab: React.FC = () => {
  const { 
    activeVideo, 
    jumpToTranscript, 
    setActiveTab, 
    setExplorationProgress 
  } = useWorkspace();
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const quiz = activeVideo?.quiz || [];

  if (quiz.length === 0) {
    return (
      <div className="max-w-4xl mx-auto w-full py-16 px-4 text-center text-slate-500">
        <HelpCircle className="w-10 h-10 mx-auto mb-3 text-slate-600" />
        <p className="text-sm">No quiz questions generated for this video.</p>
      </div>
    );
  }

  const currentQ = quiz[currentQIndex];

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerChecked(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < quiz.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      setIsFinished(true);
      const finalScore = score + (selectedOption === currentQ.correctIndex ? 1 : 0);
      setExplorationProgress((p) => ({ ...p, quizScore: finalScore }));
    }
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = Math.round((score / quiz.length) * 100);
    return (
      <div className="max-w-md mx-auto w-full py-12 px-4 text-center">
        <div className="glass-panel p-8 sm:p-10 bg-gradient-to-b from-[#0c121e] to-[#06080d] border-cyan-500/25 space-y-6 shadow-2xl shadow-cyan-950/40">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl mx-auto shadow-[0_0_25px_rgba(56,189,248,0.25)]">
            🏆
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Cognitive Retention Complete
            </span>
            <h2 className="font-display text-2xl font-bold text-white">
              Your Quiz Result
            </h2>
            <p className="text-xs text-slate-400 truncate">
              {activeVideo?.title}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/50 border border-white/[0.08] space-y-1">
            <div className="font-display text-4xl font-extrabold text-white">
              {score} / {quiz.length}
            </div>
            <div className="text-sm font-semibold text-emerald-400">
              {percentage}% Accuracy Score
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {percentage >= 80
              ? "Superb comprehension! You have synthesized and retained the core concepts of this video."
              : "Good effort! Review the takeaways or re-examine the video segments to reinforce retention."}
          </p>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={handleRestart}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:brightness-110 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Quiz Again</span>
            </button>

            <button
              onClick={() => setActiveTab("summary")}
              className="w-full py-2.5 px-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Return to Summary</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full py-6 px-4 sm:px-6 space-y-6">
      
      {/* Quiz Progress Top Bar */}
      <div className="space-y-3 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono text-slate-300 uppercase font-bold">
              QUESTION {currentQIndex + 1} OF {quiz.length}
            </span>
          </div>

          <span className="text-xs font-mono text-emerald-400 font-semibold">
            Score: {score}/{currentQIndex + (isAnswerChecked ? 1 : 0)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
            style={{ width: `${((currentQIndex + 1) / quiz.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel p-6 sm:p-8 bg-[#0a0f1b]/90 border-white/[0.08] space-y-6">
        <MathRenderer
          content={currentQ.question}
          className="font-display text-base sm:text-lg font-bold text-white leading-relaxed"
        />

        {/* Interactive Answer Choices */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let stateClass = "border-white/[0.08] hover:border-white/20 bg-white/[0.02]";
            if (isSelected) stateClass = "border-cyan-400 bg-cyan-500/15 text-white shadow-[0_0_15px_rgba(56,189,248,0.15)]";
            if (isAnswerChecked) {
              if (isCorrect) {
                stateClass = "border-emerald-500/40 bg-emerald-500/20 text-emerald-200 font-medium";
              } else if (isSelected && !isCorrect) {
                stateClass = "border-red-500/40 bg-red-500/20 text-red-200";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswerChecked}
                onClick={() => setSelectedOption(idx)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${stateClass}`}
              >
                <MathRenderer content={opt} className="flex-1" />
                {isAnswerChecked && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                )}
                {isAnswerChecked && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback & Video Timestamp Grounding */}
        {isAnswerChecked && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-2.5 text-xs animate-in fade-in">
            <div className="flex items-center gap-2 font-bold">
              {selectedOption === currentQ.correctIndex ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Incorrect
                </span>
              )}
            </div>

            <MathRenderer
              content={currentQ.explanation}
              className="text-slate-300 leading-relaxed font-normal"
            />

            {/* Video Moment Review Link */}
            {currentQ.sourceTimestamp && activeVideo && (
              <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <span>📍 Explained in video at</span>
                  <span className="text-cyan-400 font-mono font-semibold">{currentQ.sourceTimestamp}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => jumpToTranscript(currentQ.sourceTimestamp || "00:00")}
                    className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                  >
                    <FileText className="w-3 h-3 text-cyan-400" />
                    <span>Transcript</span>
                  </button>

                  <button
                    onClick={() => openYouTubeAtTimestamp(activeVideo.id, currentQ.sourceTimestamp || "00:00")}
                    className="px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 text-[11px] font-semibold transition-all shadow-sm"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>▶ Review this moment</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-end">
          {!isAnswerChecked ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:brightness-110 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all disabled:opacity-40"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-cyan-500 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>{currentQIndex < quiz.length - 1 ? "Next Question" : "View Final Results"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
