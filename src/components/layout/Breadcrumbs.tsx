"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const slugToLabel: Record<string, string> = {
  cert: "Certifications",
};

function formatSlug(slug: string): string {
  if (slugToLabel[slug]) return slugToLabel[slug];
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: formatSlug(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));

  return (
    <nav className="flex items-center gap-1.5 text-sm text-text-secondary mb-6">
      <Link href="/" className="hover:text-text-primary">
        Home
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {i === crumbs.length - 1 ? (
            <span className="text-text-primary font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-text-primary">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
