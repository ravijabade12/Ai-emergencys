import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function SummaryCard({ summary }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = summary;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 relative group" id="summary-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-mono font-bold text-[#8A8F98] tracking-widest uppercase">
          Summary
        </h3>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[#8A8F98] hover:bg-white/[0.06] hover:text-[#EDEDEF] transition-all cursor-pointer absolute top-4 right-4"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#5E6AD2]" />
              <span className="text-xs font-mono text-[#5E6AD2]">Copied!</span>
            </>
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <p className="text-sm text-[#8A8F98] leading-relaxed mt-3 pr-8">
        {summary}
      </p>
    </div>
  );
}
