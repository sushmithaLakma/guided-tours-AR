import { useState } from "react";
import { MessageSquarePlus, Star, X } from "lucide-react";
import { useUserData } from "../context/UserDataContext";

export default function FeedbackControl({ stopId, stopTitle }: { stopId: string; stopTitle: string }) {
  const { getFeedback, setFeedback } = useUserData();
  const existing = getFeedback(stopId);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [note, setNote] = useState(existing?.note ?? "");

  const openSheet = () => {
    setRating(existing?.rating ?? 0);
    setNote(existing?.note ?? "");
    setOpen(true);
  };

  const save = () => {
    setFeedback(stopId, { rating, note });
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          openSheet();
        }}
        className="inline-flex items-center gap-1 text-[11px] text-ink-500 uppercase tracking-wide"
      >
        <MessageSquarePlus size={13} />
        {existing ? `Rated ${existing.rating}/5` : "Feedback"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-ink-950/50" />
          <div
            className="relative w-full max-w-[430px] bg-paper border-t border-ink-950 p-5 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] float-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-ink-500">Feedback</p>
                <h3 className="font-serif text-[17px] text-ink-950 mt-0.5">{stopTitle}</h3>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="p-1 text-ink-500">
                <X size={18} />
              </button>
            </div>

            <div className="flex gap-1.5 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  className="h-10 w-10 flex items-center justify-center border border-ink-950"
                >
                  <Star size={16} fill={n <= rating ? "currentColor" : "none"} className="text-ink-950" />
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

            <button
              type="button"
              onClick={save}
              disabled={rating === 0}
              className="w-full mt-3 bg-ink-950 text-paper py-3 text-[13px] font-medium disabled:opacity-40"
            >
              Save feedback
            </button>
          </div>
        </div>
      )}
    </>
  );
}
