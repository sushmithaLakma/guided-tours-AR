import { useState } from "react";
import { Phone, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const digits = mobile.replace(/\D/g, "");
  const canContinue = name.trim().length > 0 && digits.length >= 7;

  const handleContinue = () => {
    if (!canContinue) return;
    signUp({ name: name.trim(), mobile: digits });
  };

  return (
    <div className="relative h-dvh flex flex-col bg-paper px-6 pt-[calc(env(safe-area-inset-top,0px)+64px)] pb-[calc(env(safe-area-inset-bottom,0px)+32px)]">
      <div className="flex-1">
        <p className="text-[11px] uppercase tracking-wide text-ink-500">Wayfare</p>
        <h1 className="font-serif text-[34px] leading-[1.05] text-ink-950 mt-2">
          Your city,
          <br />
          narrated.
        </h1>
        <p className="text-[13px] text-ink-600 mt-3 max-w-[32ch]">
          Sign up with your mobile number to save favourites, feedback and progress across tours.
        </p>

        <div className="mt-10 flex flex-col gap-4">
          <label className="block">
            <span className="text-[11px] uppercase tracking-wide text-ink-500">Name</span>
            <div className="flex items-center gap-2 mt-1.5 border border-ink-950 bg-paper px-3 py-3">
              <User size={15} className="text-ink-400 shrink-0" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                className="flex-1 min-w-0 bg-transparent text-[14px] text-ink-950 placeholder:text-ink-400 focus:outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-[11px] uppercase tracking-wide text-ink-500">Mobile number</span>
            <div className="flex items-center gap-2 mt-1.5 border border-ink-950 bg-paper px-3 py-3">
              <Phone size={15} className="text-ink-400 shrink-0" />
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                type="tel"
                inputMode="tel"
                placeholder="+1 555 000 1234"
                autoComplete="tel"
                className="flex-1 min-w-0 bg-transparent text-[14px] text-ink-950 placeholder:text-ink-400 focus:outline-none"
              />
            </div>
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!canContinue}
        className="w-full bg-ink-950 text-paper py-3.5 text-[13px] font-medium uppercase tracking-wide disabled:opacity-40"
      >
        Continue
      </button>
      <p className="text-[10.5px] text-ink-400 text-center mt-3">
        We only use this to personalise your trip — no verification code in this demo.
      </p>
    </div>
  );
}
