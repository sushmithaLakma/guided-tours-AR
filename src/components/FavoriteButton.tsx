import { Heart } from "lucide-react";

export default function FavoriteButton({
  active,
  onToggle,
  size = "md",
}: {
  active: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}) {
  const dims = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconSize = size === "sm" ? 13 : 16;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={active}
      className={`${dims} shrink-0 flex items-center justify-center border border-ink-950 transition-colors ${
        active ? "bg-ink-950 text-paper" : "bg-paper text-ink-950"
      }`}
    >
      <Heart size={iconSize} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
