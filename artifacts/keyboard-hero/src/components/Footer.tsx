export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: '#000',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 8vw, 9rem)',
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <span
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '1.25rem',
                fontWeight: 900,
                fontStyle: 'italic',
                letterSpacing: '0.08em',
                color: '#fff',
              }}
            >
              MUSTANG
            </span>
            <span
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.05rem',
                fontWeight: 300,
                color: 'var(--gold)',
                letterSpacing: '0.05em',
              }}
            >
              1966
            </span>
          </div>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.28)',
              lineHeight: 1.6,
              maxWidth: '28ch',
            }}
          >
            A tribute to the most iconic pony car ever built. Pure. Original. Timeless.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 'clamp(2rem, 5vw, 5rem)', flexWrap: 'wrap' }}>
          {[
            {
              heading: 'Explore',
              links: ['Legacy', 'Rarity', 'Performance'],
            },
            {
              heading: 'Connect',
              links: ['Contact', 'Inquire', 'Follow'],
            },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <p
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.28)',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                {heading}
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.45)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        display: 'inline-block',
                      }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = '#fff')
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color =
                          'rgba(255,255,255,0.45)')
                      }
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)',
          marginBottom: '2rem',
        }}
      />

      {/* Bottom row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <p
          style={{
            fontSize: '0.68rem',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.08em',
          }}
        >
          © {year} Mustang 1966. All rights reserved.
        </p>
        <p
          style={{
            fontSize: '0.68rem',
            color: 'rgba(255,255,255,0.15)',
            letterSpacing: '0.08em',
          }}
        >
          Ford Motor Company · Dearborn, Michigan
        </p>
        <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em' }}>
          developed by{' '}
          <a
            href="https://instagram.com/dinorahwavmq"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(201,168,76,0.7)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = 'rgba(201,168,76,1)')}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(201,168,76,0.7)')}
          >
            murphy
          </a>
        </p>
      </div>
    </footer>
  );
}
