"use client";

import React from "react";
import { 
  FileText, 
  ListChecks, 
  MessageSquare, 
  FileCode2, 
  HelpCircle, 
  Clock, 
  Youtube, 
  ExternalLink,
  Sparkles
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";

export const WorkspaceHeader: React.FC = () => {
  const { activeVideo, activeTab, setActiveTab } = useWorkspace();

  if (!activeVideo) return null;

  const tabs = [
    { id: "summary", label: "Summary", icon: FileText },
    { id: "takeaways", label: "Key Takeaways", icon: ListChecks },
    { id: "chat", label: "Ask OpticAI", icon: MessageSquare },
    { id: "transcript", label: "Transcript", icon: FileCode2 },
    { id: "quiz", label: "Quiz", icon: HelpCircle },
  ];

  return (
    <div className="border-b border-white/[0.07] bg-[#06080e]/95 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-8 pt-4 pb-0">
      <div className="max-w-5xl mx-auto space-y-3.5">
        
        {/* Calm Video Metadata Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Analyzed by OpticAI</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-sans flex items-center gap-1">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                {activeVideo.channel}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-sans flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {activeVideo.duration}
              </span>
            </div>

            <h1 className="font-display text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>{activeVideo.title}</span>
              <a
                href={activeVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Open on YouTube"
                className="text-slate-500 hover:text-red-400 transition-colors inline-flex items-center"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </h1>
          </div>
        </div>

        {/* Refined Tab System with Soft Underline / Pill Active Indicator */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pt-1 -mb-[1px]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-3.5 text-xs font-semibold transition-all rounded-t-xl border-b-2 flex items-center gap-2 shrink-0 ${
                  isActive
                    ? "border-cyan-400 text-white bg-white/[0.04] shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
