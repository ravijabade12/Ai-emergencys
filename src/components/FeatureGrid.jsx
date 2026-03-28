import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  ListChecks,
  Phone,
  Droplets,
  Hospital,
  AlertTriangle,
  Navigation,
} from 'lucide-react';

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

function FeatureCard({ icon: Icon, title, children, delay = 0, className = '', iconBg = 'bg-[#5E6AD2]/10 border-[#5E6AD2]/15' }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`rounded-2xl p-6 sm:p-7 relative overflow-hidden ${className}`}
      style={{
        background: hovered
          ? 'linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.03))'
          : 'linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(255,255,255,0.015))',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hovered
          ? '0 0 0 1px rgba(255,255,255,0.06), 0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(94,106,210,0.04)'
          : '0 0 0 1px rgba(255,255,255,0.03), 0 2px 20px rgba(0,0,0,0.3)',
        transform: inView
          ? hovered ? 'translateY(-4px)' : 'translateY(0)'
          : 'translateY(24px)',
        opacity: inView ? 1 : 0,
        transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: inView ? `${delay}ms` : '0ms',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Icon */}
      <div className={`inline-flex p-2.5 rounded-xl border ${iconBg} mb-4`}>
        <Icon className="w-5 h-5 text-[#5E6AD2]" />
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-semibold text-[#EDEDEF] tracking-tight mb-2">
        {title}
      </h3>

      {/* Content */}
      <div className="text-sm text-[#8A8F98] leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export default function FeatureGrid() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef);

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16" id="features">
      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-16 sm:mb-20" />

      {/* Section heading */}
      <div
        ref={headingRef}
        className="text-center mb-12 sm:mb-16"
        style={{
          opacity: headingInView ? 1 : 0,
          transform: headingInView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <p className="text-[10px] font-mono font-bold text-[#5E6AD2] tracking-[0.25em] uppercase mb-4">
          How It Works
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-gradient leading-tight">
          What happens after you <br className="hidden sm:block" />describe the emergency?
        </h2>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 — Triage */}
        <FeatureCard icon={Activity} title="Instant Triage Analysis" delay={0}>
          <p className="mb-3">
            The AI reads your input and classifies the emergency instantly — situation type, severity level, and every detected issue.
          </p>
          {/* Mock severity badge */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-red-300 tracking-wider">CRITICAL</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[10px] font-mono font-bold text-amber-300 tracking-wider">MEDIUM</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-mono font-bold text-emerald-300 tracking-wider">LOW</span>
            </div>
          </div>
        </FeatureCard>

        {/* Card 2 — First Aid */}
        <FeatureCard icon={ListChecks} title="Step-by-Step First Aid" delay={80}>
          <p className="mb-3">
            Numbered, plain-language instructions specific to your emergency. Not generic advice — exactly what to do right now, in order.
          </p>
          {/* Mock steps */}
          <div className="space-y-1.5 mt-3">
            {['Check if the person is breathing', 'Apply firm pressure to the wound', 'Do not move — possible spine injury'].map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#8A8F98]/60">
                <span className="text-[#5E6AD2] font-mono font-bold text-[10px] mt-0.5">{i + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </FeatureCard>

        {/* Card 3 — Emergency Call */}
        <FeatureCard icon={Phone} title="One-Tap Emergency Call" delay={160}>
          <p className="mb-3">
            A prominent button to call 108 (ambulance) instantly. No searching for numbers, no dialing. One tap — connected.
          </p>
          {/* Mock call button */}
          <div className="mt-3">
            <div
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                boxShadow: '0 0 0 1px rgba(220,38,38,0.4), 0 4px 12px rgba(220,38,38,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <Phone className="w-3.5 h-3.5" />
              Call 108
            </div>
          </div>
        </FeatureCard>

        {/* Card 4 — Blood Request */}
        <FeatureCard
          icon={Droplets}
          title="Blood Request via WhatsApp"
          delay={240}
          iconBg="bg-red-500/10 border-red-500/15"
        >
          <p className="mb-3">
            If the AI detects heavy bleeding, a blood request form appears. Select blood group, nearest hospital auto-fills, and a complete emergency message is generated — shared via WhatsApp in one tap.
          </p>
          {/* Mock blood groups */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {['A+', 'B+', 'O+', 'AB+'].map((bg) => (
              <span
                key={bg}
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold border bg-white/[0.02] border-white/[0.06] text-[#8A8F98]/50"
              >
                {bg}
              </span>
            ))}
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold bg-red-500/10 border border-red-500/20 text-red-300">
              O−
            </span>
          </div>
        </FeatureCard>

        {/* Card 5 — Hospitals — Full width */}
        <FeatureCard
          icon={Hospital}
          title="Nearest Hospitals"
          delay={320}
          className="md:col-span-2"
        >
          <p className="mb-4">
            Using your live location, the app finds the 3 closest hospitals. See name, distance, and navigate instantly via Google Maps.
          </p>
          {/* Mock hospital list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { name: 'City General Hospital', dist: '1.2 km' },
              { name: 'Apollo Emergency', dist: '2.8 km' },
              { name: 'Manipal Hospital', dist: '4.1 km' },
            ].map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
              >
                <div className="w-6 h-6 rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-mono font-bold text-[#5E6AD2]">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#EDEDEF]/80 truncate">{h.name}</p>
                  <p className="text-[10px] font-mono text-[#8A8F98]/40">{h.dist}</p>
                </div>
                <Navigation className="w-3 h-3 text-[#5E6AD2]/40 flex-shrink-0" />
              </div>
            ))}
          </div>
        </FeatureCard>
      </div>
    </section>
  );
}
