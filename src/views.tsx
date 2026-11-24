import type { ReactNode } from "react";
import { TOTAL, countOk, playUrl, rankFor } from "./constants";
import { LESSONS, TRANSLATOR } from "./data";
import { Exercise } from "./Exercise";
import { CodeBlock, Inline } from "./highlight";
import type { Lesson as LessonData, Progress, Status } from "./types";

function Window({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="win">
      <div className="title"><span className="box">■</span><span className="grow">{title}</span></div>
      <div className="body">{children}</div>
    </section>
  );
}

export function Home() {
  return (
    <Window title="BIENVENIDO.TXT">
      <h1 className="big">RUST<span className="dot">.</span>EXE<span className="cursor" aria-hidden="true" /></h1>
      <p className="lead">Rust explicado para quien ya sabe React y TypeScript.</p>
      <p>Ya sabes componer interfaces, manejar estado y tipar con TypeScript, y con eso tienes mucho hecho. Cada lección parte de algo que conoces de JS o React y lo traduce a Rust, con un ejemplo a cada lado.</p>
      <p>Son {LESSONS.length} lecciones con {TOTAL} ejercicios. Cada ejercicio vale 10 XP, tiene una pista y explica la respuesta. Puedes abrir cualquier ejemplo en el Playground oficial para ejecutarlo y romperlo sin instalar nada.</p>
      <div className="row"><a className="btn go" href="#leccion-1">Empezar lección 1 ►</a></div>

      <h3 className="sec">Traductor rápido</h3>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>En JS / React</th><th>En Rust</th></tr></thead>
          <tbody>
            {TRANSLATOR.map(([js, rust]) => <tr key={js}><td>{js}</td><td>{rust}</td></tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="sec">Instalar Rust (opcional)</h3>
      <p>Se instala con <a href="https://rustup.rs" target="_blank" rel="noopener">rustup</a>, que incluye <code>cargo</code>, el equivalente a npm y a tu bundler a la vez.</p>
      <CodeBlock label="TERMINAL" code={"cargo new hola    // crea el proyecto\ncd hola\ncargo run         // compila y ejecuta\ncargo check       // solo comprueba errores, rápido\ncargo test        // ejecuta los tests"} />
    </Window>
  );
}

interface LessonProps {
  lesson: LessonData;
  index: number;
  progress: Progress;
  onResolve: (id: string, status: Status) => void;
}

export function Lesson({ lesson, index, progress, onResolve }: LessonProps) {
  const prev = index === 0 ? "inicio" : LESSONS[index - 1].id;
  const next = index === LESSONS.length - 1 ? "final" : LESSONS[index + 1].id;
  return (
    <Window title={"LECCION_0" + (index + 1) + ".RS"}>
      <h2 className="lt"><span className="num">0{index + 1}</span> {lesson.title}</h2>
      {lesson.intro.map((p, i) => <p key={i}><Inline text={p} /></p>)}
      <div className="compare">
        <CodeBlock code={lesson.ts} label={lesson.tsLabel} />
        <CodeBlock code={lesson.rust} label="RUST" />
      </div>
      <div className="note"><b>★ DESDE REACT</b><p><Inline text={lesson.note} /></p></div>
      <div className="row">
        <a className="btn small" href={playUrl(lesson.play)} target="_blank" rel="noopener">Probar en el Playground ►</a>
      </div>
      <h3 className="sec">Ejercicios</h3>
      <div className="exs">
        {lesson.ex.map((ex, i) => (
          <Exercise key={ex.id} ex={ex} n={i + 1} status={progress[ex.id]} onResolve={onResolve} />
        ))}
      </div>
      <div className="pager">
        <a className="btn" href={"#" + prev}>◄ Anterior</a>
        <a className="btn go" href={"#" + next}>Siguiente ►</a>
      </div>
    </Window>
  );
}

const RESOURCES: [string, string, string][] = [
  ["The Rust Book", "https://doc.rust-lang.org/book/", "El libro oficial, en inglés, de principio a fin."],
  ["Rustlings", "https://github.com/rust-lang/rustlings", "Ejercicios pequeños que arreglas en tu editor."],
  ["Rust by Example", "https://doc.rust-lang.org/rust-by-example/", "Ejemplos ejecutables por tema."],
  ["Exercism", "https://exercism.org/tracks/rust", "Retos con revisión por mentores."]
];

export function Final({ progress }: { progress: Progress }) {
  const ok = countOk(progress);
  return (
    <Window title="FIN.TXT">
      <h2 className="lt">Siguientes pasos</h2>
      <p>Llevas <b>{ok} de {TOTAL}</b> ejercicios resueltos. Rango actual: <code>{rankFor(ok / TOTAL)}</code>.</p>
      <p>Con estas ocho lecciones tienes el vocabulario básico. Para seguir, estos recursos son los más usados:</p>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Recurso</th><th>Para qué sirve</th></tr></thead>
          <tbody>
            {RESOURCES.map(([name, url, what]) => (
              <tr key={url}><td><a href={url} target="_blank" rel="noopener">{name}</a></td><td>{what}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Temas que vienen después: traits y genéricos, lifetimes, módulos, manejo de errores con tipos propios y concurrencia. Si quieres llevar Rust al navegador, busca WebAssembly con <code>wasm-bindgen</code>.</p>
      <div className="pager">
        <a className="btn" href="#leccion-8">◄ Lección 8</a>
        <a className="btn go" href="#inicio">Volver al inicio</a>
      </div>
    </Window>
  );
}
