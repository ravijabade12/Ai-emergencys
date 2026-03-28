import { AlertTriangle, Flame, HeartPulse, Activity } from 'lucide-react';

const severityConfig = {
  Critical: {
    icon: Activity,
    dot: 'bg-red-500',
    pillBg: 'bg-red-500/15 border-red-500/20',
    pillText: 'text-red-400',
    containerGlow: '0 0 30px rgba(239,68,68,0.2)',
    iconColor: 'text-red-400'
  },
  High: {
    icon: AlertTriangle,
    dot: 'bg-orange-500',
    pillBg: 'bg-orange-500/15 border-orange-500/20',
    pillText: 'text-orange-400',
    containerGlow: '0 0 30px rgba(249,115,22,0.2)',
    iconColor: 'text-orange-400'
  },
  Medium: {
    icon: Flame,
    dot: 'bg-amber-500',
    pillBg: 'bg-amber-500/15 border-amber-500/20',
    pillText: 'text-amber-400',
    containerGlow: '0 0 30px rgba(245,158,11,0.2)',
    iconColor: 'text-amber-400'
  },
  Low: {
    icon: HeartPulse,
    dot: 'bg-emerald-500',
    pillBg: 'bg-emerald-500/15 border-emerald-500/20',
    pillText: 'text-emerald-400',
    containerGlow: '0 0 30px rgba(16,185,129,0.2)',
    iconColor: 'text-emerald-400'
  },
};

export default function SeverityBadge({ severity, situation, confidence }) {
  const config = severityConfig[severity] || severityConfig.Medium;
  const Icon = config.icon;

  // Guess situation type category
  const situationLower = situation.toLowerCase();
  let type = "General Emergency";
  if (situationLower.includes('fire')) type = "Fire · Structural Risk";
  else if (situationLower.includes('medical') || situationLower.includes('pain') || situationLower.includes('attack')) type = "Medical · Potential Trauma";
  else if (situationLower.includes('accident') || situationLower.includes('crash')) type = "Accident · Safety Risk";
  else if (situationLower.includes('bleed') || situationLower.includes('cut')) type = "Injury · Hemorrhage Risk";

  return (
    <div 
      className="w-full rounded-2xl p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      id="severity-badge"
    >
      <div className="flex items-start justify-between gap-4 relative z-10">
        
        {/* Left Side */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${config.pillBg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
              <span className={`text-xs font-mono font-bold tracking-widest uppercase ${config.pillText}`}>
                {severity}
              </span>
            </div>
            {typeof confidence === 'number' && (
              <span className="text-xs font-mono text-[#8A8F98]">
                {confidence}% confident
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-[#EDEDEF] tracking-tight leading-[1.15] mb-2">
            {situation}
          </h2>
          <p className="text-sm text-[#8A8F98]">
            {type}
          </p>
        </div>

        {/* Right Side Icon */}
        <div className="flex-shrink-0">
          <div 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center"
            style={{ boxShadow: config.containerGlow }}
          >
            <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${config.iconColor}`} />
          </div>
        </div>

      </div>
    </div>
  );
}
