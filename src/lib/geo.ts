const EARTH_RADIUS_KM = 6371;

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function kmToMiles(km: number): number {
  return km * 0.621371;
}

export function findNearest<T extends { lat: number; lng: number }>(
  lat: number,
  lng: number,
  candidates: T[]
): T {
  return candidates.reduce((closest, candidate) =>
    haversineKm(lat, lng, candidate.lat, candidate.lng) < haversineKm(lat, lng, closest.lat, closest.lng)
      ? candidate
      : closest
  );
}
