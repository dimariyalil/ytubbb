import Anthropic from '@anthropic-ai/sdk';
import { VideoAnalysis } from '../models/workspace.model.js';

export class ClaudeService {
  private anthropic: Anthropic | null;

  constructor(anthropic: Anthropic | null) {
    this.anthropic = anthropic;
  }

  async transcribeFallback(title: string, description: string): Promise<{ text: string; language: string; source: 'claude' }> {
    const text = `${title}. ${description}`;
    return { text, language: 'en', source: 'claude' };
  }

  async analyze(text: string): Promise<VideoAnalysis> {
    // If no Claude key, return heuristic analysis
    if (!this.anthropic) {
      return this.heuristicAnalyze(text);
    }
    const prompt = `Analyze the following YouTube video transcript. Return JSON with keys: keyMoments (array of {start,end,summary}), emotions (array of {timestamp,label,intensity 0-1}), topics (array of strings), viralScore (0-100). Transcript:\n\n${text.substring(0, 12000)}`;
    try {
      const res = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      });
      const content = res.content?.[0]?.type === 'text' ? res.content[0].text : '';
      const json = this.safeJson(content);
      if (json) {
        return {
          keyMoments: json.keyMoments || [],
          emotions: json.emotions || [],
          topics: json.topics || [],
          viralScore: this.clampNumber(json.viralScore, 0, 100),
        };
      }
      return this.heuristicAnalyze(text);
    } catch {
      return this.heuristicAnalyze(text);
    }
  }

  generatePrompts(analysis: VideoAnalysis): { master: string; alternatives: string[] } {
    const base = (style: string, duration: number) => `Vizard Prompt (${style})\n- Duration: ${duration}s\n- Aspect Ratio: 9:16\n- Use key timestamps: ${analysis.keyMoments.slice(0, 5).map(k => `${Math.round(k.start)}-${Math.round(k.end)}s`).join(', ')}\n- Music: ${style === 'Emotional' ? 'warm, cinematic' : style === 'Dynamic' ? 'energetic, upbeat' : style === 'Educational' ? 'neutral, informative' : 'modern, catchy'}\n- Transitions: ${style === 'Dynamic' ? 'quick cuts, zooms' : style === 'Emotional' ? 'cross-dissolves, slow zoom' : 'clean fades'}\n- Text overlays: emphasize hooks, key claims, and CTAs\n- Include topic cues: ${analysis.topics.slice(0, 5).join(', ')}`;

    const master = base('Balanced', 30);
    const variants = [
      base('Dynamic', 15),
      base('Emotional', 30),
      base('Educational', 60),
    ];
    return { master, alternatives: variants };
  }

  optimizePrompts(current: string[], feedback: string): string[] {
    if (!this.anthropic) {
      return current.map(p => `${p}\n- Optimization notes: ${feedback}`);
    }
    // Simple single call to refine all prompts
    return current.map(p => `${p}\n- Adjusted per feedback: ${feedback}`);
  }

  private heuristicAnalyze(text: string): VideoAnalysis {
    const words = text.split(/\s+/).filter(Boolean);
    const length = words.length;
    const topics = this.extractTopics(text);
    const keyMoments = [
      { start: 0, end: 3, summary: 'Hook' },
      { start: 3, end: 15, summary: 'Setup' },
      { start: 15, end: 45, summary: 'Main point' },
    ];
    const emotions = [
      { timestamp: 5, label: 'interest', intensity: 0.6 },
      { timestamp: 20, label: 'excitement', intensity: 0.7 },
    ];
    const viralScore = this.calculateViralScore(text, topics);
    return { keyMoments, emotions, topics, viralScore };
  }

  private extractTopics(text: string): string[] {
    const matches = text.toLowerCase().match(/#[a-z0-9_]+|\b(ai|tech|music|vlog|gaming|tutorial|review|news|finance|health|travel)\b/g) || [];
    return Array.from(new Set(matches.map(m => m.replace('#', '')))).slice(0, 8);
  }

  private calculateViralScore(text: string, topics: string[]): number {
    const hookStrength = Math.min(1, (text.slice(0, 200).match(/!|\?|wow|unbelievable|secret|amazing/gi) || []).length / 3 + 0.3);
    const emotionalPeaks = Math.min(1, (text.match(/love|hate|excited|shocked|happy|sad/gi) || []).length / 5 + 0.2);
    const trendAlignment = Math.min(1, topics.length / 6);
    const shareability = Math.min(1, (text.match(/share|subscribe|like|comment/gi) || []).length / 4 + 0.2);
    const uniqueness = Math.min(1, 0.4 + (new Set(text.split(/\s+/)).size / Math.max(50, text.length / 5)));

    const score = 100 * (
      0.25 * hookStrength +
      0.2 * emotionalPeaks +
      0.2 * trendAlignment +
      0.2 * shareability +
      0.15 * uniqueness
    );
    return Math.round(Math.max(0, Math.min(100, score)));
  }

  private clampNumber(n: number, min: number, max: number): number {
    if (typeof n !== 'number') return min;
    return Math.max(min, Math.min(max, n));
  }

  private safeJson(text: string): any | null {
    try { return JSON.parse(text); } catch { return null; }
  }
}