// hooks/useAI.js
import openai from '../lib/openai';

const MODEL = 'gpt-4o-mini';
const MAX_TOKENS = 300;

const PERSONALITY_INSTRUCTIONS = {
  friendly: 'Be warm, friendly, and approachable.',
  professional: 'Be polished, professional, and concise.',
  casual: 'Be relaxed and casual, like texting a close friend.',
  funny: 'Be playful and a little funny, without being over the top.',
};

async function callOpenAI(systemPrompt, userPrompt) {
  const response = await openai.chat.completions.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });
  return response.choices[0].message.content;
}

function safeParseJSON(text) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

export function useAI() {
  async function generatePostContent(userIdea) {
    const systemPrompt =
      'You are a social media writing assistant. The user will give you a brief idea for their post. ' +
      'Generate an engaging social media post. Return JSON: { "description": "..." }. ' +
      'Keep under 280 characters. Be natural and warm. No hashtags unless requested.';

    const raw = await callOpenAI(systemPrompt, userIdea);
    const parsed = safeParseJSON(raw);
    return parsed.description;
  }

  async function suggestComment(postDescription) {
    const systemPrompt =
      `You are helping a user write a comment on a social media post. The post is: ${postDescription}. ` +
      'Write a short genuine comment (1-2 sentences). Be conversational. Do not use hashtags. ' +
      'Do not be generic like "Great post."';

    const comment = await callOpenAI(systemPrompt, 'Suggest a comment for this post.');
    return comment.trim();
  }

  async function optimizeBio({ bio, name, location }) {
    const systemPrompt =
      `You are a professional profile writer. Current bio: ${bio || '(empty)'}. Name: ${name}. ` +
      `Location: ${location || '(not specified)'}. Write an improved bio that is professional, warm and ` +
      'engaging. Keep it under 150 characters. Return only the bio text.';

    const improved = await callOpenAI(systemPrompt, 'Optimize this bio.');
    return improved.trim();
  }

  async function suggestReplies({ userName, friendName, recentMessages, personality = 'friendly' }) {
    const conversationText = recentMessages
      .map((m) => `${m.senderName}: ${m.content}`)
      .join('\n');

    const systemPrompt =
      `You are ${userName}'s messaging assistant. You are helping ${userName} reply to ${friendName}. ` +
      `Recent conversation: ${conversationText}. Generate 3 short natural reply options. ` +
      'Return JSON: { "suggestions": ["reply1", "reply2", "reply3"] }. ' +
      `Each suggestion under 100 characters. Match the conversational tone. ${PERSONALITY_INSTRUCTIONS[personality] || ''}`;

    const raw = await callOpenAI(systemPrompt, 'Suggest 3 replies.');
    const parsed = safeParseJSON(raw);
    return parsed.suggestions;
  }

  async function generateAutoReply({ userName, friendName, recentMessages, personality = 'friendly' }) {
    const conversationText = recentMessages
      .map((m) => `${m.senderName}: ${m.content}`)
      .join('\n');

    const systemPrompt =
      `You are replying to ${friendName} on behalf of ${userName}. Recent conversation: ${conversationText}. ` +
      `Reply naturally as ${userName} would. Keep it short (1-3 sentences max). ` +
      `Do not reveal you are an AI unless directly asked. ${PERSONALITY_INSTRUCTIONS[personality] || ''}`;

    const reply = await callOpenAI(systemPrompt, 'Write the reply.');
    return reply.trim();
  }

  return {
    generatePostContent,
    suggestComment,
    optimizeBio,
    suggestReplies,
    generateAutoReply,
  };
}