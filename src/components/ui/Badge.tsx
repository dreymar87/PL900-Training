interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning";
}

const variants = {
  default: "bg-surface-tertiary text-text-secondary",
  accent: "bg-accent-light text-accent",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
};

export default function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
