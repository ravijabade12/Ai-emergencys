import { useState } from 'react';
import { Droplets, MessageCircle, User, Phone, Heart, Info } from 'lucide-react';
import { generateBloodRequestMessage, openWhatsApp } from '../utils/whatsapp';
import { getGoogleMapsLink } from '../services/location';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodRequest({ nearestHospital, userLocation }) {
  const [bloodGroup, setBloodGroup] = useState('');
  const [unknownBloodGroup, setUnknownBloodGroup] = useState(false);
  const [units, setUnits] = useState(2);
  const [patientName, setPatientName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [sent, setSent] = useState(false);

  const hospitalName = nearestHospital?.name || 'Nearest Hospital';
  const mapsLink = nearestHospital
    ? getGoogleMapsLink(nearestHospital.lat, nearestHospital.lng)
    : userLocation
      ? getGoogleMapsLink(userLocation.lat, userLocation.lng)
      : '';

  const canSubmit = (bloodGroup || unknownBloodGroup) && contactName.trim() && contactPhone.trim();

  const handleSendBloodRequest = () => {
    const groups = unknownBloodGroup ? 'O+ / O- (Universal Donor)' : bloodGroup;
    const message = generateBloodRequestMessage({
      bloodGroup: groups,
      units,
      patientName: patientName.trim() || undefined,
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      hospitalName,
      mapsLink,
    });
    openWhatsApp(message);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="card card-blood p-5 sm:p-6" id="blood-request">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="p-2 rounded-xl border border-red-500/15 bg-red-500/[0.06]"
          style={{ boxShadow: '0 0 15px rgba(220,38,38,0.06), 0 0 0 1px rgba(220,38,38,0.08)' }}
        >
          <Droplets className="w-4 h-4 text-red-400" />
        </div>
        <div>
          <h3 className="text-[10px] font-mono font-bold text-red-300/80 tracking-[0.2em] uppercase">
            Blood Request
          </h3>
          <p className="text-[10px] text-[#8A8F98]/40 font-mono mt-0.5">
            Blood may be needed — send request via WhatsApp
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Blood Group */}
        <div>
          <label className="text-[10px] font-mono font-bold text-[#8A8F98] tracking-[0.15em] uppercase mb-2.5 block">
            Blood Group
          </label>
          <div className="flex flex-wrap gap-1.5">
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => { setBloodGroup(bg); setUnknownBloodGroup(false); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold cursor-pointer border transition-all duration-200 ${
                  bloodGroup === bg && !unknownBloodGroup
                    ? 'bg-red-500/15 border-red-500/30 text-red-300'
                    : 'bg-white/[0.02] border-white/[0.06] text-[#8A8F98]/60 hover:bg-white/[0.05] hover:text-[#EDEDEF]'
                }`}
                style={{ transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                {bg}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setUnknownBloodGroup(true); setBloodGroup(''); }}
            className={`mt-2 flex items-center gap-1.5 text-[10px] font-mono cursor-pointer transition-colors ${
              unknownBloodGroup ? 'text-amber-400/80' : 'text-[#8A8F98]/30 hover:text-[#8A8F98]/60'
            }`}
          >
            <Info className="w-3 h-3" />
            Unknown? Request O+/O- universal donors
          </button>
        </div>

        {/* Units */}
        <div>
          <label className="text-[10px] font-mono font-bold text-[#8A8F98] tracking-[0.15em] uppercase mb-2.5 block">
            Units
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setUnits(Math.max(1, units - 1))}
              className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#EDEDEF] font-mono font-bold flex items-center justify-center hover:bg-white/[0.06] cursor-pointer"
              style={{ transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.03)' }}
            >
              −
            </button>
            <span className="text-lg font-mono font-bold text-[#EDEDEF] w-8 text-center">{units}</span>
            <button
              onClick={() => setUnits(Math.min(10, units + 1))}
              className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#EDEDEF] font-mono font-bold flex items-center justify-center hover:bg-white/[0.06] cursor-pointer"
              style={{ transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.03)' }}
            >
              +
            </button>
          </div>
        </div>

        {/* Patient Name */}
        <div>
          <label className="text-[10px] font-mono font-bold text-[#8A8F98] tracking-[0.15em] uppercase mb-1.5 flex items-center gap-1.5">
            <User className="w-3 h-3" />
            Patient <span className="text-[#8A8F98]/30 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Patient's name"
            className="w-full bg-[#0a0a0c] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[#EDEDEF] placeholder:text-[#8A8F98]/25 outline-none focus:border-[#5E6AD2]/50 transition-colors font-mono"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)' }}
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-mono font-bold text-[#8A8F98] tracking-[0.15em] uppercase mb-1.5 flex items-center gap-1.5">
              <User className="w-3 h-3" /> Contact *
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-[#0a0a0c] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[#EDEDEF] placeholder:text-[#8A8F98]/25 outline-none focus:border-[#5E6AD2]/50 transition-colors font-mono"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)' }}
            />
          </div>
          <div>
            <label className="text-[10px] font-mono font-bold text-[#8A8F98] tracking-[0.15em] uppercase mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> Phone *
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full bg-[#0a0a0c] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[#EDEDEF] placeholder:text-[#8A8F98]/25 outline-none focus:border-[#5E6AD2]/50 transition-colors font-mono"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)' }}
            />
          </div>
        </div>

        {/* Hospital auto-fill */}
        <div className="flex items-center gap-3 px-3.5 py-2.5 bg-white/[0.02] rounded-xl border border-white/[0.04]">
          <Heart className="w-4 h-4 text-red-400/50 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono text-[#8A8F98]/30 tracking-wide">AUTO-DETECTED HOSPITAL</p>
            <p className="text-xs text-[#8A8F98]/70 font-medium truncate">{hospitalName}</p>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSendBloodRequest}
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold text-white cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
          style={{
            background: canSubmit ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#16a34a',
            boxShadow: canSubmit
              ? '0 0 0 1px rgba(22,163,74,0.5), 0 4px 16px rgba(22,163,74,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
              : 'none',
            transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          id="send-blood-request"
        >
          <MessageCircle className="w-4.5 h-4.5" />
          {sent ? '✓ Opened in WhatsApp' : 'Send Blood Request via WhatsApp'}
        </button>
      </div>
    </div>
  );
}
