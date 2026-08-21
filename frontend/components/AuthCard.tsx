"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface AuthCardProps {
  onGuestMode?: () => void;
  onSuccess?: (user: { name: string; email: string; isGuest: boolean }) => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({ onGuestMode, onSuccess }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = () => {
    setIsLoading(true);
    // Direct redirect to backend Google OAuth login endpoint
    window.location.href = "http://localhost:8000/auth/google/login";
  };

  const handleGuestEntry = () => {
    if (onGuestMode) {
      onGuestMode();
    } else {
      router.push("/workspace?auth=guest");
    }
  };

  return (
    <div className="glass-panel p-7 sm:p-9 relative overflow-hidden max-w-md w-full mx-auto">
      
      {/* Subtle top cyan highlight line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      {/* Card Header */}
      <div className="text-center mb-7">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-semibold tracking-wide uppercase mb-3">
          <Sparkles className="w-3 h-3" />
          <span>Instant Access</span>
        </div>
        
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Welcome to Optic<span className="text-cyan-400">AI</span>
        </h2>
        
        <p className="text-sm text-slate-400 mt-2 font-normal">
          Turn long videos into understanding.
        </p>
      </div>

      {/* Primary Action: Continue with Google */}
      <div className="space-y-4">
        <button
          onClick={handleGoogleAuth}
          disabled={isLoading}
          type="button"
          className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl text-sm flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 group cursor-pointer"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" className="shrink-0">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{isLoading ? "Connecting to Google..." : "Continue with Google"}</span>
        </button>

        {/* Divider with 'or' */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0b0f17] px-3 text-slate-500 font-semibold tracking-wider">
              or
            </span>
          </div>
        </div>

        {/* Secondary Action: Continue as Guest */}
        <button
          onClick={handleGuestEntry}
          type="button"
          className="w-full py-3.5 px-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/30 text-slate-200 hover:text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 transition-all group"
        >
          <span>Continue as Guest</span>
          <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Non-compulsory Trust Guarantee */}
      <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-center gap-1.5 text-center">
        <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
        <p className="text-xs text-slate-500">
          No account required to explore OpticAI.
        </p>
      </div>

    </div>
  );
};
