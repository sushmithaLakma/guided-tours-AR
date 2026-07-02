import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pause, Play, ScanLine, X } from "lucide-react";
import { getTourById } from "../data/tours";
import { usePlayer } from "../context/PlayerContext";

export default function ARScreen() {
  const { tourId, stopId } = useParams();
  const navigate = useNavigate();
  const player = usePlayer();
  const tour = getTourById(tourId ?? "");
  const stop = tour?.stops.find((s) => s.id === stopId);

  const [scanning, setScanning] = useState(true);
  const [activeLabel, setActiveLabel] = useState<number | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setScanning(false), 1600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      ?.getUserMedia?.({ video: { facingMode: "environment" } })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          setCameraReady(true);
        }
      })
      .catch(() => setCameraReady(false));
    return () => stream?.getTracks().forEach((tr) => tr.stop());
  }, []);

  if (!tour || !stop) return null;

  return (
    <div className="relative h-dvh bg-ink-950 text-paper overflow-hidden">
      <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 h-full w-full object-cover" />
      {!cameraReady && (
        <div className={`absolute inset-0 bg-gradient-to-br ${stop.photo} editorial-photo`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent,rgba(0,0,0,0.6))]" />
        </div>
      )}

      <div className="absolute inset-0 bg-black/10" />

      <div className="absolute top-0 inset-x-0 flex items-center justify-between p-4 pt-[calc(env(safe-area-inset-top,0px)+10px)]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-9 w-9 flex items-center justify-center border border-paper/50 bg-ink-950/40 backdrop-blur-sm"
          aria-label="Close AR view"
        >
          <X size={17} />
        </button>
        <span className="border border-paper/50 bg-ink-950/40 backdrop-blur-sm px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide">
          {stop.title}
        </span>
        <span className="w-9" />
      </div>

      {scanning ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-10 text-center">
          <div className="relative h-40 w-40">
            <div className="absolute inset-0 border border-paper/40" />
            <ScanLine className="absolute inset-0 m-auto text-paper animate-pulse" size={36} />
          </div>
          <p className="text-[13px] text-paper/85">{stop.arHint ?? "Point your camera at the landmark to reveal AR details."}</p>
        </div>
      ) : (
        <>
          {stop.arLabels?.map((label, i) => (
            <button
              key={label.label}
              type="button"
              onClick={() => setActiveLabel(activeLabel === i ? null : i)}
              className="absolute -translate-x-1/2 -translate-y-full float-in"
              style={{ left: `${label.x}%`, top: `${label.y}%`, animationDelay: `${i * 150}ms` }}
            >
              <span className="flex flex-col items-center">
                <span className="bg-paper text-ink-950 border border-ink-950 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide whitespace-nowrap">
                  {label.label}
                </span>
                <span className="h-3 w-px bg-paper/80" />
                <span className="h-2 w-2 bg-paper ring-2 ring-ink-950/40" />
              </span>
            </button>
          ))}

          {activeLabel !== null && stop.arLabels?.[activeLabel] && (
            <div className="absolute inset-x-4 bottom-28 bg-paper text-ink-950 border border-ink-950 p-4 float-in">
              <p className="text-[15px] font-serif">{stop.arLabels[activeLabel].label}</p>
              <p className="text-[12.5px] text-ink-600 mt-1">{stop.arLabels[activeLabel].detail}</p>
            </div>
          )}
        </>
      )}

      <div className="absolute bottom-0 inset-x-0 p-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center gap-3 border border-paper/40 bg-ink-950/50 backdrop-blur-sm px-3 py-2.5">
          <button
            type="button"
            onClick={player.toggle}
            className="h-9 w-9 shrink-0 flex items-center justify-center bg-paper text-ink-950"
            aria-label={player.isPlaying ? "Pause narration" : "Resume narration"}
          >
            {player.isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" className="ml-0.5" />}
          </button>
          <p className="text-[12.5px] text-paper/90 flex-1 truncate">Narration continues while you look around</p>
        </div>
      </div>
    </div>
  );
}
