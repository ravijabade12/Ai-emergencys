import { useState } from 'react';

export default function ActionSteps({ actions }) {
  const [completed, setCompleted] = useState(new Set());

  const toggleStep = (index) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  if (!actions || actions.length === 0) return null;

  const progressPct = Math.round((completed.size / actions.length) * 100);

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5" id="action-steps">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono font-bold text-[#8A8F98] tracking-widest uppercase">
          Immediate Actions
        </h3>
        <span className="text-xs font-mono text-[#8A8F98]">
          {completed.size} / {actions.length} completed
        </span>
      </div>

      {/* Steps List */}
      <div className="space-y-0">
        {actions.map((action, index) => {
          const isDone = completed.has(index);
          const numStr = (index + 1).toString().padStart(2, '0');
          
          return (
            <div
              key={index}
              onClick={() => toggleStep(index)}
              className="group flex items-start gap-3 sm:gap-4 py-3 border-b border-white/[0.04] last:border-0 cursor-pointer transition-all duration-200"
            >
              {/* Circle */}
              <div 
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 mt-0.5 ${
                  isDone 
                    ? 'bg-[#5E6AD2] border border-[#5E6AD2]' 
                    : 'bg-transparent border border-[#5E6AD2]'
                }`}
              >
                <span className={`text-[10px] font-mono ${isDone ? 'text-white' : 'text-[#5E6AD2]'}`}>
                  {numStr}
                </span>
              </div>
              
              {/* Text */}
              <div className="flex-1 pt-0.5">
                <p 
                  className={`text-sm leading-relaxed transition-all duration-200 ${
                    isDone ? 'text-[#8A8F98]/60 line-through' : 'text-[#EDEDEF]'
                  }`}
                >
                  {action}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-0.5 bg-white/[0.04] rounded-full mt-4 overflow-hidden">
        <div 
          className="h-full bg-[#5E6AD2] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
