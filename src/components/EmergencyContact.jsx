import { Phone, MessageCircle } from 'lucide-react';
import { generateEmergencyMessage } from '../utils/whatsapp';

export default function EmergencyContact({ contact, result }) {
  if (!contact) return null;

  const emergencyMessage = result ? generateEmergencyMessage(result) : '';

  const handleShare = () => {
    if (!emergencyMessage) return;
    const encoded = encodeURIComponent(emergencyMessage);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full" id="emergency-contact">
      {/* Left button - Call */}
      <a
        href={`tel:${contact.number}`}
        className="flex-1 flex justify-center items-center outline-none w-full"
        style={{ textDecoration: 'none' }}
      >
        <div 
          className="w-full flex justify-center items-center gap-2 py-4 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-200"
          style={{
            background: '#DC2626',
            boxShadow: '0 0 0 1px rgba(220,38,38,0.4), 0 4px 20px rgba(220,38,38,0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#EF4444';
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(239,68,68,0.5), 0 8px 30px rgba(239,68,68,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#DC2626';
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(220,38,38,0.4), 0 4px 20px rgba(220,38,38,0.3)';
          }}
        >
          <Phone className="w-4 h-4 fill-white animate-pulse" />
          Call {contact.number} — {contact.name}
        </div>
      </a>

      {/* Right button - Share */}
      <button
        onClick={handleShare}
        className="flex-1 flex justify-center items-center w-full gap-2 py-4 rounded-xl text-sm font-semibold text-[#EDEDEF] cursor-pointer transition-all duration-200"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        }}
      >
        <MessageCircle className="w-4 h-4 text-[#EDEDEF]" />
        Share Alert
      </button>
    </div>
  );
}
