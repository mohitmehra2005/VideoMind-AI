"use client";

import React from "react";
import katex from "katex";

interface MathRendererProps {
  content: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = "" }) => {
  // Parse content for LaTeX expressions: $$display$$ and $inline$
  const renderFormattedText = (text: string) => {
    // Regex matching $$...$$ (block) or $...$ (inline)
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+\$)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <span
              key={index}
              className="my-3 block overflow-x-auto text-cyan-200 font-serif"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <code key={index} className="text-cyan-300">{part}</code>;
        }
      } else if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
        const math = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: false,
            throwOnError: false,
          });
          return (
            <span
              key={index}
              className="inline-block px-1 text-cyan-200 font-serif"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <code key={index} className="text-cyan-300">{part}</code>;
        }
      }

      // Format bold, italic and code
      return (
        <span key={index}>
          {part}
        </span>
      );
    });
  };

  return (
    <div className={className}>
      {renderFormattedText(content)}
    </div>
  );
};
