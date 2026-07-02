import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

export default function ScreenHeader({
  title,
  onBack,
  transparent,
  right,
}: {
  title?: string;
  onBack?: () => void;
  transparent?: boolean;
  right?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <header
      className={`sticky top-0 z-20 flex items-center gap-2 px-2 py-3 pt-[calc(env(safe-area-inset-top,0px)+10px)] ${
        transparent ? "" : "bg-paper/90 backdrop-blur border-b border-ink-200"
      }`}
    >
      <button
        type="button"
        onClick={() => (onBack ? onBack() : navigate(-1))}
        className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${
          transparent ? "bg-ink-950/40 text-ink-50 backdrop-blur" : "bg-ink-100 text-ink-800"
        }`}
        aria-label="Go back"
      >
        <ChevronLeft size={20} />
      </button>
      {title && (
        <h1 className={`flex-1 truncate text-[15px] font-semibold ${transparent ? "text-ink-50" : "text-ink-900"}`}>
          {title}
        </h1>
      )}
      {right}
    </header>
  );
}
