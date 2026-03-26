// SM-2 inspired spaced repetition algorithm
// Simplified for client-side use with localStorage

export interface CardReview {
  cardId: string;
  easeFactor: number; // starts at 2.5
  interval: number; // days until next review
  repetitions: number; // consecutive correct answers
  nextReview: number; // timestamp (ms)
  lastReview: number; // timestamp (ms)
}

export type ReviewRating = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = complete blackout
// 1 = incorrect, remembered on seeing answer
// 2 = incorrect, easy to recall after seeing answer
// 3 = correct, significant difficulty
// 4 = correct, some hesitation
// 5 = correct, perfect recall

export function createNewReview(cardId: string): CardReview {
  return {
    cardId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: 0,
    lastReview: 0,
  };
}

export function processReview(
  review: CardReview,
  rating: ReviewRating
): CardReview {
  const now = Date.now();
  let { easeFactor, interval, repetitions } = review;

  if (rating < 3) {
    // Failed — reset
    repetitions = 0;
    interval = 0;
  } else {
    // Passed
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor
  easeFactor =
    easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReview = now + interval * 24 * 60 * 60 * 1000;

  return {
    cardId: review.cardId,
    easeFactor,
    interval,
    repetitions,
    nextReview,
    lastReview: now,
  };
}

export function isDue(review: CardReview): boolean {
  return Date.now() >= review.nextReview;
}

export function getReviewStats(reviews: CardReview[]) {
  const now = Date.now();
  const due = reviews.filter((r) => now >= r.nextReview).length;
  const learning = reviews.filter((r) => r.repetitions > 0 && r.repetitions < 3).length;
  const mastered = reviews.filter((r) => r.repetitions >= 3).length;
  const newCards = reviews.filter((r) => r.repetitions === 0 && r.lastReview === 0).length;

  return { due, learning, mastered, newCards, total: reviews.length };
}
