import { LayoutList, Map as MapIcon } from "lucide-react";

export default function MapListToggle({
  mode,
  onChange,
}: {
  mode: "map" | "list";
  onChange: (mode: "map" | "list") => void;
}) {
  return (
    <div className="inline-flex border border-ink-950 bg-paper overflow-hidden">
      <button
        type="button"
        onClick={() => onChange("map")}
        className={`flex items-center gap-1.5 pl-3.5 pr-4 py-2 text-[12px] font-medium uppercase tracking-wide ${
          mode === "map" ? "bg-ink-950 text-paper" : "text-ink-700"
        }`}
      >
        <MapIcon size={13} />
        Map
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        className={`flex items-center gap-1.5 pl-3.5 pr-4 py-2 text-[12px] font-medium uppercase tracking-wide border-l border-ink-950 ${
          mode === "list" ? "bg-ink-950 text-paper" : "text-ink-700"
        }`}
      >
        <LayoutList size={13} />
        List
      </button>
    </div>
  );
}
