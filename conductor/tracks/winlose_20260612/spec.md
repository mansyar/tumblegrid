<protect>
# Specification: Win/Lose Flow, Victory UI & Menus

## Overview
Implement the complete menu flow and win/lose lifecycle for TumbleGrid. Players start at a main menu (Campaign/Sandbox), progress through a level-select screen, play levels with victory detection (goal bucket dwell), and see celebration overlays with navigation options. Campaign progression persists via localStorage.

## Functional Requirements

### FR1: Main Menu
- **FR1.1** Game loads to the main menu screen displaying the title "TumbleGrid"
- **FR1.2** Two primary buttons: **Campaign** and **Sandbox**
- **FR1.3** The R3F 3D scene (grid floor + ambient lighting) serves as the background behind the menu UI
- **FR1.4** Clicking **Campaign** navigates to the Level Select screen
- **FR1.5** Clicking **Sandbox** loads the sandbox level directly in sandbox mode

### FR2: Level Select Screen
- **FR2.1** Displays 5 campaign level cards in a grid layout
- **FR2.2** Each card shows: level number, title, and unlock status
- **FR2.3** Level 1 is always unlocked; subsequent levels unlock when the previous level is completed
- **FR2.4** Locked levels display as greyed-out cards with a lock icon — not clickable
- **FR2.5** Clicking an unlocked level loads the game in campaign mode with that level's data
- **FR2.6** A "Back" button returns to the main menu

### FR3: Level Intro Overlay
- **FR3.1** When a campaign level loads, display the level title and description text
- **FR3.2** Overlay auto-dismisses after 3 seconds
- **FR3.3** Player can click/tap anywhere to dismiss it immediately
- **FR3.4** Not shown when replaying a level (only on first load per navigation)

### FR4: Victory Detection
- **FR4.1** The Goal Bucket acts as a trigger volume sensor
- **FR4.2** When the marble enters and remains fully contained within the bucket for **1.5 consecutive seconds**, the level is cleared
- **FR4.3** On detection, transition the state machine to `LEVEL_CLEARED`
- **FR4.4** The marble exiting the bucket before 1.5s resets the dwell timer
- **FR4.5** Sandbox mode bypasses all victory detection (no Goal Bucket, no win condition)

### FR5: Victory Overlay
- **FR5.1** When `LEVEL_CLEARED` is set, display a "Level Complete!" overlay with celebration styling
- **FR5.2** Three buttons:
  - **Next Level** — loads the next campaign level (disabled on last level)
  - **Retry** — resets all player-placed pieces to initial state, loads the same level fresh
  - **Back to Menu** — returns to the main menu
- **FR5.3** No statistics or score display (out of MVP scope)
- **FR5.4** The 3D scene (with the marble and pieces) remains visible behind the overlay

### FR6: Campaign Progression (localStorage)
- **FR6.1** On level completion, persist `campaign_<id>` as completed in localStorage
- **FR6.2** On game load, read localStorage to determine which levels are unlocked
- **FR6.3** Completing level N unlocks level N+1
- **FR6.4** Completed levels remain unlocked indefinitely (no reset mechanism for MVP)
- **FR6.5** Sandbox mode does not affect campaign progression

### FR7: Screen Navigation
- **FR7.1** Screen routing uses simple React conditional rendering in App.tsx (no router library)
- **FR7.2** Navigation flow: **MainMenu** ↔ **LevelSelect** → **Game** (campaign or sandbox)
- **FR7.3** The R3F Canvas is mounted at the App level and visible behind menu/overlay screens

## Non-Functional Requirements
- **NFR1:** All menu UI components must be responsive and scale with viewport
- **NFR2:** Button touch targets ≥ 44px for mobile usability
- **NFR3:** localStorage operations must be wrapped in try/catch (privacy mode, storage full)
- **NFR4:** Victory detection must be frame-accurate (dwell timer uses physics tick delta, not wall clock)
- **NFR5:** Level intro must not block the game loading (scene initializes behind the overlay)

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC1 | App loads to main menu with Campaign and Sandbox buttons |
| AC2 | Clicking Campaign shows 5 level cards, only Level 1 unlocked |
| AC3 | Clicking an unlocked level loads the game in campaign mode |
| AC4 | Level intro overlay shows title + description, dismisses on click or after 3s |
| AC5 | Guiding marble into goal bucket triggers "Level Complete!" after 1.5s |
| AC6 | Victory overlay shows Next Level, Retry (reset), and Back to Menu |
| AC7 | Clicking Next Level loads the next campaign level |
| AC8 | Clicking Retry resets the level to initial state |
| AC9 | Campaign progress persists across page reloads |
| AC10 | Sandbox mode loads directly without goal bucket or victory detection |
| AC11 | Back to Menu from any screen returns to the main menu |

## Out of Scope
- Audio for menus/overlays (deferred to TRACK-008)
- Sandbox inventory changes (reuses existing system)
- Statistics, scores, or timer display on victory
- Level reset confirmation dialog
- Animated transitions between screens
- PWA or service worker support
</protect>
