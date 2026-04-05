"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextBpm = Math.min(240, Math.max(1, Number(event.target.value)));
    setBpm(nextBpm);
  };

  const handlePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const start = useRef<number | null>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const flickerRef = useRef<number>(0);
  const raf = useRef<number | null>(null);
  const hz = useRef<number>(0);
  useEffect(() => {
    const step: FrameRequestCallback = (time) => {
      if (!isPlaying) {
        if (raf.current) {
          cancelAnimationFrame(raf.current);
          raf.current = null;
          flickerRef.current = 0;
          start.current = null;
          if (lightRef.current) {
            lightRef.current.style.opacity = "0";
          }
        }
        return;
      }

      if (start.current === null) {
        start.current = time;
      }
      const elapsed = time - start.current;

      if (elapsed < 1000) hz.current += 1;

      flickerRef.current = Math.sin(
        ((elapsed / 1000) * 2 * Math.PI * bpm) / 60,
      );
      if (lightRef.current) {
        lightRef.current.style.opacity = `${flickerRef.current}`;
      }

      raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
  }, [bpm, isPlaying]);

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
          {isPlaying ? "Stop" : "Play"}
        </button>
      </div>
    </div>
  );
}
