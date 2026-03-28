import SeverityBadge from './SeverityBadge';
import ActionSteps from './ActionSteps';
import EmergencyContact from './EmergencyContact';
import NearbyHospitals from './NearbyHospitals';
import BloodRequest from './BloodRequest';
import SummaryCard from './SummaryCard';
import DetectedIssues from './DetectedIssues';

export default function ResultCard({
  result,
  hospitals,
  hospitalsLoading,
  userLocation,
  locationError,
}) {
  if (!result) return null;

  const nearestHospital = hospitals?.[0] || null;

  // Background glow settings based on severity
  const glowConfig = {
    Critical: 'rgba(239, 68, 68, 0.15)',
    High: 'rgba(249, 115, 22, 0.15)',
    Medium: 'rgba(245, 158, 11, 0.15)',
    Low: 'rgba(16, 185, 129, 0.15)',
  };
  const glowColor = glowConfig[result.severity] || glowConfig.Medium;

  return (
    <div className="w-full relative animate-fade-in" id="result-page">
      {/* Ambient glow behind results */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none z-[-1]"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 60%)`,
          filter: 'blur(100px)',
        }}
        aria-hidden="true"
      />

      {/* Cards stack — all cards have small gap */}
      <div className="flex flex-col gap-3 pb-2">
        
        <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
          <SeverityBadge
            severity={result.severity}
            situation={result.situation}
            confidence={result.confidence}
          />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '60ms' }}>
          <EmergencyContact
            contact={result.emergencyContact}
            result={result}
          />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '120ms' }}>
          <ActionSteps actions={result.actions} />
        </div>

        {result.detectedIssues && result.detectedIssues.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '180ms' }}>
            <DetectedIssues issues={result.detectedIssues} />
          </div>
        )}

        {result.needsBlood && (
          <div className="animate-slide-up" style={{ animationDelay: '240ms' }}>
            <BloodRequest
              nearestHospital={nearestHospital}
              userLocation={userLocation}
            />
          </div>
        )}

        <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <NearbyHospitals
            hospitals={hospitals}
            userLocation={userLocation}
            isLoading={hospitalsLoading}
            locationError={locationError}
          />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '360ms' }}>
          <SummaryCard summary={result.summary} />
        </div>

      </div>
    </div>
  );
}
