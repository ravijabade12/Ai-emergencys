import { useState, useRef, useEffect } from 'react';
import { Mic, Type, Camera, SendHorizonal, MicOff } from 'lucide-react';
import { createSpeechRecognizer, isSpeechSupported } from '../services/speech';

const TABS = [
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'photo', label: 'Photo', icon: Camera },
];

export default function HeroInput({ onSubmit, isLoading }) {
  const [activeTab, setActiveTab] = useState('text');
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognizerRef = useRef(null);
  const textareaRef = useRef(null);

  const speechSupported = isSpeechSupported();

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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'voice' && speechSupported) {
      startRecording();
    } else if (isRecording) {
      stopRecording();
    }
    if (tabId === 'text') {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const startRecording = () => {
    const r = recognizerRef.current;
    if (!r) return;
    setInput('');
    setInterimText('');
    r.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognizerRef.current?.stop();
    setIsRecording(false);
    setInterimText('');
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (isRecording) stopRecording();
    if (input.trim() && !isLoading) onSubmit(input.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(e);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      {/* Ambient glow behind card */}
      <div
        className="absolute -inset-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(94,106,210,0.12) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Card */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 2px 20px rgba(0,0,0,0.4), 0 0 80px rgba(94,106,210,0.1)',
        }}
      >
        {/* Top edge highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        <div className="p-5 sm:p-7">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.04] mb-5 w-fit">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDisabled = tab.id === 'voice' && !speechSupported;
              const isPhotoDisabled = tab.id === 'photo';

              return (
                <button
                  key={tab.id}
                  onClick={() => !isDisabled && !isPhotoDisabled && handleTabChange(tab.id)}
                  disabled={isDisabled || isPhotoDisabled}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-[#5E6AD2]/15 text-[#5E6AD2] border border-[#5E6AD2]/25'
                      : isDisabled || isPhotoDisabled
                        ? 'text-[#8A8F98]/20 cursor-not-allowed border border-transparent'
                        : 'text-[#8A8F98]/60 hover:text-[#8A8F98] border border-transparent hover:bg-white/[0.03]'
                  }`}
                  style={{ transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {isPhotoDisabled && <span className="text-[8px] ml-0.5 opacity-50">soon</span>}
                </button>
              );
            })}
          </div>

          {/* Voice recording state */}
          {activeTab === 'voice' && isRecording && (
            <div className="flex flex-col items-center py-8 gap-4">
              <div className="relative">
                <button
                  onClick={stopRecording}
                  className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer recording-pulse"
                  style={{
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    boxShadow: '0 0 30px rgba(239,68,68,0.15)',
                  }}
                >
                  <MicOff className="w-6 h-6 text-red-400" />
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-mono text-red-400/80 tracking-wider uppercase">Listening</span>
              </div>
              {(input || interimText) && (
                <p className="text-sm text-center text-[#EDEDEF]/80 max-w-md leading-relaxed">
                  {input}
                  {interimText && <span className="text-[#8A8F98]/50"> {interimText}</span>}
                </p>
              )}
            </div>
          )}

          {/* Voice idle state */}
          {activeTab === 'voice' && !isRecording && (
            <div className="flex flex-col items-center py-8 gap-4">
              <button
                onClick={startRecording}
                className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
                style={{
                  background: 'rgba(94,106,210,0.1)',
                  border: '1px solid rgba(94,106,210,0.2)',
                  boxShadow: '0 0 20px rgba(94,106,210,0.1)',
                  transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(94,106,210,0.15)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(94,106,210,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(94,106,210,0.1)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(94,106,210,0.1)';
                }}
              >
                <Mic className="w-6 h-6 text-[#5E6AD2]" />
              </button>
              <span className="text-xs font-mono text-[#8A8F98]/40 tracking-wider">Tap to speak</span>
              {input && (
                <p className="text-sm text-center text-[#EDEDEF]/80 max-w-md leading-relaxed mt-2">
                  {input}
                </p>
              )}
            </div>
          )}

          {/* Text input */}
          {activeTab === 'text' && (
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. There's a bike accident, person is bleeding heavily and unconscious..."
              disabled={isLoading}
              rows={4}
              className="w-full rounded-xl px-4 py-3.5 text-sm text-[#EDEDEF] placeholder:text-[#8A8F98]/25 resize-none outline-none mb-4 leading-relaxed disabled:opacity-40"
              style={{
                background: '#0F0F12',
                border: '1px solid rgba(255,255,255,0.08)',
                caretColor: '#5E6AD2',
                transition: 'border-color 200ms',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(94,106,210,0.4)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              autoFocus
            />
          )}

          {/* Photo placeholder */}
          {activeTab === 'photo' && (
            <div className="flex flex-col items-center py-10 gap-3">
              <Camera className="w-8 h-8 text-[#8A8F98]/20" />
              <p className="text-xs font-mono text-[#8A8F98]/30 tracking-wide">Coming soon</p>
            </div>
          )}

          {/* Analyze button */}
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold text-white cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
            style={{
              background: '#5E6AD2',
              boxShadow: input.trim() && !isLoading
                ? '0 0 0 1px rgba(94,106,210,0.5), 0 4px 16px rgba(94,106,210,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'
                : 'none',
              transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              if (input.trim() && !isLoading) {
                e.currentTarget.style.background = '#6872D9';
                e.currentTarget.style.boxShadow = '0 0 0 1px rgba(94,106,210,0.6), 0 8px 24px rgba(94,106,210,0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#5E6AD2';
              if (input.trim() && !isLoading) {
                e.currentTarget.style.boxShadow = '0 0 0 1px rgba(94,106,210,0.5), 0 4px 16px rgba(94,106,210,0.3), inset 0 1px 0 rgba(255,255,255,0.15)';
              }
            }}
            id="submit-emergency"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing Emergency
              </>
            ) : (
              <>
                Analyze Emergency
                <SendHorizonal className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
