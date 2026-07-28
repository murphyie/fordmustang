import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 clamp(1.5rem, 5vw, 4rem)',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        background: scrolled
          ? 'rgba(0,0,0,0.72)'
          : 'rgba(0,0,0,0.25)',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.06)'
          : '1px solid transparent',
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}
    >
      {/* Logo */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '1px',
        }}
      >
        <span
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '1.05rem',
            fontWeight: 900,
            letterSpacing: '0.25em',
            color: '#fff',
            lineHeight: 1,
          }}
        >
          MUSTANG
        </span>
        <span
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '0.65rem',
            fontWeight: 300,
            letterSpacing: '0.3em',
            color: 'var(--gold)',
            lineHeight: 1,
          }}
        >
          1966
        </span>
      </button>

      {/* Links */}
      <ul
        style={{
          display: 'flex',
          gap: 'clamp(1.5rem, 3vw, 3rem)',
          listStyle: 'none',
        }}
      >
        {[
          { label: 'Home', target: '' },
          { label: 'About', target: 'legacy' },
          { label: 'Contact', target: 'contact' },
        ].map(({ label, target }) => (
          <li key={label}>
            <button
              onClick={() =>
                target
                  ? scrollTo(target)
                  : window.scrollTo({ top: 0, behavior: 'smooth' })
              }
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--app-font-sans)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.65)',
                transition: 'color 0.25s ease',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = '#fff')
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color =
                  'rgba(255,255,255,0.65)')
              }
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
