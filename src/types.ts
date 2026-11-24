// Un ejercicio es una unión discriminada por `type`: el mismo patrón que
// en Rust se escribe con un enum. TypeScript estrecha el tipo al comprobar `ex.type`.

interface ExerciseBase {
  id: string;
  prompt: string;
  hint: string;
  why: string;
}

export interface ChoiceExercise extends ExerciseBase {
  type: "choice";
  code?: string;
  options: string[];
  answer: number; // índice en `options`
}

export interface BugExercise extends ExerciseBase {
  type: "bug";
  code: string;
  answer: number; // número de línea, empezando en 1
}

export interface FillExercise extends ExerciseBase {
  type: "fill";
  pre: string;
  post: string;
  accept: string[];
}

export type Exercise = ChoiceExercise | BugExercise | FillExercise;

export interface Lesson {
  id: string;
  title: string;
  short: string;
  intro: string[];
  tsLabel: string;
  ts: string;
  rust: string;
  note: string;
  play: string;
  ex: Exercise[];
}

export type Status = "ok" | "solved";
export type Progress = Record<string, Status>;
