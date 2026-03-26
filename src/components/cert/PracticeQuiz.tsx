"use client";

import { useState, useCallback } from "react";
import type { QuizQuestion } from "@/lib/types";

interface PracticeQuizProps {
  questions: QuizQuestion[];
}

type AnswerState = {
  selectedIndex: number;
  isCorrect: boolean;
};

export default function PracticeQuiz({ questions }: PracticeQuizProps) {
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = useCallback(
    (questionId: string, optionIndex: number, correctIndex: number) => {
      if (answers[questionId]) return; // already answered
      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          selectedIndex: optionIndex,
          isCorrect: optionIndex === correctIndex,
        },
      }));
    },
    [answers]
  );

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
  const allAnswered = answeredCount === questions.length;
  const scorePercent = allAnswered ? Math.round((correctCount / questions.length) * 100) : 0;

  const reset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-text-secondary">
          {answeredCount} of {questions.length} answered
        </span>
        {answeredCount > 0 && (
          <span className="text-sm text-text-secondary">
            {correctCount} correct
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-8">
        <div className="flex-1 h-2 bg-surface-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const answer = answers[q.id];

          return (
            <div
              key={q.id}
              className="bg-surface-primary border border-border-primary rounded-xl p-5"
            >
              <p className="font-medium mb-4">
                <span className="text-accent mr-2">{qIndex + 1}.</span>
                {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((opt, optIndex) => {
                  let styles = "border-border-primary hover:border-accent/30 hover:bg-surface-secondary cursor-pointer";

                  if (answer) {
                    if (optIndex === q.correctIndex) {
                      styles = "border-success bg-success-light";
                    } else if (optIndex === answer.selectedIndex && !answer.isCorrect) {
                      styles = "border-danger bg-danger-light";
                    } else {
                      styles = "border-border-primary opacity-60";
                    }
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelect(q.id, optIndex, q.correctIndex)}
                      disabled={!!answer}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${styles}`}
                    >
                      <span className="font-medium text-text-secondary mr-2">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      {opt}
                      {answer && optIndex === q.correctIndex && (
                        <span className="float-right text-success font-medium">&#10003;</span>
                      )}
                      {answer && optIndex === answer.selectedIndex && !answer.isCorrect && (
                        <span className="float-right text-danger font-medium">&#10007;</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {answer && q.explanation && (
                <p className="mt-3 text-sm text-text-secondary bg-surface-secondary rounded-lg px-4 py-2">
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Results */}
      {allAnswered && (
        <div className="mt-8 bg-surface-primary border border-border-primary rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Quiz Complete!</h3>
          <div className="text-4xl font-bold text-accent mb-1">{scorePercent}%</div>
          <p className="text-text-secondary text-sm mb-4">
            {correctCount} out of {questions.length} correct
          </p>
          <div className="flex items-center gap-2 justify-center mb-4">
            <div className="flex-1 max-w-xs h-3 bg-surface-tertiary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  scorePercent >= 70 ? "bg-success" : scorePercent >= 50 ? "bg-warning" : "bg-danger"
                }`}
                style={{ width: `${scorePercent}%` }}
              />
            </div>
          </div>
          <p className="text-sm mb-4">
            {scorePercent >= 70
              ? "Great job! You're on track."
              : scorePercent >= 50
              ? "Good effort! Review the topics you missed."
              : "Keep studying! Review the material and try again."}
          </p>
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Reset button (visible before completion too) */}
      {answeredCount > 0 && !allAnswered && (
        <div className="mt-6 text-center">
          <button
            onClick={reset}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border-primary hover:bg-surface-tertiary transition-colors"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
