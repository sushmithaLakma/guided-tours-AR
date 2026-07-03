import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sparkles, DoorOpen, Check } from "lucide-react";
import { getTourById } from "../data/tours";
import { usePlayer } from "../context/PlayerContext";
import { useUserData } from "../context/UserDataContext";
import { formatTime } from "../lib/format";
import ScreenHeader from "../components/ScreenHeader";
import MiniPlayer from "../components/MiniPlayer";
import BottomNav from "../components/BottomNav";
import FavoriteButton from "../components/FavoriteButton";
import MapListToggle from "../components/MapListToggle";
import FilterChipRow from "../components/FilterChipRow";
import MapZoomControls from "../components/MapZoomControls";
import StreetGrid from "../components/StreetGrid";
import type { Stop } from "../types/tour";

const FILTERS = [
  { key: "all", label: "All stops" },
  { key: "ar", label: "AR waypoints" },
  { key: "visited", label: "Visited" },
];

export default function MapScreen() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const player = usePlayer();
  const userData = useUserData();
  const routeTour = getTourById(tourId ?? "");
  const tour = player.tour?.id === routeTour?.id ? player.tour : routeTour;
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState<"map" | "list">("map");
  const [filter, setFilter] = useState("all");
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

  const matchesFilter = (stop: Stop) =>
    filter === "all" || (filter === "ar" && stop.hasAR) || (filter === "visited" && userData.isVisited(stop.id));

  const jumpToStop = (stop: Stop) => {
    if (isActive) player.skipToStop(stop.id);
    else player.loadTour(tour, { startAt: stop.timestamp, autoplay: false });
    navigate(`/tour/${tour.id}/listen`);
  };

  const routePath = tour.stops.map((s) => `${s.x},${s.y}`).join(" ");
  const exitPoint = {
    x: Math.min(Math.max(tour.stops[0].x - 10, 24), 76),
    y: Math.max(tour.stops[0].y - 10, 6),
  };

  return (
    <div className="relative h-dvh flex flex-col bg-paper">
      <ScreenHeader title="Route map" />

      <div className="flex items-center justify-between px-5 py-3 border-b border-ink-950">
        <MapListToggle mode={mode} onChange={setMode} />
      </div>
      <div className="border-b border-ink-950">
        <FilterChipRow options={FILTERS} active={filter} onChange={setFilter} />
      </div>

      {mode === "list" ? (
        <main className="flex-1 overflow-y-auto no-scrollbar pb-36">
          {tour.stops.filter(matchesFilter).map((stop, i) => {
            const visited = userData.isVisited(stop.id);
            return (
              <button
                key={stop.id}
                type="button"
                onClick={() => jumpToStop(stop)}
                className={`flex items-center gap-3 w-full px-5 py-4 text-left ${i > 0 ? "border-t border-ink-200" : ""}`}
              >
                <span className="text-[13px] font-mono text-ink-400 w-5 shrink-0">{String(stop.order).padStart(2, "0")}</span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[14.5px] font-serif text-ink-950 truncate">{stop.title}</span>
                    {stop.hasAR && <Sparkles size={12} className="text-terracotta-500 shrink-0" />}
                    {visited && <Check size={13} strokeWidth={2.5} className="text-ink-950 shrink-0" />}
                  </span>
                  <span className="block text-[12px] text-ink-500 truncate">{stop.teaser}</span>
                </span>
                <span className="text-[11px] font-mono text-ink-400 shrink-0">{formatTime(stop.timestamp)}</span>
              </button>
            );
          })}
        </main>
      ) : (
        <div className="flex-1 relative overflow-auto no-scrollbar bg-ink-50 touch-pan-x touch-pan-y">
          <div
            className="relative origin-top-left transition-transform duration-200"
            style={{ width: "100%", height: "100%", transform: `scale(${zoom})` }}
          >
            <StreetGrid />
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <polyline
                points={routePath}
                fill="none"
                stroke="#17140f"
                strokeWidth="0.6"
                strokeDasharray="2.4 1.6"
                strokeLinecap="round"
              />
              <polyline
                points={`${exitPoint.x},${exitPoint.y} ${tour.stops[0].x},${tour.stops[0].y}`}
                fill="none"
                stroke="#7d7266"
                strokeWidth="0.5"
                strokeDasharray="1.2 1.4"
                strokeLinecap="round"
              />
            </svg>

            {/* exit marker */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${exitPoint.x}%`, top: `${exitPoint.y}%` }}
            >
              <div className="h-7 w-7 bg-paper border border-ink-950 text-ink-950 flex items-center justify-center shadow-float">
                <DoorOpen size={13} />
              </div>
              <span className="mt-1 border border-ink-950 bg-paper px-2 py-0.5 text-[9px] font-medium text-ink-800 whitespace-nowrap uppercase">
                Quick exit
              </span>
            </div>

            {tour.stops.map((stop, i) => {
              const done = isActive && i < player.currentStopIndex;
              const current = isActive && i === player.currentStopIndex;
              const visited = userData.isVisited(stop.id);
              const dimmed = !matchesFilter(stop);
              return (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => setSelected(stop)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-opacity ${dimmed ? "opacity-30" : ""}`}
                  style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
                >
                  <span className="relative">
                    <span
                      className={`h-8 w-8 flex items-center justify-center text-[11px] font-semibold border shadow-float ${
                        current
                          ? "bg-ink-950 text-paper border-ink-950"
                          : visited || done
                            ? "bg-ink-300 text-ink-950 border-ink-950"
                            : "bg-paper text-ink-950 border-ink-950"
                      }`}
                    >
                      {stop.order}
                    </span>
                    {stop.hasAR && (
                      <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-terracotta-500 border border-paper flex items-center justify-center">
                        <Sparkles size={8} className="text-paper" />
                      </span>
                    )}
                  </span>
                  <span className="mt-1 max-w-[72px] truncate border border-ink-950 text-[9px] font-medium text-ink-800 bg-paper/90 px-2 py-0.5 shadow-sm">
                    {stop.title}
                  </span>
                </button>
              );
            })}

            {/* you-are-here marker */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
            >
              <div className="relative h-4 w-4">
                <span className="pulse-ring absolute inset-0 text-ink-950/50" />
                <span className="relative block h-4 w-4 rounded-full bg-ink-950 ring-2 ring-paper" />
              </div>
            </div>
          </div>

          <MapZoomControls zoom={zoom} setZoom={setZoom} />
        </div>
      )}

      {selected && (
        <div className="absolute inset-x-3 bottom-[130px] bg-paper border border-ink-950 p-4 shadow-float float-in">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] text-ink-500 font-mono">{formatTime(selected.timestamp)}</p>
              <p className="text-[15px] font-serif text-ink-950">{selected.title}</p>
              <p className="text-[12.5px] text-ink-600 mt-0.5">{selected.teaser}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-ink-500 text-lg leading-none px-1"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => jumpToStop(selected)}
              className="flex-1 bg-ink-950 text-paper text-[13px] font-medium py-2.5"
            >
              Jump audio here
            </button>
            <FavoriteButton
              active={userData.isFavoriteTour(tour.id)}
              onToggle={() => userData.toggleFavoriteTour(tour.id)}
            />
            {selected.hasAR && (
              <button
                type="button"
                onClick={() => navigate(`/tour/${tour.id}/ar/${selected.id}`)}
                className="flex-1 border border-ink-950 text-ink-950 text-[13px] font-medium py-2.5 flex items-center justify-center gap-1"
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
