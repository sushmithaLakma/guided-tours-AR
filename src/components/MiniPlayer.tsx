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
      className="absolute left-0 right-0 bottom-[60px] z-30 mx-2 mb-2 rounded-2xl bg-ink-900 text-left shadow-card overflow-hidden active:scale-[0.99] transition-transform"
      aria-label="Open now-playing screen"
    >
      <div className="h-1 bg-ink-700 w-full">
        <div className="h-full bg-terracotta-400" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div
          className={`h-9 w-9 shrink-0 rounded-full bg-gradient-to-br ${tour.gradient} flex items-center justify-center`}
        >
          <span className="text-[10px] font-serif text-ink-950/70">
            {isPlaying ? "♪" : "❚❚"}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-ink-50 truncate">
            {currentStop ? currentStop.title : tour.title}
          </p>
          <p className="text-[11px] text-ink-400 truncate">{tour.title}</p>
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
          className="h-8 w-8 shrink-0 rounded-full bg-terracotta-500 flex items-center justify-center text-ink-950"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" className="ml-0.5" />}
        </div>
      </div>
    </button>
  );
}
