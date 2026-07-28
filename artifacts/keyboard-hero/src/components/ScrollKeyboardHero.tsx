import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 192;
const SCROLL_HEIGHT = '900vh';
const MAX_DPR = 2;

function getFrameUrl(base: string, frameNum: number): string {
  const padded = String(frameNum).padStart(5, '0');
  return `${base}frames/${padded}.jpg`;
}

export default function ScrollKeyboardHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadedCountRef = useRef(0);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastDimensionRef = useRef({ w: 0, h: 0 });

  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const BASE_URL = import.meta.env.BASE_URL;

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;

    // Only resize canvas if dimensions actually changed — avoids blinking
    if (
      canvas.width !== Math.round(W * dpr) ||
      canvas.height !== Math.round(H * dpr) ||
      lastDimensionRef.current.w !== W ||
      lastDimensionRef.current.h !== H
    ) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      lastDimensionRef.current = { w: W, h: H };
      ctx.scale(dpr, dpr);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgAspect = imgW / imgH;
    const viewAspect = W / H;

    let scale: number;

    if (imgAspect > viewAspect) {
      // Landscape image on a portrait-ish viewport (mobile portrait).
      // The keyboard itself occupies roughly the center 56% of image width.
      // Scale so that region fills the viewport width exactly → full keyboard visible.
      // Cap by the full-cover scale so we never upscale past full height coverage.
      const KEYBOARD_REGION = 0.56; // fraction of image width the keyboard occupies
      const scaleForKeyboard = W / (imgW * KEYBOARD_REGION);
      const coverScale = Math.max(W / imgW, H / imgH);
      scale = Math.min(scaleForKeyboard, coverScale);
    } else {
      // Landscape/square viewport → true cover fill, no letterboxing
      scale = Math.max(W / imgW, H / imgH);
    }

    const drawW = imgW * scale;
    const drawH = imgH * scale;

    // Center-anchor the image
    const drawX = (W - drawW) / 2;
    const drawY = (H - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // RAF loop: smoothly interpolate toward target frame
  const animate = useCallback(() => {
    const cur = currentFrameRef.current;
    const target = targetFrameRef.current;

    if (cur !== target) {
      const diff = target - cur;
      // Slow, smooth lerp — feels buttery; minimum 1 frame step to avoid stalling
      const step = Math.sign(diff) * Math.max(1, Math.abs(diff) * 0.12);
      const next = cur + step;
      const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(next)));
      currentFrameRef.current = clamped;
      drawFrame(clamped);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [drawFrame]);

  // Preload frames: priority (every 6th) first, then fill in everything
  useEffect(() => {
    let mounted = true;
    loadedCountRef.current = 0;
    setIsReady(false);

    const priority: number[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i += 6) priority.push(i);
    const rest: number[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (!priority.includes(i)) rest.push(i);
    }
    const loadOrder = [...priority, ...rest];

    let earlyReady = false;

    const onLoad = () => {
      if (!mounted) return;
      loadedCountRef.current++;
      const pct = loadedCountRef.current / TOTAL_FRAMES;
      setLoadProgress(pct);

      if (!earlyReady && pct >= 0.1) {
        earlyReady = true;
        setIsReady(true);
        drawFrame(0);
      }
    };

    imagesRef.current = new Array(TOTAL_FRAMES).fill(null);
    for (const i of loadOrder) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = onLoad;
      img.onerror = onLoad;
      img.src = getFrameUrl(BASE_URL, i + 1);
      imagesRef.current[i] = img;
    }

    return () => { mounted = false; };
  }, [BASE_URL, drawFrame]);

  // Start RAF loop once ready
  useEffect(() => {
    if (!isReady) return;
    drawFrame(currentFrameRef.current);
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isReady, animate, drawFrame]);

  // Scroll → frame mapping
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      setScrollProgress(progress);
      const frameIndex = Math.round(progress * (TOTAL_FRAMES - 1));
      targetFrameRef.current = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Resize → redraw immediately
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      lastDimensionRef.current = { w: 0, h: 0 }; // Force resize on next draw
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  const showScrollHint = scrollProgress < 0.04;
  const headingOpacity = scrollProgress < 0.12 ? 1 : Math.max(0, 1 - (scrollProgress - 0.12) / 0.1);
  const subOpacity = scrollProgress < 0.08 ? 1 : Math.max(0, 1 - (scrollProgress - 0.08) / 0.08);

  const progressPercent = Math.round(scrollProgress * 100);

  return (
    <div ref={containerRef} className="relative" style={{ height: SCROLL_HEIGHT }}>
      <div className="sticky top-0 w-full overflow-hidden bg-black" style={{ height: '100svh' }}>

        {/* Loading overlay */}
        {!isReady && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
            <div className="text-white/50 text-xs tracking-[0.5em] uppercase mb-6 font-light">
              Loading
            </div>
            <div className="relative w-56 h-px bg-white/8 overflow-hidden rounded-full">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${loadProgress * 100}%`,
                  background: 'linear-gradient(90deg, rgba(255,140,50,0.6), rgba(255,85,0,0.8))',
                  transition: 'width 0.15s ease',
                  boxShadow: '0 0 8px rgba(255,140,50,0.5)',
                }}
              />
            </div>
            <div className="text-white/20 text-xs font-mono mt-4 tabular-nums">
              {Math.round(loadProgress * 100)}%
            </div>
          </div>
        )}

        {/* Main canvas — covers the entire viewport */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          style={{
            opacity: isReady ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Cinematic vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `
              linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 22%, transparent 38%, transparent 65%, rgba(0,0,0,0.6) 100%),
              radial-gradient(ellipse 100% 55% at 50% 50%, transparent 25%, rgba(0,0,0,0.5) 100%)
            `,
          }}
        />

        {/* Top: eyebrow + heading */}
        <div
          className="absolute inset-x-0 top-0 z-20 flex flex-col items-center px-4 sm:px-8 pointer-events-none"
          style={{ paddingTop: 'clamp(2rem, 5vh, 4rem)' }}
        >
          <p
            className="text-white/30 font-light tracking-[0.45em] uppercase mb-3"
            style={{
              fontSize: 'clamp(0.55rem, 1.2vw, 0.7rem)',
              opacity: headingOpacity,
              transition: 'opacity 0.08s linear',
            }}
          >
            Next Generation
          </p>
          <h1
            className="text-center font-bold tracking-tight leading-[1.05]"
            style={{
              fontSize: 'clamp(1.9rem, 5.5vw, 5.2rem)',
              opacity: headingOpacity,
              transition: 'opacity 0.08s linear',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(130deg, #ffffff 0%, #f5ece0 35%, #ff8c32 70%, #ff4400 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Upgrade Your
            </span>
            <br />
            <span className="text-white">Experience</span>
          </h1>
        </div>

        {/* Bottom: subheading tagline */}
        <div
          className="absolute inset-x-0 z-20 flex flex-col items-center px-4 pointer-events-none"
          style={{
            bottom: 'clamp(5.5rem, 12vh, 8rem)',
            opacity: subOpacity,
            transition: 'opacity 0.08s linear',
          }}
        >
          <p
            className="text-white/40 text-center font-light tracking-wide"
            style={{ fontSize: 'clamp(0.78rem, 1.6vw, 1rem)' }}
          >
            From standard to gaming — feel the transformation
          </p>
        </div>

        {/* Scroll indicator — animated when idle at top */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          style={{
            bottom: 'clamp(1.5rem, 4vh, 2.5rem)',
            opacity: showScrollHint ? 1 : 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none',
          }}
        >
          <span
            className="text-white/35 font-light tracking-[0.35em] uppercase"
            style={{ fontSize: '0.6rem' }}
          >
            Scroll
          </span>
          {/* Animated mouse */}
          <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
            <rect x="1" y="1" width="16" height="26" rx="8" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
            <rect x="1" y="1" width="16" height="26" rx="8" stroke="rgba(255,255,255,0.0)" strokeWidth="1.5"/>
            <ScrollDot />
          </svg>
          {/* Chevron pair */}
          <div className="flex flex-col items-center" style={{ gap: '1px', marginTop: '2px' }}>
            <Chevron delay={0} />
            <Chevron delay={0.2} />
          </div>
        </div>

        {/* Right-side vertical progress track */}
        <div
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2"
          style={{
            opacity: scrollProgress > 0.02 ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          {/* Track */}
          <div
            className="relative rounded-full overflow-hidden"
            style={{
              width: '2px',
              height: 'clamp(60px, 18vh, 120px)',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 rounded-full"
              style={{
                height: `${progressPercent}%`,
                background: 'linear-gradient(to bottom, rgba(255,140,50,0.9), rgba(255,60,0,0.7))',
                boxShadow: '0 0 6px rgba(255,140,50,0.6)',
                transition: 'height 0.1s ease',
              }}
            />
          </div>
          {/* Percentage */}
          <span
            className="text-white/25 font-mono tabular-nums"
            style={{ fontSize: '0.55rem', letterSpacing: '0.05em' }}
          >
            {progressPercent}%
          </span>
        </div>

        {/* Orange progress line at very bottom edge */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
          style={{ height: '1.5px' }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, rgba(255,140,50,0), rgba(255,140,50,0.7), rgba(255,60,0,0.9))',
              transition: 'width 0.08s linear',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ScrollDot() {
  return (
    <circle
      cx="9"
      cy="8"
      r="2.5"
      fill="rgba(255,255,255,0.5)"
      style={{
        animation: 'scrollDot 1.6s ease-in-out infinite',
      }}
    />
  );
}

function Chevron({ delay }: { delay: number }) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      style={{
        animation: `chevronPulse 1.6s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: 0,
      }}
    >
      <path d="M1 1L5 5L9 1" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
