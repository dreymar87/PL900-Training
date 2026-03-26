"use client";

import { useState } from "react";
import Link from "next/link";
import { vendorPath, certPath } from "@/lib/constants";
import type { Vendor } from "@/lib/types";

interface SidebarNavProps {
  vendors: Vendor[];
  pathname: string;
  onNavigate: () => void;
}

export default function SidebarNav({ vendors, pathname, onNavigate }: SidebarNavProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const v of vendors) {
      if (pathname.startsWith(`/cert/${v.slug}`)) {
        initial[v.slug] = true;
      }
    }
    return initial;
  });

  const toggle = (slug: string) => {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <div className="mt-4">
      <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Vendors
      </div>
      {vendors.map((vendor) => (
        <div key={vendor.slug} className="mb-1">
          <button
            onClick={() => toggle(vendor.slug)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-tertiary hover:text-text-primary"
          >
            <span>{vendor.name}</span>
            <svg
              className={`w-4 h-4 transition-transform ${expanded[vendor.slug] ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {expanded[vendor.slug] && (
            <div className="ml-4 mt-1 space-y-0.5">
              {vendor.certifications.map((certSlug) => {
                const href = certPath(vendor.slug, certSlug);
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={certSlug}
                    href={href}
                    onClick={onNavigate}
                    className={`block px-3 py-1.5 rounded-md text-sm ${
                      isActive
                        ? "bg-accent-light text-accent font-medium"
                        : "text-text-secondary hover:bg-surface-tertiary hover:text-text-primary"
                    }`}
                  >
                    {certSlug.toUpperCase()}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
