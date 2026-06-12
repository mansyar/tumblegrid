<protect>
# Implementation Plan: Audio System (TRACK-008)

## Phase 1: Audio Engine Core [checkpoint: f66d492]

- [x] Task: Create AudioEngine singleton with lazy AudioContext initialization `642f326`
    - [ ] Create `src/audio/AudioEngine.ts` with singleton pattern
    - [ ] Implement lazy `getContext()` that creates AudioContext on first call
    - [ ] Add master GainNode connected to destination
    - [ ] Handle AudioContext state (suspended/running/closed)
    - [ ] Write unit tests for AudioEngine initialization and state management

- [x] Task: Implement mute toggle functionality `4208c04`
    - [ ] Add `muted` state to AudioEngine
    - [ ] Add `setMuted(muted: boolean)` method that sets master gain to 0/1
    - [ ] Create `src/components/ui/MuteToggle.tsx` button component
    - [ ] Wire MuteToggle to AudioEngine via Zustand store or direct call
    - [ ] Write unit tests for mute state transitions

- [x] Task: Handle tab visibility for continuous sounds `fa110bd`
    - [ ] Add `document.visibilitychange` listener in AudioEngine
    - [ ] Implement `pauseContinuous()` and `resumeContinuous()` methods
    - [ ] Track active continuous sound sources (marble roll)
    - [ ] Write unit tests for visibility change handling

- [ ] Task: Conductor - User Manual Verification 'Phase 1: Audio Engine Core' (Protocol in workflow.md)

## Phase 2: UI Interaction Sounds

- [x] Task: Create UI click sound synthesizer `e5ad610`
    - [ ] Create `src/audio/sounds/uiClick.ts` with pure function
    - [ ] Implement `playUIClick(context: AudioContext, type: 'place' | 'remove' | 'rotate')`
    - [ ] Use short sine oscillator (~50ms) with different pitches per type
    - [ ] Connect through master gain node
    - [ ] Write unit tests for each click type

- [ ] Task: Integrate UI sounds with store actions
    - [ ] Create `src/hooks/useAudio.ts` hook
    - [ ] Subscribe to Zustand store for placePiece, removePiece, rotatePiece actions
    - [ ] Call `playUIClick()` on each action (only in BUILDING/SANDBOX_BUILDING states)
    - [ ] Handle AudioContext initialization on first interaction
    - [ ] Write integration tests for store action → sound trigger

- [ ] Task: Conductor - User Manual Verification 'Phase 2: UI Interaction Sounds' (Protocol in workflow.md)

## Phase 3: Victory & Fail Sounds

- [ ] Task: Create victory jingle synthesizer
    - [ ] Create `src/audio/sounds/victoryJingle.ts` with pure function
    - [ ] Implement `playVictoryJingle(context: AudioContext)`
    - [ ] 3-note rising sine sequence (e.g., C5, E5, G5) spaced ~150ms apart
    - [ ] Total duration ~500ms
    - [ ] Write unit tests for jingle timing and frequency

- [ ] Task: Create fail tone synthesizer
    - [ ] Create `src/audio/sounds/failTone.ts` with pure function
    - [ ] Implement `playFailTone(context: AudioContext)`
    - [ ] Descending sine slide from ~400Hz to ~200Hz over ~300ms
    - [ ] Write unit tests for tone duration and frequency range

- [ ] Task: Integrate victory/fail sounds with game state
    - [ ] Subscribe to Zustand store for machineState transitions
    - [ ] Play victory jingle when state → LEVEL_CLEARED
    - [ ] Play fail tone when marble Y < -5 (triggered from FailDetector)
    - [ ] Write integration tests for state transition → sound trigger

- [ ] Task: Conductor - User Manual Verification 'Phase 3: Victory & Fail Sounds' (Protocol in workflow.md)

## Phase 4: Marble Roll Sound

- [ ] Task: Create marble roll sound synthesizer
    - [ ] Create `src/audio/sounds/marbleRoll.ts` with pure functions
    - [ ] Implement `createMarbleRollSource(context: AudioContext)` that returns white noise source
    - [ ] Implement `createBandpassFilter(context: AudioContext, frequency: number)` for velocity mapping
    - [ ] Implement `createPanner(context: AudioContext, position: [x, y, z])` for 3D spatialization
    - [ ] Write unit tests for source creation and filter configuration

- [ ] Task: Implement velocity-to-pitch mapping
    - [ ] Create `src/utils/audio.ts` with `velocityToFrequency(velocity: number): number`
    - [ ] Map marble velocity (0-20 units/s) to frequency (200-800Hz range)
    - [ ] Implement lerp for smooth transitions
    - [ ] Write unit tests for frequency mapping and edge cases

- [ ] Task: Integrate marble roll with physics loop
    - [ ] Create `useMarbleRoll` hook or integrate into `usePlayLoop`
    - [ ] On Play Mode start: create noise source, filter, panner, connect chain
    - [ ] Each physics tick: update panner position from marble, update filter frequency from velocity
    - [ ] On Stop/fail/victory: fade out and disconnect nodes
    - [ ] Handle multiple play/stop cycles (cleanup old sources)
    - [ ] Write integration tests for lifecycle (start → update → stop)

- [ ] Task: Conductor - User Manual Verification 'Phase 4: Marble Roll Sound' (Protocol in workflow.md)

## Phase 5: Testing & Polish

- [ ] Task: Write comprehensive unit tests for all audio utilities
    - [ ] Test `AudioEngine` singleton behavior, mute, visibility handling
    - [ ] Test `uiClick` with different types
    - [ ] Test `victoryJingle` timing and frequencies
    - [ ] Test `failTone` duration and frequency range
    - [ ] Test `marbleRoll` source creation, filter, panner
    - [ ] Test `velocityToFrequency` mapping
    - [ ] Ensure >80% coverage for `src/audio/` directory

- [ ] Task: Write integration tests for audio hooks
    - [ ] Test `useAudio` hook with mocked store actions
    - [ ] Test `useMarbleRoll` hook lifecycle with mocked physics state
    - [ ] Test mute toggle affects all sounds
    - [ ] Test tab visibility pauses/resumes continuous sounds

- [ ] Task: Verify browser compatibility and error handling
    - [ ] Test in Chrome, Firefox, Safari (if possible)
    - [ ] Verify silent fail when AudioContext unavailable
    - [ ] Test autoplay policy handling (lazy init)
    - [ ] Fix any browser-specific issues

- [ ] Task: Conductor - User Manual Verification 'Phase 5: Testing & Polish' (Protocol in workflow.md)
</protect>