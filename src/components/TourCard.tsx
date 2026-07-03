import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Star } from "lucide-react";
import type { Tour } from "../types/tour";
import { formatDuration } from "../lib/format";
import { useUserData } from "../context/UserDataContext";
import FavoriteButton from "./FavoriteButton";
import PhotoBlock from "./PhotoBlock";

export default function TourCard({ tour }: { tour: Tour }) {
  const navigate = useNavigate();
  const userData = useUserData();
  const visitedCount = userData.visitedCountForStops(tour.stops.map((s) => s.id));
  const open = () => navigate(`/tour/${tour.id}`);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") open();
      }}
      className="w-full text-left group cursor-pointer"
    >
      <PhotoBlock gradient={tour.gradient} className="aspect-[16/10]">
        {tour.stops.some((s) => s.hasAR) && (
          <span className="absolute z-10 top-0 left-0 border border-ink-950 bg-paper px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-ink-950">
            AR waypoints
          </span>
        )}
        <span className="absolute z-10 top-2 right-2">
          <FavoriteButton
            active={userData.isFavoriteTour(tour.id)}
            onToggle={() => userData.toggleFavoriteTour(tour.id)}
            size="sm"
          />
        </span>
      </PhotoBlock>
      <div className="pt-3">
        <h3 className="font-serif text-[19px] leading-snug text-ink-950">{tour.title}</h3>
        <p className="text-[13px] text-ink-600 leading-snug mt-1">{tour.tagline}</p>
        <div className="flex items-center justify-between mt-3 pb-4">
          <span className="text-[12px] text-ink-500 flex items-center gap-1.5">
            <Star size={11} fill="currentColor" className="text-ink-700" />
            {tour.rating}
            <span aria-hidden>▪</span>
            <span className="capitalize">{tour.pace}</span>
            <span aria-hidden>▪</span>
            {formatDuration(tour.totalDuration)}
            {visitedCount > 0 && (
              <>
                <span aria-hidden>▪</span>
                {visitedCount}/{tour.stops.length} visited
              </>
            )}
          </span>
          <span className="h-7 w-7 shrink-0 flex items-center justify-center bg-ink-100 border border-ink-950 group-active:bg-ink-950 group-active:text-paper transition-colors">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}
