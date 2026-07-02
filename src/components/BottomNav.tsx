import { useLocation, useNavigate } from "react-router-dom";
import { ListMusic, Map as MapIcon, Compass } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

export default function BottomNav() {
  const { tour } = usePlayer();
  const location = useLocation();
  const navigate = useNavigate();

  if (!tour) return null;

  const tabs = [
    { key: "listen", label: "Listen", icon: Compass, path: `/tour/${tour.id}/listen` },
    { key: "stops", label: "Stops", icon: ListMusic, path: `/tour/${tour.id}` },
    { key: "map", label: "Map", icon: MapIcon, path: `/tour/${tour.id}/map` },
  ];

  return (
    <nav
      className="absolute bottom-0 inset-x-0 z-30 flex items-stretch bg-paper border-t border-ink-950 pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Tour navigation"
    >
      {tabs.map(({ key, label, icon: Icon, path }) => {
        const active = location.pathname === path;
        return (
          <button
            key={key}
            type="button"
            onClick={() => navigate(path)}
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
