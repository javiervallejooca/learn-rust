import type { ReactNode } from "react";

const KEYWORDS = new Set(
  "fn let mut const if else match for while loop in return struct enum impl use mod pub self Self as ref move true false where trait type break continue crate super static unsafe dyn async await function var this class interface export import typeof null undefined".split(" ")
);
const TYPES = new Set(
  "i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 bool char str string number boolean".split(" ")
);

// Resaltado de sintaxis mínimo: devuelve un array de nodos <span>
export function highlight(src: string): ReactNode[] {
  const re = /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*")|(\b\d[\d_]*(?:\.\d+)?)|([A-Za-z_]\w*)(!?)|([\s\S])/g;
  const out: ReactNode[] = [];
  let buf = "";
  let key = 0;
  const flush = () => {
    if (buf) {
      out.push(buf);
      buf = "";
    }
  };
  const tok = (cls: string, text: string) => {
    flush();
    out.push(<span key={key++} className={cls}>{text}</span>);
  };

  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const [, comment, str, num, id, bang, any] = m;
    if (comment) tok("c", comment);
    else if (str) tok("s", str);
    else if (num) tok("n", num);
    else if (id) {
      const next: string | undefined = src[m.index + id.length + bang.length];
      if (bang && next && "([{".includes(next)) tok("m", id + bang);
      else if (KEYWORDS.has(id)) { tok("k", id); buf += bang; }
      else if (TYPES.has(id) || /^[A-Z]/.test(id)) { tok("t", id); buf += bang; }
      else if (next === "(" && !bang) tok("f", id);
      else buf += id + bang;
    } else buf += any;
  }
  flush();
  return out;
}

// `código` y **negrita** dentro de un texto
export function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
        if (part.startsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
        if (part.startsWith("**")) return <b key={i}>{part.slice(2, -2)}</b>;
        return part;
      })}
    </>
  );
}

export function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="code">
      <div className="clabel"><span>{label}</span></div>
      <pre><code>{highlight(code)}</code></pre>
    </div>
  );
}
