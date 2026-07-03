import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface Feedback {
  rating: number;
  note: string;
}

interface StoredShape {
  favoriteTours: string[];
  visitedStops: string[];
  feedback: Record<string, Feedback>;
}

interface UserDataContextValue {
  isFavoriteTour: (tourId: string) => boolean;
  toggleFavoriteTour: (tourId: string) => void;
  isVisited: (stopId: string) => boolean;
  markVisited: (stopId: string) => void;
  getFeedback: (tourId: string) => Feedback | undefined;
  setFeedback: (tourId: string, feedback: Feedback) => void;
  visitedCountForStops: (stopIds: string[]) => number;
}

const STORAGE_KEY = "wayfare:userdata:v2";

function loadInitial(): StoredShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw);
    return {
      favoriteTours: parsed.favoriteTours ?? [],
      visitedStops: parsed.visitedStops ?? [],
      feedback: parsed.feedback ?? {},
    };
  } catch {
    return { favoriteTours: [], visitedStops: [], feedback: {} };
  }
}

const UserDataContext = createContext<UserDataContextValue | null>(null);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredShape>(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // storage full or unavailable — fail silently
    }
  }, [data]);

  const favoriteTourSet = useMemo(() => new Set(data.favoriteTours), [data.favoriteTours]);
  const visitedStopSet = useMemo(() => new Set(data.visitedStops), [data.visitedStops]);

  const isFavoriteTour = useCallback((tourId: string) => favoriteTourSet.has(tourId), [favoriteTourSet]);
  const toggleFavoriteTour = useCallback((tourId: string) => {
    setData((prev) => {
      const has = prev.favoriteTours.includes(tourId);
      return {
        ...prev,
        favoriteTours: has ? prev.favoriteTours.filter((id) => id !== tourId) : [...prev.favoriteTours, tourId],
      };
    });
  }, []);

  const isVisited = useCallback((stopId: string) => visitedStopSet.has(stopId), [visitedStopSet]);
  const markVisited = useCallback((stopId: string) => {
    setData((prev) => (prev.visitedStops.includes(stopId) ? prev : { ...prev, visitedStops: [...prev.visitedStops, stopId] }));
  }, []);

  const getFeedback = useCallback((tourId: string) => data.feedback[tourId], [data.feedback]);
  const setFeedback = useCallback((tourId: string, feedback: Feedback) => {
    setData((prev) => ({ ...prev, feedback: { ...prev.feedback, [tourId]: feedback } }));
  }, []);

  const visitedCountForStops = useCallback((stopIds: string[]) => stopIds.filter((id) => visitedStopSet.has(id)).length, [visitedStopSet]);

  const value: UserDataContextValue = {
    isFavoriteTour,
    toggleFavoriteTour,
    isVisited,
    markVisited,
    getFeedback,
    setFeedback,
    visitedCountForStops,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData must be used within UserDataProvider");
  return ctx;
}
