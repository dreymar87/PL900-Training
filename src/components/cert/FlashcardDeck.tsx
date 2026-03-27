"use client";

import { useState, useCallback, useEffect } from "react";
import type { Flashcard } from "@/lib/types";

interface FlashcardDeckProps {
  flashcards: Flashcard[];
}

export default function FlashcardDeck({ flashcards }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());

  const card = flashcards[currentIndex];

  const handleFlip = useCallback(() => {
    if (!flipped) {
      setReviewed((prev) => new Set(prev).add(card.id));
    }
    setFlipped((f) => !f);
  }, [flipped, card.id]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      setFlipped(false);
    },
    []
  );

  const prev = useCallback(
    () => goTo(currentIndex > 0 ? currentIndex - 1 : flashcards.length - 1),
    [currentIndex, flashcards.length, goTo]
  );
  const next = useCallback(
    () => goTo(currentIndex < flashcards.length - 1 ? currentIndex + 1 : 0),
    [currentIndex, flashcards.length, goTo]
  );

  const shuffle = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * flashcards.length);
    goTo(randomIndex);
  }, [flashcards.length, goTo]);

  const reset = () => {
    setReviewed(new Set());
    goTo(0);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture when typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case " ":
        case "Enter":
          e.preventDefault();
          handleFlip();
          break;
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          prev();
          break;
        case "s":
        case "S":
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            shuffle();
          }
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleFlip, next, prev, shuffle]);

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-text-secondary">
          Card {currentIndex + 1} of {flashcards.length}
        </span>
        <span className="text-sm text-text-secondary">
          {reviewed.size} / {flashcards.length} reviewed
        </span>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 h-2 bg-surface-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${(reviewed.size / flashcards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <button
        onClick={handleFlip}
        className="w-full cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-2xl"
        aria-label={flipped ? "Click to see question" : "Click to reveal answer"}
      >
        <div
          className={`relative min-h-[240px] rounded-2xl border-2 p-8 flex items-center justify-center text-center transition-all duration-300 ${
            flipped
              ? "bg-accent-light border-accent/30"
              : "bg-surface-primary border-border-primary hover:border-accent/20 hover:shadow-md"
          }`}
        >
          <div>
            <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
              {flipped ? "Answer" : "Question"}
            </div>
            <p className="text-lg font-medium leading-relaxed">
              {flipped ? card.answer : card.question}
            </p>
          </div>

          <div className="absolute bottom-4 right-4 text-xs text-text-muted">
            Space to {flipped ? "see question" : "reveal answer"}
          </div>
        </div>
      </button>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={prev}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-border-primary hover:bg-surface-tertiary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <div className="flex gap-2">
          <button
            onClick={shuffle}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border-primary hover:bg-surface-tertiary transition-colors"
          >
            Shuffle
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border-primary hover:bg-surface-tertiary transition-colors"
          >
            Reset
          </button>
        </div>

        <button
          onClick={next}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-border-primary hover:bg-surface-tertiary transition-colors"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Keyboard hints */}
      <p className="text-center text-xs text-text-muted mt-4">
        Shortcuts: Space/Enter flip &middot; Arrow keys navigate &middot; S shuffle
      </p>

      {/* Card dots */}
      <div className="flex flex-wrap justify-center gap-1.5 mt-4">
        {flashcards.map((fc, i) => (
          <button
            key={fc.id}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentIndex
                ? "bg-accent scale-125"
                : reviewed.has(fc.id)
                ? "bg-success"
                : "bg-surface-tertiary hover:bg-border-secondary"
            }`}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
