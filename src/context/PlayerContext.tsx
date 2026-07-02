import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Stop, Tour } from "../types/tour";

export const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

interface PlayerState {
  tour: Tour | null;
  elapsed: number;
  isPlaying: boolean;
  speed: PlaybackSpeed;
  currentStop: Stop | null;
  currentStopIndex: number;
  progress: number; // 0-1 within the whole tour
  hasFinished: boolean;
}

interface PlayerContextValue extends PlayerState {
  loadTour: (tour: Tour, opts?: { autoplay?: boolean; startAt?: number }) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seekTo: (seconds: number) => void;
  seekBy: (deltaSeconds: number) => void;
  skipToStop: (stopId: string) => void;
  nextStop: () => void;
  previousStop: () => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  exitTour: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [tour, setTour] = useState<Tour | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState<PlaybackSpeed>(1);
  const [hasFinished, setHasFinished] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying || !tour) return;

    const tick = (now: number) => {
      if (lastTickRef.current == null) lastTickRef.current = now;
      const deltaSec = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setElapsed((prev) => {
        const next = prev + deltaSec * speed;
        if (next >= tour.totalDuration) {
          setIsPlaying(false);
          setHasFinished(true);
          return tour.totalDuration;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTickRef.current = null;
    };
  }, [isPlaying, tour, speed]);

  const loadTour = useCallback((newTour: Tour, opts?: { autoplay?: boolean; startAt?: number }) => {
    setTour(newTour);
    setElapsed(opts?.startAt ?? 0);
    setHasFinished(false);
    setIsPlaying(opts?.autoplay ?? false);
  }, []);

  const play = useCallback(() => {
    if (!tour) return;
    setHasFinished(false);
    if (elapsed >= tour.totalDuration) setElapsed(0);
    setIsPlaying(true);
  }, [tour, elapsed]);

  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying((p) => !p), []);

  const seekTo = useCallback(
    (seconds: number) => {
      if (!tour) return;
      const clamped = Math.min(Math.max(seconds, 0), tour.totalDuration);
      setElapsed(clamped);
      setHasFinished(clamped >= tour.totalDuration);
    },
    [tour]
  );

  const seekBy = useCallback((deltaSeconds: number) => {
    setElapsed((prev) => {
      if (!tour) return prev;
      return Math.min(Math.max(prev + deltaSeconds, 0), tour.totalDuration);
    });
  }, [tour]);

  const currentStopIndex = useMemo(() => {
    if (!tour) return -1;
    let idx = 0;
    for (let i = 0; i < tour.stops.length; i++) {
      if (elapsed >= tour.stops[i].timestamp) idx = i;
    }
    return idx;
  }, [tour, elapsed]);

  const currentStop = tour ? tour.stops[currentStopIndex] ?? null : null;

  const skipToStop = useCallback(
    (stopId: string) => {
      if (!tour) return;
      const stop = tour.stops.find((s) => s.id === stopId);
      if (!stop) return;
      setElapsed(stop.timestamp);
      setHasFinished(false);
    },
    [tour]
  );

  const nextStop = useCallback(() => {
    if (!tour) return;
    const next = tour.stops[currentStopIndex + 1];
    if (next) {
      setElapsed(next.timestamp);
      setHasFinished(false);
    } else {
      setElapsed(tour.totalDuration);
      setHasFinished(true);
      setIsPlaying(false);
    }
  }, [tour, currentStopIndex]);

  const previousStop = useCallback(() => {
    if (!tour) return;
    const current = tour.stops[currentStopIndex];
    // if we're more than 4s into the current stop, restart it; else go to previous
    if (current && elapsed - current.timestamp > 4 && currentStopIndex >= 0) {
      setElapsed(current.timestamp);
      return;
    }
    const prev = tour.stops[currentStopIndex - 1];
    setElapsed(prev ? prev.timestamp : 0);
  }, [tour, currentStopIndex, elapsed]);

  const setSpeed = useCallback((s: PlaybackSpeed) => setSpeedState(s), []);

  const exitTour = useCallback(() => {
    setIsPlaying(false);
    setTour(null);
    setElapsed(0);
    setHasFinished(false);
  }, []);

  const progress = tour && tour.totalDuration > 0 ? elapsed / tour.totalDuration : 0;

  const value: PlayerContextValue = {
    tour,
    elapsed,
    isPlaying,
    speed,
    currentStop,
    currentStopIndex,
    progress,
    hasFinished,
    loadTour,
    play,
    pause,
    toggle,
    seekTo,
    seekBy,
    skipToStop,
    nextStop,
    previousStop,
    setSpeed,
    exitTour,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
