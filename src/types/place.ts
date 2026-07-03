export type PlaceCategory = "restaurant" | "market";

export interface Place {
  id: string;
  cityId: string;
  name: string;
  category: PlaceCategory;
  blurb: string;
  tag: string;
  gradient: string;
  /** position on the city overview map, 0-100 as % of the map canvas */
  x: number;
  y: number;
}
