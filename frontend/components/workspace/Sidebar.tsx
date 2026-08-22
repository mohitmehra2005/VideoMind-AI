"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  PanelLeftClose, 
  Clock, 
  ShieldAlert, 
  LogOut, 
  Sparkles,
  Home,
  X,
  ChevronRight
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";

export const Sidebar: React.FC = () => {
  const {
    user,
    setUser,
    history,
    activeVideo,
    setActiveVideo,
    isSidebarExpanded,
    setIsSidebarExpanded,
    resetToNewAnalysis,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node) &&
        accountButtonRef.current &&
        !accountButtonRef.current.contains(event.target as Node)
      ) {
        setShowAccountMenu(false);
      }
    };

    if (showAccountMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAccountMenu]);

  // Clean sidebar collapse / expand toggle
  const handleToggleSidebar = (expanded: boolean) => {
    setIsSidebarExpanded(expanded);
    setShowAccountMenu(false);
  };

  // Filter history based on search query
  const filteredHistory = history.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGoogleSignIn = () => {
    setShowAccountMenu(false);
    try {
      window.location.href = "http://localhost:8000/auth/google/login";
    } catch {
      setUser({
        name: "Alex Vance",
        email: "alex.vance@example.com",
        isGuest: false,
        avatar: "A",
      });
    }
  };

  const handleSignOut = () => {
    setUser({
      name: "Guest Explorer",
      email: null,
      isGuest: true,
      avatar: "G",
    });
    setShowAccountMenu(false);
  };

  return (
    <>
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#06080e]/95 backdrop-blur-xl border-r border-white/[0.07] transition-all duration-300 flex flex-col justify-between select-none shadow-2xl shadow-black/80 ${
          isSidebarExpanded ? "w-64" : "w-16"
        }`}
      >
        {/* ================= TOP SECTION ================= */}
        <div className="flex flex-col flex-1 overflow-hidden">
          
          {/* Top Brand / Toggle Header */}
          <div className="h-16 px-3.5 flex items-center justify-between border-b border-white/[0.06]">
            {isSidebarExpanded ? (
              <>
                <Link href="/" className="flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.25)] group-hover:border-cyan-500/40 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="url(#sideGradExp2)" strokeWidth="2.2" />
                      <circle cx="9" cy="9" r="2.5" fill="#38BDF8" />
                      <circle cx="15" cy="14" r="1.5" fill="#8B5CF6" />
                      <defs>
                        <linearGradient id="sideGradExp2" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#38BDF8" />
                          <stop offset="1" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <span className="font-display font-bold text-base tracking-tight text-white">
                    Optic<span className="text-cyan-400">AI</span>
                  </span>
                </Link>

                <button
                  onClick={() => handleToggleSidebar(false)}
                  title="Collapse Sidebar"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </>
            ) : (
              /* State 1: Collapsed Sidebar — ONLY Logo at Top */
              <button
                onClick={() => handleToggleSidebar(true)}
                title="Expand Sidebar (Click OpticAI Logo)"
                className="w-full flex items-center justify-center p-1 rounded-xl text-slate-400 hover:text-white transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-[0_0_14px_rgba(56,189,248,0.3)] group-hover:border-cyan-500/50 group-hover:scale-105 transition-all">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="url(#sideGradCol2)" strokeWidth="2.2" />
                    <circle cx="9" cy="9" r="2.5" fill="#38BDF8" />
                    <circle cx="15" cy="14" r="1.5" fill="#8B5CF6" />
                    <defs>
                      <linearGradient id="sideGradCol2" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#38BDF8" />
                        <stop offset="1" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </button>
            )}
          </div>

          {/* Action Buttons: New Analysis & Search */}
          <div className="p-3 space-y-2.5">
            
            {/* New Analysis Button */}
            <button
              onClick={resetToNewAnalysis}
              title="New Video Analysis"
              className={`w-full flex items-center justify-center gap-2 rounded-xl transition-all font-semibold text-xs cursor-pointer ${
                isSidebarExpanded
                  ? "py-2.5 px-3.5 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-indigo-500/10 hover:from-indigo-500/30 hover:to-cyan-500/30 text-cyan-200 border border-cyan-500/30 shadow-[0_0_15px_rgba(56,189,248,0.1)] transform hover:-translate-y-0.5"
                  : "p-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              }`}
            >
              <Plus className="w-4 h-4 text-cyan-400 shrink-0" />
              {isSidebarExpanded && <span>New Analysis</span>}
            </button>

            {/* Search Input in Expanded Mode */}
            {isSidebarExpanded && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search analyses..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.07] text-xs text-slate-300 placeholder:text-slate-600 outline-none focus:border-cyan-500/40 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

          </div>

          {/* ================= HISTORY LIST SECTION ================= */}
          {isSidebarExpanded && (
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
              
              {/* Signed-in History */}
              {!user.isGuest ? (
                <div>
                  <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    <span>Recent Analyses</span>
                    <span>{filteredHistory.length}</span>
                  </div>

                  <div className="space-y-1 mt-1.5">
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveVideo(item)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs truncate transition-all flex items-center gap-2.5 cursor-pointer ${
                            activeVideo?.id === item.id
                              ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-medium shadow-sm"
                              : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate flex-1">{item.title}</span>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500 font-normal">
                        {searchQuery ? "No matching analyses found." : "No saved analyses yet."}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Guest Mode Notice & Temporary History */
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-2.5">
                    <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-xs">
                      <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Guest Session</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Your analyses are temporary and not saved across sessions.
                    </p>
                    <button
                      onClick={handleGoogleSignIn}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-500/30 to-cyan-500/20 hover:from-indigo-500/40 hover:to-cyan-500/30 border border-indigo-500/30 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
                    >
                      Sign in to save history →
                    </button>
                  </div>

                  {filteredHistory.length > 0 && (
                    <div>
                      <span className="px-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                        Current Session Analyses
                      </span>
                      <div className="space-y-1 mt-1.5">
                        {filteredHistory.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setActiveVideo(item)}
                            className={`w-full text-left p-2.5 rounded-xl text-xs truncate transition-all flex items-center gap-2.5 cursor-pointer ${
                              activeVideo?.id === item.id
                                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-medium"
                                : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="truncate flex-1">{item.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

        {/* ================= BOTTOM USER ACCOUNT BAR ================= */}
        <div className="p-3 border-t border-white/[0.06] relative">
          
          <button
            ref={accountButtonRef}
            onClick={() => setShowAccountMenu((prev) => !prev)}
            aria-label="Account Menu"
            title={user.isGuest ? "Guest Menu" : user.name}
            className={`w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer ${
              !isSidebarExpanded ? "justify-center" : ""
            }`}
          >
            {/* Circular Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs shrink-0 ${
              user.isGuest 
                ? "bg-slate-800 border border-white/10 text-slate-300" 
                : "bg-gradient-to-tr from-cyan-500 to-indigo-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25"
            }`}>
              {user.avatar || (user.name ? user.name[0] : "G")}
            </div>

            {isSidebarExpanded && (
              <div className="flex-1 text-left min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {user.isGuest ? "Guest Explorer" : user.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user.isGuest ? "Temporary Session" : user.email}
                </div>
              </div>
            )}
          </button>

          {/* Floating Account Popover Menu */}
          {showAccountMenu && (
            <div
              ref={accountMenuRef}
              className={`absolute rounded-2xl bg-[#0c101a]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(56,189,248,0.12)] p-4 space-y-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                isSidebarExpanded
                  ? "bottom-full mb-2.5 left-3 right-3 min-w-[220px]"
                  : "left-full ml-3 bottom-2 w-72 min-w-[280px]"
              }`}
            >
              {user.isGuest ? (
                <div className="space-y-3">
                  <div className="text-xs text-slate-300">
                    <p className="font-semibold text-white mb-1">Browsing as Guest</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Sign in with Google to save analysis history permanently.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer group"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" className="shrink-0">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-slate-300 pb-2 border-b border-white/10">
                    <p className="font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="w-full py-2 px-2.5 text-left text-xs text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out (Switch to Guest)</span>
                  </button>
                </div>
              )}

              <div className="pt-2 border-t border-white/10">
                <Link
                  href="/"
                  onClick={() => setShowAccountMenu(false)}
                  className="w-full py-1.5 px-2 text-xs text-slate-400 hover:text-white flex items-center gap-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Home className="w-3.5 h-3.5 text-slate-400" />
                  <span>Return to Home</span>
                </Link>
              </div>

            </div>
          )}

        </div>

      </aside>
    </>
  );
};
