import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, LocateFixed, Minus, Plus, Sparkles, Store, UtensilsCrossed } from "lucide-react";
import { cities } from "../data/cities";
import { getToursByCity } from "../data/tours";
import { getPlacesByCity } from "../data/places";
import { usePlayer } from "../context/PlayerContext";
import { useUserData } from "../context/UserDataContext";
import { formatTime } from "../lib/format";
import ScreenHeader from "../components/ScreenHeader";
import MiniPlayer from "../components/MiniPlayer";
import BottomNav from "../components/BottomNav";
import type { Stop, Tour } from "../types/tour";
import type { Place } from "../types/place";

type Selection = { kind: "stop"; tour: Tour; stop: Stop } | { kind: "place"; place: Place };

export default function CityMapScreen() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const player = usePlayer();
  const userData = useUserData();
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<Selection | null>(null);

  const city = cities.find((c) => c.id === cityId);
  const tours = getToursByCity(cityId ?? "");
  const placeList = getPlacesByCity(cityId ?? "");

  if (!city) return null;

  return (
    <div className="relative h-dvh flex flex-col bg-paper">
      <ScreenHeader title={`${city.name} overview`} />

      <div className="flex-1 relative overflow-auto no-scrollbar bg-ink-50 touch-pan-x touch-pan-y">
        <div
          className="relative origin-top-left transition-transform duration-200"
          style={{ width: "100%", height: "100%", transform: `scale(${zoom})` }}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <defs>
              <pattern id="streets-city" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
                <path d="M0 4.5 H9" stroke="#d8d2c6" strokeWidth="0.35" />
                <path d="M4.5 0 V9" stroke="#d8d2c6" strokeWidth="0.35" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#streets-city)" opacity="0.6" />
            <ellipse cx="14" cy="78" rx="16" ry="12" fill="#dedad0" opacity="0.9" />
            <ellipse cx="90" cy="20" rx="14" ry="16" fill="#d8d2c6" opacity="0.7" />
          </svg>

          {tours.flatMap((tour) =>
            tour.stops.map((stop) => {
              const visited = userData.isVisited(stop.id);
              const favorite = userData.isFavoriteStop(stop.id);
              const memories = userData.getMemories(stop.id);
              return (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => setSelected({ kind: "stop", tour, stop })}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
                >
                  {memories.length > 0 && (
                    <img
                      src={memories[0].dataUrl}
                      alt=""
                      className="h-4 w-4 object-cover border border-ink-950 -mb-1 z-10"
                    />
                  )}
                  <span
                    className={`relative h-5 w-5 flex items-center justify-center border border-ink-950 ${
                      visited ? "bg-ink-950" : "bg-paper"
                    }`}
                  >
                    {favorite && (
                      <Heart size={9} fill="currentColor" className="absolute -top-1.5 -right-1.5 text-ink-950 bg-paper rounded-full p-[1px]" />
                    )}
                  </span>
                </button>
              );
            })
          )}

          {placeList.map((place) => {
            const Icon = place.category === "market" ? Store : UtensilsCrossed;
            return (
              <button
                key={place.id}
                type="button"
                onClick={() => setSelected({ kind: "place", place })}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-6 w-6 bg-paper border border-ink-950"
                style={{ left: `${place.x}%`, top: `${place.y}%` }}
              >
                <Icon size={12} className="text-ink-950" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute right-3 top-[calc(env(safe-area-inset-top,0px)+64px)] flex flex-col bg-paper border border-ink-950 overflow-hidden">
        <button type="button" className="p-2.5 border-b border-ink-950" onClick={() => setZoom((z) => Math.min(z + 0.4, 2.2))} aria-label="Zoom in">
          <Plus size={16} />
        </button>
        <button type="button" className="p-2.5" onClick={() => setZoom((z) => Math.max(z - 0.4, 1))} aria-label="Zoom out">
          <Minus size={16} />
        </button>
      </div>
      <button
        type="button"
        onClick={() => setZoom(1)}
        className="absolute right-3 bottom-[calc(env(safe-area-inset-bottom,0px)+130px)] p-2.5 bg-paper border border-ink-950"
        aria-label="Recenter"
      >
        <LocateFixed size={16} className="text-ink-950" />
      </button>

      <div className="absolute left-3 bottom-[calc(env(safe-area-inset-bottom,0px)+130px)] bg-paper border border-ink-950 px-2.5 py-2 text-[10px] text-ink-600 flex flex-col gap-1">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 bg-ink-950 border border-ink-950 inline-block" /> Visited stop
        </span>
        <span className="flex items-center gap-1.5">
          <UtensilsCrossed size={10} /> Eat &amp; shop
        </span>
      </div>

      {selected && selected.kind === "stop" && (
        <div className="absolute inset-x-3 bottom-[130px] bg-paper border border-ink-950 p-4 float-in">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">{selected.tour.title}</p>
              <p className="text-[11px] text-ink-500 font-mono mt-0.5">{formatTime(selected.stop.timestamp)}</p>
              <p className="text-[15px] font-serif text-ink-950 mt-0.5">{selected.stop.title}</p>
              <p className="text-[12.5px] text-ink-600 mt-0.5">{selected.stop.teaser}</p>
              {userData.isVisited(selected.stop.id) && (
                <span className="inline-flex items-center gap-1 mt-2 border border-ink-950 bg-ink-950 text-paper px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide">
                  Visited
                </span>
              )}
            </div>
            <button type="button" onClick={() => setSelected(null)} className="text-ink-500 text-lg leading-none px-1" aria-label="Close">
              ×
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => {
                const stop = selected.stop;
                const tour = selected.tour;
                if (player.tour?.id === tour.id) player.skipToStop(stop.id);
                else player.loadTour(tour, { startAt: stop.timestamp, autoplay: false });
                navigate(`/tour/${tour.id}/listen`);
              }}
              className="flex-1 bg-ink-950 text-paper text-[13px] font-medium py-2.5"
            >
              Jump audio here
            </button>
            <button
              type="button"
              onClick={() => userData.toggleFavoriteStop(selected.stop.id)}
              className="h-11 w-11 shrink-0 border border-ink-950 flex items-center justify-center"
              aria-label={userData.isFavoriteStop(selected.stop.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={16} fill={userData.isFavoriteStop(selected.stop.id) ? "currentColor" : "none"} />
            </button>
            {selected.stop.hasAR && (
              <button
                type="button"
                onClick={() => navigate(`/tour/${selected.tour.id}/ar/${selected.stop.id}`)}
                className="h-11 w-11 shrink-0 border border-ink-950 flex items-center justify-center"
                aria-label="View in AR"
              >
                <Sparkles size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {selected && selected.kind === "place" && (
        <div className="absolute inset-x-3 bottom-[130px] bg-paper border border-ink-950 p-4 float-in">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">{selected.place.category}</p>
              <p className="text-[15px] font-serif text-ink-950 mt-0.5">{selected.place.name}</p>
              <p className="text-[12.5px] text-ink-600 mt-0.5">{selected.place.blurb}</p>
              <p className="text-[11px] text-ink-500 mt-1.5">{selected.place.tag}</p>
            </div>
            <button type="button" onClick={() => setSelected(null)} className="text-ink-500 text-lg leading-none px-1" aria-label="Close">
              ×
            </button>
          </div>
        </div>
      )}

      <MiniPlayer />
      <BottomNav />
    </div>
  );
}
