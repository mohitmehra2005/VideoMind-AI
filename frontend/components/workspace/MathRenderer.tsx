"use client";

import React from "react";
import katex from "katex";

interface MathRendererProps {
  content: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  className = "",
}) => {
  // Render inline and block LaTeX
  const renderFormattedText = (text: string) => {
    // Match:
    // $$ ... $$  -> display math
    // $ ... $     -> inline math
    const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g;

    const parts = text.split(regex);

    return parts.map((part, index) => {
      // Display math: $$ ... $$
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
              className="my-3 block overflow-x-auto font-serif text-cyan-200"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <code key={index} className="text-cyan-300">
              {part}
            </code>
          );
        }
      }

      // Inline math: $ ... $
      if (
        part.startsWith("$") &&
        part.endsWith("$") &&
        part.length > 2
      ) {
        const math = part.slice(1, -1).trim();

        try {
          const html = katex.renderToString(math, {
            displayMode: false,
            throwOnError: false,
          });

          return (
            <span
              key={index}
              className="inline-block px-1 font-serif text-cyan-200"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <code key={index} className="text-cyan-300">
              {part}
            </code>
          );
        }
      }

      // Render **bold text**
      const textParts = part.split(/(\*\*.*?\*\*)/g);

      return (
        <React.Fragment key={index}>
          {textParts.map((textPart, textIndex) => {
            if (
              textPart.startsWith("**") &&
              textPart.endsWith("**") &&
              textPart.length > 4
            ) {
              return (
                <strong
                  key={textIndex}
                  className="font-bold text-white"
                >
                  {textPart.slice(2, -2)}
                </strong>
              );
            }

            return (
              <React.Fragment key={textIndex}>
                {textPart}
              </React.Fragment>
            );
          })}
        </React.Fragment>
      );
    });
  };

  // Render normal text and bullet points
  const renderContent = () => {
    const lines = content.split("\n");

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      // Add a small space for empty lines
      if (!trimmedLine) {
        return <div key={index} className="h-1" />;
      }

      // Handle * bullet points
      if (trimmedLine.startsWith("* ")) {
        const bulletText = trimmedLine.replace(/^\*\s*/, "");

        return (
          <div
            key={index}
            className="flex items-start gap-3 mb-3"
          >
            <span className="mt-0.5 text-cyan-400">•</span>

            <div className="flex-1">
              {renderFormattedText(bulletText)}
            </div>
          </div>
        );
      }

      // Handle - bullet points
      if (trimmedLine.startsWith("- ")) {
        const bulletText = trimmedLine.replace(/^-\s*/, "");

        return (
          <div
            key={index}
            className="flex items-start gap-3 mb-3"
          >
            <span className="mt-0.5 text-cyan-400">•</span>

            <div className="flex-1">
              {renderFormattedText(bulletText)}
            </div>
          </div>
        );
      }

      // Normal paragraph
      return (
        <p key={index} className="mb-3">
          {renderFormattedText(trimmedLine)}
        </p>
      );
    });
  };

  return (
    <div className={className}>
      {renderContent()}
    </div>
  );
};