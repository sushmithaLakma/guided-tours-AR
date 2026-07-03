import { Check } from "lucide-react";

export default function CoveredBadge({ label = "Visited" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 border border-ink-950 bg-ink-950 text-paper px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide">
      <Check size={10} strokeWidth={3} />
      {label}
    </span>
  );
}
