"use client";

import { useState, useCallback, useEffect } from "react";
import type { Flashcard } from "@/lib/types";
import {
  type CardReview,
  type ReviewRating,
  createNewReview,
  processReview,
  isDue,
  getReviewStats,
} from "@/lib/spaced-repetition";

interface SpacedRepetitionDeckProps {
  flashcards: Flashcard[];
  certSlug: string;
}

const RATING_LABELS: { rating: ReviewRating; label: string; color: string }[] = [
  { rating: 0, label: "Blackout", color: "bg-danger text-white" },
  { rating: 1, label: "Wrong", color: "bg-danger-light text-danger" },
  { rating: 2, label: "Barely", color: "bg-warning-light text-warning" },
  { rating: 3, label: "Hard", color: "bg-warning-light text-warning" },
  { rating: 4, label: "Good", color: "bg-success-light text-success" },
  { rating: 5, label: "Easy", color: "bg-success text-white" },
];

function loadReviews(certSlug: string): Record<string, CardReview> {
  try {
    const raw = localStorage.getItem(`sr-${certSlug}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveReviews(certSlug: string, reviews: Record<string, CardReview>) {
  try {
    localStorage.setItem(`sr-${certSlug}`, JSON.stringify(reviews));
  } catch {}
}

export default function SpacedRepetitionDeck({
  flashcards,
  certSlug,
}: SpacedRepetitionDeckProps) {
  const [reviews, setReviews] = useState<Record<string, CardReview>>({});
  const [flipped, setFlipped] = useState(false);
  const [sessionReviewed, setSessionReviewed] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadReviews(certSlug);
    // Initialize missing cards
    const updated = { ...saved };
    for (const fc of flashcards) {
      if (!updated[fc.id]) {
        updated[fc.id] = createNewReview(fc.id);
      }
    }
    setReviews(updated);
    setLoaded(true);
  }, [certSlug, flashcards]);

  const stats = getReviewStats(Object.values(reviews));

  // Get due cards, sorted by next review date (most overdue first)
  const dueCards = flashcards.filter((fc) => {
    const review = reviews[fc.id];
    return review && isDue(review);
  });

  const currentCard = dueCards[0] ?? null;

  const handleRate = useCallback(
    (rating: ReviewRating) => {
      if (!currentCard) return;
      const review = reviews[currentCard.id];
      const updated = processReview(review, rating);
      const newReviews = { ...reviews, [currentCard.id]: updated };
      setReviews(newReviews);
      saveReviews(certSlug, newReviews);
      setFlipped(false);
      setSessionReviewed((n) => n + 1);
    },
    [currentCard, reviews, certSlug]
  );

  if (!loaded) {
    return <div className="text-text-secondary text-center py-8">Loading...</div>;
  }

  return (
    <div>
      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-surface-primary border border-border-primary rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-danger">{stats.due}</div>
          <div className="text-xs text-text-secondary">Due</div>
        </div>
        <div className="bg-surface-primary border border-border-primary rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-accent">{stats.newCards}</div>
          <div className="text-xs text-text-secondary">New</div>
        </div>
        <div className="bg-surface-primary border border-border-primary rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-warning">{stats.learning}</div>
          <div className="text-xs text-text-secondary">Learning</div>
        </div>
        <div className="bg-surface-primary border border-border-primary rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-success">{stats.mastered}</div>
          <div className="text-xs text-text-secondary">Mastered</div>
        </div>
      </div>

      {sessionReviewed > 0 && (
        <p className="text-sm text-text-muted text-center mb-4">
          {sessionReviewed} reviewed this session
        </p>
      )}

      {currentCard ? (
        <>
          {/* Card */}
          <div
            onClick={() => setFlipped((f) => !f)}
            className="cursor-pointer select-none"
          >
            <div
              className={`relative min-h-[220px] rounded-2xl border-2 p-8 flex items-center justify-center text-center transition-all duration-300 ${
                flipped
                  ? "bg-accent-light border-accent/30"
                  : "bg-surface-primary border-border-primary hover:border-accent/20 hover:shadow-md"
              }`}
            >
              <div>
                <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
                  {flipped ? "Answer" : "Question"} &middot; {dueCards.length} remaining
                </div>
                <p className="text-lg font-medium leading-relaxed">
                  {flipped ? currentCard.answer : currentCard.question}
                </p>
              </div>
              {!flipped && (
                <div className="absolute bottom-4 right-4 text-xs text-text-muted">
                  Click to reveal
                </div>
              )}
            </div>
          </div>

          {/* Rating buttons (only when flipped) */}
          {flipped && (
            <div className="mt-4">
              <p className="text-sm text-text-secondary text-center mb-3">
                How well did you know this?
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {RATING_LABELS.map(({ rating, label, color }) => (
                  <button
                    key={rating}
                    onClick={() => handleRate(rating)}
                    className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${color}`}
                  >
                    {label}
                    <div className="text-[10px] opacity-70 mt-0.5">{rating}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-surface-primary border border-border-primary rounded-xl">
          <div className="text-4xl mb-3">&#10003;</div>
          <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
          <p className="text-sm text-text-secondary">
            No cards due for review. Come back later for your next session.
          </p>
        </div>
      )}
    </div>
  );
}
