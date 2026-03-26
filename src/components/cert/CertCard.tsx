import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { certPath } from "@/lib/constants";
import type { Certification } from "@/lib/types";

export default function CertCard({ cert }: { cert: Certification }) {
  return (
    <Link
      href={certPath(cert.vendorSlug, cert.slug)}
      className="block bg-surface-primary border border-border-primary rounded-xl p-5 hover:border-accent/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-base">{cert.name}</h3>
        <Badge>{cert.modules.length} modules</Badge>
      </div>
      <p className="text-sm text-text-secondary mb-4">{cert.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {cert.examDomains.slice(0, 4).map((d) => (
          <span
            key={d.name}
            className="text-xs bg-accent-light text-accent px-2 py-0.5 rounded"
          >
            {d.name}
          </span>
        ))}
        {cert.examDomains.length > 4 && (
          <span className="text-xs text-text-muted">
            +{cert.examDomains.length - 4} more
          </span>
        )}
      </div>
    </Link>
  );
}
