import { useNavigate } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

export default function MiniPlayer() {
  const { tour, currentStop, isPlaying, toggle, progress } = usePlayer();
  const navigate = useNavigate();

  if (!tour) return null;

  return (
    <button
      type="button"
      onClick={() => navigate(`/tour/${tour.id}/listen`)}
      className="absolute left-0 right-0 bottom-[57px] z-30 bg-paper border-t border-x border-ink-950 text-left overflow-hidden"
      aria-label="Open now-playing screen"
    >
      <div className="h-[2px] bg-ink-200 w-full">
        <div className="h-full bg-ink-950" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div className={`h-9 w-9 shrink-0 bg-gradient-to-br ${tour.gradient} editorial-photo border border-ink-950`} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-ink-950 truncate">
            {currentStop ? currentStop.title : tour.title}
          </p>
          <p className="text-[11px] text-ink-500 truncate uppercase tracking-wide">{tour.title}</p>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              toggle();
            }
          }}
          className="h-8 w-8 shrink-0 flex items-center justify-center bg-ink-950 text-paper"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
        </div>
      </div>
    </button>
  );
}
