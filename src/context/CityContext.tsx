import { createContext, useContext, useState, type ReactNode } from "react";
import { cities } from "../data/cities";

const STORAGE_KEY = "wayfare:selected-city:v1";

interface CityContextValue {
  cityId: string;
  setCityId: (id: string) => void;
}

const CityContext = createContext<CityContextValue | null>(null);

export function CityProvider({ children }: { children: ReactNode }) {
  const [cityId, setCityIdState] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && cities.some((c) => c.id === stored) ? stored : cities[0].id;
  });

  const setCityId = (id: string) => {
    setCityIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  };

  return <CityContext.Provider value={{ cityId, setCityId }}>{children}</CityContext.Provider>;
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used within CityProvider");
  return ctx;
}
