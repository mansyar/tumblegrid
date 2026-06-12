<protect>
# Specification: Audio System (TRACK-008)

## Overview

Implement a procedural audio system using the Web Audio API that provides spatial audio feedback for marble physics, UI interactions, victory/fail events, and includes a mute toggle. All sounds are generated programmatically—no audio files required.

## Functional Requirements

### 1. Audio Engine Core
- **Lazy Initialization:** AudioContext created on first user interaction (place/remove/rotate piece)
- **First Click Sound:** Initial interaction queues sound to play immediately once context is ready
- **Master Gain Node:** Single gain node controlling overall volume
- **Mute Toggle:** On/off button in HUD to mute/unmute all audio
- **Tab Visibility:** Pause continuous sounds (marble roll) when tab is hidden; allow one-shots to finish

### 2. Marble Roll Sound
- **Synthesis:** White noise source through bandpass filter
- **Velocity Mapping:** Filter frequency mapped to marble velocity (lerped for smoothness)
- **3D Spatialization:** PannerNode following marble's 3D position in real-time
- **Lifecycle:** Fades in on Play Mode start, fades out on Stop/fail/victory
- **Continuous:** Runs every physics tick during PLAYING/SANDBOX_PLAYING states

### 3. UI Interaction Sounds
- **Place Sound:** Short sine burst (~50ms) when piece is placed on grid
- **Remove Sound:** Similar short burst when piece is removed
- **Rotate Sound:** Slightly different pitch burst when piece is rotated
- **Trigger:** Fires on corresponding store actions (placePiece, removePiece, rotatePiece)

### 4. Victory Jingle
- **Synthesis:** 3-note rising sine tone sequence
- **Timing:** Notes spaced ~150ms apart
- **Trigger:** Plays when state transitions to LEVEL_CLEARED
- **Duration:** ~500ms total

### 5. Fail Tone
- **Synthesis:** Descending sine slide (continuous pitch drop)
- **Trigger:** Plays when marble Y < -5 (fail detection)
- **Duration:** ~300ms
- **Pitch:** Starts at ~400Hz, drops to ~200Hz

## Non-Functional Requirements

### Performance
- Audio processing must not block main thread
- PannerNode updates at 60Hz (synced with physics tick)
- Graceful degradation if AudioContext unavailable (silent fail)

### Browser Compatibility
- Chrome, Firefox, Safari, Edge (latest 2 major versions)
- Mobile Safari, Android Chrome
- Handle autoplay policies (lazy init pattern)

### Code Quality
- Pure functions for sound synthesis (testable)
- Singleton AudioEngine pattern (single context)
- TypeScript types for all audio parameters
- >80% test coverage for audio utilities

## Acceptance Criteria

1. **AudioContext Initialization:** Context created on first user interaction, not on page load
2. **Marble Roll:** Sound plays during Play Mode, pitch follows velocity, spatialized to marble position
3. **UI Clicks:** Place/remove/rotate each produce distinct short sounds
4. **Victory Jingle:** 3-note rising sequence plays on level clear
5. **Fail Tone:** Descending slide plays when marble falls
6. **Mute Toggle:** Button in HUD mutes/unmutes all audio
7. **Tab Handling:** Continuous sounds pause when tab hidden
8. **No Audio Files:** All sounds generated via Web Audio API
9. **No Errors:** Silent fail if AudioContext blocked or unavailable
10. **Tests Pass:** All Vitest tests pass with >80% coverage

## Out of Scope

- Background music
- Volume slider (only mute toggle)
- Audio file loading/decoding
- Sound effect variations/randomization
- Audio visualization
- Spatial audio for UI sounds (only marble roll)
</protect>