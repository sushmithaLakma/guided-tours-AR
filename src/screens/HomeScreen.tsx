import { useMemo, useState } from "react";
import { Compass } from "lucide-react";
import { cities } from "../data/cities";
import { getToursByCity } from "../data/tours";
import TourCard from "../components/TourCard";
import MiniPlayer from "../components/MiniPlayer";
import BottomNav from "../components/BottomNav";
import { usePlayer } from "../context/PlayerContext";

export default function HomeScreen() {
  const [cityId, setCityId] = useState(cities[0].id);
  const { tour } = usePlayer();
  const activeCity = cities.find((c) => c.id === cityId)!;
  const tourList = useMemo(() => getToursByCity(cityId), [cityId]);

  return (
    <div className="relative h-dvh flex flex-col bg-paper">
      <header className="px-5 pt-[calc(env(safe-area-inset-top,0px)+20px)] pb-4">
        <div className="flex items-center gap-1.5 text-terracotta-500 text-[12px] font-semibold tracking-wide uppercase mb-2">
          <Compass size={14} />
          Wayfare
        </div>
        <h1 className="font-serif text-[26px] leading-tight text-ink-950">
          Explore {activeCity.name}
          <br />
          at your own pace.
        </h1>
        <p className="text-[13px] text-ink-500 mt-1.5">
          Self-guided audio tours built for solo travellers — pause, rewind or linger, whenever you like.
        </p>
      </header>

      <div className="px-5 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {cities.map((c) => {
          const active = c.id === cityId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCityId(c.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                active ? "bg-ink-950 text-white" : "bg-ink-100 text-ink-600"
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      <main className={`flex-1 overflow-y-auto no-scrollbar px-5 pt-1 ${tour ? "pb-40" : "pb-8"} flex flex-col gap-4`}>
        <p className="text-[11px] uppercase tracking-wide text-ink-400 font-semibold mt-1">
          {tourList.length} guided tour{tourList.length === 1 ? "" : "s"} in {activeCity.name}
        </p>
        {tourList.map((t) => (
          <TourCard key={t.id} tour={t} />
        ))}
        <div className="h-2" />
      </main>

      <MiniPlayer />
      <BottomNav />
    </div>
  );
}
