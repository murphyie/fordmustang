import { useEffect, useRef, useState } from 'react';

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Keep React state in sync with the real audio state
    const onPlay  = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener('play',  onPlay);
    audio.addEventListener('pause', onPause);

    // Try autoplay immediately
    const tryPlay = () => {
      if (startedRef.current) return;
      audio.play()
        .then(() => { startedRef.current = true; })
        .catch(() => {}); // blocked — will retry on first gesture
    };

    tryPlay();

    // Fallback: start on the very first user gesture anywhere on the page
    const onGesture = () => {
      if (!startedRef.current) {
        audio.play()
          .then(() => {
            startedRef.current = true;
            // Remove all gesture listeners once started
            ['click', 'touchstart', 'keydown', 'scroll'].forEach(ev =>
              window.removeEventListener(ev, onGesture)
            );
          })
          .catch(() => {});
      }
    };

    ['click', 'touchstart', 'keydown', 'scroll'].forEach(ev =>
      window.addEventListener(ev, onGesture, { once: false, passive: true })
    );

    return () => {
      audio.removeEventListener('play',  onPlay);
      audio.removeEventListener('pause', onPause);
      ['click', 'touchstart', 'keydown', 'scroll'].forEach(ev =>
        window.removeEventListener(ev, onGesture)
      );
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    // State will update via the play/pause event listeners above
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}music.mp3`}
        loop
        preload="auto"
      />

      {/* Small sticky button — bottom-right corner */}
      <button
        onClick={toggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
        title={playing ? 'Pause music' : 'Play music'}
        style={{
          position: 'fixed',
          bottom: '1.4rem',
          right: '1.4rem',
          zIndex: 200,
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: `1px solid ${playing ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.3)'}`,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.25s ease, background 0.25s ease',
          padding: 0,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.9)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.7)';
        }}
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1.5" y="1" width="3" height="10" rx="1" fill="rgba(201,168,76,0.95)" />
            <rect x="7.5" y="1" width="3" height="10" rx="1" fill="rgba(201,168,76,0.95)" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 1.5L11 6L3 10.5V1.5Z" fill="rgba(201,168,76,0.95)" />
          </svg>
        )}
      </button>
    </>
  );
}
