"use client";

import React, { useState } from "react";
import { 
  Youtube, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  X,
  Play
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { openYouTubeAtTimestamp } from "@/utils/mockVideoData";

export const VideoContextCard: React.FC = () => {
  const { 
    activeVideo, 
    startAnalysis, 
    resetToNewAnalysis, 
    explorationProgress 
  } = useWorkspace();
  
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!activeVideo) return null;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(activeVideo.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReanalyze = () => {
    setShowModal(false);
    startAnalysis(activeVideo.url);
  };

  const handleNewAnalysis = () => {
    setShowModal(false);
    resetToNewAnalysis();
  };

  const videoThumbnail = !imgError 
    ? (activeVideo.thumbnail || `https://img.youtube.com/vi/${activeVideo.id}/maxresdefault.jpg`)
    : (activeVideo.fallbackThumbnail || `https://img.youtube.com/vi/${activeVideo.id}/hqdefault.jpg`);

  return (
    <>
      {/* Prominent Large Video Context Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-4 pb-1">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090d17]/90 border border-white/[0.08] hover:border-cyan-500/30 transition-all shadow-xl shadow-black/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            
            {/* Left Column: Prominent Large Thumbnail + Title Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 min-w-0">
              
              {/* Prominent Large Video Thumbnail (16:9 ratio, larger width) */}
              <div 
                onClick={() => openYouTubeAtTimestamp(activeVideo.id, "00:00")}
                title="Play original video on YouTube"
                className="w-full sm:w-44 md:w-48 h-28 sm:h-28 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0 relative group cursor-pointer shadow-lg shadow-black/60"
              >
                <img
                  src={videoThumbnail}
                  alt={activeVideo.title}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-[0_0_12px_rgba(56,189,248,0.5)]">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Video Title & Key Metadata */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-[0_0_8px_rgba(56,189,248,0.15)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>ANALYZED & INDEXED</span>
                  </span>

                  <span className="text-xs text-slate-500">•</span>

                  <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                    <Youtube className="w-3.5 h-3.5 text-red-500" />
                    <span>{activeVideo.channel}</span>
                  </span>

                  <span className="text-xs text-slate-500">•</span>

                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{activeVideo.duration}</span>
                  </span>
                </div>

                <h2 className="font-display text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                  {activeVideo.title}
                </h2>

                <p className="text-xs text-slate-400 line-clamp-1">
                  Full transcript indexed · RAG vector memory active
                </p>
              </div>

            </div>

            {/* Right Column: Contextual Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
              <button
                onClick={handleCopyLink}
                title="Copy YouTube video link"
                className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-all shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-200 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Session Options</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Interactive Video Options Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg glass-panel p-6 sm:p-7 bg-[#0c111c] border-cyan-500/30 shadow-2xl shadow-cyan-950/60 space-y-5"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-white">
                    Video Context & Actions
                  </h3>
                  <p className="text-xs text-slate-400">
                    OpticAI Active Video Session
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Overview */}
            <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08] flex items-center gap-3">
              <div className="w-24 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                <img
                  src={videoThumbnail}
                  alt={activeVideo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {activeVideo.title}
                </p>
                <p className="text-[11px] text-slate-400">
                  {activeVideo.channel} · {activeVideo.duration}
                </p>
              </div>
            </div>

            {/* Video Exploration Progress */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono uppercase text-[10px] tracking-wider text-slate-500">
                  Exploration Progress
                </span>
                <span className="text-cyan-400 font-mono text-[11px] font-semibold">
                  Session Active
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${explorationProgress.summaryViewed ? "text-emerald-400" : "text-slate-600"}`} />
                  <span>Summary</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${explorationProgress.takeawaysViewed ? "text-emerald-400" : "text-slate-600"}`} />
                  <span>Takeaways</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${explorationProgress.transcriptViewed ? "text-emerald-400" : "text-slate-600"}`} />
                  <span>Transcript</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300 col-span-2 sm:col-span-3">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${explorationProgress.quizScore !== null ? "text-emerald-400" : "text-slate-600"}`} />
                  <span>Quiz: {explorationProgress.quizScore !== null ? `${explorationProgress.quizScore}/5 Mastered` : "Not attempted yet"}</span>
                </div>
              </div>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <a
                href={activeVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 text-xs font-semibold text-white flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-500" />
                  <span>Open on YouTube</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
              </a>

              <button
                onClick={handleCopyLink}
                className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 text-xs font-semibold text-white flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  <span>{copied ? "Link Copied!" : "Copy Video Link"}</span>
                </div>
              </button>

              <button
                onClick={handleReanalyze}
                className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 text-xs font-semibold text-white flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <span>Re-Analyze Video</span>
              </button>

              <button
                onClick={handleNewAnalysis}
                className="p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-200 flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>New Video Analysis</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
