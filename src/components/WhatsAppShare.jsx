import { MessageCircle } from 'lucide-react';

export default function WhatsAppShare({ message, label = 'Share via WhatsApp', variant = 'default' }) {
  const handleClick = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const isUrgent = variant === 'urgent';

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
        isUrgent
          ? 'bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
          : 'bg-white/[0.03] hover:bg-white/[0.06] text-[#8A8F98] hover:text-[#EDEDEF] border border-white/[0.06]'
      }`}
      style={{
        transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isUrgent
          ? '0 0 0 1px rgba(16,185,129,0.08)'
          : 'inset 0 0 0 1px rgba(255,255,255,0.03)',
      }}
      title={label}
      id="whatsapp-share-button"
    >
      <MessageCircle className="w-3.5 h-3.5" />
      <span className="font-mono tracking-wide">{label}</span>
    </button>
  );
}
