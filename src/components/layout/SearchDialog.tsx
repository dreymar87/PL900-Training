"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "@/lib/search";

const typeLabels: Record<SearchResult["type"], string> = {
  module: "Module",
  flashcard: "Flashcard",
  quiz: "Quiz",
  resource: "Resource",
};

const typeColors: Record<SearchResult["type"], string> = {
  module: "bg-accent-light text-accent",
  flashcard: "bg-success-light text-success",
  quiz: "bg-warning-light text-warning",
  resource: "bg-surface-tertiary text-text-secondary",
};

export default function SearchDialog({ index }: { index: SearchResult[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Ctrl+K / Cmd+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return index
      .filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.excerpt.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [query, index]);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50"
        onClick={() => setOpen(false)}
      />

      {/* Dialog */}
      <div className="fixed inset-x-0 top-[10%] z-[61] mx-auto max-w-lg px-4">
        <div className="bg-surface-primary border border-border-primary rounded-xl shadow-xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-primary">
            <svg className="w-5 h-5 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search modules, flashcards, quizzes..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            <kbd className="hidden sm:inline-block text-xs text-text-muted bg-surface-tertiary px-1.5 py-0.5 rounded">
              Esc
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query.trim() && results.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-text-muted">
                No results found for &ldquo;{query}&rdquo;
              </div>
            )}
            {results.map((r, i) => (
              <button
                key={`${r.type}-${i}`}
                onClick={() => navigate(r.href)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface-secondary transition-colors border-b border-border-primary last:border-b-0"
              >
                <span
                  className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium mt-0.5 ${typeColors[r.type]}`}
                >
                  {typeLabels[r.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">
                    {r.title}
                  </div>
                  <div className="text-xs text-text-muted truncate mt-0.5">
                    {r.certName} &middot; {r.excerpt}
                  </div>
                </div>
              </button>
            ))}
            {!query.trim() && (
              <div className="px-4 py-8 text-center text-sm text-text-muted">
                Start typing to search across all content
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
