import { useCallback, useEffect, useState } from "react";
import { ALL_EX, KEY, ROUTES } from "./constants";
import type { Progress, Status } from "./types";

// Ruta a partir del hash de la URL (#leccion-3)
export function useHashRoute(): string {
  const [hash, setHash] = useState<string>(() => window.location.hash.slice(1));
  useEffect(() => {
    const onChange = () => setHash(window.location.hash.slice(1));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return ROUTES.includes(hash) ? hash : "inicio";
}

// Progreso { idEjercicio: "ok" | "solved" }, guardado en localStorage
export function useProgress(): [Progress, (id: string, status: Status) => void] {
  const [progress, setProgress] = useState<Progress>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Progress;
      return Object.fromEntries(Object.entries(saved).filter(([id]) => ALL_EX.some(e => e.id === id)));
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress));
    } catch {
      /* sin almacenamiento: el progreso vive solo en memoria */
    }
  }, [progress]);

  const resolve = useCallback((id: string, status: Status) => {
    setProgress(p => (p[id] ? p : { ...p, [id]: status }));
  }, []);

  return [progress, resolve];
}
