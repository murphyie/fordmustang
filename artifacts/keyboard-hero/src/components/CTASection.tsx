import { useEffect, useRef, useState } from 'react';

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-black py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,100,30,0.06) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,140,50,0.2), transparent)' }}
        />
      </div>

      <div
        ref={ref}
        className="relative max-w-4xl mx-auto text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(32px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <p className="text-orange-400/60 text-xs tracking-[0.4em] uppercase mb-6">Limited Release</p>

        <h2
          className="font-bold tracking-tight mb-6"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
        >
          <span className="text-white">Ready to </span>
          <span
            style={{
              background: 'linear-gradient(135deg, #ff8c32 0%, #ff5500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Upgrade?
          </span>
        </h2>

        <p className="text-white/40 text-lg leading-relaxed mb-12 max-w-xl mx-auto">
          Transform your setup. Elevate your performance.
          Make the switch from ordinary to unstoppable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            className="relative px-10 py-4 rounded-full font-semibold text-black text-base overflow-hidden group transition-all duration-300 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #ff8c32, #ff5500)' }}
          >
            <span className="relative z-10">Order Now — $199</span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, #ffaa55, #ff7722)' }} />
          </button>

          <button className="px-10 py-4 rounded-full font-semibold text-white text-base border transition-all duration-300 hover:border-orange-400/50 hover:text-orange-300"
            style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
            Learn More
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-white/25 text-xs tracking-wider">
          <span>Free Worldwide Shipping</span>
          <span className="text-white/10">·</span>
          <span>2-Year Warranty</span>
          <span className="text-white/10">·</span>
          <span>30-Day Returns</span>
        </div>
      </div>
    </section>
  );
}
