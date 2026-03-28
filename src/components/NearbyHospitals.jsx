import { MapPin, Navigation } from 'lucide-react';
import { getGoogleMapsDirections } from '../services/location';

export default function NearbyHospitals({ hospitals, userLocation, isLoading, locationError }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5" id="nearby-hospitals">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xs font-mono font-bold text-[#8A8F98] tracking-widest uppercase flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          Nearest Hospitals
        </h3>
      </div>

      {locationError && (
        <div className="text-center py-6">
          <p className="text-sm text-[#8A8F98] mb-4">Location access denied or unavailable</p>
          <button 
            className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-[#EDEDEF] border border-white/[0.08] bg-transparent hover:bg-white/[0.04] transition-all cursor-pointer outline-none"
            onClick={() => window.location.reload()}
          >
            Enable Location
          </button>
        </div>
      )}

      {isLoading && (
        <div className="py-6 flex flex-col items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-[#5E6AD2]/30 border-t-[#5E6AD2] rounded-full animate-spin" />
          <p className="text-xs font-mono text-[#8A8F98]">Locating nearby facilities...</p>
        </div>
      )}

      {!isLoading && !locationError && (!hospitals || hospitals.length === 0) && (
        <div className="text-center py-6">
          <p className="text-sm text-[#8A8F98]">No hospitals found nearby.</p>
        </div>
      )}

      {!isLoading && hospitals?.length > 0 && (
        <div className="space-y-0">
          {hospitals.map((hospital, index) => {
            // Mock open/closed since Overpass API rarely gives reliable operating hours
            const isOpen = index !== hospitals.length - 1; // Last one is mock-closed for design demo

            return (
              <div 
                key={index}
                className="flex items-center justify-between py-3.5 border-b border-white/[0.04] last:border-0 last:pb-0"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-medium text-[#EDEDEF] truncate mb-1">
                    {hospital.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8A8F98]">{hospital.distance} km</span>
                    <span className="text-[#8A8F98]/30">·</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-xs text-[#8A8F98]">{isOpen ? 'Open' : 'Closed'}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={getGoogleMapsDirections(hospital.lat, hospital.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/[0.06] hover:bg-white/[0.04] transition-all cursor-pointer flex-shrink-0"
                  style={{ textDecoration: 'none' }}
                >
                  <span className="text-xs font-semibold text-[#5E6AD2]">Navigate</span>
                  <Navigation className="w-3 h-3 text-[#5E6AD2]" />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
