import { useMemo, useState } from "react";
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
      <div className="flex items-center justify-between px-5 py-4 pt-[calc(env(safe-area-inset-top,0px)+16px)] border-b border-ink-950">
        <span className="font-serif text-[20px] text-ink-950">Wayfare</span>
        <span className="text-[11px] uppercase tracking-wide text-ink-500">Solo travel</span>
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
              onClick={() => setCityId(c.id)}
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
        <p className="text-[11px] uppercase tracking-wide text-ink-400 font-medium mt-4 mb-1">
          {tourList.length} guided tour{tourList.length === 1 ? "" : "s"} in {activeCity.name}
        </p>
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
