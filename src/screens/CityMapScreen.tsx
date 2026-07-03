import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, Sparkles, Store, UtensilsCrossed } from "lucide-react";
import { cities } from "../data/cities";
import { getToursByCity } from "../data/tours";
import { getPlacesByCity } from "../data/places";
import { usePlayer } from "../context/PlayerContext";
import { useUserData } from "../context/UserDataContext";
import { formatTime } from "../lib/format";
import ScreenHeader from "../components/ScreenHeader";
import MiniPlayer from "../components/MiniPlayer";
import BottomNav from "../components/BottomNav";
import MapListToggle from "../components/MapListToggle";
import FilterChipRow from "../components/FilterChipRow";
import MapZoomControls from "../components/MapZoomControls";
import type { Stop, Tour } from "../types/tour";
import type { Place } from "../types/place";

type Selection = { kind: "stop"; tour: Tour; stop: Stop } | { kind: "place"; place: Place };

const FILTERS = [
  { key: "all", label: "All" },
  { key: "tours", label: "Tours" },
  { key: "eat", label: "Eat & shop" },
  { key: "favourites", label: "Favourites" },
];

export default function CityMapScreen() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const player = usePlayer();
  const userData = useUserData();
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState<"map" | "list">("map");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Selection | null>(null);

  const city = cities.find((c) => c.id === cityId);
  const tours = getToursByCity(cityId ?? "");
  const placeList = getPlacesByCity(cityId ?? "");

  if (!city) return null;

  const showTours = filter === "all" || filter === "tours" || filter === "favourites";
  const showPlaces = filter === "all" || filter === "eat";
  const stopMatches = (tour: Tour) => filter !== "favourites" || userData.isFavoriteTour(tour.id);

  return (
    <div className="relative h-dvh flex flex-col bg-paper">
      <ScreenHeader title={`${city.name} overview`} />

      <div className="flex items-center justify-between px-5 py-3 border-b border-ink-950">
        <MapListToggle mode={mode} onChange={setMode} />
      </div>
      <div className="border-b border-ink-950">
        <FilterChipRow options={FILTERS} active={filter} onChange={setFilter} />
      </div>

      {mode === "list" ? (
        <main className="flex-1 overflow-y-auto no-scrollbar pb-36">
          {showTours &&
            tours
              .filter(stopMatches)
              .map((tour) => (
                <div key={tour.id}>
                  <p className="px-5 pt-4 pb-1 text-[11px] uppercase tracking-wide text-ink-400 font-medium">{tour.title}</p>
                  {tour.stops.map((stop, i) => {
                    const visited = userData.isVisited(stop.id);
                    return (
                      <button
                        key={stop.id}
                        type="button"
                        onClick={() => {
                          if (player.tour?.id === tour.id) player.skipToStop(stop.id);
                          else player.loadTour(tour, { startAt: stop.timestamp, autoplay: false });
                          navigate(`/tour/${tour.id}/listen`);
                        }}
                        className={`flex items-center gap-3 w-full px-5 py-3 text-left ${i > 0 ? "border-t border-ink-200" : ""}`}
                      >
                        <span className="text-[13px] font-mono text-ink-400 w-5 shrink-0">
                          {String(stop.order).padStart(2, "0")}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="flex items-center gap-1.5">
                            <span className="text-[14px] font-serif text-ink-950 truncate">{stop.title}</span>
                            {stop.hasAR && <Sparkles size={11} className="text-terracotta-500 shrink-0" />}
                          </span>
                        </span>
                        {visited && (
                          <span className="rounded-full text-[9px] uppercase tracking-wide border border-ink-950 bg-ink-950 text-paper px-2 py-0.5 shrink-0">
                            Visited
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}

          {showPlaces && placeList.length > 0 && (
            <div>
              <p className="px-5 pt-4 pb-1 text-[11px] uppercase tracking-wide text-ink-400 font-medium">Eat &amp; shop</p>
              {placeList.map((place, i) => {
                const Icon = place.category === "market" ? Store : UtensilsCrossed;
                return (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => setSelected({ kind: "place", place })}
                    className={`flex items-center gap-3 w-full px-5 py-3 text-left ${i > 0 ? "border-t border-ink-200" : ""}`}
                  >
                    <Icon size={14} className="text-ink-500 shrink-0" />
                    <span className="flex-1 min-w-0">
                      <span className="text-[14px] font-serif text-ink-950 truncate block">{place.name}</span>
                      <span className="text-[11px] text-ink-500">{place.tag}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </main>
      ) : (
        <div className="flex-1 relative overflow-auto no-scrollbar bg-ink-50 touch-pan-x touch-pan-y">
          <div
            className="relative origin-top-left transition-transform duration-200"
            style={{ width: "100%", height: "100%", transform: `scale(${zoom})` }}
          >
            {tours.flatMap((tour) =>
              tour.stops.map((stop) => {
                const visited = userData.isVisited(stop.id);
                const dimmed = !showTours || !stopMatches(tour);
                return (
                  <button
                    key={stop.id}
                    type="button"
                    onClick={() => setSelected({ kind: "stop", tour, stop })}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-opacity ${dimmed ? "opacity-30" : ""}`}
                    style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
                  >
                    <span className="relative">
                      <span
                        className={`h-6 w-6 rounded-full flex items-center justify-center border border-ink-950 shadow-float ${
                          visited ? "bg-ink-950" : "bg-paper"
                        }`}
                      />
                      {stop.hasAR && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-terracotta-500 border border-paper" />
                      )}
                    </span>
                    <span className="mt-1 max-w-[64px] truncate rounded-full text-[8.5px] font-medium text-ink-800 bg-paper/90 px-1.5 py-0.5 shadow-sm">
                      {stop.title}
                    </span>
                  </button>
                );
              })
            )}

            {placeList.map((place) => {
              const Icon = place.category === "market" ? Store : UtensilsCrossed;
              const dimmed = !showPlaces;
              return (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => setSelected({ kind: "place", place })}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-opacity ${dimmed ? "opacity-30" : ""}`}
                  style={{ left: `${place.x}%`, top: `${place.y}%` }}
                >
                  <span className="flex items-center justify-center h-7 w-7 rounded-full bg-paper border border-ink-950 shadow-float">
                    <Icon size={12} className="text-ink-950" />
                  </span>
                  <span className="mt-1 max-w-[64px] truncate rounded-full text-[8.5px] font-medium text-ink-800 bg-paper/90 px-1.5 py-0.5 shadow-sm">
                    {place.name}
                  </span>
                </button>
              );
            })}
          </div>

          <MapZoomControls zoom={zoom} setZoom={setZoom} />

          <div className="absolute left-3 bottom-3 rounded-2xl bg-paper border border-ink-950 px-3 py-2.5 text-[10px] text-ink-600 flex flex-col gap-1 shadow-float">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-ink-950 border border-ink-950 inline-block" /> Visited stop
            </span>
            <span className="flex items-center gap-1.5">
              <UtensilsCrossed size={10} /> Eat &amp; shop
            </span>
          </div>
        </div>
      )}

      {selected && selected.kind === "stop" && (
        <div className="absolute inset-x-3 bottom-[130px] rounded-3xl bg-paper border border-ink-950 p-4 shadow-float float-in">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">{selected.tour.title}</p>
              <p className="text-[11px] text-ink-500 font-mono mt-0.5">{formatTime(selected.stop.timestamp)}</p>
              <p className="text-[15px] font-serif text-ink-950 mt-0.5">{selected.stop.title}</p>
              <p className="text-[12.5px] text-ink-600 mt-0.5">{selected.stop.teaser}</p>
              {userData.isVisited(selected.stop.id) && (
                <span className="inline-flex items-center gap-1 mt-2 rounded-full border border-ink-950 bg-ink-950 text-paper px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide">
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
              className="flex-1 rounded-full bg-ink-950 text-paper text-[13px] font-medium py-2.5"
            >
              Jump audio here
            </button>
            <button
              type="button"
              onClick={() => userData.toggleFavoriteTour(selected.tour.id)}
              className="h-11 w-11 shrink-0 rounded-full border border-ink-950 flex items-center justify-center"
              aria-label={userData.isFavoriteTour(selected.tour.id) ? "Remove tour from favorites" : "Add tour to favorites"}
            >
              <Heart size={16} fill={userData.isFavoriteTour(selected.tour.id) ? "currentColor" : "none"} />
            </button>
            {selected.stop.hasAR && (
              <button
                type="button"
                onClick={() => navigate(`/tour/${selected.tour.id}/ar/${selected.stop.id}`)}
                className="h-11 w-11 shrink-0 rounded-full border border-ink-950 flex items-center justify-center"
                aria-label="View in AR"
              >
                <Sparkles size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {selected && selected.kind === "place" && (
        <div className="absolute inset-x-3 bottom-[130px] rounded-3xl bg-paper border border-ink-950 p-4 shadow-float float-in">
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
