import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface MemoryPhoto {
  id: string;
  dataUrl: string;
  caption?: string;
  createdAt: string;
}

export interface Feedback {
  rating: number;
  note: string;
}

interface StoredShape {
  favoriteTours: string[];
  favoriteStops: string[];
  visitedStops: string[];
  feedback: Record<string, Feedback>;
  memories: Record<string, MemoryPhoto[]>;
}

interface UserDataContextValue {
  isFavoriteTour: (tourId: string) => boolean;
  toggleFavoriteTour: (tourId: string) => void;
  isFavoriteStop: (stopId: string) => boolean;
  toggleFavoriteStop: (stopId: string) => void;
  isVisited: (stopId: string) => boolean;
  markVisited: (stopId: string) => void;
  getFeedback: (stopId: string) => Feedback | undefined;
  setFeedback: (stopId: string, feedback: Feedback) => void;
  getMemories: (stopId: string) => MemoryPhoto[];
  addMemory: (stopId: string, dataUrl: string, caption?: string) => void;
  removeMemory: (stopId: string, memoryId: string) => void;
  visitedCountForStops: (stopIds: string[]) => number;
}

const STORAGE_KEY = "wayfare:userdata:v1";

function loadInitial(): StoredShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw);
    return {
      favoriteTours: parsed.favoriteTours ?? [],
      favoriteStops: parsed.favoriteStops ?? [],
      visitedStops: parsed.visitedStops ?? [],
      feedback: parsed.feedback ?? {},
      memories: parsed.memories ?? {},
    };
  } catch {
    return { favoriteTours: [], favoriteStops: [], visitedStops: [], feedback: {}, memories: {} };
  }
}

const UserDataContext = createContext<UserDataContextValue | null>(null);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredShape>(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // storage full or unavailable — memories in particular can be large; fail silently
    }
  }, [data]);

  const favoriteTourSet = useMemo(() => new Set(data.favoriteTours), [data.favoriteTours]);
  const favoriteStopSet = useMemo(() => new Set(data.favoriteStops), [data.favoriteStops]);
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

  const isFavoriteStop = useCallback((stopId: string) => favoriteStopSet.has(stopId), [favoriteStopSet]);
  const toggleFavoriteStop = useCallback((stopId: string) => {
    setData((prev) => {
      const has = prev.favoriteStops.includes(stopId);
      return {
        ...prev,
        favoriteStops: has ? prev.favoriteStops.filter((id) => id !== stopId) : [...prev.favoriteStops, stopId],
      };
    });
  }, []);

  const isVisited = useCallback((stopId: string) => visitedStopSet.has(stopId), [visitedStopSet]);
  const markVisited = useCallback((stopId: string) => {
    setData((prev) => (prev.visitedStops.includes(stopId) ? prev : { ...prev, visitedStops: [...prev.visitedStops, stopId] }));
  }, []);

  const getFeedback = useCallback((stopId: string) => data.feedback[stopId], [data.feedback]);
  const setFeedback = useCallback((stopId: string, feedback: Feedback) => {
    setData((prev) => ({ ...prev, feedback: { ...prev.feedback, [stopId]: feedback } }));
  }, []);

  const getMemories = useCallback((stopId: string) => data.memories[stopId] ?? [], [data.memories]);
  const addMemory = useCallback((stopId: string, dataUrl: string, caption?: string) => {
    const memory: MemoryPhoto = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, dataUrl, caption, createdAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, memories: { ...prev.memories, [stopId]: [...(prev.memories[stopId] ?? []), memory] } }));
  }, []);
  const removeMemory = useCallback((stopId: string, memoryId: string) => {
    setData((prev) => ({
      ...prev,
      memories: { ...prev.memories, [stopId]: (prev.memories[stopId] ?? []).filter((m) => m.id !== memoryId) },
    }));
  }, []);

  const visitedCountForStops = useCallback((stopIds: string[]) => stopIds.filter((id) => visitedStopSet.has(id)).length, [visitedStopSet]);

  const value: UserDataContextValue = {
    isFavoriteTour,
    toggleFavoriteTour,
    isFavoriteStop,
    toggleFavoriteStop,
    isVisited,
    markVisited,
    getFeedback,
    setFeedback,
    getMemories,
    addMemory,
    removeMemory,
    visitedCountForStops,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData must be used within UserDataProvider");
  return ctx;
}
