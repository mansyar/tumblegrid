<protect>
# Implementation Plan: Win/Lose Flow, Victory UI & Menus

## Phase 1: Menu Navigation

**Objective:** Build the main menu, level-select screen, campaign progression persistence, and wire the screen navigation in App.tsx.

- [ ] **Task 1.1: Implement screen navigation state in App.tsx**
    - [ ] Write tests for screen state transitions (menu → levelSelect, levelSelect → game, etc.)
    - [ ] Add `currentScreen` state to App.tsx with conditional rendering of MainMenu, LevelSelect, and Game
    - [ ] Pass navigation callbacks (`onNavigate`) to child components
- [ ] **Task 1.2: Create `useCampaignProgress` hook**
    - [ ] Write tests for localStorage read/write, unlock logic, try/catch error handling
    - [ ] Implement `useCampaignProgress` as a hook with `getUnlockedLevels()`, `completeLevel(id)`, `isLevelUnlocked(id)` functions
    - [ ] Wrap localStorage access in try/catch for private browsing fallback
- [ ] **Task 1.3: Create `MainMenu` component**
    - [ ] Write tests for rendering title, Campaign/Sandbox buttons, and click handlers
    - [ ] Implement MainMenu with "TumbleGrid" title and two primary buttons
    - [ ] Style with CSS overlay (centered layout, semi-transparent background over R3F canvas)
- [ ] **Task 1.4: Create `LevelSelect` component**
    - [ ] Write tests for 5 level cards display, locked/unlocked states, click handling
    - [ ] Implement LevelSelect with grid of level cards showing number, title, lock state
    - [ ] Greyed-out card with lock icon for locked levels; clickable card for unlocked
    - [ ] "Back" button to return to main menu
- [ ] **Task 1.5: Wire navigation flow**
    - [ ] Connect MainMenu → LevelSelect (Campaign) and MainMenu → Game/Sandbox
    - [ ] Connect LevelSelect → Game (campaign with selected level data)
    - [ ] Verify sandbox mode navigation loads sandbox level directly
- [ ] **Task: Conductor - User Manual Verification 'Menu Navigation' (Protocol in workflow.md)**

## Phase 2: Victory Detection

**Objective:** Implement goal bucket dwell detection, LEVEL_CLEARED state machine transition, and campaign progression persistence on victory.

- [ ] **Task 2.1: Update Zustand store for victory state**
    - [ ] Write tests for new state machine transitions: PLAYING → LEVEL_CLEARED, LEVEL_CLEARED → BUILDING/back
    - [ ] Add `setLevelCleared()` action to store
    - [ ] Add `resetLevel()` action that clears player-placed pieces and resets to initial level state
    - [ ] Ensure sandbox states (`SANDBOX_*`) bypass LEVEL_CLEARED transitions
- [ ] **Task 2.2: Create `useGoalDetector` hook**
    - [ ] Write tests for 1.5s dwell timer logic, bucket exit resets timer, sandbox bypass
    - [ ] Implement hook that monitors `marbleInBucketIds` from store
    - [ ] Use physics tick delta (not wall clock) for frame-accurate dwell measurement
    - [ ] On 1.5s sustained containment: call `setLevelCleared()` and `completeLevel()` on campaign progress
- [ ] **Task 2.3: Wire goal detector into Scene/GameCanvas**
    - [ ] Mount useGoalDetector in the scene, connected to goal bucket sensor trigger
    - [ ] Verify sandbox mode bypasses detector entirely
- [ ] **Task: Conductor - User Manual Verification 'Victory Detection' (Protocol in workflow.md)**

## Phase 3: Victory Overlay & Level Intro

**Objective:** Build the "Level Complete!" celebration overlay and the level intro overlay, integrating them into the game flow.

- [ ] **Task 3.1: Create `VictoryOverlay` component**
    - [ ] Write tests for overlay rendering when LEVEL_CLEARED, button visibility (Next Level enabled/disabled on last level)
    - [ ] Implement "Level Complete!" overlay with celebration styling
    - [ ] Three buttons: **Next Level** (loads next campaign level), **Retry** (resets level to initial state), **Back to Menu**
    - [ ] Next Level button disabled on level 5 (last campaign level)
    - [ ] Semi-transparent overlay allowing 3D scene to show through
- [ ] **Task 3.2: Create `LevelIntro` component**
    - [ ] Write tests for auto-dismiss timer (3s), click/tap to dismiss immediately
    - [ ] Implement overlay showing level title + description text
    - [ ] Timer auto-dismisses after 3 seconds; clicking/tapping also dismisses
    - [ ] Only shown on first level load per navigation (not on retry)
- [ ] **Task 3.3: Integrate overlays into game flow**
    - [ ] Wire VictoryOverlay to appear on LEVEL_CLEARED state
    - [ ] Wire LevelIntro to appear on level load (campaign only)
    - [ ] Connect overlay buttons: Next Level → load level+1, Retry → resetLevel() + reload, Back to Menu → navigate home
    - [ ] Verify retry resets all placed pieces to initial state
- [ ] **Task: Conductor - User Manual Verification 'Victory Overlay & Level Intro' (Protocol in workflow.md)**
</protect>
