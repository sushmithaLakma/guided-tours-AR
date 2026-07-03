import { ArrowLeft } from "lucide-react";
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
  const buttonClass = transparent
    ? "bg-ink-950/45 text-ink-50 border-ink-50/40 backdrop-blur-sm"
    : "bg-ink-100 text-ink-950 border-ink-950";

  return (
    <header
      className={`sticky top-0 z-20 flex items-center gap-2 px-4 py-3 pt-[calc(env(safe-area-inset-top,0px)+12px)] ${
        transparent ? "" : "bg-paper border-b border-ink-950"
      }`}
    >
      <button
        type="button"
        onClick={() => (onBack ? onBack() : navigate(-1))}
        className={`h-9 w-9 shrink-0 flex items-center justify-center border ${buttonClass}`}
        aria-label="Go back"
      >
        <ArrowLeft size={17} />
      </button>
      {title && (
        <h1
          className={`flex-1 truncate text-[13px] font-medium uppercase tracking-wide ${
            transparent ? "text-ink-50" : "text-ink-900"
          }`}
        >
          {title}
        </h1>
      )}
      {!title && <span className="flex-1" />}
      {right}
    </header>
  );
}
