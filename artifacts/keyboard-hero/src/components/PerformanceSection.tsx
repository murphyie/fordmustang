import { useReveal } from '@/hooks/useReveal';

export default function PerformanceSection() {
  const ref = useReveal<HTMLElement>();

  const specs = [
    { label: 'Engine', value: '289 V8', sub: 'High-Performance' },
    { label: 'Horsepower', value: '271', sub: 'at 6,000 RPM' },
    { label: '0 – 60', value: '6.5s', sub: 'Period benchmark' },
    { label: 'Torque', value: '312 lb-ft', sub: 'at 3,400 RPM' },
  ];

  return (
    <section
      id="performance"
      ref={ref}
      className="reveal-section"
      style={{
        padding: 'clamp(5rem, 10vh, 9rem) clamp(1.5rem, 8vw, 9rem)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
      }}
    >
      {/* Top label row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 'clamp(3rem, 6vw, 6rem)',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              fontWeight: 500,
              marginBottom: '1rem',
            }}
          >
            Performance
          </p>
          <h2
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#fff',
            }}
          >
            Born to<br />
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Perform</span>
          </h2>
        </div>

        <p
          style={{
            fontSize: 'clamp(0.85rem, 1.3vw, 0.95rem)',
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.45)',
            maxWidth: '38ch',
          }}
        >
          The 289 Hi-Po V8 didn't just promise performance — it delivered it with
          style. Remarkable figures for 1966. Timeless by any standard.
        </p>
      </div>

      {/* Spec grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2px',
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        {specs.map(({ label, value, sub }, i) => (
          <div
            key={label}
            style={{
              background: '#000',
              padding: 'clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 3vw, 2.5rem)',
              position: 'relative',
              overflow: 'hidden',
              transitionDelay: `${i * 0.08}s`,
            }}
          >
            {/* Top accent line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background:
                  i === 0
                    ? 'var(--gold)'
                    : 'rgba(255,255,255,0.06)',
              }}
            />

            <p
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                fontWeight: 500,
                marginBottom: '0.9rem',
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
                fontWeight: 300,
                lineHeight: 1,
                color: '#fff',
                marginBottom: '0.5rem',
              }}
            >
              {value}
            </p>
            <p
              style={{
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.28)',
                letterSpacing: '0.08em',
              }}
            >
              {sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
