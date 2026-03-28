import { useState, useRef, useEffect } from 'react';
import { RotateCcw, AlertOctagon } from 'lucide-react';
import Navbar from './components/Navbar';
import HeroInput from './components/HeroInput';
import FeatureGrid from './components/FeatureGrid';
import LoadingPulse from './components/LoadingPulse';
import ResultCard from './components/ResultCard';
import { analyzeEmergency } from './services/gemini';
import { getCurrentPosition, findNearbyHospitals } from './services/location';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resultRef = useRef(null);
  const inputRef = useRef(null);

  // Location & hospital state
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [hospitalsLoading, setHospitalsLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Request location on mount
  useEffect(() => {
    getCurrentPosition()
      .then((pos) => setUserLocation(pos))
      .catch((err) => {
        console.warn('Location unavailable:', err.message);
        setLocationError(err.message);
      });
  }, []);

  // Fetch hospitals when we have location + result
  useEffect(() => {
    if (!userLocation || !result) return;
    setHospitalsLoading(true);
    findNearbyHospitals(userLocation.lat, userLocation.lng)
      .then((results) => setHospitals(results))
      .catch(() => setHospitals([]))
      .finally(() => setHospitalsLoading(false));
  }, [userLocation, result]);

  const handleSubmit = async (inputText) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setHospitals([]);

    try {
      const response = await analyzeEmergency(inputText);
      setResult(response);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setLoading(false);
    setHospitals([]);
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 sm:px-6 pb-16 overflow-hidden">

      {/* ═══ Ambient Gradient Blobs (Layer 3) ═══ */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden" aria-hidden="true">
        {/* Primary blob — top center */}
        <div
          className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full animate-float"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(94,106,210,0.18) 0%, transparent 60%)',
            filter: 'blur(150px)',
          }}
        />
        {/* Secondary blob — left */}
        <div
          className="absolute top-[30%] -left-[200px] w-[600px] h-[800px] rounded-full animate-float-reverse"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, transparent 60%)',
            filter: 'blur(120px)',
          }}
        />
        {/* Tertiary blob — right */}
        <div
          className="absolute top-[50%] -right-[150px] w-[500px] h-[700px] rounded-full animate-float"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(94,106,210,0.1) 0%, transparent 60%)',
            filter: 'blur(100px)',
            animationDelay: '3s',
          }}
        />
        {/* Emergency accent blob — appears when results are active */}
        {result && (
          <div
            className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full animate-fade-in"
            style={{
              background: result.severity === 'Critical' || result.severity === 'High'
                ? 'radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(94,106,210,0.06) 0%, transparent 70%)',
              filter: 'blur(120px)',
            }}
          />
        )}
      </div>

      {/* ═══ Navbar ═══ */}
      <Navbar onTryNow={() => inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })} />

      {/* ═══ Main Content ═══ */}
      <main className="w-full flex flex-col items-center relative z-10 pt-20">
        
        {/* Section 1: Hero */}
        <div className="pt-10 pb-4 flex flex-col items-center text-center w-full max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#5E6AD2]/30 bg-[#5E6AD2]/10 mb-8" 
            style={{ boxShadow: '0 0 20px rgba(94,106,210,0.2)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E6AD2] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono font-bold text-[#5E6AD2] tracking-widest uppercase">
              AI-Powered Emergency Response
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight text-gradient mb-6 max-w-4xl leading-[1.1]">
            Describe the emergency.<br className="hidden sm:block" /> We handle the rest.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#8A8F98] max-w-2xl mb-12">
            Voice, text, or image — our AI understands any situation and gives you life-saving actions in seconds.
          </p>

          {/* Hero Input Box */}
          <div className="w-full" ref={inputRef}>
            <HeroInput onSubmit={handleSubmit} isLoading={loading} />
          </div>
        </div>

        {/* Global Loading / Error State */}
        <div className="w-full max-w-2xl mt-4">
          {loading && <LoadingPulse />}
          {error && (
            <div className="w-full animate-shake mt-4" id="error-display">
              <div className="card p-4 flex items-start gap-3" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
                <AlertOctagon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300/90 font-medium text-sm leading-relaxed">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div ref={resultRef} className="w-full max-w-xl mx-auto mt-4">
          {result && (
            <div className="pt-8 w-full">
              <ResultCard
                result={result}
                hospitals={hospitals}
                hospitalsLoading={hospitalsLoading}
                userLocation={userLocation}
                locationError={locationError}
              />

              {/* Reset */}
              <div className="flex justify-center mt-6 pb-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-transparent border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.12] text-[#8A8F98] hover:text-[#EDEDEF] rounded-xl transition-all duration-200 text-sm cursor-pointer outline-none"
                  id="new-emergency-button"
                >
                  <RotateCcw className="w-4 h-4" />
                  Report New Emergency
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Feature Grid */}
        {!result && !loading && (
          <FeatureGrid />
        )}
      </main>

      {/* ═══ Footer ═══ */}
      <footer className="mt-auto pt-8 pb-6 text-center relative z-10 w-full max-w-xl mx-auto px-4">
        {result && <div className="border-t border-white/[0.04] mb-6 w-full" />}
        <p className="text-xs text-[#8A8F98]/50 text-center leading-relaxed">
          Emergency Copilot provides AI-generated guidance. Always call professional emergency services.
        </p>
        <p className="text-[10px] sm:text-xs text-[#8A8F98]/30 mt-2 font-mono tracking-wider text-center">
          IN: <span className="text-[#8A8F98]/50">112</span> General · <span className="text-[#8A8F98]/50">108</span> Ambulance · <span className="text-[#8A8F98]/50">101</span> Fire · <span className="text-[#8A8F98]/50">100</span> Police
        </p>
      </footer>
    </div>
  );
}

export default App;
