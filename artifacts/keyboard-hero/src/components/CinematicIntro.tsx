import { useEffect, useState } from 'react';

export default function CinematicIntro() {
  // phase: 'visible' → 'fading' → 'gone'
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible');

  useEffect(() => {
    // Hold for 2.4s, then start 0.9s fade-out
    const fadeTimer = setTimeout(() => setPhase('fading'), 2400);
    const doneTimer = setTimeout(() => setPhase('gone'), 3300);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.1rem',
        opacity: phase === 'fading' ? 0 : 1,
        transition: phase === 'fading' ? 'opacity 0.9s cubic-bezier(0.4,0,0.2,1)' : 'none',
        pointerEvents: 'none',
      }}
    >
      {/* Top rule */}
      <div style={{
        width: 'clamp(40px, 8vw, 72px)',
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.5), transparent)',
        animation: 'lineGrow 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s both',
      }} />

      {/* Label */}
      <p style={{
        fontFamily: 'var(--app-font-sans)',
        fontSize: 'clamp(0.55rem, 1.1vw, 0.68rem)',
        fontWeight: 500,
        letterSpacing: '0.38em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.3)',
        animation: 'subtleReveal 0.7s cubic-bezier(0.22,1,0.36,1) 0.45s both',
      }}>
        A Production by
      </p>

      {/* Name */}
      <p style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: 'clamp(2rem, 6vw, 5rem)',
        fontWeight: 800,
        fontStyle: 'italic',
        letterSpacing: '-0.03em',
        color: '#fff',
        lineHeight: 1,
        animation: 'heroReveal 0.85s cubic-bezier(0.22,1,0.36,1) 0.55s both',
      }}>
        Murphy
      </p>

      {/* Bottom rule */}
      <div style={{
        width: 'clamp(40px, 8vw, 72px)',
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.5), transparent)',
        animation: 'lineGrow 0.7s cubic-bezier(0.22,1,0.36,1) 0.7s both',
      }} />
    </div>
  );
}
