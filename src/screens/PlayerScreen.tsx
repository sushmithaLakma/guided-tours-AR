import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Map as MapIcon, Pause, Play, Rewind, Sparkles, FastForward, SkipBack, SkipForward } from "lucide-react";
import { getTourById } from "../data/tours";
import { PLAYBACK_SPEEDS, usePlayer } from "../context/PlayerContext";
import { formatTime } from "../lib/format";
import ScreenHeader from "../components/ScreenHeader";
import BottomNav from "../components/BottomNav";

export default function PlayerScreen() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const player = usePlayer();
  const routeTour = getTourById(tourId ?? "");

  useEffect(() => {
    if (routeTour && player.tour?.id !== routeTour.id) {
      player.loadTour(routeTour, { autoplay: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId]);

  const tour = player.tour ?? routeTour;
  if (!tour) return null;

  const { elapsed, isPlaying, speed, currentStop, currentStopIndex, hasFinished } = player;

  return (
    <div className="relative h-dvh flex flex-col bg-ink-950 text-ink-50">
      <ScreenHeader
        transparent
        title={tour.title}
        right={
          <button
            type="button"
            onClick={() => navigate(`/tour/${tour.id}/map`)}
            className="h-9 w-9 shrink-0 rounded-full bg-ink-950/40 backdrop-blur flex items-center justify-center"
            aria-label="Open map"
          >
            <MapIcon size={17} />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <div
          className={`mx-5 mt-2 aspect-square rounded-[28px] bg-gradient-to-br ${
            currentStop?.photo ?? tour.gradient
          } relative flex flex-col justify-end p-5 overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-ink-950/10" />
          {hasFinished && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-950/70 backdrop-blur-sm text-center px-8">
              <p className="font-serif text-2xl">Tour complete</p>
              <p className="text-[13px] text-ink-200">
                Take your time getting back — check the map whenever you're ready.
              </p>
              <button
                type="button"
                onClick={() => navigate(`/tour/${tour.id}/map`)}
                className="mt-3 rounded-full bg-white text-ink-950 px-5 py-2.5 text-[13px] font-medium"
              >
                View route back
              </button>
            </div>
          )}
          <div className="relative z-10">
            <p className="text-[11px] font-semibold tracking-wide text-white/80 uppercase mb-1">
              Stop {currentStopIndex + 1} of {tour.stops.length}
            </p>
            <h2 className="font-serif text-[26px] leading-tight text-white drop-shadow-sm">
              {currentStop?.title ?? tour.title}
            </h2>
            {currentStop?.hasAR && (
              <button
                type="button"
                onClick={() => navigate(`/tour/${tour.id}/ar/${currentStop.id}`)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sky-500 text-white pl-2.5 pr-3.5 py-1.5 text-[12.5px] font-medium"
              >
                <Sparkles size={14} />
                View in AR
              </button>
            )}
          </div>
        </div>

        <div className="px-6 pt-6">
          <Scrubber />
          <div className="flex justify-between text-[11px] font-mono text-ink-400 mt-1.5">
            <span>{formatTime(elapsed)}</span>
            <span>-{formatTime(tour.totalDuration - elapsed)}</span>
          </div>
        </div>

        <div className="px-6 pt-6 flex items-center justify-center gap-5">
          <button type="button" onClick={player.previousStop} aria-label="Previous stop" className="text-ink-300 p-2">
            <SkipBack size={22} />
          </button>
          <button
            type="button"
            onClick={() => player.seekBy(-15)}
            aria-label="Back 15 seconds"
            className="text-ink-300 p-2 relative"
          >
            <Rewind size={22} />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-semibold">15</span>
          </button>
          <button
            type="button"
            onClick={player.toggle}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="h-16 w-16 rounded-full bg-terracotta-500 text-ink-950 flex items-center justify-center shadow-float active:scale-95 transition-transform"
          >
            {isPlaying ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" className="ml-1" />}
          </button>
          <button
            type="button"
            onClick={() => player.seekBy(15)}
            aria-label="Forward 15 seconds"
            className="text-ink-300 p-2 relative"
          >
            <FastForward size={22} />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-semibold">15</span>
          </button>
          <button type="button" onClick={player.nextStop} aria-label="Next stop" className="text-ink-300 p-2">
            <SkipForward size={22} />
          </button>
        </div>

        <div className="px-6 pt-7">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400 mb-2">Playback speed</p>
          <div className="flex gap-2">
            {PLAYBACK_SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => player.setSpeed(s)}
                className={`flex-1 rounded-xl py-2 text-[13px] font-medium transition-colors ${
                  speed === s ? "bg-terracotta-500 text-ink-950" : "bg-ink-900 text-ink-300"
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>

        {currentStop && (
          <div className="px-6 pt-7">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400 mb-2">Follow along</p>
            <p className="text-[14px] leading-relaxed text-ink-200">{currentStop.transcript}</p>
          </div>
        )}

        <div className="px-6 pt-7">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400 mb-2">Chapters — skip anytime</p>
          <div className="flex flex-col gap-1 rounded-2xl bg-ink-900 p-1.5">
            {tour.stops.map((stop, i) => {
              const isCurrent = i === currentStopIndex;
              return (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => player.skipToStop(stop.id)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    isCurrent ? "bg-ink-800" : "active:bg-ink-800/60"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                      isCurrent ? "bg-terracotta-400" : "bg-ink-600"
                    }`}
                  />
                  <span className={`flex-1 text-[13px] truncate ${isCurrent ? "text-terracotta-300" : "text-ink-200"}`}>
                    {stop.title}
                  </span>
                  {stop.hasAR && <Sparkles size={12} className="text-sky-500 shrink-0" />}
                  <span className="text-[11px] font-mono text-ink-500 shrink-0">{formatTime(stop.timestamp)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function Scrubber() {
  const { tour, elapsed, seekTo } = usePlayer();
  if (!tour) return null;
  const pct = tour.totalDuration > 0 ? (elapsed / tour.totalDuration) * 100 : 0;

  return (
    <div className="relative py-2">
      <div className="relative h-1.5 rounded-full bg-ink-700">
        <div className="absolute inset-y-0 left-0 rounded-full bg-terracotta-400" style={{ width: `${pct}%` }} />
        {tour.stops.map((stop) => (
          <span
            key={stop.id}
            className="absolute top-1/2 -translate-y-1/2 h-2.5 w-[2px] bg-ink-950/50"
            style={{ left: `${(stop.timestamp / tour.totalDuration) * 100}%` }}
            aria-hidden
          />
        ))}
      </div>
      <input
        type="range"
        min={0}
        max={tour.totalDuration}
        step={1}
        value={elapsed}
        onChange={(e) => seekTo(Number(e.target.value))}
        className="absolute inset-x-0 top-0 h-5 w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-terracotta-400 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:mt-[-7px] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-terracotta-400 [&::-moz-range-thumb]:border-0"
        aria-label="Seek within tour audio"
      />
    </div>
  );
}
