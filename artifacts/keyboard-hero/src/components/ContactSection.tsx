import { useReveal } from '@/hooks/useReveal';
import { useState } from 'react';

export default function ContactSection() {
  const ref = useReveal<HTMLElement>();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.12)',
    padding: '0.9rem 0',
    fontSize: 'clamp(0.88rem, 1.2vw, 1rem)',
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.25s ease',
    fontFamily: 'var(--app-font-sans)',
    caretColor: 'var(--gold)',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.65rem',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    fontWeight: 500,
    marginBottom: '0.25rem',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="reveal-section"
      style={{
        padding: 'clamp(5rem, 10vh, 9rem) clamp(1.5rem, 8vw, 9rem)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        background: 'linear-gradient(to bottom, #000, #060606)',
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <p
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            fontWeight: 500,
            marginBottom: '1.2rem',
            textAlign: 'center',
          }}
        >
          Contact
        </p>
        <h2
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: 'clamp(2rem, 4.5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#fff',
            marginBottom: '0.8rem',
            textAlign: 'center',
          }}
        >
          Connect With Us
        </h2>
        <p
          style={{
            fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)',
            color: 'rgba(255,255,255,0.38)',
            textAlign: 'center',
            marginBottom: 'clamp(3rem, 5vw, 4.5rem)',
            lineHeight: 1.7,
          }}
        >
          Whether you're inquiring about acquisition, provenance, or simply want
          to discuss the legend — we'd love to hear from you.
        </p>

        {sent ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              border: '1px solid rgba(201,168,76,0.2)',
            }}
          >
            <p
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                fontWeight: 300,
                color: '#fff',
                marginBottom: '0.8rem',
              }}
            >
              Message Received
            </p>
            <p
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
              }}
            >
              We'll be in touch shortly
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <label style={labelStyle}>Name</label>
                <input
                  style={inputStyle}
                  type="text"
                  required
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  onFocus={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor = 'rgba(201,168,76,0.5)')
                  }
                  onBlur={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.12)')
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  style={inputStyle}
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  onFocus={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor = 'rgba(201,168,76,0.5)')
                  }
                  onBlur={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.12)')
                  }
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Message</label>
              <textarea
                style={{
                  ...inputStyle,
                  resize: 'none',
                  height: '120px',
                  display: 'block',
                  borderBottom: '1px solid rgba(255,255,255,0.12)',
                }}
                required
                placeholder="Tell us what's on your mind..."
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                onFocus={(e) =>
                  ((e.target as HTMLTextAreaElement).style.borderColor = 'rgba(201,168,76,0.5)')
                }
                onBlur={(e) =>
                  ((e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.12)')
                }
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="submit"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(201,168,76,0.55)',
                  color: 'var(--gold)',
                  padding: '1rem 3.5rem',
                  fontSize: '0.72rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.25s ease, color 0.25s ease',
                  fontFamily: 'var(--app-font-sans)',
                }}
                onMouseEnter={(e) => {
                  const b = e.currentTarget;
                  b.style.background = 'rgba(201,168,76,0.12)';
                  b.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget;
                  b.style.background = 'transparent';
                  b.style.color = 'var(--gold)';
                }}
              >
                Send Message
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
