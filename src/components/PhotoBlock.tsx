import type { ReactNode } from "react";

export default function PhotoBlock({
  gradient,
  className = "",
  children,
}: {
  gradient: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative bg-gradient-to-br ${gradient} editorial-photo photo-grain ${className}`}>
      {children}
    </div>
  );
}
