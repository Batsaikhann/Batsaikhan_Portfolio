"use client";

import dynamic from "next/dynamic";
import { PERF_LAB } from "@/lib/perf-lab";

// PERF_LAB is a build-time constant, so in a normal production build this is `() => null`
// and the panel's code is never bundled.
export const PerfLabLoader = PERF_LAB ? dynamic(() => import("./PerfLab").then((m) => m.PerfLab), { ssr: false }) : () => null;
