import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { modulePath } from "@/lib/constants";
import type { Module } from "@/lib/types";

interface ModuleListProps {
  modules: Module[];
  vendorSlug: string;
  certSlug: string;
}

export default function ModuleList({ modules, vendorSlug, certSlug }: ModuleListProps) {
  const sorted = [...modules].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-2">
      {sorted.map((mod, i) => (
        <Link
          key={mod.slug}
          href={modulePath(vendorSlug, certSlug, mod.slug)}
          className="flex items-center gap-4 bg-surface-primary border border-border-primary rounded-xl p-4 hover:border-accent/40 hover:shadow-sm transition-all"
        >
          <div className="flex-shrink-0 w-8 h-8 bg-accent-light text-accent rounded-lg flex items-center justify-center text-sm font-semibold">
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm">{mod.title}</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {mod.sections.length} {mod.sections.length === 1 ? "section" : "sections"}
            </p>
          </div>
          <Badge>{mod.label}</Badge>
        </Link>
      ))}
    </div>
  );
}
