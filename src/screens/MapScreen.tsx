import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LocateFixed, Minus, Plus, Sparkles, DoorOpen } from "lucide-react";
import { getTourById } from "../data/tours";
import { usePlayer } from "../context/PlayerContext";
import { formatTime } from "../lib/format";
import ScreenHeader from "../components/ScreenHeader";
import MiniPlayer from "../components/MiniPlayer";
import BottomNav from "../components/BottomNav";
import type { Stop } from "../types/tour";

export default function MapScreen() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const player = usePlayer();
  const routeTour = getTourById(tourId ?? "");
  const tour = player.tour?.id === routeTour?.id ? player.tour : routeTour;
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<Stop | null>(null);
  const isActive = !!tour && player.tour?.id === tour.id;

  const userPos = useMemo(() => {
    if (!tour) return { x: 0, y: 0 };
    if (!isActive) return { x: tour.stops[0].x, y: tour.stops[0].y };
    const idx = player.currentStopIndex;
    const current = tour.stops[idx];
    const next = tour.stops[idx + 1];
    if (!next) return { x: current.x, y: current.y };
    const stopFrac = Math.min(
      Math.max((player.elapsed - current.timestamp) / (next.timestamp - current.timestamp), 0),
      1
    );
    return {
      x: current.x + (next.x - current.x) * stopFrac,
      y: current.y + (next.y - current.y) * stopFrac,
    };
  }, [isActive, player.currentStopIndex, player.elapsed, tour]);

  if (!tour) return null;

  const routePath = tour.stops.map((s) => `${s.x},${s.y}`).join(" ");
  const exitPoint = {
    x: Math.min(Math.max(tour.stops[0].x - 10, 14), 86),
    y: Math.max(tour.stops[0].y - 10, 6),
  };

  return (
    <div className="relative h-dvh flex flex-col bg-paper">
      <ScreenHeader title="Route map" />

      <div className="flex-1 relative overflow-auto no-scrollbar bg-ink-100 touch-pan-x touch-pan-y">
        <div
          className="relative origin-top-left transition-transform duration-200"
          style={{ width: "100%", height: "100%", transform: `scale(${zoom})` }}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <defs>
              <pattern id="streets" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
                <path d="M0 4.5 H9" stroke="#cabda9" strokeWidth="0.35" />
                <path d="M4.5 0 V9" stroke="#cabda9" strokeWidth="0.35" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#streets)" opacity="0.5" />
            <ellipse cx="14" cy="78" rx="16" ry="12" fill="#e2e9dc" opacity="0.8" />
            <ellipse cx="90" cy="20" rx="14" ry="16" fill="#dbe9f0" opacity="0.7" />

            <polyline
              points={routePath}
              fill="none"
              stroke="#c96a3f"
              strokeWidth="0.8"
              strokeDasharray="2.4 1.6"
              strokeLinecap="round"
            />
            <polyline
              points={`${exitPoint.x},${exitPoint.y} ${tour.stops[0].x},${tour.stops[0].y}`}
              fill="none"
              stroke="#35607a"
              strokeWidth="0.7"
              strokeDasharray="1.2 1.4"
              strokeLinecap="round"
            />
          </svg>

          {/* exit marker */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${exitPoint.x}%`, top: `${exitPoint.y}%` }}
          >
            <div className="h-6 w-6 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-card">
              <DoorOpen size={13} />
            </div>
            <span className="mt-1 rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-medium text-sky-700 whitespace-nowrap shadow-sm">
              Quick exit · main street
            </span>
          </div>

          {tour.stops.map((stop, i) => {
            const done = isActive && i < player.currentStopIndex;
            const current = isActive && i === player.currentStopIndex;
            return (
              <button
                key={stop.id}
                type="button"
                onClick={() => setSelected(stop)}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
              >
                <span
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-semibold shadow-card border-2 border-white ${
                    current
                      ? "bg-terracotta-500 text-white"
                      : done
                        ? "bg-ink-400 text-white"
                        : "bg-white text-ink-700"
                  }`}
                >
                  {stop.order}
                </span>
                {stop.hasAR && (
                  <Sparkles size={11} className="text-sky-500 -mt-1 bg-white rounded-full p-[1px]" />
                )}
              </button>
            );
          })}

          {/* you-are-here marker */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
          >
            <div className="relative h-4 w-4">
              <span className="pulse-ring absolute inset-0 text-terracotta-500/60" />
              <span className="relative block h-4 w-4 rounded-full bg-terracotta-500 ring-2 ring-white shadow-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-3 top-[calc(env(safe-area-inset-top,0px)+64px)] flex flex-col rounded-full bg-white shadow-card overflow-hidden">
        <button type="button" className="p-2.5 border-b border-ink-100" onClick={() => setZoom((z) => Math.min(z + 0.4, 2.2))} aria-label="Zoom in">
          <Plus size={16} />
        </button>
        <button type="button" className="p-2.5" onClick={() => setZoom((z) => Math.max(z - 0.4, 1))} aria-label="Zoom out">
          <Minus size={16} />
        </button>
      </div>
      <button
        type="button"
        onClick={() => setZoom(1)}
        className="absolute right-3 bottom-[calc(env(safe-area-inset-bottom,0px)+130px)] p-2.5 rounded-full bg-white shadow-card"
        aria-label="Recenter"
      >
        <LocateFixed size={16} className="text-terracotta-500" />
      </button>

      {selected && (
        <div className="absolute inset-x-3 bottom-[130px] rounded-2xl bg-white shadow-float p-4 float-in">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] text-ink-400 font-mono">{formatTime(selected.timestamp)}</p>
              <p className="text-[15px] font-semibold text-ink-900">{selected.title}</p>
              <p className="text-[12.5px] text-ink-500 mt-0.5">{selected.teaser}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-ink-400 text-lg leading-none px-1"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => {
                if (isActive) player.skipToStop(selected.id);
                else player.loadTour(tour, { startAt: selected.timestamp, autoplay: false });
                navigate(`/tour/${tour.id}/listen`);
              }}
              className="flex-1 rounded-full bg-ink-950 text-white text-[13px] font-medium py-2.5"
            >
              Jump audio here
            </button>
            {selected.hasAR && (
              <button
                type="button"
                onClick={() => navigate(`/tour/${tour.id}/ar/${selected.id}`)}
                className="flex-1 rounded-full bg-sky-500 text-white text-[13px] font-medium py-2.5 flex items-center justify-center gap-1"
              >
                <Sparkles size={13} /> View AR
              </button>
            )}
          </div>
        </div>
      )}

      <MiniPlayer />
      <BottomNav />
    </div>
  );
}
