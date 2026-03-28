/**
 * Web Speech API wrapper for voice input.
 * Uses the browser's built-in speech recognition (Chrome/Edge best support).
 */

const SpeechRecognition = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null;

/**
 * Check if speech recognition is supported
 */
export const isSpeechSupported = () => Boolean(SpeechRecognition);

/**
 * Creates a speech recognizer instance.
 * @returns {{ start, stop, onResult, onError, onEnd, isListening }}
 */
export function createSpeechRecognizer() {
  if (!SpeechRecognition) {
    return {
      start: () => {},
      stop: () => {},
      onResult: () => {},
      onError: () => {},
      onEnd: () => {},
      isListening: () => false,
      isSupported: false,
    };
  }

  const recognition = new SpeechRecognition();

  // Configuration
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-IN'; // Indian English
  recognition.maxAlternatives = 1;

  let resultCallback = null;
  let errorCallback = null;
  let endCallback = null;
  let listening = false;
  let finalTranscript = '';

  // Handle results
  recognition.onresult = (event) => {
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    if (resultCallback) {
      resultCallback({
        final: finalTranscript.trim(),
        interim: interimTranscript.trim(),
        full: (finalTranscript + interimTranscript).trim(),
      });
    }
  };

  recognition.onerror = (event) => {
    // 'no-speech' and 'aborted' are not real errors — ignore them
    if (event.error === 'no-speech' || event.error === 'aborted') {
      return;
    }
    listening = false;
    if (errorCallback) {
      errorCallback(event.error);
    }
  };

  recognition.onend = () => {
    listening = false;
    if (endCallback) {
      endCallback();
    }
  };

  return {
    start: () => {
      finalTranscript = '';
      listening = true;
      try {
        recognition.start();
      } catch (e) {
        // Already started — ignore
        console.warn('Speech recognition start error:', e.message);
      }
    },

    stop: () => {
      listening = false;
      try {
        recognition.stop();
      } catch (e) {
        // Already stopped — ignore
      }
    },

    onResult: (callback) => {
      resultCallback = callback;
    },

    onError: (callback) => {
      errorCallback = callback;
    },

    onEnd: (callback) => {
      endCallback = callback;
    },

    isListening: () => listening,

    isSupported: true,
  };
}
