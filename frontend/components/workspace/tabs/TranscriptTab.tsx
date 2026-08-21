"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, FileCode2, X, Play, ExternalLink, Sparkles } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { openYouTubeAtTimestamp } from "@/utils/mockVideoData";

export const TranscriptTab: React.FC = () => {
  const { activeVideo, highlightedTimestamp, setHighlightedTimestamp } = useWorkspace();
  const [searchTerm, setSearchTerm] = useState("");
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Auto-scroll to highlighted segment when navigated from Summary or Takeaways
  useEffect(() => {
    if (highlightedTimestamp && itemRefs.current[highlightedTimestamp]) {
      itemRefs.current[highlightedTimestamp]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      const timer = setTimeout(() => {
        setHighlightedTimestamp(null);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [highlightedTimestamp, setHighlightedTimestamp]);

  if (!activeVideo?.transcript || activeVideo.transcript.length === 0) {
    return (
      <div className="max-w-4xl mx-auto w-full py-16 px-4 text-center text-slate-500">
        <FileCode2 className="w-10 h-10 mx-auto mb-3 text-slate-600" />
        <p className="text-sm">No transcript available for this video.</p>
      </div>
    );
  }

  const filteredLines = activeVideo.transcript.filter((line) =>
    line.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto w-full py-6 px-4 sm:px-6 space-y-6">
      
      {/* Header & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.06] gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
            <FileCode2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-tight">
              Synchronized Transcript
            </h2>
            <p className="text-[11px] text-slate-400">
              Click any timestamp to jump to that moment in the video
            </p>
          </div>
        </div>

        {/* Transcript Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transcript..."
            className="w-full pl-8 pr-8 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Transcript Segments List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
        {filteredLines.length > 0 ? (
          filteredLines.map((line, idx) => {
            const isHighlighted = highlightedTimestamp === line.time;

            return (
              <div
                key={idx}
                ref={(el) => { itemRefs.current[line.time] = el; }}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-4 text-xs sm:text-sm group ${
                  isHighlighted
                    ? "bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.3)] ring-1 ring-cyan-400"
                    : "bg-white/[0.015] hover:bg-white/[0.035] border-white/[0.05] hover:border-white/10"
                }`}
              >
                {/* Clickable Timestamp Anchor */}
                <button
                  onClick={() => openYouTubeAtTimestamp(activeVideo.id, line.time)}
                  title={`Play on YouTube at ${line.time}`}
                  className="font-mono text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/25 px-2.5 py-1 rounded-md border border-cyan-500/20 hover:border-cyan-400 shrink-0 flex items-center gap-1.5 transition-all group-hover:shadow-[0_0_8px_rgba(56,189,248,0.3)]"
                >
                  <Play className="w-2.5 h-2.5 fill-current text-cyan-400" />
                  <span>{line.time}</span>
                </button>

                {/* Text Segment with Search Highlighting */}
                <p className="text-slate-200 leading-relaxed group-hover:text-white transition-colors flex-1 pt-0.5">
                  {searchTerm ? (
                    line.text.split(new RegExp(`(${searchTerm})`, "gi")).map((part, i) =>
                      part.toLowerCase() === searchTerm.toLowerCase() ? (
                        <mark key={i} className="bg-cyan-400/30 text-cyan-200 px-0.5 rounded">
                          {part}
                        </mark>
                      ) : (
                        part
                      )
                    )
                  ) : (
                    line.text
                  )}
                </p>

                {/* Direct Video External Jump Icon */}
                <button
                  onClick={() => openYouTubeAtTimestamp(activeVideo.id, line.time)}
                  title="Open in YouTube"
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-cyan-400 transition-all shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-slate-500">
            No transcript segments match "{searchTerm}"
          </div>
        )}
      </div>

    </div>
  );
};
