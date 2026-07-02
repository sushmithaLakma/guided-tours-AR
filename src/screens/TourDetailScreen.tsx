import { useNavigate, useParams } from "react-router-dom";
import { Clock, MapPin, Play, Sparkles, Star } from "lucide-react";
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
      <div className={`h-56 bg-gradient-to-br ${tour.gradient} relative shrink-0`}>
        <ScreenHeader transparent />
        <div className="absolute bottom-0 inset-x-0 p-5 pt-10 bg-gradient-to-t from-ink-950/70 to-transparent">
          <h1 className="font-serif text-2xl text-white leading-tight mb-1">{tour.title}</h1>
          <p className="text-[13px] text-white/85">{tour.tagline}</p>
        </div>
      </div>

      <main className={`flex-1 overflow-y-auto no-scrollbar ${isActive ? "pb-40" : player.tour ? "pb-56" : "pb-28"}`}>
        <div className="px-5 py-4 flex items-center gap-3 text-[12px] text-ink-500 border-b border-ink-100">
          <span className="inline-flex items-center gap-1">
            <Clock size={13} /> {formatDuration(tour.totalDuration)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} /> {tour.distanceKm} km
          </span>
          <span className="inline-flex items-center gap-1">
            <Star size={13} fill="currentColor" className="text-terracotta-500" /> {tour.rating} ({tour.ratingCount})
          </span>
        </div>

        <div className="px-5 py-4">
          <p className="text-[14px] leading-relaxed text-ink-700">{tour.description}</p>
          <p className="text-[12px] text-ink-400 mt-2">Narrated by {tour.narrator}</p>
          <div className="flex gap-1.5 flex-wrap mt-3">
            {tour.tags.map((t) => (
              <span key={t} className="rounded-full bg-ink-100 px-2.5 py-1 text-[11px] text-ink-600">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="px-5 pt-2 pb-1 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-500">
            {tour.stops.length} stops
          </h2>
          <p className="text-[11px] text-ink-400">Tap any stop to jump straight there</p>
        </div>

        <ol className="px-5 flex flex-col">
          {tour.stops.map((stop, i) => {
            const isCurrent = isActive && player.currentStop?.id === stop.id;
            return (
              <li key={stop.id} className="relative flex gap-3 pb-5">
                {i < tour.stops.length - 1 && (
                  <span className="absolute left-[15px] top-8 bottom-0 w-px bg-ink-200" aria-hidden />
                )}
                <button
                  type="button"
                  onClick={() => openAtStop(stop)}
                  className="flex gap-3 text-left w-full group"
                >
                  <span
                    className={`relative z-10 h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-[12px] font-semibold ${
                      isCurrent
                        ? "bg-terracotta-500 text-white"
                        : "bg-white ring-1 ring-ink-200 text-ink-600 group-active:bg-ink-100"
                    }`}
                  >
                    {stop.order}
                  </span>
                  <span className="flex-1 pt-0.5">
                    <span className="flex items-center gap-1.5">
                      <span className={`text-[14px] font-medium ${isCurrent ? "text-terracotta-600" : "text-ink-900"}`}>
                        {stop.title}
                      </span>
                      {stop.hasAR && <Sparkles size={13} className="text-sky-500 shrink-0" />}
                    </span>
                    <span className="block text-[12.5px] text-ink-500 mt-0.5 leading-snug">{stop.teaser}</span>
                    <span className="block text-[11px] text-ink-400 mt-1 font-mono">
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
          className={`absolute inset-x-0 p-4 bg-gradient-to-t from-paper via-paper to-transparent ${
            player.tour ? "bottom-[124px]" : "bottom-0 pb-[calc(env(safe-area-inset-bottom,0px)+16px)]"
          }`}
        >
          <button
            type="button"
            onClick={startTour}
            className="w-full rounded-full bg-ink-950 text-white py-3.5 flex items-center justify-center gap-2 font-medium shadow-card active:scale-[0.99] transition-transform"
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
