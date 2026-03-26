import type { ModuleSection } from "@/lib/types";

export default function StudyGuideSection({ section }: { section: ModuleSection }) {
  // Simple bold markdown: **text** → <strong>text</strong>
  const rendered = section.content.replace(
    /\*\*(.+?)\*\*/g,
    "<strong>$1</strong>"
  );

  return (
    <div className="bg-surface-secondary rounded-xl p-5">
      <h3 className="font-semibold text-base mb-2">{section.heading}</h3>
      <p
        className="text-sm text-text-secondary leading-relaxed"
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    </div>
  );
}
