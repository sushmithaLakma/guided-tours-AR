export type PlaceCategory = "restaurant" | "market";

export interface Place {
  id: string;
  cityId: string;
  name: string;
  category: PlaceCategory;
  blurb: string;
  tag: string;
  gradient: string;
  rating: number;
  ratingCount: number;
  /** real-world coordinates, used to compute live distance from the traveller */
  lat: number;
  lng: number;
  /** position on the stylized city overview map, 0-100 as % of the map canvas */
  x: number;
  y: number;
}
