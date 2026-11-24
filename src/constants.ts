import { LESSONS } from "./data";
import type { Exercise, Progress } from "./types";

export const KEY = "rust-retro-v1";
export const ROUTES: string[] = ["inicio", ...LESSONS.map(l => l.id), "final"];
export const ALL_EX: Exercise[] = LESSONS.flatMap(l => l.ex);
export const TOTAL = ALL_EX.length;
export const LETTERS = ["A", "B", "C", "D"];

const RANKS = ["Recién compilado", "Aprendiz del borrow checker", "Rustáceo", "Cangrejo con casco", "Maestro del ownership"];

export const rankFor = (p: number): string => RANKS[p >= 1 ? 4 : p >= 0.7 ? 3 : p >= 0.45 ? 2 : p >= 0.2 ? 1 : 0];

export const countOk = (progress: Progress): number => Object.values(progress).filter(s => s === "ok").length;

export const playUrl = (code: string): string =>
  "https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&code=" + encodeURIComponent(code);
