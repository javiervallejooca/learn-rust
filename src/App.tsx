import { useEffect } from "react";
import { ROUTES, TOTAL, countOk, rankFor } from "./constants";
import { LESSONS } from "./data";
import { useHashRoute, useProgress } from "./hooks";
import type { Progress } from "./types";
import { Final, Home, Lesson } from "./views";

/* Componentes: App > Menu, vista (Home | Lesson | Final), StatusBar
   Hooks: useState, useEffect, useCallback y dos hooks propios (hooks.ts) */

function Menu({ current, progress }: { current: string; progress: Progress }) {
  const item = (id: string, mark: string, label: string, cls = "") => (
    <li key={id}>
      <a className={"mi" + cls + (current === id ? " cur" : "")} href={"#" + id} aria-current={current === id ? "page" : undefined}>
        <span className="mk">{mark}</span><span>{label}</span>
      </a>
    </li>
  );
  return (
    <nav className="win menu" aria-label="Lecciones">
      <div className="title"><span className="box">■</span><span className="grow">MENU</span></div>
      <ul>
        {item("inicio", "[■]", "Inicio")}
        <hr />
        {LESSONS.map((l, i) => {
          const d = l.ex.filter(e => progress[e.id]).length;
          const all = d === l.ex.length;
          return item(l.id, all ? "[✓]" : d > 0 ? "[" + d + "]" : "[ ]", "0" + (i + 1) + " " + l.short, all ? " done" : d > 0 ? " part" : "");
        })}
        <hr />
        {item("final", "[►]", "Siguientes pasos")}
      </ul>
    </nav>
  );
}

function StatusBar({ progress }: { progress: Progress }) {
  const ok = countOk(progress);
  const p = ok / TOTAL;
  return (
    <div className="status" role="status" aria-live="polite">
      <span>XP {ok * 10}/{TOTAL * 10}</span>
      <span className="bar" aria-hidden="true"><i style={{ width: Math.round(p * 100) + "%" }} /></span>
      <span>Rango: {rankFor(p)}</span>
    </div>
  );
}

export function App() {
  const route = useHashRoute();
  const [progress, resolve] = useProgress();

  // Al cambiar de página, volver arriba
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  // Flechas del teclado para cambiar de lección
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || e.altKey || e.ctrlKey || e.metaKey) return;
      const i = ROUTES.indexOf(route);
      if (e.key === "ArrowRight" && i < ROUTES.length - 1) window.location.hash = ROUTES[i + 1];
      if (e.key === "ArrowLeft" && i > 0) window.location.hash = ROUTES[i - 1];
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [route]);

  const lessonIndex = LESSONS.findIndex(l => l.id === route);
  return (
    <>
      <div className="topbar"><b>RUST.EXE</b><span>Rust para gente de React</span></div>
      <div className="layout">
        <Menu current={route} progress={progress} />
        <main>
          {route === "inicio" && <Home />}
          {lessonIndex >= 0 && (
            // key = id de la lección: al cambiar de lección se reinicia el estado local de los ejercicios
            <Lesson key={route} lesson={LESSONS[lessonIndex]} index={lessonIndex} progress={progress} onResolve={resolve} />
          )}
          {route === "final" && <Final progress={progress} />}
        </main>
      </div>
      <StatusBar progress={progress} />
    </>
  );
}
