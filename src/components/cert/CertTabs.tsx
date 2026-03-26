"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { certPath } from "@/lib/constants";

interface CertTabsProps {
  vendorSlug: string;
  certSlug: string;
}

const tabs = [
  { label: "Overview", suffix: "" },
  { label: "Flashcards", suffix: "/flashcards" },
  { label: "Practice Quiz", suffix: "/quiz" },
  { label: "Checklist", suffix: "/checklist" },
];

export default function CertTabs({ vendorSlug, certSlug }: CertTabsProps) {
  const pathname = usePathname();
  const basePath = certPath(vendorSlug, certSlug);

  return (
    <div className="flex gap-1 mb-6 border-b border-border-primary overflow-x-auto">
      {tabs.map((tab) => {
        const href = basePath + tab.suffix;
        const isActive =
          tab.suffix === ""
            ? pathname === basePath
            : pathname === href;

        return (
          <Link
            key={tab.suffix}
            href={href}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              isActive
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-secondary"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
