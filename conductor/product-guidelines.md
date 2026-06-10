# Product Guidelines — TumbleGrid

## 1. Prose & Communication Style

- **Tone:** Clear, concise, direct. Use plain English with minimal jargon. When jargon is necessary (e.g., "restitution", "collider"), define it once.
- **UI Text:**
  - Button labels: Imperative verbs ("Play", "Stop", "Rotate", "Place")
  - Level descriptions: One sentence describing the challenge, not the solution
  - Error states: Explain what happened and what the user can do next
- **No flavour text.** Every word serves a functional purpose. Level descriptions hint at the mechanic without spoiling the puzzle.

## 2. Visual & Branding Guidelines

### Colour Palette
| Role | Colour | Hex |
|---|---|---|
| Grid surface | Soft pastel | `#E8E0D8` |
| Grid lines | Subtle grey | `#C0B8B0` |
| Background | Dark matte | `#1A1A2E` |
| Marble | Neon emissive | `#00FFD1` |
| Goal bucket | Gold accent | `#FFD700` |
| UI text | White / Light grey | `#FFFFFF` / `#CCCCCC` |
| Selection highlight | Cyan outline | `#00D4FF` |
| Ghost preview | Semi-transparent white | `rgba(255,255,255,0.3)` |
| Trajectory line | Low-opacity pastel | `rgba(200,200,255,0.4)` |

### Typography
- **System font stack** for performance: `system-ui, -apple-system, sans-serif`
- No custom or web fonts for MVP
- UI text sizes: 12px (labels), 14px (body), 16px (buttons), 24px (titles)

### 3D Visual Style
- **Low-poly minimalism:** All pieces built from Three.js primitives (BoxGeometry, CylinderGeometry) — no custom mesh imports
- **Lighting:** Ambient hemisphere light + single directional light casting soft shadows
- **Shadows:** Real-time directional shadows below components to anchor height visually
- **Marble trail:** Faint light trail following marble path during Play Mode

## 3. UX Principles

### Core Tenets
1. **Direct Manipulation:** Every action has immediate, visible feedback. Click → place. Tap → select. R → rotate.
2. **No Surprises:** State transitions are clear and predictable. The mode indicator always shows whether you're in BUILDING or PLAYING.
3. **Forgiveness:** Pieces can be freely removed and re-placed. No penalties for iteration. The only constraint is inventory count.
4. **Progressive Disclosure:** Levels introduce one mechanic at a time. Tutorial text explains new pieces on first encounter.
5. **Consistency:** All pieces share identical interaction patterns (click/tap to place, click/tap selected to remove, R/rotate button to spin).

### State Machine Principles
- `BUILDING` → `PLAYING`: Explicit "Play" button press
- `PLAYING` → `BUILDING`: Manual "Stop" button OR automatic fail (Y < -5)
- `PLAYING` → `LEVEL_CLEARED`: Goal bucket dwell ≥ 1.5s
- All transitions preserve placed pieces. No state is lost.

### Input Design
- **Desktop:** Left-click (place/select), R (rotate), Right-drag (orbit), Scroll (zoom), Escape (stop/deselect)
- **Mobile:** Tap (place/select), Rotate button (rotate), Pinch (zoom), Single-finger drag (orbit), Two-finger twist (rotate alternative)
- **Touch targets:** Minimum 44px on mobile

## 4. Level Design Guidelines

- **Fairness:** Every campaign level has at least one valid solution using exactly its provided inventory
- **No Dead Ends:** All placed pieces must serve a purpose. Inventory is tight — no filler placements
- **Progressive Difficulty:** Each level introduces exactly one new mechanic or constraint
- **Solution Validation:** Level JSON must pass schema validation at build time and runtime
- **No Trivial Shortcuts:** Solutions must require deliberate routing; the marble cannot skip obstacles accidentally

## 5. Technical Constraints

- **No external assets:** All audio procedural, all meshes primitive-based, no image textures for MVP
- **No PWA for MVP:** Standard web app, no service worker or offline support
- **Browser targets:** Chrome, Firefox, Safari, Edge (latest 2 major versions)
- **Performance target:** 60fps on mid-range desktop and mobile devices
- **Fixed timestep physics:** Rapier must run at a locked timestep to prevent tunneling
- **All collision:** Primitive box/sphere colliders only — no mesh-to-mesh collision

## 6. Accessibility

- **High contrast:** UI text on dark backgrounds. Emissive marble against dark environment.
- **Colour-independent:** No information conveyed solely through colour. Piece shapes are distinct.
- **Camera safety:** Pitch clamped 10°–80° to prevent disorientation
- **Touch first:** All interactions must work via touch. Desktop controls are additive, not primary.
