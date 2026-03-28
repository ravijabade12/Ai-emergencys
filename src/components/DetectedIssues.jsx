export default function DetectedIssues({ issues }) {
  if (!issues || issues.length === 0) return null;

  const dangerousKeywords = ['bleeding', 'fire', 'fracture', 'unconscious', 'heart', 'cardiac', 'choking'];

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5" id="detected-issues">
      <h3 className="text-xs font-mono font-bold text-[#8A8F98] tracking-widest uppercase mb-4">
        Detected Issues
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {issues.map((issue, i) => {
          const isDangerous = dangerousKeywords.some(kw => issue.toLowerCase().includes(kw));
          
          return (
            <span
              key={i}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                isDangerous
                  ? 'bg-red-500/10 border-red-500/20 text-red-100'
                  : 'bg-white/[0.06] border-white/[0.08] text-[#EDEDEF]'
              }`}
            >
              {issue}
            </span>
          );
        })}
      </div>
    </div>
  );
}
