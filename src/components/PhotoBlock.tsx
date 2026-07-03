import { useState, type ReactNode } from "react";
import { photoUrl } from "../lib/photo";

export default function PhotoBlock({
  gradient,
  seed,
  className = "",
  children,
}: {
  gradient: string;
  /** unique id used to pick a deterministic real photo; omit to keep the plain gradient */
  seed?: string;
  className?: string;
  children?: ReactNode;
}) {
  const [broken, setBroken] = useState(false);

  return (
    <div className={`relative bg-gradient-to-br ${gradient} editorial-photo photo-grain ${className}`}>
      {seed && !broken && (
        <img
          src={photoUrl(seed)}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      )}
      {children}
    </div>
  );
}
