import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Star } from "lucide-react";
import type { Tour } from "../types/tour";
import { formatDuration } from "../lib/format";

export default function TourCard({ tour }: { tour: Tour }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/tour/${tour.id}`)}
      className="w-full text-left group"
    >
      <div className={`relative aspect-[16/10] bg-gradient-to-br ${tour.gradient} editorial-photo`}>
        {tour.stops.some((s) => s.hasAR) && (
          <span className="absolute top-0 left-0 border border-ink-950 bg-paper px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-ink-950">
            AR waypoints
          </span>
        )}
      </div>
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
          </span>
          <span className="h-7 w-7 shrink-0 flex items-center justify-center bg-ink-100 border border-ink-950 group-active:bg-ink-950 group-active:text-paper transition-colors">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </button>
  );
}
