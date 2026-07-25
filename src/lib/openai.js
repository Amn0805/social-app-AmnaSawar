// lib/openai.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // required for frontend-only usage — no backend proxy in this project
  timeout: 20 * 1000, // fail fast (20s) instead of the SDK's 10-minute default
  maxRetries: 1, // avoid long exponential-backoff retry chains under rate limiting
});

export default openai;