interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-surface-primary border border-border-primary rounded-xl p-5 ${className}`}>
      {children}
    </div>
  );
}
