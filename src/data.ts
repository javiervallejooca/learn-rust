import type { Lesson } from "./types";

export const LESSONS: Lesson[] = [
{
  id: "leccion-1", title: "Variables y mutabilidad", short: "Variables",
  intro: [
    "En Rust todo es inmutable por defecto, como si cada variable fuera un `const`. Para poder cambiarla tienes que escribir `mut`, y se nota a simple vista.",
    "También puedes volver a declarar un nombre con `let` (se llama shadowing). Es una variable nueva que tapa a la anterior, no una mutación."
  ],
  tsLabel: "TypeScript",
  ts: `const count = 0;
let total = 0;
total += 5;

const MAX = 100;
const x = 5;
const doubled = x * 2;`,
  rust: `let count = 0;          // inmutable
let mut total = 0;      // mutable
total += 5;

const MAX: u32 = 100;   // constante, con tipo
let x = 5;
let x = x * 2;          // shadowing: x vale 10`,
  note: "En React no mutas el estado a mano, llamas a `setState` con un valor nuevo. Rust te empuja a lo mismo: lo normal es no mutar, y `mut` es la excepción visible.",
  play: `fn main() {
    let count = 0;
    let mut total = 0;
    total += 5;
    const MAX: u32 = 100;
    // count = 1; // descomenta: error, count no es mut
    let x = 5;
    let x = x * 2; // shadowing
    println!("count={count} total={total} max={MAX} x={x}");
}
`,
  ex: [
    { id: "l1e1", type: "bug", prompt: "Una de estas líneas no compila. Haz clic en ella.",
      code: `let a = 5;
let mut b = 10;
b = b + a;
a = b;`, answer: 4,
      hint: "Mira qué variables se declararon sin `mut` y cuáles se reasignan.",
      why: "`a` no es `mut`, así que no se puede reasignar. El compilador te dice: cannot assign twice to immutable variable." },
    { id: "l1e2", type: "fill", prompt: "Completa la declaración para que `counter += 1;` sea válido.",
      pre: "let ", post: " counter = 0;\ncounter += 1;", accept: ["mut"],
      hint: "Es la palabra de tres letras que activa la mutabilidad.",
      why: "`let mut counter` declara una variable mutable." },
    { id: "l1e3", type: "choice", prompt: "¿Qué imprime este programa?",
      code: `let x = 5;
let x = x * 2;
println!("{x}");`,
      options: ["5", "Error: x ya está declarada", "10"], answer: 2,
      hint: "Piensa en shadowing: la segunda `x` se calcula a partir de la primera.",
      why: "La segunda `let x` crea una variable nueva con valor 10 que tapa a la primera. No hay error porque no es una mutación." }
  ]
},
{
  id: "leccion-2", title: "Tipos y funciones", short: "Tipos y fn",
  intro: [
    "Rust es de tipado estático, con inferencia. Los números tienen tamaño y signo explícitos: `i32` es un entero con signo de 32 bits, `u8` va de 0 a 255, `f64` es un decimal.",
    "Las funciones llevan los tipos en parámetros y retorno (`->`). La última expresión del bloque, **sin punto y coma**, es el valor que devuelve la función."
  ],
  tsLabel: "TypeScript",
  ts: `function add(a: number, b: number): number {
  return a + b;
}

const price: number = 9.99;
const ok: boolean = true;
const name: string = "Ferris";`,
  rust: `fn add(a: i32, b: i32) -> i32 {
    a + b      // sin ; = valor devuelto
}

let price: f64 = 9.99;
let ok: bool = true;
let name: &str = "Ferris";`,
  note: "Piensa en TypeScript con el modo estricto al máximo: sin `any`, sin `undefined` implícito, y con `number` dividido en tipos con tamaño.",
  play: `fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let price: f64 = 9.99;
    let ok: bool = true;
    let name: &str = "Ferris";
    println!("{} {price} {ok} {name}", add(2, 3));
}
`,
  ex: [
    { id: "l2e1", type: "choice", prompt: "¿Qué ocurre al compilar esta función?",
      code: `fn double(n: i32) -> i32 {
    n * 2;
}`,
      options: ["Devuelve n * 2", "Error: el `;` convierte la expresión en sentencia y la función devuelve `()`", "Devuelve 0"], answer: 1,
      hint: "Fíjate en el punto y coma del final.",
      why: "Con `;` la última línea deja de ser una expresión, así que el bloque devuelve `()` y no un `i32`. Quita el `;` y compila." },
    { id: "l2e2", type: "fill", prompt: "Escribe el símbolo que separa los parámetros del tipo de retorno.",
      pre: "fn is_adult(age: u32) ", post: " bool {\n    age >= 18\n}", accept: ["->"],
      hint: "Es una flecha de dos caracteres.",
      why: "`->` introduce el tipo de retorno. Si una función no devuelve nada, se omite." },
    { id: "l2e3", type: "choice", prompt: "¿Qué tipo usarías para un entero sin signo de 8 bits (0 a 255)?",
      options: ["i8", "u16", "u8", "byte"], answer: 2,
      hint: "La `u` es de unsigned.",
      why: "`u8` va de 0 a 255. `i8` iría de -128 a 127." }
  ]
},
{
  id: "leccion-3", title: "Ownership: quién es el dueño", short: "Ownership",
  intro: [
    "Cada valor tiene un único dueño. Si asignas un valor no trivial (como un `String`) a otra variable o lo pasas a una función, se **mueve**: la variable original deja de ser válida.",
    "Cuando el dueño sale de su bloque, el valor se libera. Por eso Rust no necesita recolector de basura. Los tipos pequeños como `i32` o `bool` se copian, así que no tienen este problema."
  ],
  tsLabel: "JavaScript",
  ts: `const a = { name: "Ana" };
const b = a;           // misma referencia
console.log(a.name);   // funciona
b.name = "Luis";       // a también cambia`,
  rust: `let a = String::from("Ana");
let b = a;             // a se MUEVE a b
println!("{a}");       // error: valor movido

let c = b.clone();     // copia explícita
println!("{b} {c}");`,
  note: "En JS dos variables pueden apuntar al mismo objeto y nadie protesta, de ahí los bugs de mutación compartida. Rust lo prohíbe por diseño: o transfieres la propiedad, o prestas el valor (siguiente lección).",
  play: `fn main() {
    let a = String::from("Ana");
    let b = a.clone(); // prueba a quitar .clone() y mira el error
    println!("{a} {b}");

    let n = 5;
    let m = n; // i32 se copia
    println!("{n} {m}");
}
`,
  ex: [
    { id: "l3e1", type: "bug", prompt: "¿Qué línea provoca el error de compilación?",
      code: `let s1 = String::from("hola");
let s2 = s1;
println!("{s2}");
println!("{s1}");`, answer: 4,
      hint: "Mira dónde se usa una variable que ya se movió.",
      why: "En la línea 2, `s1` se mueve a `s2`. En la línea 4 intentas usar `s1`, que ya no es válida." },
    { id: "l3e2", type: "choice", prompt: "¿Cuál de estos tipos se copia en lugar de moverse?",
      options: ["String", "Vec<i32>", "i32", "Box<i32>"], answer: 2,
      hint: "Los tipos que viven por completo en la pila y son pequeños.",
      why: "`i32` implementa `Copy`. `String`, `Vec` y `Box` poseen memoria en el heap, así que se mueven." },
    { id: "l3e3", type: "fill", prompt: "Completa para copiar el contenido y seguir usando `s1`.",
      pre: "let s2 = s1.", post: "();\nprintln!(\"{s1} {s2}\");", accept: ["clone"],
      hint: "Es el método que hace una copia profunda.",
      why: "`.clone()` duplica el dato. Cuesta algo de memoria, y por eso Rust te obliga a pedirlo de forma explícita." }
  ]
},
{
  id: "leccion-4", title: "Borrowing: referencias", short: "Borrowing",
  intro: [
    "Para usar un valor sin quedártelo, lo prestas con `&`. Una referencia `&T` es de solo lectura y puede haber muchas a la vez. Una referencia `&mut T` permite modificar, pero tiene que ser la única.",
    "La regla: o varias lecturas, o una sola escritura, nunca las dos a la vez. El compilador la comprueba, y así se evitan en tiempo de compilación las condiciones de carrera y los datos que cambian mientras los lees."
  ],
  tsLabel: "JavaScript",
  ts: `function shout(user) {
  return user.name.toUpperCase();
}
function rename(user) {
  user.name += "!";   // muta el original
}`,
  rust: `fn shout(name: &String) -> String {
    name.to_uppercase()
}
fn rename(name: &mut String) {
    name.push_str("!");
}

let mut n = String::from("ana");
rename(&mut n);
shout(&n);`,
  note: "`&T` es como una prop: la recibes para leerla. `&mut T` es como recibir además el setter, pero de forma exclusiva: nadie más puede tocar el valor mientras lo tienes.",
  play: `fn shout(name: &String) -> String {
    name.to_uppercase()
}

fn rename(name: &mut String) {
    name.push_str("!");
}

fn main() {
    let mut n = String::from("ana");
    rename(&mut n);
    println!("{}", shout(&n));
}
`,
  ex: [
    { id: "l4e1", type: "choice", prompt: "Tras llamar a `len(&s)`, donde `fn len(s: &String) -> usize`, ¿en qué estado queda `s`?",
      options: ["Se ha movido y ya no se puede usar", "Sigue siendo válida: solo se prestó", "Se ha clonado"], answer: 1,
      hint: "El `&` delante de `s` es la clave.",
      why: "Pasar `&s` presta el valor. La función lo lee y, al terminar, `s` sigue siendo tuya." },
    { id: "l4e2", type: "bug", prompt: "Una línea rompe la regla de borrowing. ¿Cuál?",
      code: `let mut s = String::from("hi");
let r1 = &s;
let r2 = &mut s;
println!("{r1} {r2}");`, answer: 3,
      hint: "`r1` sigue en uso en la línea 4.",
      why: "No se puede pedir una referencia mutable (línea 3) mientras una de solo lectura sigue viva (se usa en la línea 4)." },
    { id: "l4e3", type: "fill", prompt: "Completa para que la función pueda modificar el vector.",
      pre: "fn add_one(v: &", post: " Vec<i32>) {\n    v.push(1);\n}", accept: ["mut"],
      hint: "Es la misma palabra de la lección 1.",
      why: "`&mut Vec<i32>` es una referencia exclusiva que permite modificar. Quien llama debe pasar `&mut v`." }
  ]
},
{
  id: "leccion-5", title: "Structs e impl", short: "Structs",
  intro: [
    "Un `struct` agrupa campos con nombre, como una `interface` o el tipo de unas props. Los métodos se definen aparte, en un bloque `impl`.",
    "El primer parámetro dice cómo se usa el struct: `&self` lee, `&mut self` modifica y `self` lo consume. Sin `self` es una función asociada, como un constructor: `Counter::new()`."
  ],
  tsLabel: "TypeScript",
  ts: `class Counter {
  count = 0;
  inc() { this.count += 1; }
  get() { return this.count; }
}
const c = new Counter();
c.inc();`,
  rust: `#[derive(Debug)]
struct Counter { count: u32 }

impl Counter {
    fn new() -> Self { Self { count: 0 } }
    fn inc(&mut self) { self.count += 1; }
    fn get(&self) -> u32 { self.count }
}

let mut c = Counter::new();
c.inc();`,
  note: "`struct` + `impl` cubre lo que haces con `interface` y los métodos de una clase. No hay herencia: la reutilización viene de los traits, que son como interfaces con implementación.",
  play: `#[derive(Debug)]
struct Counter {
    count: u32,
}

impl Counter {
    fn new() -> Self { Self { count: 0 } }
    fn inc(&mut self) { self.count += 1; }
    fn get(&self) -> u32 { self.count }
}

fn main() {
    let mut c = Counter::new();
    c.inc();
    c.inc();
    println!("{} {:?}", c.get(), c);
}
`,
  ex: [
    { id: "l5e1", type: "choice", prompt: "¿Qué primer parámetro necesita un método que modifica el struct?",
      options: ["&self", "&mut self", "self.mut", "mut &self"], answer: 1,
      hint: "Combina las lecciones 1 y 4.",
      why: "`&mut self` presta el struct de forma exclusiva y mutable. `&self` solo permitiría leer." },
    { id: "l5e2", type: "fill", prompt: "¿Qué trait derivas para poder imprimir el struct con `{:?}`?",
      pre: "#[derive(", post: ")]\nstruct Counter { count: u32 }", accept: ["Debug"],
      hint: "Es el que sirve para depurar. Escríbelo con mayúscula inicial.",
      why: "`#[derive(Debug)]` genera automáticamente el formato de depuración que usa `{:?}`." },
    { id: "l5e3", type: "bug", prompt: "¿Qué línea no compila?",
      code: `let c = Counter::new();
c.inc();
println!("{}", c.get());`, answer: 2,
      hint: "`inc` pide `&mut self`.",
      why: "`c` se declaró sin `mut`, así que no se puede tomar una referencia mutable. Debería ser `let mut c`." }
  ]
},
{
  id: "leccion-6", title: "Enums y match", short: "Enums",
  intro: [
    "Un `enum` de Rust puede llevar datos en cada variante. Es el equivalente a una unión discriminada de TypeScript, solo que integrado en el lenguaje.",
    "`match` es como un `switch` exhaustivo: si olvidas una variante, el programa no compila. Cada brazo se escribe `patrón => resultado`."
  ],
  tsLabel: "TypeScript",
  ts: `type Action =
  | { type: "inc" }
  | { type: "add"; n: number }
  | { type: "reset" };

function reduce(state: number, a: Action) {
  switch (a.type) {
    case "inc": return state + 1;
    case "add": return state + a.n;
    case "reset": return 0;
  }
}`,
  rust: `enum Action { Inc, Add(i32), Reset }

fn reduce(state: i32, a: Action) -> i32 {
    match a {
        Action::Inc => state + 1,
        Action::Add(n) => state + n,
        Action::Reset => 0,
    }
}`,
  note: "Es el `useReducer` que ya conoces: las acciones son un enum y el reducer es un `match`. La diferencia es que el compilador comprueba que cubres todos los casos.",
  play: `enum Action {
    Inc,
    Add(i32),
    Reset,
}

fn reduce(state: i32, a: Action) -> i32 {
    match a {
        Action::Inc => state + 1,
        Action::Add(n) => state + n,
        Action::Reset => 0,
    }
}

fn main() {
    let s = reduce(0, Action::Add(5));
    let s = reduce(s, Action::Inc);
    println!("{s}");
}
`,
  ex: [
    { id: "l6e1", type: "choice", prompt: "Añades la variante `Action::Dec` al enum pero no tocas el `match`. ¿Qué pasa?",
      options: ["No compila: el match no cubre todas las variantes", "Compila y devuelve undefined en ese caso", "Compila y entra en pánico al ejecutarse"], answer: 0,
      hint: "La palabra clave de la explicación es «exhaustivo».",
      why: "Rust exige que `match` cubra todos los casos posibles. Es lo que evita olvidarte de una acción nueva." },
    { id: "l6e2", type: "fill", prompt: "Escribe el símbolo que separa el patrón del resultado en un brazo de `match`.",
      pre: "Action::Add(n) ", post: " state + n,", accept: ["=>"],
      hint: "Parece una flecha gruesa.",
      why: "`=>` separa el patrón del valor. No lo confundas con `->`, que es el tipo de retorno de una función." },
    { id: "l6e3", type: "choice", prompt: "¿Qué hace un brazo `_ => ...` en un `match`?",
      options: ["Lanza una excepción", "Captura cualquier caso que no se haya cubierto antes", "Ignora el match entero"], answer: 1,
      hint: "Es el equivalente a `default` en un switch.",
      why: "`_` es el comodín: encaja con cualquier valor. Se coloca al final para cubrir el resto." }
  ]
},
{
  id: "leccion-7", title: "Option y Result", short: "Option / Result",
  intro: [
    "Rust no tiene `null` ni excepciones. Si un valor puede faltar, su tipo es `Option<T>`: `Some(valor)` o `None`. Si una operación puede fallar, devuelve `Result<T, E>`: `Ok(valor)` o `Err(error)`.",
    "El operador `?` al final de una expresión devuelve el error al que llamó a la función si lo hay, y si no, te da el valor. Es el `await` que propaga el rechazo hacia arriba."
  ],
  tsLabel: "TypeScript",
  ts: `const first = names[0] ?? "anon";

function parseDouble(s: string): number {
  const n = Number.parseInt(s.trim(), 10);
  if (Number.isNaN(n)) throw new Error("no es un número");
  return n * 2;
}`,
  rust: `let first = names.first().cloned().unwrap_or("anon");

fn parse_double(s: &str) -> Result<i32, std::num::ParseIntError> {
    let n: i32 = s.trim().parse()?;
    Ok(n * 2)
}`,
  note: "`Option` sustituye a `null` y `undefined`, y `Result` sustituye a `throw`. El fallo forma parte del tipo, así que no puedes olvidarte de manejarlo.",
  play: `fn parse_double(s: &str) -> Result<i32, std::num::ParseIntError> {
    let n: i32 = s.trim().parse()?;
    Ok(n * 2)
}

fn main() {
    let names = vec!["Ana", "Luis"];
    let first = names.first().cloned().unwrap_or("anon");
    println!("{first}");
    println!("{:?}", parse_double(" 21 "));
    println!("{:?}", parse_double("abc"));
}
`,
  ex: [
    { id: "l7e1", type: "choice", prompt: "`v.first()` devuelve el primer elemento de un vector, que puede estar vacío. ¿Qué tipo devuelve?",
      options: ["T", "null", "Option<&T>", "Result<T, E>"], answer: 2,
      hint: "Puede haber un valor o no.",
      why: "Devuelve `Some(&primero)` si hay elementos y `None` si el vector está vacío. No existe `null`." },
    { id: "l7e2", type: "fill", prompt: "Escribe el operador que propaga el error al llamador.",
      pre: "let n: i32 = s.trim().parse()", post: ";", accept: ["?"],
      hint: "Es un signo de puntuación, el mismo del encadenado opcional de JS.",
      why: "Si `parse()` devuelve `Err`, la función retorna ese error inmediatamente. Si devuelve `Ok`, `?` te da el valor." },
    { id: "l7e3", type: "choice", prompt: "¿Qué ocurre al llamar a `.unwrap()` sobre un `None`?",
      options: ["Devuelve 0", "Devuelve undefined", "El programa entra en pánico y termina"], answer: 2,
      hint: "`unwrap` asume que el valor existe.",
      why: "`unwrap()` hace `panic!` si no hay valor. En código serio se prefiere `match`, `unwrap_or` o `?`." }
  ]
},
{
  id: "leccion-8", title: "Vec, iteradores y closures", short: "Iteradores",
  intro: [
    "`Vec<T>` es el array dinámico. Se crea con la macro `vec![...]` y se recorre con iteradores: `.iter()` presta los elementos y `.into_iter()` los consume.",
    "Las closures se escriben `|x| x * 2`, como una arrow function. Los iteradores son perezosos: no hacen nada hasta que cierras la cadena con `.collect()`, `.sum()` o similar."
  ],
  tsLabel: "TypeScript",
  ts: `const nums = [1, 2, 3, 4];
const evens = nums
  .filter(n => n % 2 === 0)
  .map(n => n * 10);
// [20, 40]`,
  rust: `let nums = vec![1, 2, 3, 4];
let evens: Vec<i32> = nums
    .into_iter()
    .filter(|n| n % 2 == 0)
    .map(|n| n * 10)
    .collect();
// [20, 40]`,
  note: "Casi todo lo que haces con `map`, `filter` y `reduce` tiene su equivalente. La diferencia es que Rust los compila a bucles tan rápidos como los escritos a mano.",
  play: `fn main() {
    let nums = vec![1, 2, 3, 4];
    let evens: Vec<i32> = nums
        .into_iter()
        .filter(|n| n % 2 == 0)
        .map(|n| n * 10)
        .collect();
    println!("{:?}", evens);
}
`,
  ex: [
    { id: "l8e1", type: "choice", prompt: "¿Qué método cierra una cadena de iteradores para obtener un `Vec`?",
      options: [".toArray()", ".collect()", ".build()", ".end()"], answer: 1,
      hint: "Recolecta los elementos en una colección.",
      why: "`.collect()` consume el iterador y construye la colección que indique el tipo (aquí un `Vec<i32>`)." },
    { id: "l8e2", type: "fill", prompt: "Completa para duplicar cada elemento.",
      pre: "let doubled: Vec<i32> = v.iter().", post: "(|x| x * 2).collect();", accept: ["map"],
      hint: "Es el mismo nombre que en JavaScript.",
      why: "`.map` transforma cada elemento con la closure. Hasta `.collect()` no se ejecuta nada." },
    { id: "l8e3", type: "choice", prompt: "¿Qué imprime este programa?",
      code: `let v = vec![1, 2, 3];
let s: i32 = v.iter().sum();
println!("{s}");`,
      options: ["[1, 2, 3]", "6", "Error de tipos"], answer: 1,
      hint: "`sum` hace lo que su nombre indica.",
      why: "`.sum()` suma los elementos del iterador. El tipo de `s` le indica que el resultado es un `i32`." }
  ]
}
];

export const TRANSLATOR: [string, string][] = [
  ["const x = 1", "let x = 1;"],
  ["let x = 1", "let mut x = 1;"],
  ["interface / type", "struct"],
  ["unión discriminada + switch", "enum + match"],
  ["T | undefined", "Option<T>"],
  ["throw / try / catch", "Result<T, E> y ?"],
  ["arr.filter(...).map(...)", "v.iter().filter(...).map(...).collect()"],
  ["console.log(x)", "println!(\"{x}\")"],
  ["package.json", "Cargo.toml"],
  ["npm run dev", "cargo run"]
];
