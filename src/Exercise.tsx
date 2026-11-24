import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { LETTERS } from "./constants";
import { CodeBlock, Inline, highlight } from "./highlight";
import type { Exercise as ExerciseData, Status } from "./types";

function Feedback({ kind, title, children }: { kind: "ok" | "bad" | "sol"; title: string; children: ReactNode }) {
  return (
    <div className={"fb " + kind}>
      <b>{title}</b>
      <p>{children}</p>
    </div>
  );
}

interface Props {
  ex: ExerciseData;
  n: number;
  status: Status | undefined;
  onResolve: (id: string, status: Status) => void;
}

// Estado local de cada ejercicio; el resultado final sube a App con onResolve
export function Exercise({ ex, n, status, onResolve }: Props) {
  const [wrong, setWrong] = useState<number[]>([]);
  const [tries, setTries] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [text, setText] = useState("");
  const done = status !== undefined;

  const pick = (value: number) => {
    if (done || ex.type === "fill") return;
    setTries(t => t + 1);
    if (value === ex.answer) onResolve(ex.id, "ok");
    else setWrong(w => [...w, value]);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (done || ex.type !== "fill") return;
    setTries(t => t + 1);
    if (ex.accept.includes(text.trim().replace(/\s+/g, " "))) onResolve(ex.id, "ok");
  };

  // Aquí TypeScript estrecha `ex` según `ex.type`, como un match de Rust
  const solution =
    ex.type === "choice" ? ex.options[ex.answer] : ex.type === "bug" ? "línea " + ex.answer : ex.accept[0];

  const cls = "ex" + (status === "ok" ? " is-ok" : status === "solved" ? " is-solved" : "");

  return (
    <article className={cls}>
      <header>
        <span className="exn">EJERCICIO {n}</span>
        <span className="pts">{status === "ok" ? "+10 XP" : "10 XP"}</span>
      </header>
      <p className="q"><Inline text={ex.prompt} /></p>

      {ex.type === "choice" && (
        <>
          {ex.code && <CodeBlock code={ex.code} label="RUST" />}
          <div className="opts">
            {ex.options.map((option, k) => {
              const state = wrong.includes(k) ? " bad" : done && k === ex.answer ? " good" : "";
              return (
                <button key={k} type="button" className={"opt" + state} disabled={done || wrong.includes(k)} onClick={() => pick(k)}>
                  <span className="key">[{LETTERS[k]}]</span>
                  <span><Inline text={option} /></span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {ex.type === "bug" && (
        <div className="lines">
          {ex.code.split("\n").map((line, i) => {
            const num = i + 1;
            const state = wrong.includes(num) ? " bad" : done && num === ex.answer ? " good" : "";
            return (
              <button key={num} type="button" className={"codeline" + state} disabled={done || wrong.includes(num)} aria-label={"Línea " + num} onClick={() => pick(num)}>
                <span className="num">{num}</span>
                <span className="src">{highlight(line)}</span>
              </button>
            );
          })}
        </div>
      )}

      {ex.type === "fill" && (
        <form className="fill" onSubmit={submit}>
          <div className="fillbox">
            <span className="part">{highlight(ex.pre)}</span>
            <input
              type="text"
              aria-label="Respuesta"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              value={done ? ex.accept[0] : text}
              disabled={done}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
            />
            <span className="part">{highlight(ex.post)}</span>
          </div>
          {!done && <div className="acts"><button type="submit" className="btn small go">Comprobar</button></div>}
        </form>
      )}

      {status === "ok" && <Feedback kind="ok" title="CORRECTO"><Inline text={ex.why} /></Feedback>}
      {status === "solved" && <Feedback kind="sol" title={"SOLUCIÓN: " + solution}><Inline text={ex.why} /></Feedback>}
      {!done && tries > 0 && <Feedback kind="bad" title="NO ES ESO">Inténtalo de nuevo.</Feedback>}

      {!done && (
        <>
          <div className="acts">
            {!showHint && <button type="button" className="btn small" onClick={() => setShowHint(true)}>Pista</button>}
            {tries >= 1 && <button type="button" className="btn small" onClick={() => onResolve(ex.id, "solved")}>Ver solución</button>}
          </div>
          {showHint && <p className="hint">» <Inline text={ex.hint} /></p>}
        </>
      )}
    </article>
  );
}
