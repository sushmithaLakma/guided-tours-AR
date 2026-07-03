import { useLocation, useNavigate } from "react-router-dom";
import { Heart, House, Map as MapIcon, UtensilsCrossed } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useCity } from "../context/CityContext";

const TABS = [
  { key: "home", label: "Home", icon: House, path: "/" },
  { key: "map", label: "Map", icon: MapIcon, path: null },
  { key: "favourites", label: "Favourites", icon: Heart, path: "/favorites" },
  { key: "eateries", label: "Eateries", icon: UtensilsCrossed, path: "/eateries" },
] as const;

export default function BottomNav() {
  const { tour, hasFinished, exitTour } = usePlayer();
  const { cityId } = useCity();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="absolute bottom-0 inset-x-0 z-30 flex items-stretch bg-paper border-t border-ink-950 pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Main navigation"
    >
      {TABS.map(({ key, label, icon: Icon, path }) => {
        const target = path ?? `/city/${cityId}/map`;
        const active = key === "map" ? location.pathname.endsWith("/map") : location.pathname === path;
        return (
          <button
            key={key}
            type="button"
            onClick={() => {
              // A finished tour naturally hands control back to browsing mode on Home
              if (key === "home" && tour && hasFinished) exitTour();
              navigate(target);
            }}
            className="flex-1 flex flex-col items-center gap-1.5 py-2.5"
          >
            <Icon size={18} strokeWidth={active ? 2 : 1.5} className={active ? "text-ink-950" : "text-ink-400"} />
            <span
              className={`text-[10px] font-medium uppercase tracking-wide pb-0.5 ${
                active ? "text-ink-950 border-b border-ink-950" : "text-ink-400"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
