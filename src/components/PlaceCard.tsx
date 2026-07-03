import { Store, UtensilsCrossed } from "lucide-react";
import type { Place } from "../types/place";

export default function PlaceCard({ place }: { place: Place }) {
  const Icon = place.category === "market" ? Store : UtensilsCrossed;
  return (
    <div className="w-40 shrink-0">
      <div className={`relative aspect-[4/3] bg-gradient-to-br ${place.gradient} editorial-photo`}>
        <span className="absolute bottom-0 left-0 h-6 w-6 flex items-center justify-center bg-paper border-t border-r border-ink-950">
          <Icon size={12} className="text-ink-950" />
        </span>
      </div>
      <div className="pt-2">
        <h4 className="text-[13px] font-serif text-ink-950 leading-snug truncate">{place.name}</h4>
        <p className="text-[11px] text-ink-500 mt-0.5">{place.tag}</p>
      </div>
    </div>
  );
}
