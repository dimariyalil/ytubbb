import Anthropic from '@anthropic-ai/sdk';

export function createAnthropic() {
  const key = process.env.CLAUDE_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}