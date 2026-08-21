"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

interface NavbarProps {
  onOpenAuthModal?: () => void;
  onGuestClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuthModal, onGuestClick }) => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGuestNav = () => {
    if (onGuestClick) {
      onGuestClick();
    } else {
      router.push("/workspace?auth=guest");
    }
  };

  const handleSignInNav = () => {
    // Redirect to backend Google OAuth login
    window.location.href = "http://localhost:8000/auth/google/login";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050608]/85 backdrop-blur-lg border-b border-white/10 py-3 shadow-2xl shadow-black/60"
          : "bg-transparent py-4.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="#hero" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.25)] group-hover:border-cyan-500/40 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="url(#lunarNavGrad2)" strokeWidth="2.2" />
              <circle cx="9" cy="9" r="2.5" fill="#38BDF8" />
              <circle cx="15" cy="14" r="1.5" fill="#8B5CF6" />
              <defs>
                <linearGradient id="lunarNavGrad2" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38BDF8" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">
            Optic<span className="text-cyan-400">AI</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
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
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={handleSignInNav}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg transition-all cursor-pointer"
          >
            Sign In
          </button>
          
          <button
            onClick={handleGuestNav}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-400 hover:brightness-110 rounded-lg shadow-md shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <span>Try as Guest</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#050608]/95 backdrop-blur-xl border-b border-white/10 px-6 py-5 space-y-4 animate-in fade-in slide-in-from-top-3">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
            <Link
              href="#what-is-optic"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white"
            >
              What is OpticAI
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white"
            >
              How It Works
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white"
            >
              Demo
            </Link>
          </nav>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSignInNav();
              }}
              className="w-full py-2 text-center text-xs font-medium text-white bg-white/[0.05] border border-white/10 rounded-lg"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleGuestNav();
              }}
              className="w-full py-2 text-center text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center gap-1.5"
            >
              <span>Try as Guest</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
