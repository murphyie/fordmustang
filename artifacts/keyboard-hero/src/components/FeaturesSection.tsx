import { useEffect, useRef, useState } from 'react';

const features = [
  {
    number: '01',
    title: 'Lightning Response',
    description: 'Ultra-fast mechanical switches with sub-1ms actuation. Every keystroke registers before your competitors even see it coming.',
    tag: 'Performance',
  },
  {
    number: '02',
    title: 'Dynamic RGB',
    description: 'Per-key customizable lighting with 16.8M colors. Pulse, wave, react — your keyboard, your story.',
    tag: 'Aesthetics',
  },
  {
    number: '03',
    title: 'Aircraft Aluminum',
    description: 'Precision-milled aluminum frame paired with double-shot PBT keycaps. Built for thousands of hours of heavy use.',
    tag: 'Durability',
  },
  {
    number: '04',
    title: 'N-Key Rollover',
    description: 'Every single key registers simultaneously. No ghosting. No missed inputs. Pure gaming precision.',
    tag: 'Accuracy',
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
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
    <div
      ref={ref}
      className="relative border-t border-white/8 pt-8 pb-10 group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s`,
      }}
    >
      <div className="flex items-start gap-8">
        <span className="text-white/15 font-mono text-sm tracking-widest shrink-0 mt-1">{feature.number}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-white text-xl font-semibold tracking-tight">{feature.title}</h3>
            <span className="text-[10px] tracking-widest uppercase text-orange-400/70 border border-orange-400/20 px-2 py-0.5 rounded-full">
              {feature.tag}
            </span>
          </div>
          <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,140,50,0.15), transparent)',
          opacity: 0,
          transition: 'opacity 0.3s',
        }}
      />
    </div>
  );
}

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-black py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/4 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,100,30,0.04) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div
          ref={ref}
          className="mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <p className="text-orange-400/60 text-xs tracking-[0.4em] uppercase mb-4">What's inside</p>
          <h2
            className="font-bold tracking-tight"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.5) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Engineered to
            <br />
            <span style={{ WebkitTextFillColor: 'rgba(255,140,50,0.9)' }}>Dominate</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16">
          {features.map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
