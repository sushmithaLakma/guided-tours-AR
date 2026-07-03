import { LocateFixed, Minus, Plus } from "lucide-react";

export default function MapZoomControls({
  zoom,
  setZoom,
  minZoom = 1,
  maxZoom = 2.2,
  step = 0.4,
}: {
  zoom: number;
  setZoom: (updater: (z: number) => number) => void;
  minZoom?: number;
  maxZoom?: number;
  step?: number;
}) {
  return (
    <div className="absolute right-3 top-3 flex flex-col gap-2">
      <button
        type="button"
        disabled={zoom >= maxZoom}
        className="h-10 w-10 flex items-center justify-center bg-paper border border-ink-950 shadow-float disabled:opacity-40"
        onClick={() => setZoom((z) => Math.min(z + step, maxZoom))}
        aria-label="Zoom in"
      >
        <Plus size={16} />
      </button>
      <button
        type="button"
        disabled={zoom <= minZoom}
        className="h-10 w-10 flex items-center justify-center bg-paper border border-ink-950 shadow-float disabled:opacity-40"
        onClick={() => setZoom((z) => Math.max(z - step, minZoom))}
        aria-label="Zoom out"
      >
        <Minus size={16} />
      </button>
      <button
        type="button"
        className="h-10 w-10 flex items-center justify-center bg-paper border border-ink-950 shadow-float"
        onClick={() => setZoom(() => minZoom)}
        aria-label="Recenter"
      >
        <LocateFixed size={16} />
      </button>
    </div>
  );
}
