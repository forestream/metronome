"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Metronome } from "@forestream/metronome";

export default function Home() {
  const [isOscillating, setIsOscillating] = useState(false);
  const [bpm, setBpm] = useState(72);
  const [fps, setFps] = useState(0);
  const metronome = useMemo(() => new Metronome(bpm), [bpm]);

  const stopMetronome = useCallback(() => {
    metronome.stop();
    setIsOscillating(false);
  }, [metronome]);

  const startMetronome = useCallback(() => {
    metronome.start();
    setIsOscillating(true);
  }, [metronome]);

  useEffect(() => {
    if (!metronome) return;
    const stopPrev = stopMetronome;
    return () => stopPrev();
  }, [metronome, stopMetronome]);

  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextBpm = Math.min(240, Math.max(1, Number(event.target.value)));
    setBpm(nextBpm);
  };

  const handlePlay = () => {
    const playing = metronome.startedAt !== null;
    if (playing) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };

  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    metronome.callbacks.add((tick) => {
      if (!lightRef.current) return;
      if (tick > 0.95) lightRef.current.style.opacity = "1";
      else lightRef.current.style.opacity = "0";
    });
  }, [metronome]);

  useEffect(() => {
    if (!metronome) return;
    const interval = setInterval(() => {
      setFps(metronome.fps ?? 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [metronome]);

  return (
    <div className="mx-auto max-w-[800px] px-4 w-full min-h-dvh">
      <div className="w-24 h-24 border border-amber-600 rounded my-24 mx-auto">
        <div
          ref={lightRef}
          className="w-full h-full bg-amber-600"
          style={{ opacity: "0" }}
        />
      </div>
      <div className="flex flex-col gap-2 items-center justify-center w-full">
        <div className="text-sm text-gray-500">FPS: {fps}</div>
        <div className="flex gap-2 w-full items-center">
          <label htmlFor="bpm">BPM</label>
          <input
            className="border border-amber-600 rounded-md w-full py-2 text-2xl"
            id="bpm"
            type="number"
            value={bpm}
            onChange={handleBpmChange}
            min={1}
            max={240}
            step={1}
          />
        </div>
        <button
          onClick={handlePlay}
          className="bg-amber-600 text-white rounded-md w-full py-2 text-2xl"
        >
          {isOscillating ? "Stop" : "Play"}
        </button>
      </div>
    </div>
  );
}
