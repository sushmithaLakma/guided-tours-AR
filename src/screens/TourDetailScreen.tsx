import { useNavigate, useParams } from "react-router-dom";
import { Play, Sparkles } from "lucide-react";
import { getTourById } from "../data/tours";
import { usePlayer } from "../context/PlayerContext";
import { formatDuration, formatTime } from "../lib/format";
import ScreenHeader from "../components/ScreenHeader";
import MiniPlayer from "../components/MiniPlayer";
import BottomNav from "../components/BottomNav";
import type { Stop } from "../types/tour";

export default function TourDetailScreen() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const player = usePlayer();
  const tour = getTourById(tourId ?? "");

  if (!tour) {
    return (
      <div className="p-6">
        <p>Tour not found.</p>
      </div>
    );
  }

  const isActive = player.tour?.id === tour.id;

  const openAtStop = (stop: Stop) => {
    if (isActive) {
      player.skipToStop(stop.id);
    } else {
      player.loadTour(tour, { startAt: stop.timestamp, autoplay: false });
    }
    navigate(`/tour/${tour.id}/listen`);
  };

  const startTour = () => {
    player.loadTour(tour, { autoplay: true });
    navigate(`/tour/${tour.id}/listen`);
  };

  return (
    <div className="relative h-dvh flex flex-col bg-paper">
      <ScreenHeader />

      <main className={`flex-1 overflow-y-auto no-scrollbar ${isActive ? "pb-40" : player.tour ? "pb-56" : "pb-28"}`}>
        <div className={`aspect-[16/10] bg-gradient-to-br ${tour.gradient} editorial-photo`} />

        <div className="px-5 pt-5">
          <h1 className="font-serif text-[26px] leading-tight text-ink-950">{tour.title}</h1>
          <p className="text-[13px] text-ink-600 mt-1.5">{tour.tagline}</p>

          <div className="flex items-center gap-1.5 text-[12px] text-ink-500 mt-3 uppercase tracking-wide">
            <span>{tour.rating} rating</span>
            <span aria-hidden>▪</span>
            <span className="capitalize">{tour.pace}</span>
            <span aria-hidden>▪</span>
            <span>{formatDuration(tour.totalDuration)}</span>
            <span aria-hidden>▪</span>
            <span>{tour.distanceKm} km</span>
          </div>
        </div>

        <div className="px-5 py-4 mt-2 border-t border-ink-950">
          <p className="text-[14px] leading-relaxed text-ink-700">{tour.description}</p>
          <p className="text-[12px] text-ink-500 mt-3 uppercase tracking-wide">Narrated by {tour.narrator}</p>
          <div className="flex gap-1.5 flex-wrap mt-3">
            {tour.tags.map((t) => (
              <span key={t} className="border border-ink-950 px-2.5 py-1 text-[11px] text-ink-700">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="px-5 pt-4 pb-2 flex items-end justify-between border-t border-ink-950">
          <h2 className="font-serif text-[19px] text-ink-950 pt-4">{tour.stops.length} stops</h2>
          <p className="text-[11px] text-ink-400 pb-1">Tap to jump straight there</p>
        </div>

        <ol className="px-5 flex flex-col">
          {tour.stops.map((stop, i) => {
            const isCurrent = isActive && player.currentStop?.id === stop.id;
            return (
              <li key={stop.id} className={i > 0 ? "border-t border-ink-200" : ""}>
                <button type="button" onClick={() => openAtStop(stop)} className="flex gap-4 text-left w-full py-4">
                  <span
                    className={`shrink-0 text-[13px] font-mono pt-0.5 ${
                      isCurrent ? "text-ink-950 font-semibold" : "text-ink-400"
                    }`}
                  >
                    {String(stop.order).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className={`text-[15px] font-serif ${isCurrent ? "text-ink-950" : "text-ink-900"}`}>
                        {stop.title}
                      </span>
                      {stop.hasAR && <Sparkles size={12} className="text-ink-500 shrink-0" />}
                      {isCurrent && <span className="text-[9px] uppercase tracking-wide border border-ink-950 px-1.5 py-0.5">Now</span>}
                    </span>
                    <span className="block text-[12.5px] text-ink-500 mt-0.5 leading-snug">{stop.teaser}</span>
                    <span className="block text-[11px] text-ink-400 mt-1.5 font-mono uppercase tracking-wide">
                      {formatTime(stop.timestamp)} · {formatDuration(stop.duration)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </main>

      {!isActive && (
        <div
          className={`absolute inset-x-0 p-4 bg-paper ${
            player.tour ? "bottom-[124px] border-t border-ink-950" : "bottom-0 border-t border-ink-950 pb-[calc(env(safe-area-inset-bottom,0px)+16px)]"
          }`}
        >
          <button
            type="button"
            onClick={startTour}
            className="w-full bg-ink-950 text-paper py-3.5 flex items-center justify-center gap-2 font-medium active:bg-ink-800 transition-colors"
          >
            <Play size={16} fill="currentColor" />
            {player.tour ? "Start this tour instead" : "Start tour"}
          </button>
        </div>
      )}

      <MiniPlayer />
      <BottomNav />
    </div>
  );
}
