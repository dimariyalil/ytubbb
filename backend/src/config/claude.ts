import Anthropic from 'anthropic';

export const createAnthropic = (apiKey?: string): Anthropic | null => {
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
};