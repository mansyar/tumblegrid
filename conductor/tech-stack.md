# Technology Stack — TumbleGrid

## Build & Development Tools

| Tool | Version | Purpose |
|---|---|---|
| **Vite** | 8.x | Build engine, dev server, HMR |
| **pnpm** | Latest | Package manager, strict lockfile |
| **Biome** | Latest | Linting & formatting (replaces ESLint + Prettier) |
| **Vitest** | 4.x | Unit & integration testing |
| **Playwright** | Latest | Browser-mode testing via Vitest |

## Frontend

| Technology | Version | Purpose |
|---|---|---|
| **TypeScript** | 5.x | Language — type-safe JavaScript |
| **React** | 19.x | UI component framework |
| **Zustand** | Latest | Global state management (single centralized store) |

## 3D & Physics

| Library | Purpose |
|---|---|
| **Three.js** | WebGL 3D rendering engine |
| **@react-three/fiber (R3F)** | Declarative React bindings for Three.js |
| **@react-three/drei** | Utility components (OrbitControls, Grid, primitives) |
| **@react-three/rapier** | WASM-compiled Rust physics engine (Rapier) |

## Project Structure

```
tumblegrid/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── scene/           # R3F scene components (Canvas, GridFloor, etc.)
│   │   ├── pieces/          # 3D piece meshes (StraightRamp, BumperPad, etc.)
│   │   ├── physics/         # Physics world, Marble, colliders
│   │   └── ui/              # 2D overlay UI (Inventory, HUD, Menus)
│   ├── store/               # Zustand store, types, actions
│   ├── levels/              # Campaign & sandbox JSON level data
│   │   ├── campaign/        # 5 campaign levels
│   │   └── sandbox.json     # Sandbox preset
│   ├── audio/               # Web Audio API procedural sounds
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions (input, math, validation)
│   ├── constants/           # Tunable physics/config constants
│   └── styles/              # CSS files
├── tests/                   # Test files
├── conductor/               # Conductor methodology files
├── docs/                    # Design documents (GDD, TDD, ROADMAP)
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── biome.json
└── pnpm-lock.yaml
```

## Core Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "three": "^0.184.0",
    "@react-three/fiber": "^9.6.1",
    "@react-three/drei": "^10.7.7",
    "@react-three/rapier": "^2.2.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "vite": "^8.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "vitest": "^4.0.0",
    "biome": "^1.9.0",
    "@playwright/test": "^1.48.0"
  }
}
```

## Browser Targets

- Chrome (latest 2 major versions)
- Firefox (latest 2 major versions)
- Safari (latest 2 major versions)
- Edge (latest 2 major versions)
- Mobile: iOS Safari, Android Chrome
