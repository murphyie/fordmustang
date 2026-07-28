import { useReveal } from '@/hooks/useReveal';

export default function LegacySection() {
  const ref = useReveal<HTMLElement>();
  const stat1 = useReveal<HTMLDivElement>(0.3);
  const stat2 = useReveal<HTMLDivElement>(0.3);
  const stat3 = useReveal<HTMLDivElement>(0.3);

  return (
    <section
      id="legacy"
      ref={ref}
      className="reveal-section"
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 10vh, 9rem) clamp(1.5rem, 8vw, 9rem)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Subtle left accent */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '2px',
          height: '40%',
          background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)',
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(3rem, 6vw, 7rem)',
          alignItems: 'start',
        }}
      >
        {/* Label + heading */}
        <div>
          <p
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              fontWeight: 500,
              marginBottom: '1.2rem',
            }}
          >
            Legacy
          </p>
          <h2
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#fff',
              marginBottom: '1.8rem',
            }}
          >
            Rewrote<br />
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>the Rules</span>
          </h2>
          <p
            style={{
              fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.52)',
              maxWidth: '38ch',
            }}
          >
            Born in 1964½, the Mustang rewrote the rulebook for American muscle.
            The 1966 model represents the peak of the original pony car era —
            before cars grew heavy, before performance bowed to regulation.
            This is the Mustang in its purest, most untouched form.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {[
            { value: '1964½', label: 'Year Introduced', delay: '0.1s', ref: stat1 },
            { value: '607K', label: 'Units Built in 1966', delay: '0.25s', ref: stat2 },
            { value: '60+', label: 'Years of Heritage', delay: '0.4s', ref: stat3 },
          ].map(({ value, label, delay, ref: sRef }) => (
            <div
              key={label}
              ref={sRef}
              className="reveal-section"
              style={{
                borderLeft: '1px solid rgba(201,168,76,0.2)',
                paddingLeft: '1.5rem',
                transitionDelay: delay,
              }}
            >
              <p
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 300,
                  color: '#fff',
                  lineHeight: 1,
                  marginBottom: '0.35rem',
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.35)',
                  fontWeight: 500,
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
