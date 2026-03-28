import { ShieldAlert } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full text-center pt-12 sm:pt-16 pb-8 relative">
      {/* Ambient glow behind logo */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(94,106,210,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative flex items-center justify-center gap-3.5 mb-4">
        {/* Shield icon */}
        <div className="relative">
          <div className="p-2 rounded-xl border border-white/[0.06] bg-white/[0.03]"
            style={{
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 2px 12px rgba(0,0,0,0.3), 0 0 30px rgba(94,106,210,0.08)'
            }}
          >
            <ShieldAlert className="w-7 h-7 text-[#5E6AD2]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
          <span className="text-gradient">Emergency</span>{' '}
          <span className="text-gradient-accent">Copilot</span>
        </h1>
      </div>

      {/* Tagline with mono labels */}
      <div className="flex items-center justify-center gap-3 text-xs sm:text-sm">
        <span className="text-[#8A8F98]/50 font-mono tracking-widest uppercase text-[10px]">Chaos</span>
        <span className="text-white/10">→</span>
        <span className="text-[#8A8F98]/70 font-mono tracking-widest uppercase text-[10px]">Clarity</span>
        <span className="text-white/10">→</span>
        <span className="text-[#5E6AD2] font-mono tracking-widest uppercase text-[10px] font-medium">Action</span>
      </div>
    </header>
  );
}
