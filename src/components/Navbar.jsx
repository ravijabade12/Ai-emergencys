import { useState, useEffect } from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function Navbar({ onTryNow }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050506]/80 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent border-b border-transparent'
      }`}
      style={{ transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left — Brand */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03]">
            <ShieldAlert className="w-4 h-4 text-[#5E6AD2]" />
          </div>
          <span className="text-sm font-semibold text-[#EDEDEF] tracking-tight">
            AI Emergency Copilot
          </span>
        </div>

        {/* Right — CTA */}
        <button
          onClick={onTryNow}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg cursor-pointer text-white"
          style={{
            background: '#5E6AD2',
            boxShadow: '0 0 0 1px rgba(94,106,210,0.5), 0 2px 8px rgba(94,106,210,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#6872D9';
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(94,106,210,0.6), 0 4px 16px rgba(94,106,210,0.35), inset 0 1px 0 rgba(255,255,255,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#5E6AD2';
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(94,106,210,0.5), 0 2px 8px rgba(94,106,210,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
          }}
        >
          Try Now <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </nav>
  );
}
