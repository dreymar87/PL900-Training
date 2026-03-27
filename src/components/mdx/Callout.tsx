import type { ReactNode } from "react";

interface CalloutProps {
  type?: "info" | "warning" | "success";
  title?: string;
  children: ReactNode;
}

const styles = {
  info: {
    border: "border-accent",
    bg: "bg-accent-light",
    icon: "&#8505;",
    defaultTitle: "Note",
  },
  warning: {
    border: "border-warning",
    bg: "bg-warning-light",
    icon: "&#9888;",
    defaultTitle: "Warning",
  },
  success: {
    border: "border-success",
    bg: "bg-success-light",
    icon: "&#10003;",
    defaultTitle: "Key Point",
  },
};

export default function Callout({ type = "info", title, children }: CalloutProps) {
  const s = styles[type];
  return (
    <div className={`${s.bg} border-l-4 ${s.border} rounded-r-xl p-4 my-4`}>
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0 mt-0.5" dangerouslySetInnerHTML={{ __html: s.icon }} />
        <div>
          <div className="font-semibold text-sm mb-1">{title ?? s.defaultTitle}</div>
          <div className="text-sm text-text-secondary leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
