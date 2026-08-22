"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface StructuredSummaryItem {
  id: number;
  title: string;
  explanation: string;
  keyPoints?: string[];
  startTimestamp: string;
  endTimestamp?: string;
  startSeconds: number;
}

export interface TakeawayItem {
  id: number;
  title: string;
  text: string;
  timestamp: string;
  seconds: number;
}

export interface TranscriptItem {
  time: string;
  seconds: number;
  text: string;
}

export interface QuizItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceTimestamp?: string;
  sourceSeconds?: number;
}

export interface VideoHistoryItem {
  id: string;
  url: string;
  title: string;
  channel: string;
  duration: string;
  timestamp: string;
  thumbnail?: string;
  fallbackThumbnail?: string;
  summary?: string;
  executiveSummary?: string;
  structuredSummary?: StructuredSummaryItem[];
  takeaways?: string[];
  takeawaysWithMeta?: TakeawayItem[];
  transcript?: TranscriptItem[];
  quiz?: QuizItem[];
}

export interface UserProfile {
  name: string;
  email: string | null;
  isGuest: boolean;
  avatar: string;
}

export interface ExplorationProgress {
  summaryViewed: boolean;
  takeawaysViewed: boolean;
  questionsCount: number;
  transcriptViewed: boolean;
  quizScore: number | null;
  quizTotal: number;
}

interface WorkspaceContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  activeVideo: VideoHistoryItem | null;
  setActiveVideo: React.Dispatch<React.SetStateAction<VideoHistoryItem | null>>;
  history: VideoHistoryItem[];
  addToHistory: (video: VideoHistoryItem) => void;
  activeTab: "summary" | "takeaways" | "chat" | "transcript" | "quiz";
  setActiveTab: React.Dispatch<React.SetStateAction<"summary" | "takeaways" | "chat" | "transcript" | "quiz">>;
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isAnalyzing: boolean;
  setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
  processingStage: number;
  setProcessingStage: React.Dispatch<React.SetStateAction<number>>;
  processingError: string | null;
  setProcessingError: React.Dispatch<React.SetStateAction<string | null>>;
  highlightedTimestamp: string | null;
  setHighlightedTimestamp: React.Dispatch<React.SetStateAction<string | null>>;
  pendingChatMessage: string | null;
  setPendingChatMessage: React.Dispatch<React.SetStateAction<string | null>>;
  explorationProgress: ExplorationProgress;
  setExplorationProgress: React.Dispatch<React.SetStateAction<ExplorationProgress>>; 
  startAnalysis: (url: string) => Promise<void>;  
  resetToNewAnalysis: () => void;
  jumpToTranscript: (timestamp: string) => void;
  sendToAskOptic: (prompt: string) => void;
}

const DEFAULT_USER: UserProfile = {
  name: "Guest Explorer",
  email: null,
  isGuest: true,
  avatar: "G",
};

const DEFAULT_PROGRESS: ExplorationProgress = {
  summaryViewed: true,
  takeawaysViewed: false,
  questionsCount: 0,
  transcriptViewed: false,
  quizScore: null,
  quizTotal: 5,
};

const SAMPLE_SIGNED_IN_HISTORY: VideoHistoryItem[] = [
  {
    id: "kCc8FmEb1nY",
    url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
    title: "Neural Networks from Scratch: Math & Code",
    channel: "3Blue1Brown",
    duration: "18:45",
    timestamp: "Just now",
    thumbnail: "https://img.youtube.com/vi/kCc8FmEb1nY/hqdefault.jpg",
  },
  {
    id: "aircAruvnKk",
    url: "https://www.youtube.com/watch?v=aircAruvnKk",
    title: "What is Backpropagation Really Doing?",
    channel: "3Blue1Brown",
    duration: "13:54",
    timestamp: "2 hours ago",
    thumbnail: "https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg",
  },
  {
    id: "wjZofJX0v4E",
    url: "https://www.youtube.com/watch?v=wjZofJX0v4E",
    title: "Attention Is All You Need (Transformers Explained)",
    channel: "Yannic Kilcher",
    duration: "24:10",
    timestamp: "Yesterday",
    thumbnail: "https://img.youtube.com/vi/wjZofJX0v4E/hqdefault.jpg",
  },
];

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [history, setHistory] = useState<VideoHistoryItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoHistoryItem | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "takeaways" | "chat" | "transcript" | "quiz">("summary");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<number>(0);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [highlightedTimestamp, setHighlightedTimestamp] = useState<string | null>(null);
  const [pendingChatMessage, setPendingChatMessage] = useState<string | null>(null);
  const [explorationProgress, setExplorationProgress] = useState<ExplorationProgress>(DEFAULT_PROGRESS);

  // Initialize history based on auth mode
 useEffect(() => {
  setHistory([]);
}, [user.isGuest]);

  // Track exploration progress on tab switches
  useEffect(() => {
    if (activeTab === "summary") {
      setExplorationProgress((p) => ({ ...p, summaryViewed: true }));
    } else if (activeTab === "takeaways") {
      setExplorationProgress((p) => ({ ...p, takeawaysViewed: true }));
    } else if (activeTab === "transcript") {
      setExplorationProgress((p) => ({ ...p, transcriptViewed: true }));
    }
  }, [activeTab]);

  const addToHistory = (video: VideoHistoryItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== video.id);
      return [video, ...filtered];
    });
  };

const startAnalysis = async (url: string) => {
  setIsAnalyzing(true);
  setProcessingStage(0);
  setProcessingError(null);

  try {
    const response = await fetch("http://127.0.0.1:8000/analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_url: url,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.detail || "Failed to analyze the video."
      );
    }

    const data = await response.json();

    const analyzedVideo: VideoHistoryItem = {
      id: data.video.id,
      url: data.video.url,
      title: data.video.title,
      channel: data.video.channel,
      duration: data.video.duration,
      timestamp: "Just now",
      thumbnail: data.video.thumbnail,

      executiveSummary: data.executive_summary,
      structuredSummary: data.structured_summary.map((section: any) => ({
        ...section,
        startTimestamp: section.start_timestamp,
        endTimestamp: section.end_timestamp,
      })),
      takeaways: data.key_takeaways,
      quiz: data.quiz,
    };

    setActiveVideo(analyzedVideo);
    addToHistory(analyzedVideo);

    setIsAnalyzing(false);

    } catch (error) {
    console.error("Analysis error:", error);

    setProcessingError(
      error instanceof Error
        ? error.message
        : "Something went wrong while analyzing the video."
    );
  }
};

  const resetToNewAnalysis = () => {
    setActiveVideo(null);
    setIsAnalyzing(false);
    setProcessingStage(0);
    setProcessingError(null);
    setHighlightedTimestamp(null);
    setPendingChatMessage(null);
    setExplorationProgress(DEFAULT_PROGRESS);
  };

  const jumpToTranscript = (timestamp: string) => {
    setHighlightedTimestamp(timestamp);
    setActiveTab("transcript");
  };

  const sendToAskOptic = (prompt: string) => {
    setPendingChatMessage(prompt);
    setActiveTab("chat");
  };

  return (
    <WorkspaceContext.Provider
      value={{
        user,
        setUser,
        activeVideo,
        setActiveVideo,
        history,
        addToHistory,
        activeTab,
        setActiveTab,
        isSidebarExpanded,
        setIsSidebarExpanded,
        isAnalyzing,
        setIsAnalyzing,
        processingStage,
        setProcessingStage,
        processingError,
        setProcessingError,
        highlightedTimestamp,
        setHighlightedTimestamp,
        pendingChatMessage,
        setPendingChatMessage,
        explorationProgress,
        setExplorationProgress,
        startAnalysis,
        resetToNewAnalysis,
        jumpToTranscript,
        sendToAskOptic,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
