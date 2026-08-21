"use client";

import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-[#030406] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-[0_0_10px_rgba(56,189,248,0.2)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="url(#lunarNavGradFooter)" strokeWidth="2.2" />
              <circle cx="9" cy="9" r="2.5" fill="#38BDF8" />
              <circle cx="15" cy="14" r="1.5" fill="#8B5CF6" />
              <defs>
                <linearGradient id="lunarNavGradFooter" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38BDF8" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-display font-bold text-base text-white">
            Optic<span className="text-cyan-400">AI</span>
          </span>
          <span className="text-xs text-slate-500 ml-2 hidden sm:inline">
            · AI-powered video cognition
          </span>
        </div>

        {/* Anchor Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-medium">
          <Link href="#hero" className="hover:text-white transition-colors">
            Back to Top ↑
          </Link>
          <Link href="#what-is-optic" className="hover:text-white transition-colors">
            What is OpticAI
          </Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#demo" className="hover:text-white transition-colors">
            Demo
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-500 text-center md:text-right font-mono">
          © {new Date().getFullYear()} OpticAI. All rights reserved.
        </div>

      </div>
    </footer>
  );
};
