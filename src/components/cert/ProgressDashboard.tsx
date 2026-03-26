"use client";

import { useState, useEffect } from "react";
import type { Certification } from "@/lib/types";
import { getReviewStats, type CardReview } from "@/lib/spaced-repetition";

interface ProgressDashboardProps {
  cert: Certification;
}

interface ProgressData {
  checklist: { checked: number; total: number };
  resources: { completed: number; total: number };
  spaced: ReturnType<typeof getReviewStats>;
  notes: number;
}

function loadProgress(cert: Certification): ProgressData {
  const certSlug = cert.slug;

  // Checklist
  let checklistChecked = 0;
  const totalChecklistItems = cert.checklistGroups.reduce((s, g) => s + g.items.length, 0);
  try {
    const raw = localStorage.getItem(`checklist-${certSlug}`);
    if (raw) checklistChecked = (JSON.parse(raw) as string[]).length;
  } catch {}

  // Resources
  let resourcesCompleted = 0;
  try {
    const raw = localStorage.getItem(`resources-${certSlug}`);
    if (raw) resourcesCompleted = (JSON.parse(raw) as string[]).length;
  } catch {}

  // Spaced repetition
  let srReviews: CardReview[] = [];
  try {
    const raw = localStorage.getItem(`sr-${certSlug}`);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, CardReview>;
      srReviews = Object.values(parsed);
    }
  } catch {}
  const spaced = getReviewStats(srReviews.length > 0 ? srReviews : []);

  // Notes (cert-level + per-module)
  let noteCount = 0;
  try {
    const certNotes = localStorage.getItem(`notes-${certSlug}`);
    if (certNotes) noteCount += (JSON.parse(certNotes) as unknown[]).length;
    for (const mod of cert.modules) {
      const modNotes = localStorage.getItem(`notes-${certSlug}-${mod.slug}`);
      if (modNotes) noteCount += (JSON.parse(modNotes) as unknown[]).length;
    }
  } catch {}

  return {
    checklist: { checked: checklistChecked, total: totalChecklistItems },
    resources: { completed: resourcesCompleted, total: cert.resources.length },
    spaced: srReviews.length > 0 ? spaced : { due: cert.flashcards.length, newCards: cert.flashcards.length, learning: 0, mastered: 0, total: cert.flashcards.length },
    notes: noteCount,
  };
}

function StatCard({ label, value, subtext, color }: { label: string; value: string | number; subtext?: string; color: string }) {
  return (
    <div className="bg-surface-primary border border-border-primary rounded-xl p-4">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-text-secondary mt-1">{label}</div>
      {subtext && <div className="text-xs text-text-muted mt-0.5">{subtext}</div>}
    </div>
  );
}

function ProgressRing({ percent, size = 80, strokeWidth = 6, color }: { percent: number; size?: number; strokeWidth?: number; color: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-surface-tertiary"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
    </svg>
  );
}

export default function ProgressDashboard({ cert }: ProgressDashboardProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    setProgress(loadProgress(cert));
  }, [cert]);

  if (!progress) {
    return <div className="text-text-secondary text-center py-8">Loading...</div>;
  }

  const checklistPercent = progress.checklist.total > 0
    ? Math.round((progress.checklist.checked / progress.checklist.total) * 100)
    : 0;
  const resourcePercent = progress.resources.total > 0
    ? Math.round((progress.resources.completed / progress.resources.total) * 100)
    : 0;
  const masteryPercent = progress.spaced.total > 0
    ? Math.round((progress.spaced.mastered / progress.spaced.total) * 100)
    : 0;

  // Overall readiness: weighted average
  const overallPercent = Math.round(
    (checklistPercent * 0.3 + resourcePercent * 0.2 + masteryPercent * 0.5)
  );

  return (
    <div>
      {/* Overall readiness */}
      <div className="bg-surface-primary border border-border-primary rounded-xl p-6 mb-6 flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <ProgressRing percent={overallPercent} size={100} strokeWidth={8} color="var(--color-accent)" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{overallPercent}%</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">Exam Readiness</h3>
          <p className="text-sm text-text-secondary">
            {overallPercent >= 80
              ? "Looking great! You're well-prepared for the exam."
              : overallPercent >= 50
              ? "Good progress. Keep reviewing and completing study materials."
              : "Keep going! Complete more modules and review flashcards to improve readiness."}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Checklist"
          value={`${checklistPercent}%`}
          subtext={`${progress.checklist.checked}/${progress.checklist.total} items`}
          color="text-accent"
        />
        <StatCard
          label="Resources"
          value={`${resourcePercent}%`}
          subtext={`${progress.resources.completed}/${progress.resources.total} completed`}
          color="text-accent"
        />
        <StatCard
          label="Cards Mastered"
          value={progress.spaced.mastered}
          subtext={`of ${progress.spaced.total} flashcards`}
          color="text-success"
        />
        <StatCard
          label="Notes Written"
          value={progress.notes}
          color="text-accent"
        />
      </div>

      {/* Spaced repetition breakdown */}
      <div className="bg-surface-primary border border-border-primary rounded-xl p-5 mb-6">
        <h3 className="font-semibold mb-4">Flashcard Review Status</h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-danger">{progress.spaced.due}</div>
            <div className="text-xs text-text-secondary">Due Now</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent">{progress.spaced.newCards}</div>
            <div className="text-xs text-text-secondary">New</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-warning">{progress.spaced.learning}</div>
            <div className="text-xs text-text-secondary">Learning</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">{progress.spaced.mastered}</div>
            <div className="text-xs text-text-secondary">Mastered</div>
          </div>
        </div>
        {progress.spaced.total > 0 && (
          <div className="mt-4">
            <div className="flex h-3 rounded-full overflow-hidden bg-surface-tertiary">
              {progress.spaced.mastered > 0 && (
                <div
                  className="bg-success"
                  style={{ width: `${(progress.spaced.mastered / progress.spaced.total) * 100}%` }}
                />
              )}
              {progress.spaced.learning > 0 && (
                <div
                  className="bg-warning"
                  style={{ width: `${(progress.spaced.learning / progress.spaced.total) * 100}%` }}
                />
              )}
              {progress.spaced.newCards > 0 && (
                <div
                  className="bg-accent"
                  style={{ width: `${(progress.spaced.newCards / progress.spaced.total) * 100}%` }}
                />
              )}
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-text-muted">
              <span>Mastered</span>
              <span>Learning</span>
              <span>New</span>
            </div>
          </div>
        )}
      </div>

      {/* Exam domains */}
      <div className="bg-surface-primary border border-border-primary rounded-xl p-5">
        <h3 className="font-semibold mb-4">Exam Domain Weights</h3>
        <div className="space-y-3">
          {cert.examDomains.map((domain) => (
            <div key={domain.name} className="flex items-center gap-3">
              <span className="text-sm font-medium w-40 truncate">{domain.name}</span>
              <div className="flex-1 h-2 bg-surface-tertiary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: domain.weight.split("-")[1]?.replace("%", "") + "%" }}
                />
              </div>
              <span className="text-xs text-text-secondary w-14 text-right">{domain.weight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
