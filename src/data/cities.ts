import type { City } from "../types/tour";

export const cities: City[] = [
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    blurb: "Hills, tiles & fado",
    gradient: "from-terracotta-500 to-terracotta-300",
    lat: 38.7139,
    lng: -9.1394,
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    blurb: "Temples & bamboo groves",
    gradient: "from-sage-600 to-sage-400",
    lat: 35.0116,
    lng: 135.7681,
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    blurb: "Ruins & piazzas",
    gradient: "from-sky-600 to-sky-500",
    lat: 41.8933,
    lng: 12.4829,
  },
];
