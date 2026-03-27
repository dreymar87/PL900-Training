"use client";

import { useState, useCallback, useEffect } from "react";
import type { Resource } from "@/lib/types";

interface ResourceTrackerProps {
  resources: Resource[];
  certSlug: string;
}

const typeIcons: Record<Resource["type"], string> = {
  video: "\u25B6",
  article: "\u270E",
  documentation: "\uD83D\uDCD6",
  course: "\uD83C\uDF93",
};

const typeColors: Record<Resource["type"], string> = {
  video: "bg-danger-light text-danger",
  article: "bg-accent-light text-accent",
  documentation: "bg-warning-light text-warning",
  course: "bg-success-light text-success",
};

function loadCompleted(certSlug: string): Set<string> {
  try {
    const raw = localStorage.getItem(`resources-${certSlug}`);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCompleted(certSlug: string, completed: Set<string>) {
  try {
    localStorage.setItem(`resources-${certSlug}`, JSON.stringify([...completed]));
  } catch {}
}

export default function ResourceTracker({ resources, certSlug }: ResourceTrackerProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Resource["type"] | "all">("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCompleted(loadCompleted(certSlug));
    setLoaded(true);
  }, [certSlug]);

  const toggle = useCallback(
    (id: string) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        saveCompleted(certSlug, next);
        return next;
      });
    },
    [certSlug]
  );

  const filtered = filter === "all" ? resources : resources.filter((r) => r.type === filter);
  const completedCount = resources.filter((r) => completed.has(r.id)).length;
  const percent = resources.length > 0 ? Math.round((completedCount / resources.length) * 100) : 0;

  const types = Array.from(new Set(resources.map((r) => r.type)));

  if (!loaded) {
    return <div className="text-text-secondary text-center py-8">Loading...</div>;
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-secondary">
          {completedCount} of {resources.length} completed
        </span>
        <span className="text-sm font-medium text-accent">{percent}%</span>
      </div>
      <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filter === "all"
              ? "bg-accent text-white"
              : "bg-surface-tertiary text-text-secondary hover:text-text-primary"
          }`}
        >
          All ({resources.length})
        </button>
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              filter === type
                ? "bg-accent text-white"
                : "bg-surface-tertiary text-text-secondary hover:text-text-primary"
            }`}
          >
            {type}s ({resources.filter((r) => r.type === type).length})
          </button>
        ))}
      </div>

      {/* Resource list */}
      <div className="space-y-2">
        {filtered.map((resource) => {
          const isCompleted = completed.has(resource.id);
          return (
            <div
              key={resource.id}
              className={`flex items-center gap-3 bg-surface-primary border border-border-primary rounded-xl p-4 transition-all ${
                isCompleted ? "opacity-70" : ""
              }`}
            >
              <button
                onClick={() => toggle(resource.id)}
                role="checkbox"
                aria-checked={isCompleted}
                aria-label={`Mark ${resource.title} as ${isCompleted ? "incomplete" : "complete"}`}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  isCompleted
                    ? "bg-success border-success"
                    : "border-border-secondary hover:border-accent"
                }`}
              >
                {isCompleted && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              <span
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm ${typeColors[resource.type]}`}
                aria-hidden="true"
              >
                {typeIcons[resource.type]}
              </span>

              <div className="flex-1 min-w-0">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm font-medium hover:text-accent transition-colors ${
                    isCompleted ? "line-through text-text-muted" : "text-text-primary"
                  }`}
                >
                  {resource.title}
                </a>
                <div className="text-xs text-text-muted capitalize mt-0.5">{resource.type}</div>
              </div>

              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-text-muted hover:text-accent transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-text-secondary text-center py-8 text-sm">
          No resources match this filter.
        </p>
      )}
    </div>
  );
}
