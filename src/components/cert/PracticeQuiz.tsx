"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import type { QuizQuestion } from "@/lib/types";

interface PracticeQuizProps {
  questions: QuizQuestion[];
  timerMinutes?: number;
}

type AnswerState = {
  selectedIndex: number;
  isCorrect: boolean;
};

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function PracticeQuiz({ questions, timerMinutes }: PracticeQuizProps) {
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [shuffled, setShuffled] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const displayQuestions = useMemo(() => {
    return shuffled ? shuffleArray(questions) : questions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, shuffled]);

  const defaultTimer = timerMinutes ?? Math.max(Math.ceil(questions.length * 1.5), 5);

  const handleSelect = useCallback(
    (questionId: string, optionIndex: number, correctIndex: number) => {
      if (answers[questionId]) return;
      if (!started) setStarted(true);
      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          selectedIndex: optionIndex,
          isCorrect: optionIndex === correctIndex,
        },
      }));
    },
    [answers, started]
  );

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
  const allAnswered = answeredCount === questions.length;
  const scorePercent = allAnswered ? Math.round((correctCount / questions.length) * 100) : 0;
  const timedOut = timerEnabled && timeLeft === 0 && started;

  // Timer logic
  useEffect(() => {
    if (timerEnabled && started && !allAnswered && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [timerEnabled, started, allAnswered, timeLeft]);

  useEffect(() => {
    if (allAnswered && timerRef.current) clearInterval(timerRef.current);
  }, [allAnswered]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const reset = () => {
    setAnswers({});
    setStarted(false);
    setTimeLeft(defaultTimer * 60);
    if (timerRef.current) clearInterval(timerRef.current);
    if (shuffled) setShuffled(false);
    setTimeout(() => { if (shuffled) setShuffled(true); }, 0);
  };

  const toggleShuffle = () => {
    setShuffled((s) => !s);
    setAnswers({});
    setStarted(false);
    setTimeLeft(defaultTimer * 60);
  };

  const toggleTimer = () => {
    setTimerEnabled((t) => {
      if (!t) setTimeLeft(defaultTimer * 60);
      return !t;
    });
    setAnswers({});
    setStarted(false);
  };

  const showDone = allAnswered || timedOut;

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={toggleShuffle}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            shuffled
              ? "bg-accent text-white border-accent"
              : "border-border-primary hover:bg-surface-tertiary"
          }`}
        >
          Shuffle {shuffled ? "On" : "Off"}
        </button>
        <button
          onClick={toggleTimer}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            timerEnabled
              ? "bg-accent text-white border-accent"
              : "border-border-primary hover:bg-surface-tertiary"
          }`}
        >
          Timer {timerEnabled ? "On" : "Off"}
        </button>
        {timerEnabled && (
          <span className={`text-sm font-mono font-bold ${timeLeft < 60 ? "text-danger" : "text-text-primary"}`}>
            {formatTime(timeLeft)}
          </span>
        )}
      </div>

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
        {displayQuestions.map((q, qIndex) => {
          const answer = answers[q.id];
          const isDisabled = !!answer || timedOut;

          return (
            <div
              key={q.id}
              className="bg-surface-primary border border-border-primary rounded-xl p-5"
            >
              <p className="font-medium mb-4">
                <span className="text-accent mr-2">{qIndex + 1}.</span>
                {q.question}
              </p>

              <div className="space-y-2" role="radiogroup" aria-label={`Question ${qIndex + 1}`}>
                {q.options.map((opt, optIndex) => {
                  let styles = "border-border-primary hover:border-accent/30 hover:bg-surface-secondary cursor-pointer";

                  if (answer || timedOut) {
                    if (optIndex === q.correctIndex) {
                      styles = "border-success bg-success-light";
                    } else if (answer && optIndex === answer.selectedIndex && !answer.isCorrect) {
                      styles = "border-danger bg-danger-light";
                    } else {
                      styles = "border-border-primary opacity-60";
                    }
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelect(q.id, optIndex, q.correctIndex)}
                      disabled={isDisabled}
                      role="radio"
                      aria-checked={answer?.selectedIndex === optIndex}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${styles}`}
                    >
                      <span className="font-medium text-text-secondary mr-2">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      {opt}
                      {(answer || timedOut) && optIndex === q.correctIndex && (
                        <span className="float-right text-success font-medium">{"\u2713"}</span>
                      )}
                      {answer && optIndex === answer.selectedIndex && !answer.isCorrect && (
                        <span className="float-right text-danger font-medium">{"\u2717"}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {(answer || timedOut) && q.explanation && (
                <p className="mt-3 text-sm text-text-secondary bg-surface-secondary rounded-lg px-4 py-2">
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Results */}
      {showDone && (
        <div className="mt-8 bg-surface-primary border border-border-primary rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">
            {timedOut && !allAnswered ? "Time's Up!" : "Quiz Complete!"}
          </h3>
          <div className="text-4xl font-bold text-accent mb-1">{scorePercent}%</div>
          <p className="text-text-secondary text-sm mb-4">
            {correctCount} out of {questions.length} correct
            {timedOut && !allAnswered && ` (${questions.length - answeredCount} unanswered)`}
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

      {/* Reset button */}
      {answeredCount > 0 && !showDone && (
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
