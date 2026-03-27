import type { ReactNode } from "react";

interface KeyTermProps {
  term: string;
  children: ReactNode;
}

export default function KeyTerm({ term, children }: KeyTermProps) {
  return (
    <div className="bg-surface-tertiary rounded-xl p-4 my-3">
      <span className="font-bold text-sm text-text-primary">{term}:</span>{" "}
      <span className="text-sm text-text-secondary leading-relaxed">{children}</span>
    </div>
  );
}
