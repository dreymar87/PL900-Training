import type { ModuleSection } from "@/lib/types";

function renderBoldMarkdown(content: string): React.ReactNode[] {
  const parts = content.split(/(\*\*.+?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function StudyGuideSection({ section }: { section: ModuleSection }) {
  return (
    <div className="bg-surface-secondary rounded-xl p-5">
      <h3 className="font-semibold text-base mb-2">{section.heading}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">
        {renderBoldMarkdown(section.content)}
      </p>
    </div>
  );
}
