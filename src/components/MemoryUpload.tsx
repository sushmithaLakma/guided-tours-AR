import { useRef } from "react";
import { Camera, X } from "lucide-react";
import { useUserData } from "../context/UserDataContext";

export default function MemoryUpload({ stopId }: { stopId: string }) {
  const { getMemories, addMemory, removeMemory } = useUserData();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const memories = getMemories(stopId);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") addMemory(stopId, reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {memories.map((m) => (
        <div key={m.id} className="relative h-14 w-14 shrink-0 border border-ink-950">
          <img src={m.dataUrl} alt="Your memory photo" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeMemory(stopId, m.id);
            }}
            aria-label="Remove memory photo"
            className="absolute -top-2 -right-2 h-5 w-5 bg-ink-950 text-paper flex items-center justify-center"
          >
            <X size={11} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className="h-14 w-14 shrink-0 border border-dashed border-ink-500 flex flex-col items-center justify-center gap-0.5 text-ink-500"
        aria-label="Add a memory photo"
      >
        <Camera size={16} />
        <span className="text-[8px] uppercase tracking-wide">Add</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
