import type { Metadata, Viewport } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050608",
};

export const metadata: Metadata = {
  title: "OpticAI — AI-Powered Video Cognition & Learning",
  description: "Transform long YouTube videos into structured summaries, grounded AI Q&A, and interactive knowledge quizzes.",
  keywords: ["AI Video Summary", "YouTube Learning", "RAG Video Assistant", "Video Quiz AI", "OpticAI"],
  authors: [{ name: "OpticAI Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧠</text></svg>" />
      </head>
      <body className="bg-[#050608] text-slate-100 antialiased min-h-screen selection:bg-cyan-500/20 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
