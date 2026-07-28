import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 192;
const SCROLL_HEIGHT = '650vh'; // slightly faster than 900vh per user request
const MAX_DPR = 2;

function getFrameUrl(base: string, n: number) {
  return `${base}frames/${String(n).padStart(5, '0')}.jpg`;
}

export default function MustangHero() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const imagesRef     = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadedRef     = useRef(0);
  const curFrameRef   = useRef(0);
  const tgtFrameRef   = useRef(0);
  const rafRef        = useRef<number | null>(null);
  const lastDimRef    = useRef({ w: 0, h: 0 });

  const leftRef    = useRef<HTMLDivElement>(null);
  const rightRef   = useRef<HTMLDivElement>(null);
  const centerRef  = useRef<HTMLDivElement>(null);

  const [loadPct, setLoadPct]   = useState(0);
  const [ready, setReady]       = useState(false);
  const [scrollProg, setScrollProg] = useState(0);

  const BASE = import.meta.env.BASE_URL;

  // ── Draw a single frame onto the canvas ──────────────────────────────────
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[idx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const W   = canvas.clientWidth;
    const H   = canvas.clientHeight;

    if (
      canvas.width  !== Math.round(W * dpr) ||
      canvas.height !== Math.round(H * dpr) ||
      lastDimRef.current.w !== W ||
      lastDimRef.current.h !== H
    ) {
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      lastDimRef.current = { w: W, h: H };
      ctx.scale(dpr, dpr);
    }

    ctx.imageSmoothingEnabled  = true;
    ctx.imageSmoothingQuality  = 'high';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    const imgW      = img.naturalWidth;
    const imgH      = img.naturalHeight;
    const imgAspect = imgW / imgH;
    const viewAspect = W / H;

    let scale: number;
    if (imgAspect > viewAspect) {
      // Landscape image on portrait viewport — fit width so full frame is visible
      // Use cover if it would keep height ≥ 55% of viewport; else scale-to-fit-width
      const scaleW   = W / imgW;
      const coverSc  = Math.max(W / imgW, H / imgH);
      const min55H   = (H * 0.55) / imgH;
      scale = Math.min(coverSc, Math.max(scaleW, min55H));
    } else {
      // Full cover fill on landscape/desktop
      scale = Math.max(W / imgW, H / imgH);
    }

    const drawW = imgW * scale;
    const drawH = imgH * scale;
    ctx.drawImage(img, (W - drawW) / 2, (H - drawH) / 2, drawW, drawH);
  }, []);

  // ── RAF animation loop — lerp toward target frame ─────────────────────────
  const animate = useCallback(() => {
    const cur = curFrameRef.current;
    const tgt = tgtFrameRef.current;
    if (cur !== tgt) {
      const diff = tgt - cur;
      const step = Math.sign(diff) * Math.max(1, Math.abs(diff) * 0.12);
      const next = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(cur + step)));
      curFrameRef.current = next;
      drawFrame(next);
    }
    rafRef.current = requestAnimationFrame(animate);
  }, [drawFrame]);

  // ── Preload: priority frames every 6th, then fill in rest ────────────────
  useEffect(() => {
    let mounted = true;
    loadedRef.current = 0;
    setReady(false);

    const priority: number[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i += 6) priority.push(i);
    const rest = Array.from({ length: TOTAL_FRAMES }, (_, i) => i)
      .filter(i => !priority.includes(i));
    const order = [...priority, ...rest];

    let earlyReady = false;
    const onLoad = () => {
      if (!mounted) return;
      loadedRef.current++;
      const pct = loadedRef.current / TOTAL_FRAMES;
      setLoadPct(pct);
      if (!earlyReady && pct >= 0.1) {
        earlyReady = true;
        setReady(true);
        drawFrame(0);
      }
    };

    imagesRef.current = new Array(TOTAL_FRAMES).fill(null);
    for (const i of order) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = onLoad;
      img.onerror = onLoad;
      img.src = getFrameUrl(BASE, i + 1);
      imagesRef.current[i] = img;
    }
    return () => { mounted = false; };
  }, [BASE, drawFrame]);

  // ── Start RAF once ready ──────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    drawFrame(curFrameRef.current);
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [ready, animate, drawFrame]);

  // ── Scroll → frame mapping + text parallax ────────────────────────────────
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = containerRef.current;
        if (!el) { ticking = false; return; }
        const rect      = el.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const prog       = Math.max(0, Math.min(1, -rect.top / scrollable));
        setScrollProg(prog);
        tgtFrameRef.current = Math.round(prog * (TOTAL_FRAMES - 1));

        // Text parallax
        if (leftRef.current)
          leftRef.current.style.transform =
            `translateX(${-prog * 50}px) translateY(${-prog * 24}px)`;
        if (rightRef.current)
          rightRef.current.style.transform =
            `translateX(${prog * 50}px) translateY(${-prog * 24}px)`;
        if (centerRef.current)
          centerRef.current.style.transform =
            `translateY(${-prog * 20}px)`;

        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Resize → immediate redraw ─────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      lastDimRef.current = { w: 0, h: 0 };
      drawFrame(curFrameRef.current);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawFrame]);

  // Derived opacity values for text/overlays
  const textOpacity   = scrollProg < 0.82 ? 1 : Math.max(0, 1 - (scrollProg - 0.82) / 0.12);
  const hintOpacity   = scrollProg < 0.04 ? 1 : 0;
  const progPct       = Math.round(scrollProg * 100);

  return (
    <div ref={containerRef} style={{ position: 'relative', height: SCROLL_HEIGHT }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100svh',
          overflow: 'hidden',
          background: '#000',
        }}
      >
        {/* ── Loading overlay ─────────────────────────────────────────── */}
        {!ready && (
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 50,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: '#000',
            }}
          >
            <p style={{
              fontSize: '0.65rem', letterSpacing: '0.4em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
              marginBottom: '1.5rem',
            }}>
              Loading
            </p>
            <div style={{
              width: '200px', height: '1px',
              background: 'rgba(255,255,255,0.08)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0, width: `${loadPct * 100}%`,
                background: 'linear-gradient(90deg, rgba(201,168,76,0.4), rgba(201,168,76,0.9))',
                transition: 'width 0.15s ease',
                boxShadow: '0 0 8px rgba(201,168,76,0.5)',
              }} />
            </div>
            <p style={{
              marginTop: '1rem', fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.2)', fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.08em', fontFamily: 'monospace',
            }}>
              {Math.round(loadPct * 100)}%
            </p>
          </div>
        )}

        {/* ── Canvas — full viewport background ───────────────────────── */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', display: 'block',
            opacity: ready ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* ── Cinematic vignette + dark overlay ───────────────────────── */}
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
            background: `
              linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 20%, transparent 40%, transparent 60%, rgba(0,0,0,0.65) 100%),
              radial-gradient(ellipse 100% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)
            `,
          }}
        />

        {/* ── MUSTANG | emblem | 1966 row ─────────────────────────────── */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 clamp(1rem, 4vw, 4rem)',
            opacity: textOpacity,
            transition: 'opacity 0.1s linear',
          }}
        >
          {/* LEFT — MUSTANG */}
          <div
            ref={leftRef}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              willChange: 'transform',
              animation: 'heroReveal 1.1s cubic-bezier(0.22,1,0.36,1) 0.15s both',
            }}
          >
            <span style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: 'clamp(3rem, 11vw, 13rem)',
              fontWeight: 900, fontStyle: 'italic',
              letterSpacing: '-0.04em', lineHeight: 0.88,
              color: '#fff', display: 'block', userSelect: 'none',
              textShadow: '0 2px 40px rgba(0,0,0,0.8)',
            }}>
              MUS<br />TANG
            </span>
            <div style={{
              marginTop: '1.2rem', width: '2.5rem', height: '1px',
              background: 'var(--gold)', transformOrigin: 'left',
              animation: 'lineGrow 0.8s cubic-bezier(0.22,1,0.36,1) 0.9s both',
            }} />
            <p style={{
              marginTop: '0.8rem',
              fontFamily: 'var(--app-font-sans)',
              fontSize: 'clamp(0.55rem, 1vw, 0.75rem)',
              fontWeight: 400, letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              animation: 'subtleReveal 0.9s cubic-bezier(0.22,1,0.36,1) 1.1s both',
            }}>
              Ford Motor Company
            </p>
          </div>

          {/* CENTER — emblem */}
          <div
            ref={centerRef}
            style={{
              flex: '0 0 auto', padding: '0 clamp(0.5rem, 2vw, 2.5rem)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '1rem',
              willChange: 'transform',
              animation: 'subtleReveal 1.1s cubic-bezier(0.22,1,0.36,1) 0.5s both',
            }}
          >
            <div style={{
              width: 'clamp(48px, 7vw, 80px)', height: 'clamp(48px, 7vw, 80px)',
              borderRadius: '50%',
              border: '1px solid rgba(201,168,76,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(201,168,76,0.1), 0 0 60px rgba(0,0,0,0.6)',
              background: 'rgba(0,0,0,0.3)',
            }}>
              <svg viewBox="0 0 48 48" fill="none"
                style={{ width: '52%', height: '52%', opacity: 0.8 }}>
                <path
                  d="M24 8c-2 0-3.5 1-4.5 2.5-.5.8-.8 1.5-1 2.5-.8-.3-1.7-.5-2.5-.3-1.5.4-2.5 1.8-2.5 3.3 0 .8.3 1.6.8 2.2L12 22l1 5-1 4 2 .5L15 28l2 3-1 7h3l.5-6 1.5 1 1 5h3l-1-6 1.5-1.5L27 38h3l-1-6.5 1.5-1 1.5 6.5h2l-1-7.5.5-3.5 2-1.5.5-5-1-2c.5-.6.8-1.4.8-2.2 0-1.5-1-2.9-2.5-3.3-.8-.2-1.7 0-2.5.3-.2-1-.5-1.7-1-2.5C27.5 9 26 8 24 8Z"
                  fill="rgba(201,168,76,0.85)"
                />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: 'clamp(0.48rem, 0.85vw, 0.62rem)', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', fontWeight: 500 }}>
                Original
              </span>
              <span style={{ width: '1px', height: '22px', background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.3), transparent)', display: 'block' }} />
              <span style={{ fontSize: 'clamp(0.48rem, 0.85vw, 0.62rem)', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', fontWeight: 500 }}>
                Iconic
              </span>
            </div>
          </div>

          {/* RIGHT — 1966 */}
          <div
            ref={rightRef}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
              willChange: 'transform',
              animation: 'heroReveal 1.1s cubic-bezier(0.22,1,0.36,1) 0.3s both',
            }}
          >
            <span style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 'clamp(3rem, 11vw, 13rem)',
              fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 0.88,
              color: '#fff', display: 'block', userSelect: 'none',
              textShadow: '0 2px 40px rgba(0,0,0,0.8)',
            }}>
              19<br />66
            </span>
            <div style={{
              marginTop: '1.2rem', width: '2.5rem', height: '1px',
              background: 'var(--gold)', marginLeft: 'auto', transformOrigin: 'right',
              animation: 'lineGrow 0.8s cubic-bezier(0.22,1,0.36,1) 1.0s both',
            }} />
            <p style={{
              marginTop: '0.8rem',
              fontFamily: 'var(--app-font-sans)',
              fontSize: 'clamp(0.55rem, 1vw, 0.75rem)',
              fontWeight: 400, letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              textAlign: 'right',
              animation: 'subtleReveal 0.9s cubic-bezier(0.22,1,0.36,1) 1.1s both',
            }}>
              Pony Car Era
            </p>
          </div>
        </div>

        {/* ── Bottom tagline + scroll indicator ───────────────────────── */}
        <div
          style={{
            position: 'absolute', bottom: 'clamp(1.8rem, 4vh, 3rem)',
            left: 0, right: 0, zIndex: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
            opacity: hintOpacity, transition: 'opacity 0.5s ease',
            pointerEvents: 'none',
            animation: 'subtleReveal 1s cubic-bezier(0.22,1,0.36,1) 1.3s both',
          }}
        >
          <p style={{
            fontSize: 'clamp(0.58rem, 0.95vw, 0.72rem)',
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', fontWeight: 400,
          }}>
            Born in Detroit · Lives Forever
          </p>
          {/* Mouse scroll indicator */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{
              width: '20px', height: '32px',
              border: '1.5px solid rgba(255,255,255,0.22)', borderRadius: '10px',
              display: 'flex', justifyContent: 'center', paddingTop: '5px',
            }}>
              <div style={{
                width: '3px', height: '6px',
                background: 'rgba(255,255,255,0.5)', borderRadius: '2px',
                animation: 'scrollBounce 1.8s ease-in-out infinite',
              }} />
            </div>
            {[0, 1, 2].map(i => (
              <svg key={i} viewBox="0 0 16 9" fill="none"
                style={{
                  width: '13px', height: '7px',
                  animation: `chevronFade 1.8s ease-in-out ${i * 0.22}s infinite`,
                }}>
                <path d="M1 1l7 7 7-7" stroke="rgba(255,255,255,0.45)"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ))}
          </div>
        </div>

        {/* ── Right-side vertical progress bar ────────────────────────── */}
        <div
          style={{
            position: 'absolute', right: '1.2rem', top: '50%',
            transform: 'translateY(-50%)', zIndex: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            opacity: scrollProg > 0.02 ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <div style={{
            width: '1.5px', height: 'clamp(60px, 16vh, 110px)',
            background: 'rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden',
            borderRadius: '2px',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: `${progPct}%`,
              background: 'linear-gradient(to bottom, rgba(201,168,76,0.9), rgba(201,168,76,0.4))',
              boxShadow: '0 0 6px rgba(201,168,76,0.5)',
              transition: 'height 0.1s ease',
            }} />
          </div>
          <span style={{
            fontSize: '0.52rem', color: 'rgba(255,255,255,0.2)',
            fontFamily: 'monospace', letterSpacing: '0.05em',
          }}>
            {progPct}%
          </span>
        </div>

        {/* ── Bottom progress line ─────────────────────────────────────── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '1.5px', zIndex: 20, pointerEvents: 'none',
        }}>
          <div style={{
            height: '100%', width: `${progPct}%`,
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), rgba(201,168,76,0.9))',
            transition: 'width 0.08s linear',
          }} />
        </div>
      </div>
    </div>
  );
}
