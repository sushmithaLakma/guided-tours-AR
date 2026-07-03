export interface FilterOption {
  key: string;
  label: string;
}

export default function FilterChipRow({
  options,
  active,
  onChange,
}: {
  options: FilterOption[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-3">
      {options.map((opt) => {
        const isActive = opt.key === active;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`shrink-0 border px-3.5 py-1.5 text-[12px] font-medium whitespace-nowrap ${
              isActive ? "bg-ink-950 text-paper border-ink-950" : "border-ink-950 text-ink-700"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
