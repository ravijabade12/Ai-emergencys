export default function LoadingPulse() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in" id="loading-indicator">
      {/* Concentric rings */}
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full border border-[#5E6AD2]/20 animate-ping-slow" />
        <div className="absolute inset-2 rounded-full border border-[#5E6AD2]/15 animate-ping-slow" style={{ animationDelay: '200ms' }} />
        <div className="absolute inset-4 rounded-full border border-[#5E6AD2]/10 animate-ping-slow" style={{ animationDelay: '400ms' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-6 h-6 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, #5E6AD2 0%, rgba(94,106,210,0.3) 100%)',
              boxShadow: '0 0 20px rgba(94,106,210,0.3), 0 0 40px rgba(94,106,210,0.15)',
            }}
          />
        </div>
      </div>

      {/* Text */}
      <p className="text-sm font-semibold text-[#EDEDEF] mb-1.5 tracking-tight">
        Analyzing Emergency
      </p>
      <p className="text-xs text-[#8A8F98]/60 font-mono tracking-wide">
        Processing situation for immediate guidance
      </p>

      {/* Dots */}
      <div className="flex gap-1 mt-5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#5E6AD2]"
            style={{
              animation: 'bounce-dot 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
