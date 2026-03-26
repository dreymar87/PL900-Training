"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarNav from "./SidebarNav";
import type { Vendor } from "@/lib/types";

export default function Sidebar({ vendors }: { vendors: Vendor[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 border-b border-border-primary bg-surface-primary px-4 py-3">
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 rounded-md hover:bg-surface-tertiary"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/" className="font-semibold text-lg">CertTrainer</Link>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-surface-primary border-r border-border-primary flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-primary">
          <Link href="/" className="font-bold text-xl text-text-primary" onClick={() => setOpen(false)}>
            CertTrainer
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-surface-tertiary"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-1 ${
              pathname === "/"
                ? "bg-accent-light text-accent"
                : "text-text-secondary hover:bg-surface-tertiary hover:text-text-primary"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
            </svg>
            Home
          </Link>
          <SidebarNav vendors={vendors} pathname={pathname} onNavigate={() => setOpen(false)} />
        </nav>

        <div className="px-5 py-3 border-t border-border-primary text-xs text-text-muted">
          Certification Training Platform
        </div>
      </aside>
    </>
  );
}
