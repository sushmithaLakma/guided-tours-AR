import { Store, UtensilsCrossed } from "lucide-react";
import type { Place } from "../types/place";
import PhotoBlock from "./PhotoBlock";

export default function PlaceCard({ place }: { place: Place }) {
  const Icon = place.category === "market" ? Store : UtensilsCrossed;
  return (
    <div className="w-full">
      <PhotoBlock gradient={place.gradient} seed={place.id} className="aspect-[4/3]">
        <span className="absolute z-10 bottom-0 left-0 h-6 w-6 flex items-center justify-center bg-paper border-t border-r border-ink-950">
          <Icon size={12} className="text-ink-950" />
        </span>
      </PhotoBlock>
      <div className="pt-2">
        <h4 className="text-[13px] font-serif text-ink-950 leading-snug truncate">{place.name}</h4>
        <p className="text-[11px] text-ink-500 mt-0.5">{place.tag}</p>
      </div>
    </div>
  );
}
