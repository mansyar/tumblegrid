import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

// ─── Mocks ────────────────────────────────────────────────────────────

const mockSetMuted = vi.fn();
const mockIsMuted = vi.fn().mockReturnValue(false);

vi.mock('@/audio/AudioEngine', () => ({
  audioEngine: {
    setMuted: mockSetMuted,
    isMuted: mockIsMuted,
  },
}));

// ─── Tests ────────────────────────────────────────────────────────────

describe('MuteToggle', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders unmuted button by default', async () => {
    mockIsMuted.mockReturnValue(false);

    const { MuteToggle } = await import('@/components/ui/MuteToggle');

    render(<MuteToggle />);

    const button = screen.getByRole('button', { name: /mute/i });
    expect(button).toBeDefined();
  });

  it('renders muted button when audio is muted', async () => {
    mockIsMuted.mockReturnValue(true);

    const { MuteToggle } = await import('@/components/ui/MuteToggle');

    render(<MuteToggle />);

    const button = screen.getByRole('button', { name: /unmute/i });
    expect(button).toBeDefined();
  });

  it('calls setMuted(true) when clicking unmuted button', async () => {
    const user = userEvent.setup();
    mockIsMuted.mockReturnValue(false);

    const { MuteToggle } = await import('@/components/ui/MuteToggle');

    render(<MuteToggle />);

    const button = screen.getByRole('button', { name: /mute/i });
    await user.click(button);

    expect(mockSetMuted).toHaveBeenCalledWith(true);
  });

  it('calls setMuted(false) when clicking muted button', async () => {
    const user = userEvent.setup();
    mockIsMuted.mockReturnValue(true);

    const { MuteToggle } = await import('@/components/ui/MuteToggle');

    render(<MuteToggle />);

    const button = screen.getByRole('button', { name: /unmute/i });
    await user.click(button);

    expect(mockSetMuted).toHaveBeenCalledWith(false);
  });

  it('toggles mute state on click', async () => {
    const user = userEvent.setup();
    mockIsMuted.mockReturnValue(false);

    const { MuteToggle } = await import('@/components/ui/MuteToggle');

    render(<MuteToggle />);

    const button = screen.getByRole('button', { name: /mute/i });
    await user.click(button);

    expect(mockSetMuted).toHaveBeenCalledTimes(1);
    expect(mockSetMuted).toHaveBeenCalledWith(true);
  });

  it('has correct aria-label for unmuted state', async () => {
    mockIsMuted.mockReturnValue(false);

    const { MuteToggle } = await import('@/components/ui/MuteToggle');

    render(<MuteToggle />);

    const button = screen.getByRole('button', { name: /mute/i });
    expect(button.getAttribute('aria-label')).toBe('Mute');
  });

  it('has correct aria-label for muted state', async () => {
    mockIsMuted.mockReturnValue(true);

    const { MuteToggle } = await import('@/components/ui/MuteToggle');

    render(<MuteToggle />);

    const button = screen.getByRole('button', { name: /unmute/i });
    expect(button.getAttribute('aria-label')).toBe('Unmute');
  });
});
