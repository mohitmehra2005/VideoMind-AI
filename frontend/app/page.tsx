"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { WhatIsOptic } from "@/components/WhatIsOptic";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { DemoSection } from "@/components/DemoSection";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  const router = useRouter();

  const handleGuestEntry = () => {
    router.push("/workspace?auth=guest");
  };

  const handleAuthModal = () => {
    router.push("/workspace?auth=google");
  };

  return (
    <main className="min-h-screen bg-[#050608] text-slate-100 relative selection:bg-cyan-500/20 selection:text-cyan-200">
      
      {/* 1. Top Fixed Sticky Navbar */}
      <Navbar onOpenAuthModal={handleAuthModal} onGuestClick={handleGuestEntry} />

      {/* 2. Hero Section with Cinematic Lunar Surface Background & Simplified Google/Guest Auth */}
      <Hero onGuestMode={handleGuestEntry} />

      {/* 3. Section: What is OpticAI? (Editorial Contrast & Transformation Flow) */}
      <WhatIsOptic />

      {/* 4. Section: How It Works (Connected 5-Stage Progressive Timeline) */}
      <HowItWorks />

      {/* 5. Section: Features (Asymmetrical Bento Grid Layout with Hero Spotlight) */}
      <Features />

      {/* 6. Section: Interactive Demo (Simulated OpticAI Workspace) */}
      <DemoSection />

      {/* 7. Section: Final Call to Action */}
      <CTA onGoogleClick={handleAuthModal} onGuestClick={handleGuestEntry} />

      {/* 8. Section: Minimalist Lunar Footer */}
      <Footer />

    </main>
  );
}
