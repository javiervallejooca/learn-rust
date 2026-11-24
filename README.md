# Rust para gente de React

Web de aprendizaje de Rust con estética de IDE de DOS. React 18 + TypeScript + Vite.

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # comprueba tipos y genera dist/
npm run typecheck  # solo tipos
```

## Estructura

| Archivo | Qué contiene |
| --- | --- |
| `src/types.ts` | Tipos: `Exercise` es una unión discriminada (choice, bug, fill) |
| `src/data.ts` | Las 8 lecciones y sus 24 ejercicios |
| `src/hooks.ts` | `useHashRoute` y `useProgress` (localStorage) |
| `src/highlight.tsx` | Resaltado de sintaxis, `Inline` y `CodeBlock` |
| `src/Exercise.tsx` | Un ejercicio, con su estado local |
| `src/views.tsx` | `Home`, `Lesson` y `Final` |
| `src/App.tsx` | Menú, barra de estado y navegación |

Para añadir una lección, agrega un objeto a `LESSONS` en `src/data.ts`; el menú, la ruta y el contador de XP se actualizan solos.
