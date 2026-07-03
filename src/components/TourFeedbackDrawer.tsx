import { useState } from "react";
import { Star, X } from "lucide-react";
import { useUserData } from "../context/UserDataContext";

export default function TourFeedbackDrawer({
  tourId,
  tourTitle,
  open,
  onClose,
}: {
  tourId: string;
  tourTitle: string;
  open: boolean;
  onClose: () => void;
}) {
  const { setFeedback } = useUserData();
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");

  if (!open) return null;

  const save = () => {
    setFeedback(tourId, { rating, note });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-ink-950/50" />
      <div
        className="relative w-full max-w-[430px] bg-paper border-t border-ink-950 p-5 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] float-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-1">
          <p className="text-[11px] uppercase tracking-wide text-ink-500">Tour complete</p>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1 text-ink-500">
            <X size={18} />
          </button>
        </div>
        <h3 className="font-serif text-[19px] text-ink-950 mb-1">How was {tourTitle}?</h3>
        <p className="text-[12.5px] text-ink-600 mb-4">
          You've made it through every stop — a quick rating helps other solo travellers pick this one.
        </p>

        <div className="flex gap-1.5 mb-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className="h-11 w-11 flex items-center justify-center border border-ink-950"
            >
              <Star size={18} fill={n <= rating ? "currentColor" : "none"} className="text-ink-950" />
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What stood out? Anything worth telling other travellers?"
          rows={3}
          className="w-full border border-ink-950 bg-paper p-3 text-[13px] text-ink-950 placeholder:text-ink-400 focus:outline-none resize-none"
        />

        <div className="flex gap-2 mt-3">
          <button type="button" onClick={onClose} className="flex-1 border border-ink-950 text-ink-950 py-3 text-[13px] font-medium">
            Skip
          </button>
          <button
            type="button"
            onClick={save}
            disabled={rating === 0}
            className="flex-[2] bg-ink-950 text-paper py-3 text-[13px] font-medium disabled:opacity-40"
          >
            Save feedback
          </button>
        </div>
      </div>
    </div>
  );
}
