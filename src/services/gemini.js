import { EMERGENCY_SYSTEM_PROMPT, buildUserPrompt } from '../utils/prompts';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Models to try in order — free-tier friendly options on OpenRouter
const MODEL_CHAIN = [
  'google/gemini-2.0-flash-exp:free',
  'google/gemini-2.0-flash-lite-001',
  'google/gemini-2.5-flash-preview',
];

/**
 * Sleep helper for retry delays
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Call OpenRouter chat completions API with a specific model
 */
async function tryModel(modelName, userPrompt) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Emergency Copilot',
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: EMERGENCY_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      top_p: 0.8,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMsg = errorBody?.error?.message || response.statusText || `HTTP ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('Empty response from AI model.');
  }

  return text;
}

/**
 * Analyzes an emergency situation using AI via OpenRouter.
 * Automatically falls back through models if one fails.
 * @param {string} inputText - The user's emergency description
 * @returns {Promise<Object>} Structured emergency response
 */
export async function analyzeEmergency(inputText) {
  if (!inputText || inputText.trim().length === 0) {
    throw new Error('Please describe the emergency situation.');
  }

  if (!API_KEY) {
    throw new Error(
      'OpenRouter API key not found. Please add VITE_OPENROUTER_API_KEY to your .env file.'
    );
  }

  const userPrompt = buildUserPrompt(inputText);
  let lastError = null;

  // Try each model in the chain
  for (let i = 0; i < MODEL_CHAIN.length; i++) {
    const modelName = MODEL_CHAIN[i];

    // Retry up to 2 times per model
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) {
          await sleep(1000 * attempt);
        }

        const text = await tryModel(modelName, userPrompt);

        // Parse JSON
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          // Try extracting JSON from markdown code fences or raw text
          const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[1]);
          } else {
            throw new Error('Failed to parse AI response.');
          }
        }

        // Validate required fields
        const required = ['situation', 'severity', 'actions', 'emergencyContact', 'summary'];
        for (const field of required) {
          if (!parsed[field]) {
            throw new Error(`AI response missing required field: ${field}`);
          }
        }

        // Normalize severity
        const validSeverities = ['Low', 'Medium', 'High', 'Critical'];
        if (!validSeverities.includes(parsed.severity)) {
          parsed.severity = 'Medium';
        }

        // Ensure confidence is a valid number
        if (typeof parsed.confidence !== 'number' || parsed.confidence < 0 || parsed.confidence > 100) {
          parsed.confidence = 75;
        }

        // Ensure needsBlood is a boolean
        parsed.needsBlood = Boolean(parsed.needsBlood);

        return parsed;
      } catch (error) {
        lastError = error;
        const status = error.status || 0;
        const msg = error.message?.toLowerCase() || '';

        // Auth errors — don't retry or fallback
        if (status === 401 || status === 403 || msg.includes('api key') || msg.includes('invalid')) {
          throw new Error('Invalid OpenRouter API key. Please check your .env file.');
        }

        // Rate limit / quota — try next model
        if (status === 429 || msg.includes('quota') || msg.includes('rate') || msg.includes('limit')) {
          console.warn(`Model ${modelName} rate-limited, trying fallback...`);
          break;
        }

        // Model not found — try next model  
        if (status === 404 || msg.includes('not found') || msg.includes('not available')) {
          console.warn(`Model ${modelName} not available, trying fallback...`);
          break;
        }

        // Other errors — retry once, then next model
        if (attempt === 1) {
          console.warn(`Model ${modelName} failed after retry, trying fallback...`);
        }
      }
    }
  }

  // All models exhausted
  throw new Error(
    lastError?.message || 'Failed to analyze emergency. Please try again.'
  );
}
