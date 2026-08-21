"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { WorkspaceProvider, useWorkspace } from "@/context/WorkspaceContext";
import { Sidebar } from "@/components/workspace/Sidebar";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { VideoContextCard } from "@/components/workspace/VideoContextCard";
import { NewAnalysisHome } from "@/components/workspace/NewAnalysisHome";
import { ProcessingView } from "@/components/workspace/ProcessingView";
import { SummaryTab } from "@/components/workspace/tabs/SummaryTab";
import { TakeawaysTab } from "@/components/workspace/tabs/TakeawaysTab";
import { AskOpticTab } from "@/components/workspace/tabs/AskOpticTab";
import { TranscriptTab } from "@/components/workspace/tabs/TranscriptTab";
import { QuizTab } from "@/components/workspace/tabs/QuizTab";

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const {
    user,
    setUser,
    activeVideo,
    activeTab,
    isSidebarExpanded,
    isAnalyzing,
  } = useWorkspace();

  // Sync auth mode and profile from query params or backend token
  useEffect(() => {
    const authParam = searchParams.get("auth");
    const tokenParam = searchParams.get("token");
    const nameParam = searchParams.get("name");
    const emailParam = searchParams.get("email");
    const pictureParam = searchParams.get("picture");

    if (authParam === "google") {
      const userName = nameParam ? decodeURIComponent(nameParam) : "Google User";
      const userEmail = emailParam ? decodeURIComponent(emailParam) : "user@gmail.com";
      const avatarLetter = userName.trim()[0]?.toUpperCase() || "G";

      if (tokenParam && typeof window !== "undefined") {
        try {
          localStorage.setItem("optic_jwt", tokenParam);
        } catch (e) {}
      }

      setUser({
        name: userName,
        email: userEmail,
        isGuest: false,
        avatar: avatarLetter,
      });
    } else if (authParam === "guest") {
      setUser({
        name: "Guest Explorer",
        email: null,
        isGuest: true,
        avatar: "G",
      });
    }
  }, [searchParams, setUser]);

  return (
    <div className="min-h-screen bg-[#050608] text-slate-100 flex relative overflow-x-hidden">
      
      {/* Sidebar Component (Handles Collapsed / Expanded state) */}
      <Sidebar />

      {/* Main Workspace Area (Dynamically margins according to sidebar state) */}
      <main
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarExpanded ? "ml-64" : "ml-16"
        }`}
      >
        {isAnalyzing ? (
          /* Processing Pipeline State */
          <ProcessingView />
        ) : !activeVideo ? (
          /* Clean Centered Home / New Analysis Input State */
          <NewAnalysisHome />
        ) : (
          /* Active Video Workspace (Header + Persistent Context Card + Active Tab) */
          <div className="flex-1 flex flex-col">
            <WorkspaceHeader />
            <VideoContextCard />

            <div className="flex-1 overflow-y-auto">
              {activeTab === "summary" && <SummaryTab />}
              {activeTab === "takeaways" && <TakeawaysTab />}
              {activeTab === "chat" && <AskOpticTab />}
              {activeTab === "transcript" && <TranscriptTab />}
              {activeTab === "quiz" && <QuizTab />}
            </div>
          </div>
        )}
      </main>

    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050608] flex items-center justify-center text-slate-500 text-xs font-mono">
        Loading OpticAI Workspace...
      </div>
    }>
      <WorkspaceProvider>
        <WorkspaceContent />
      </WorkspaceProvider>
    </Suspense>
  );
}
