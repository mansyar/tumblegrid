import { audioEngine } from '@/audio/AudioEngine';
import { useState } from 'react';
import './MuteToggle.css';

export function MuteToggle() {
  const [muted, setMuted] = useState(() => audioEngine.isMuted());

  const handleToggle = () => {
    const next = !muted;
    audioEngine.setMuted(next);
    setMuted(next);
  };

  return (
    <div className="mute-toggle">
      <button
        type="button"
        className="mute-toggle-btn"
        aria-label={muted ? 'Unmute' : 'Mute'}
        onClick={handleToggle}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
