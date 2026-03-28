import { useState, useRef, useEffect } from 'react';
import { SendHorizonal, AlertTriangle, Mic, MicOff } from 'lucide-react';
import { createSpeechRecognizer, isSpeechSupported } from '../services/speech';

const PLACEHOLDER_EXAMPLES = [
  '"My father has chest pain and is sweating"',
  '"There\'s a bike accident, he\'s bleeding"',
  '"There is a fire in my kitchen"',
  '"Someone fell from the stairs and can\'t move"',
  '"A child swallowed cleaning liquid"',
];

export default function EmergencyInput({ onSubmit, isLoading }) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognizerRef = useRef(null);
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [placeholderIdx] = useState(() =>
    Math.floor(Math.random() * PLACEHOLDER_EXAMPLES.length)
  );

  const speechSupported = isSpeechSupported();

  // Mouse spotlight tracking
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Speech recognizer setup
  useEffect(() => {
    if (!speechSupported) return;
    const recognizer = createSpeechRecognizer();
    recognizer.onResult(({ final, interim }) => {
      setInput(final);
      setInterimText(interim);
    });
    recognizer.onError(() => {
      setIsRecording(false);
      setInterimText('');
    });
    recognizer.onEnd(() => {
      setIsRecording(false);
      setInterimText('');
    });
    recognizerRef.current = recognizer;
    return () => recognizer.stop();
  }, [speechSupported]);

  const toggleRecording = () => {
    const recognizer = recognizerRef.current;
    if (!recognizer) return;
    if (isRecording) {
      recognizer.stop();
      setIsRecording(false);
      setInterimText('');
    } else {
      setInput('');
      setInterimText('');
      recognizer.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRecording) {
      recognizerRef.current?.stop();
      setIsRecording(false);
      setInterimText('');
    }
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto" id="emergency-form">
      <div
        ref={cardRef}
        className="relative card group"
        style={{
          borderColor: isRecording ? 'rgba(239,68,68,0.3)' : undefined,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Mouse-tracking spotlight */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background: isHovering
              ? `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(94,106,210,0.08), transparent 70%)`
              : 'none',
            opacity: isHovering ? 1 : 0,
          }}
        />

        {/* Recording ambient glow */}
        {isRecording && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.04) 0%, transparent 70%)',
            }}
          />
        )}

        <div className="relative p-5 sm:p-6">
          {/* Label */}
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]/70" />
            <label htmlFor="emergency-input" className="text-xs font-mono tracking-widest uppercase text-[#8A8F98]">
              {isRecording ? (
                <span className="text-red-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                  Listening
                </span>
              ) : (
                'Describe Emergency'
              )}
            </label>
          </div>

          {/* Textarea + Mic */}
          <div className="relative">
            <textarea
              id="emergency-input"
              value={input + (interimText ? (input ? ' ' : '') : '')}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDER_EXAMPLES[placeholderIdx]}
              disabled={isLoading}
              rows={4}
              className="w-full bg-transparent text-[#EDEDEF] text-base sm:text-lg placeholder:text-[#8A8F98]/30 resize-none outline-none leading-relaxed disabled:opacity-40 pr-14"
              style={{ caretColor: '#5E6AD2' }}
              autoFocus
            />

            {/* Mic button */}
            {speechSupported && (
              <button
                type="button"
                onClick={toggleRecording}
                disabled={isLoading}
                className={`absolute top-1 right-1 p-2.5 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-30 ${
                  isRecording
                    ? 'bg-red-500/15 text-red-400 recording-pulse'
                    : 'bg-white/[0.03] text-[#8A8F98] hover:bg-white/[0.06] hover:text-[#EDEDEF] border border-white/[0.06]'
                }`}
                title={isRecording ? 'Stop recording' : 'Voice input'}
                id="mic-button"
              >
                {isRecording ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
              </button>
            )}
          </div>

          {/* Bottom bar — divider + controls */}
          <div className="section-divider mt-4 mb-3" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8A8F98]/40 hidden sm:flex items-center gap-1.5 font-mono tracking-wide">
              {speechSupported && <><Mic className="w-3 h-3" /> voice ·</>}
              <kbd className="px-1 py-0.5 bg-white/[0.04] rounded text-[10px] border border-white/[0.06]">⌘</kbd>
              <span>+</span>
              <kbd className="px-1 py-0.5 bg-white/[0.04] rounded text-[10px] border border-white/[0.06]">↵</kbd>
            </span>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              id="submit-emergency"
              className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-20 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing</span>
                </>
              ) : (
                <>
                  <SendHorizonal className="w-3.5 h-3.5" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
