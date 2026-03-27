import type { ReactNode } from "react";

export default function ExamTip({ children }: { children: ReactNode }) {
  return (
    <div className="bg-accent-light border-l-4 border-accent rounded-r-xl p-4 my-4">
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0 mt-0.5">&#127919;</span>
        <div>
          <div className="font-semibold text-sm text-accent mb-1">Exam Tip</div>
          <div className="text-sm text-text-secondary leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
