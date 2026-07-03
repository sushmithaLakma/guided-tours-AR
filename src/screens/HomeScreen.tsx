import { useMemo, useState } from "react";
import { Map as MapIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cities } from "../data/cities";
import { getToursByCity } from "../data/tours";
import { getPlacesByCity } from "../data/places";
import TourCard from "../components/TourCard";
import PlaceCard from "../components/PlaceCard";
import MiniPlayer from "../components/MiniPlayer";
import BottomNav from "../components/BottomNav";
import { usePlayer } from "../context/PlayerContext";
import { useUserData } from "../context/UserDataContext";

export default function HomeScreen() {
  const [cityId, setCityId] = useState(cities[0].id);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const { tour } = usePlayer();
  const userData = useUserData();
  const navigate = useNavigate();
  const activeCity = cities.find((c) => c.id === cityId)!;
  const allTours = useMemo(() => getToursByCity(cityId), [cityId]);
  const tourList = favoritesOnly ? allTours.filter((t) => userData.isFavoriteTour(t.id)) : allTours;
  const placeList = useMemo(() => getPlacesByCity(cityId), [cityId]);

  return (
    <div className="relative h-dvh flex flex-col bg-paper">
      <div className="flex items-center justify-between px-5 py-4 pt-[calc(env(safe-area-inset-top,0px)+16px)] border-b border-ink-950">
        <span className="font-serif text-[20px] text-ink-950">Wayfare</span>
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-wide text-ink-500">Solo travel</span>
          <button
            type="button"
            onClick={() => navigate(`/city/${cityId}/map`)}
            className="h-8 w-8 flex items-center justify-center border border-ink-950 bg-ink-100"
            aria-label={`Overview map of ${activeCity.name}`}
          >
            <MapIcon size={14} />
          </button>
        </div>
      </div>

      <header className="px-5 pt-8 pb-6">
        <h1 className="font-serif text-[38px] leading-[1.05] text-ink-950 tracking-tight">
          Explore
          <br />
          {activeCity.name}.
        </h1>
        <p className="text-[13px] text-ink-600 mt-3 max-w-[30ch]">
          Self-guided audio tours built for solo travellers — pause, rewind or linger, whenever you like.
        </p>
      </header>

      <div className="flex gap-5 px-5 border-b border-ink-950">
        {cities.map((c) => {
          const active = c.id === cityId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setCityId(c.id);
                setFavoritesOnly(false);
              }}
              className={`pb-2.5 text-[13px] font-medium ${
                active ? "text-ink-950 border-b border-ink-950" : "text-ink-400"
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      <main className={`flex-1 overflow-y-auto no-scrollbar px-5 ${tour ? "pb-40" : "pb-8"}`}>
        {placeList.length > 0 && (
          <div className="mt-5">
            <p className="text-[11px] uppercase tracking-wide text-ink-400 font-medium mb-2">Eat &amp; shop nearby</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {placeList.map((p) => (
                <PlaceCard key={p.id} place={p} />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-5 mb-1">
          <p className="text-[11px] uppercase tracking-wide text-ink-400 font-medium">
            {tourList.length} guided tour{tourList.length === 1 ? "" : "s"} in {activeCity.name}
          </p>
          <button
            type="button"
            onClick={() => setFavoritesOnly((v) => !v)}
            className={`text-[11px] uppercase tracking-wide px-2 py-1 border border-ink-950 ${
              favoritesOnly ? "bg-ink-950 text-paper" : "text-ink-700"
            }`}
          >
            Favorites
          </button>
        </div>

        {tourList.length === 0 && (
          <p className="text-[13px] text-ink-500 py-6 text-center">No favorited tours in {activeCity.name} yet.</p>
        )}

        {tourList.map((t, i) => (
          <div key={t.id} className={i > 0 ? "border-t border-ink-200" : ""}>
            <TourCard tour={t} />
          </div>
        ))}
      </main>

      <MiniPlayer />
      <BottomNav />
    </div>
  );
}
