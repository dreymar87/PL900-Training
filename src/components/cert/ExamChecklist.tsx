"use client";

import { useState, useCallback } from "react";
import type { ChecklistGroup } from "@/lib/types";

interface ExamChecklistProps {
  groups: ChecklistGroup[];
  certSlug: string;
}

export default function ExamChecklist({ groups, certSlug }: ExamChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const saved = localStorage.getItem(`checklist-${certSlug}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggle = useCallback(
    (itemId: string) => {
      setChecked((prev) => {
        const next = new Set(prev);
        if (next.has(itemId)) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
        try {
          localStorage.setItem(`checklist-${certSlug}`, JSON.stringify([...next]));
        } catch {}
        return next;
      });
    },
    [certSlug]
  );

  const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0);
  const checkedCount = checked.size;
  const percent = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const reset = () => {
    setChecked(new Set());
    try {
      localStorage.removeItem(`checklist-${certSlug}`);
    } catch {}
  };

  return (
    <div>
      {/* Overall progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-secondary">
          {checkedCount} of {totalItems} complete
        </span>
        <span className="text-sm font-medium text-accent">{percent}%</span>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 h-2.5 bg-surface-tertiary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              percent === 100 ? "bg-success" : "bg-accent"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {percent === 100 && (
        <div className="bg-success-light border border-success/20 rounded-xl p-4 mb-6 text-center">
          <p className="text-success font-semibold">All items complete! You're ready for the exam.</p>
        </div>
      )}

      {/* Checklist groups */}
      <div className="space-y-6">
        {groups.map((group) => {
          const groupChecked = group.items.filter((item) => checked.has(item.id)).length;
          const groupPercent = Math.round((groupChecked / group.items.length) * 100);

          return (
            <div
              key={group.title}
              className="bg-surface-primary border border-border-primary rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3 bg-surface-secondary border-b border-border-primary">
                <h3 className="font-semibold text-sm">{group.title}</h3>
                <span className="text-xs text-text-muted">
                  {groupChecked}/{group.items.length} ({groupPercent}%)
                </span>
              </div>
              <div className="divide-y divide-border-primary">
                {group.items.map((item) => {
                  const isChecked = checked.has(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      role="checkbox"
                      aria-checked={isChecked}
                      aria-label={item.text}
                      className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-surface-secondary transition-colors"
                    >
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isChecked
                            ? "bg-success border-success"
                            : "border-border-secondary"
                        }`}
                      >
                        {isChecked && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-sm transition-all ${
                          isChecked ? "text-text-muted line-through" : "text-text-primary"
                        }`}
                      >
                        {item.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset */}
      {checkedCount > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={reset}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border-primary hover:bg-surface-tertiary transition-colors"
          >
            Reset Checklist
          </button>
        </div>
      )}
    </div>
  );
}
