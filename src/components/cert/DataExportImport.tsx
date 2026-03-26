"use client";

import { useCallback } from "react";
import type { Certification } from "@/lib/types";

interface DataExportImportProps {
  cert: Certification;
}

interface ExportData {
  version: 1;
  certSlug: string;
  exportedAt: string;
  checklist: string[] | null;
  resources: string[] | null;
  spacedRepetition: Record<string, unknown> | null;
  certNotes: unknown[] | null;
  moduleNotes: Record<string, unknown[]>;
}

function gatherExportData(cert: Certification): ExportData {
  const certSlug = cert.slug;
  const data: ExportData = {
    version: 1,
    certSlug,
    exportedAt: new Date().toISOString(),
    checklist: null,
    resources: null,
    spacedRepetition: null,
    certNotes: null,
    moduleNotes: {},
  };

  try {
    const cl = localStorage.getItem(`checklist-${certSlug}`);
    if (cl) data.checklist = JSON.parse(cl);
  } catch {}

  try {
    const res = localStorage.getItem(`resources-${certSlug}`);
    if (res) data.resources = JSON.parse(res);
  } catch {}

  try {
    const sr = localStorage.getItem(`sr-${certSlug}`);
    if (sr) data.spacedRepetition = JSON.parse(sr);
  } catch {}

  try {
    const notes = localStorage.getItem(`notes-${certSlug}`);
    if (notes) data.certNotes = JSON.parse(notes);
  } catch {}

  for (const mod of cert.modules) {
    try {
      const modNotes = localStorage.getItem(`notes-${certSlug}-${mod.slug}`);
      if (modNotes) data.moduleNotes[mod.slug] = JSON.parse(modNotes);
    } catch {}
  }

  return data;
}

function importData(cert: Certification, data: ExportData) {
  const certSlug = cert.slug;

  if (data.checklist) {
    localStorage.setItem(`checklist-${certSlug}`, JSON.stringify(data.checklist));
  }
  if (data.resources) {
    localStorage.setItem(`resources-${certSlug}`, JSON.stringify(data.resources));
  }
  if (data.spacedRepetition) {
    localStorage.setItem(`sr-${certSlug}`, JSON.stringify(data.spacedRepetition));
  }
  if (data.certNotes) {
    localStorage.setItem(`notes-${certSlug}`, JSON.stringify(data.certNotes));
  }
  for (const [modSlug, notes] of Object.entries(data.moduleNotes)) {
    localStorage.setItem(`notes-${certSlug}-${modSlug}`, JSON.stringify(notes));
  }
}

export default function DataExportImport({ cert }: DataExportImportProps) {
  const handleExport = useCallback(() => {
    const data = gatherExportData(cert);
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certtrainer-${cert.slug}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [cert]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text) as ExportData;
        if (data.version !== 1 || data.certSlug !== cert.slug) {
          alert(
            `Import failed: this file is for "${data.certSlug}" but you're viewing "${cert.slug}".`
          );
          return;
        }
        importData(cert, data);
        window.location.reload();
      } catch {
        alert("Import failed: invalid file format.");
      }
    };
    input.click();
  }, [cert]);

  const handleClear = useCallback(() => {
    if (!confirm("Clear all progress data for this certification? This cannot be undone.")) return;
    const certSlug = cert.slug;
    localStorage.removeItem(`checklist-${certSlug}`);
    localStorage.removeItem(`resources-${certSlug}`);
    localStorage.removeItem(`sr-${certSlug}`);
    localStorage.removeItem(`notes-${certSlug}`);
    for (const mod of cert.modules) {
      localStorage.removeItem(`notes-${certSlug}-${mod.slug}`);
    }
    window.location.reload();
  }, [cert]);

  return (
    <div className="bg-surface-primary border border-border-primary rounded-xl p-5">
      <h3 className="font-semibold mb-2">Data Management</h3>
      <p className="text-sm text-text-secondary mb-4">
        Export your progress to a JSON file for backup or device transfer, or import a previous export.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          className="px-4 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
        >
          Export Progress
        </button>
        <button
          onClick={handleImport}
          className="px-4 py-2.5 text-sm font-medium rounded-lg border border-border-primary hover:bg-surface-tertiary transition-colors"
        >
          Import Progress
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2.5 text-sm font-medium rounded-lg border border-danger/30 text-danger hover:bg-danger-light transition-colors"
        >
          Clear All Data
        </button>
      </div>
    </div>
  );
}
