# Giampiero Giovingo — Portfolio

A recruiter-first portfolio with real project screenshots, case studies, a résumé, and an optional walkable studio.

## Development

```sh
npm ci
npm run dev
```

## Verify and build

```sh
npm run build
node --test tests/*.test.mjs
```

Static output is `dist/client`. The build also preserves the optional Sites worker contract in `dist/server`.

- Index: `/?view=index` — direct, motion-free access to the work.
- Studio: `/?view=studio` — move with WASD/arrow keys or select a station; Enter inspects nearby projects.
- Mobile: a compact project presentation instead of a scaled-down room.
- Reduced motion defaults to Index.

Project content lives in `src/projects.js` and `src/project-stories.js`. Both views share the same data. Private research notes and coursework source are intentionally excluded.
