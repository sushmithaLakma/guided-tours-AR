export interface City {
  id: string;
  name: string;
  country: string;
  blurb: string;
  gradient: string;
  /** real-world coordinates, used to find the nearest city from device geolocation */
  lat: number;
  lng: number;
}

export type TourPace = "leisurely" | "moderate" | "brisk";

export interface Stop {
  id: string;
  order: number;
  title: string;
  /** seconds into the tour's continuous audio track where this chapter begins */
  timestamp: number;
  /** chapter length in seconds */
  duration: number;
  teaser: string;
  transcript: string;
  /** position on the mock map, 0-100 as % of the map canvas */
  x: number;
  y: number;
  hasAR: boolean;
  arHint?: string;
  arLabels?: { x: number; y: number; label: string; detail: string }[];
  photo: string;
}

export interface Tour {
  id: string;
  cityId: string;
  title: string;
  tagline: string;
  gradient: string;
  distanceKm: number;
  totalDuration: number; // seconds, sum of stop durations
  pace: TourPace;
  rating: number;
  ratingCount: number;
  narrator: string;
  tags: string[];
  description: string;
  stops: Stop[];
}
