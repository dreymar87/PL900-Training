import Badge from "./Badge";
import type { ExamDomain } from "@/lib/types";

export default function DomainCard({ domain }: { domain: ExamDomain }) {
  return (
    <div className="bg-surface-secondary rounded-xl p-4 border-l-4 border-accent">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">{domain.name}</h3>
        <Badge variant="accent">{domain.weight}</Badge>
      </div>
      <p className="text-sm text-text-secondary mb-3">{domain.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {domain.topics.map((topic) => (
          <span
            key={topic}
            className="text-xs bg-surface-tertiary text-text-secondary px-2 py-0.5 rounded"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}
