import type { ReactNode } from "react";

export default function DidYouKnow({ children }: { children: ReactNode }) {
  return (
    <div className="bg-warning-light border-l-4 border-warning rounded-r-xl p-4 my-4">
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0 mt-0.5">&#128161;</span>
        <div>
          <div className="font-semibold text-sm text-warning mb-1">Did You Know?</div>
          <div className="text-sm text-text-secondary leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
