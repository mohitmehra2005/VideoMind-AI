"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

interface CTAProps {
  onGoogleClick?: () => void;
  onGuestClick?: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onGoogleClick, onGuestClick }) => {
  const router = useRouter();

  const handleGoogleCTA = () => {
    if (onGoogleClick) {
      onGoogleClick();
    } else {
      window.location.href = "http://localhost:8000/auth/google/login";
    }
  };

  const handleGuestCTA = () => {
    if (onGuestClick) {
      onGuestClick();
    } else {
      router.push("/workspace?auth=guest");
    }
  };

  return (
    <section id="cta" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050608] relative overflow-hidden scroll-mt-20">
      
      {/* Background Soft Glow Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[220px] bg-gradient-to-r from-indigo-500/15 via-cyan-500/15 to-transparent blur-[90px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="glass-panel p-10 sm:p-14 text-center relative overflow-hidden border-cyan-500/20 bg-gradient-to-b from-[#0c121e] to-[#06080d]">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-[11px] font-semibold uppercase tracking-wider mb-5">
            <Sparkles className="w-3 h-3" />
            <span>Instant Cognition</span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-xl mx-auto mb-4">
            Ready to Understand More?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mb-9 leading-relaxed font-normal">
            Your next YouTube video can teach you more in half the time. Try OpticAI now with zero mandatory sign-ups.
          </p>

          {/* CTA Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            
            {/* Continue with Google */}
            <button
              onClick={handleGoogleCTA}
              type="button"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl text-sm flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5 group cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
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
              <span>Continue with Google</span>
            </button>

            {/* Try as Guest */}
            <button
              onClick={handleGuestCTA}
              type="button"
              className="w-full sm:w-auto px-6 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/30 text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 transition-all group"
            >
              <span>Try as Guest</span>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>
            
          </div>

          <p className="text-xs text-slate-500 mt-6 font-mono">
            No credit card · Instant processing · Full guest access
          </p>

        </div>
      </div>
    </section>
  );
};
