import { tours } from "../data/tours";
import { cities } from "../data/cities";
import { useUserData } from "../context/UserDataContext";
import TourCard from "../components/TourCard";
import MiniPlayer from "../components/MiniPlayer";
import BottomNav from "../components/BottomNav";

export default function FavoritesScreen() {
  const userData = useUserData();
  const favoriteTours = tours.filter((t) => userData.isFavoriteTour(t.id));

  return (
    <div className="relative h-dvh flex flex-col bg-paper">
      <div className="flex items-center justify-between px-5 py-4 pt-[calc(env(safe-area-inset-top,0px)+16px)] border-b border-ink-950">
        <span className="font-serif text-[20px] text-ink-950">Favourites</span>
      </div>

      <header className="px-5 pt-8 pb-6">
        <h1 className="font-serif text-[38px] leading-[1.05] text-ink-950 tracking-tight">
          Tours you've
          <br />
          set aside.
        </h1>
        <p className="text-[13px] text-ink-600 mt-3 max-w-[32ch]">
          Tap the heart on any tour to save it here, across every city.
        </p>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-5 pb-36">
        {favoriteTours.length === 0 ? (
          <p className="text-[13px] text-ink-500 py-6 text-center">
            Nothing saved yet — browse a city from Home and tap the heart on a tour.
          </p>
        ) : (
          favoriteTours.map((t, i) => {
            const city = cities.find((c) => c.id === t.cityId);
            return (
              <div key={t.id} className={i > 0 ? "border-t border-ink-200 pt-1" : ""}>
                {city && (
                  <p className="text-[11px] uppercase tracking-wide text-ink-400 font-medium mt-4 mb-1">{city.name}</p>
                )}
                <TourCard tour={t} />
              </div>
            );
          })
        )}
      </main>

      <MiniPlayer />
      <BottomNav />
    </div>
  );
}
