import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Star } from "lucide-react";
import type { Tour } from "../types/tour";
import { formatDuration } from "../lib/format";

export default function TourCard({ tour }: { tour: Tour }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/tour/${tour.id}`)}
      className="w-full text-left rounded-3xl overflow-hidden bg-white shadow-card active:scale-[0.99] transition-transform"
    >
      <div className={`h-32 bg-gradient-to-br ${tour.gradient} relative flex items-end p-4`}>
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-ink-950/35 backdrop-blur px-2 py-1 text-white text-[11px] font-medium">
          <Star size={11} fill="currentColor" />
          {tour.rating}
        </div>
        {tour.stops.some((s) => s.hasAR) && (
          <div className="absolute top-3 left-3 rounded-full bg-white/85 backdrop-blur px-2 py-1 text-[10px] font-semibold tracking-wide text-ink-800">
            AR WAYPOINTS
          </div>
        )}
        <h3 className="font-serif text-xl text-white leading-snug drop-shadow-sm">{tour.title}</h3>
      </div>
      <div className="p-4 pt-3">
        <p className="text-[13px] text-ink-500 leading-snug mb-2.5">{tour.tagline}</p>
        <div className="flex items-center gap-3 text-[12px] text-ink-500">
          <span className="inline-flex items-center gap-1">
            <Clock size={13} /> {formatDuration(tour.totalDuration)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} /> {tour.distanceKm} km
          </span>
          <span className="capitalize rounded-full bg-ink-100 px-2 py-0.5 text-[11px] text-ink-600">{tour.pace}</span>
        </div>
      </div>
    </button>
  );
}
