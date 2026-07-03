/**
 * Deterministic real-photo URL for a given id (tour, stop, or place).
 * Uses Lorem Picsum's seeded endpoint so the same id always resolves to the
 * same photo, without needing to hand-curate a URL per piece of content.
 */
export function photoUrl(seed: string, size = 900): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}`;
}
