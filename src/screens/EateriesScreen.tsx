import { cities } from "../data/cities";
import { getPlacesByCity } from "../data/places";
import { useCity } from "../context/CityContext";
import PlaceCard from "../components/PlaceCard";
import MiniPlayer from "../components/MiniPlayer";
import BottomNav from "../components/BottomNav";

export default function EateriesScreen() {
  const { cityId, setCityId } = useCity();
  const activeCity = cities.find((c) => c.id === cityId)!;
  const placeList = getPlacesByCity(cityId);

  return (
    <div className="relative h-dvh flex flex-col bg-paper">
      <div className="flex items-center justify-between px-5 py-4 pt-[calc(env(safe-area-inset-top,0px)+16px)] border-b border-ink-950">
        <span className="font-serif text-[20px] text-ink-950">Eateries</span>
      </div>

      <header className="px-5 pt-8 pb-6">
        <h1 className="font-serif text-[38px] leading-[1.05] text-ink-950 tracking-tight">
          Eat &amp; shop
          <br />
          in {activeCity.name}.
        </h1>
        <p className="text-[13px] text-ink-600 mt-3 max-w-[32ch]">
          A short list of places worth the detour, picked to sit near the tour routes.
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

      <main className="flex-1 overflow-y-auto no-scrollbar px-5 pb-36">
        {placeList.length === 0 ? (
          <p className="text-[13px] text-ink-500 py-6 text-center">No eateries listed for {activeCity.name} yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-5">
            {placeList.map((p) => (
              <PlaceCard key={p.id} place={p} />
            ))}
          </div>
        )}
      </main>

      <MiniPlayer />
      <BottomNav />
    </div>
  );
}
