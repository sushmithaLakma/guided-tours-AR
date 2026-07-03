import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, Map as MapIcon, Pause, Play, Rewind, Sparkles, FastForward, SkipBack, SkipForward } from "lucide-react";
import { getTourById } from "../data/tours";
import { PLAYBACK_SPEEDS, usePlayer } from "../context/PlayerContext";
import { useUserData } from "../context/UserDataContext";
import { formatTime } from "../lib/format";
import ScreenHeader from "../components/ScreenHeader";
import BottomNav from "../components/BottomNav";
import PhotoBlock from "../components/PhotoBlock";
import TourFeedbackDrawer from "../components/TourFeedbackDrawer";

export default function PlayerScreen() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const player = usePlayer();
  const userData = useUserData();
  const routeTour = getTourById(tourId ?? "");
  const [feedbackDismissed, setFeedbackDismissed] = useState(false);

  useEffect(() => {
    if (routeTour && player.tour?.id !== routeTour.id) {
      player.loadTour(routeTour, { autoplay: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId]);

  const tour = player.tour ?? routeTour;
  const { elapsed, isPlaying, speed, currentStop, currentStopIndex, hasFinished } = player;

  useEffect(() => {
    if (currentStop) userData.markVisited(currentStop.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStop?.id]);

  const allStopsVisited = tour ? userData.visitedCountForStops(tour.stops.map((s) => s.id)) === tour.stops.length : false;
  const showFeedbackDrawer = Boolean(
    tour && allStopsVisited && !feedbackDismissed && !userData.getFeedback(tour.id)
  );

  if (!tour) return null;

  return (
    <div className="relative h-dvh flex flex-col bg-paper text-ink-950">
      <ScreenHeader
        title={tour.title}
        right={
          <button
            type="button"
            onClick={() => navigate(`/tour/${tour.id}/map`)}
            className="h-9 w-9 shrink-0 flex items-center justify-center border border-ink-950 bg-ink-100"
            aria-label="Open map"
          >
            <MapIcon size={16} />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <PhotoBlock
          gradient={currentStop?.photo ?? tour.gradient}
          className="aspect-square relative flex flex-col justify-end p-5"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent" />
          {hasFinished && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-paper/95 text-center px-8">
              <p className="font-serif text-2xl text-ink-950">Tour complete</p>
              <p className="text-[13px] text-ink-600">
                Take your time getting back — check the map whenever you're ready.
              </p>
              <button
                type="button"
                onClick={() => navigate(`/tour/${tour.id}/map`)}
                className="mt-3 bg-ink-950 text-paper px-5 py-2.5 text-[13px] font-medium"
              >
                View route back
              </button>
            </div>
          )}
          <div className="relative z-10">
            <p className="text-[11px] font-medium tracking-wide text-ink-50 uppercase mb-1">
              Stop {currentStopIndex + 1} of {tour.stops.length}
            </p>
            <h2 className="font-serif text-[26px] leading-tight text-ink-50">{currentStop?.title ?? tour.title}</h2>
            {currentStop?.hasAR && (
              <button
                type="button"
                onClick={() => navigate(`/tour/${tour.id}/ar/${currentStop.id}`)}
                className="mt-3 inline-flex items-center gap-1.5 bg-paper text-ink-950 border border-ink-950 pl-2.5 pr-3.5 py-1.5 text-[12.5px] font-medium"
              >
                <Sparkles size={14} />
                View in AR
              </button>
            )}
          </div>
        </PhotoBlock>

        <div className="px-6 pt-6">
          <Scrubber />
          <div className="flex justify-between text-[11px] font-mono text-ink-500 mt-1.5">
            <span>{formatTime(elapsed)}</span>
            <span>-{formatTime(tour.totalDuration - elapsed)}</span>
          </div>
        </div>

        <div className="px-6 pt-6 flex items-center justify-center gap-5">
          <button type="button" onClick={player.previousStop} aria-label="Previous stop" className="text-ink-700 p-2">
            <SkipBack size={20} />
          </button>
          <button
            type="button"
            onClick={() => player.seekBy(-15)}
            aria-label="Back 15 seconds"
            className="text-ink-700 p-2 relative"
          >
            <Rewind size={20} />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-semibold">15</span>
          </button>
          <button
            type="button"
            onClick={player.toggle}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="h-16 w-16 bg-ink-950 text-paper flex items-center justify-center active:bg-ink-800 transition-colors"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          <button
            type="button"
            onClick={() => player.seekBy(15)}
            aria-label="Forward 15 seconds"
            className="text-ink-700 p-2 relative"
          >
            <FastForward size={20} />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-semibold">15</span>
          </button>
          <button type="button" onClick={player.nextStop} aria-label="Next stop" className="text-ink-700 p-2">
            <SkipForward size={20} />
          </button>
        </div>

        <div className="px-6 pt-7">
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-500 mb-2">Playback speed</p>
          <div className="flex border border-ink-950">
            {PLAYBACK_SPEEDS.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => player.setSpeed(s)}
                className={`flex-1 py-2 text-[13px] font-medium transition-colors ${i > 0 ? "border-l border-ink-950" : ""} ${
                  speed === s ? "bg-ink-950 text-paper" : "text-ink-700"
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>

        {currentStop && (
          <div className="px-6 pt-7">
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-500 mb-2">Follow along</p>
            <p className="text-[14px] leading-relaxed text-ink-700">{currentStop.transcript}</p>
          </div>
        )}

        <div className="px-6 pt-7 pb-6">
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-500 mb-1">Chapters — skip anytime</p>
          <div className="border-t border-ink-950">
            {tour.stops.map((stop, i) => {
              const isCurrent = i === currentStopIndex;
              const visited = userData.isVisited(stop.id);
              return (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => player.skipToStop(stop.id)}
                  className="flex items-center gap-3 py-3 text-left w-full border-b border-ink-200"
                >
                  <span className={`text-[12px] font-mono w-5 shrink-0 ${isCurrent ? "text-ink-950 font-semibold" : "text-ink-400"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`flex-1 text-[13.5px] truncate ${isCurrent ? "font-serif text-ink-950" : "text-ink-700"}`}>
                    {stop.title}
                  </span>
                  {visited && <Check size={13} strokeWidth={2.5} className="text-ink-950 shrink-0" />}
                  {stop.hasAR && <Sparkles size={12} className="text-ink-500 shrink-0" />}
                  <span className="text-[11px] font-mono text-ink-400 shrink-0">{formatTime(stop.timestamp)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNav />

      <TourFeedbackDrawer
        tourId={tour.id}
        tourTitle={tour.title}
        open={showFeedbackDrawer}
        onClose={() => setFeedbackDismissed(true)}
      />
    </div>
  );
}

function Scrubber() {
  const { tour, elapsed, seekTo } = usePlayer();
  if (!tour) return null;
  const pct = tour.totalDuration > 0 ? (elapsed / tour.totalDuration) * 100 : 0;

  return (
    <div className="relative py-2">
      <div className="relative h-[2px] bg-ink-200">
        <div className="absolute inset-y-0 left-0 bg-ink-950" style={{ width: `${pct}%` }} />
        {tour.stops.map((stop) => (
          <span
            key={stop.id}
            className="absolute top-1/2 -translate-y-1/2 h-2 w-px bg-ink-950/40"
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
        className="absolute inset-x-0 top-0 h-5 w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rotate-45 [&::-webkit-slider-thumb]:bg-ink-950 [&::-webkit-slider-thumb]:mt-[-6px] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rotate-45 [&::-moz-range-thumb]:bg-ink-950 [&::-moz-range-thumb]:border-0"
        aria-label="Seek within tour audio"
      />
    </div>
  );
}
