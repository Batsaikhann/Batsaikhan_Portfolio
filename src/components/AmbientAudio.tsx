"use client";

import { useEffect, useRef, useState } from "react";

const SRC = "/images/audio/musinova-minimal-techno-ambient-loop-edit-483369.mp3";
const VOLUME = 0.13;
const FADE_IN = 0.9; // seconds
const FADE_OUT = 0.6;
const KEY = "ambient-sound";

type Graph = { ctx: AudioContext; gain: GainNode };

/**
 * Global ambient soundtrack + its toggle. Mounted once in the root layout, so it keeps playing
 * across sections and route changes. Off by default; the MP3 is only downloaded once sound is
 * turned on. Volume fades go through a Web Audio gain node because iOS ignores `audio.volume`.
 */
export function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const graph = useRef<Graph | null>(null);
  const wanted = useRef(false); // the user's choice
  const resumePending = useRef(false); // saved "on" from a previous visit, waiting for a first interaction
  const pauseTimer = useRef(0);
  const [on, setOn] = useState(false); // drives the label
  const [playing, setPlaying] = useState(false); // drives the bars

  // Gain node is created lazily inside a user gesture (browsers require that for AudioContext).
  const ensureGraph = () => {
    const audio = audioRef.current;
    if (graph.current || !audio) return graph.current;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    try {
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
      graph.current = { ctx, gain };
    } catch {
      graph.current = null;
    }
    return graph.current;
  };

  const ramp = (to: number, seconds: number) => {
    const g = graph.current;
    const audio = audioRef.current;
    if (g) {
      const now = g.ctx.currentTime;
      g.gain.gain.cancelScheduledValues(now);
      g.gain.gain.setValueAtTime(g.gain.gain.value, now);
      g.gain.gain.linearRampToValueAtTime(to, now + seconds);
    } else if (audio) {
      // Fallback without Web Audio: step the element volume.
      const from = audio.volume;
      const start = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - start) / (seconds * 1000));
        audio.volume = from + (to - from) * k;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  };

  const fadeIn = async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    clearTimeout(pauseTimer.current);
    const g = ensureGraph();
    if (!g && audio.paused) audio.volume = 0;
    try {
      if (g?.ctx.state === "suspended") await g.ctx.resume();
      await audio.play();
    } catch {
      return false; // autoplay blocked or load failed — stay quiet, nothing breaks
    }
    ramp(VOLUME, FADE_IN);
    setPlaying(true);
    return true;
  };

  const fadeOut = () => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return setPlaying(false);
    ramp(0, FADE_OUT);
    setPlaying(false);
    clearTimeout(pauseTimer.current);
    pauseTimer.current = window.setTimeout(() => {
      if (!wanted.current || document.hidden) audio.pause();
    }, FADE_OUT * 1000 + 40);
  };

  const store = (value: "on" | "off") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
  };

  const toggle = async () => {
    resumePending.current = false;
    if (wanted.current) {
      wanted.current = false;
      setOn(false);
      store("off");
      fadeOut();
      return;
    }
    wanted.current = true;
    setOn(true);
    store("on");
    if (!(await fadeIn())) {
      // Play failed even on a click (e.g. file couldn't load) — flip back so the UI tells the truth.
      wanted.current = false;
      setOn(false);
      store("off");
    }
  };

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {}

    // A previous visit chose "on": browsers won't let audio start by itself, so resume quietly
    // on the visitor's first interaction with the page — once, and only if they haven't turned it off since.
    const resumeOnce = async (event: Event) => {
      removeEventListener("pointerdown", resumeOnce, true);
      removeEventListener("keydown", resumeOnce, true);
      // A click on the toggle itself is handled by the toggle.
      if (!resumePending.current || (event.target as Element | null)?.closest?.(".sound-toggle")) return;
      resumePending.current = false;
      wanted.current = true;
      if (await fadeIn()) setOn(true);
      else wanted.current = false;
    };
    if (saved === "on") {
      resumePending.current = true;
      addEventListener("pointerdown", resumeOnce, true);
      addEventListener("keydown", resumeOnce, true);
    }

    // Tab hidden: fade out and pause. Back: resume only if sound is still wanted.
    const onVisibility = () => {
      if (document.hidden) fadeOut();
      else if (wanted.current && audioRef.current && audioRef.current.currentTime > 0) void fadeIn();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      removeEventListener("pointerdown", resumeOnce, true);
      removeEventListener("keydown", resumeOnce, true);
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(pauseTimer.current);
    };
    // Handlers only touch refs and stable setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <audio ref={audioRef} src={SRC} loop preload="none" aria-hidden="true" />
      <button
        type="button"
        className={`sound-toggle${on ? " is-on" : ""}${playing ? " is-playing" : ""}`}
        aria-label={on ? "Disable background sound" : "Enable background sound"}
        aria-pressed={on}
        onClick={toggle}
        data-cursor={on ? "Mute" : "Sound"}
      >
        <span className="sound-bars" aria-hidden="true">
          <i /> <i /> <i /> <i />
        </span>
        <span className="sound-text" aria-hidden="true">
          <small>Sound</small>
          <b>{on ? "On" : "Off"}</b>
        </span>
      </button>
    </>
  );
}
