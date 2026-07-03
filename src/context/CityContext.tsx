import { createContext, useContext, useState, type ReactNode } from "react";
import { cities } from "../data/cities";
import { findNearest } from "../lib/geo";

const STORAGE_KEY = "wayfare:selected-city:v1";

export interface GeoPoint {
  lat: number;
  lng: number;
}

interface CityContextValue {
  cityId: string;
  setCityId: (id: string) => void;
  userLocation: GeoPoint | null;
  locating: boolean;
  locationError: string | null;
  locateMe: () => void;
}

const CityContext = createContext<CityContextValue | null>(null);

export function CityProvider({ children }: { children: ReactNode }) {
  const [cityId, setCityIdState] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && cities.some((c) => c.id === stored) ? stored : cities[0].id;
  });
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const setCityId = (id: string) => {
    setCityIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      setLocationError("Location isn't available on this device.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(point);
        setLocating(false);
        const nearest = findNearest(point.lat, point.lng, cities);
        setCityId(nearest.id);
      },
      (error) => {
        setLocating(false);
        setLocationError(error.code === error.PERMISSION_DENIED ? "Location permission denied." : "Couldn't get your location.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  };

  return (
    <CityContext.Provider value={{ cityId, setCityId, userLocation, locating, locationError, locateMe }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used within CityProvider");
  return ctx;
}
