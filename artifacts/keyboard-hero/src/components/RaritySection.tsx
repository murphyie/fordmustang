import { useReveal } from '@/hooks/useReveal';

export default function RaritySection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id="rarity"
      ref={ref}
      className="reveal-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(5rem, 10vh, 9rem) clamp(1.5rem, 8vw, 9rem)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #000 60%, #0d0a04 100%)',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: 'clamp(300px, 50vw, 700px)',
          height: 'clamp(300px, 50vw, 700px)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <p
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            fontWeight: 500,
            marginBottom: '1.5rem',
          }}
        >
          Rarity
        </p>

        <h2
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            color: '#fff',
            marginBottom: '2rem',
          }}
        >
          Exclusively{' '}
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>Rare</span>
        </h2>

        {/* Decorative divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              background:
                'linear-gradient(to right, transparent, rgba(201,168,76,0.3))',
            }}
          />
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--gold)',
              opacity: 0.6,
            }}
          />
          <div
            style={{
              flex: 1,
              height: '1px',
              background:
                'linear-gradient(to left, transparent, rgba(201,168,76,0.3))',
            }}
          />
        </div>

        <p
          style={{
            fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '60ch',
            margin: '0 auto 3rem',
          }}
        >
          Just 607,568 were built in 1966. Today, fewer than a fraction survive in
          original, unrestored condition. A pristine 1966 Mustang isn't just a car
          — it's a time capsule. A tangible piece of American history that only grows
          more valuable with each passing decade.
        </p>

        {/* Feature cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {[
            { icon: '◈', label: 'Collector Grade', sub: 'Investment-quality condition' },
            { icon: '◉', label: 'Authenticated', sub: 'Matching numbers verified' },
            { icon: '◫', label: 'Time Capsule', sub: 'Factory-original components' },
          ].map(({ icon, label, sub }) => (
            <div
              key={label}
              style={{
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                background: '#000',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.8rem',
                transition: 'background 0.3s ease',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = '#0a0a0a')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = '#000')
              }
            >
              <span style={{ fontSize: '1.4rem', color: 'var(--gold)', opacity: 0.7 }}>
                {icon}
              </span>
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#fff',
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontSize: '0.72rem',
                  color: 'rgba(255,255,255,0.35)',
                  lineHeight: 1.5,
                }}
              >
                {sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
