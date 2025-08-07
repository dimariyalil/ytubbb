import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectMongo, mongoose } from './_lib/mongodb';

const Workspace = mongoose.models.Workspace || mongoose.model('Workspace');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id, videoId } = req.body || {};
    if (!id || !videoId) return res.status(400).json({ error: 'Missing id or videoId' });

    await connectMongo();
    const ws = await Workspace.findById(id);
    if (!ws) return res.status(404).json({ error: 'Workspace not found' });
    const video = ws.videos.find((v: any) => v.videoId === videoId);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const analysis = video.analysis || { keyMoments: [], topics: [], viralScore: 50 };
    const base = (style: string, duration: number) => `Vizard Prompt (${style})\n- Duration: ${duration}s\n- Aspect Ratio: 9:16\n- Use key timestamps: ${analysis.keyMoments.map((k: any) => `${k.start}-${k.end}s`).join(', ')}\n- Music: ${style}\n- Transitions: clean\n- Text overlays: hooks, claims, CTAs\n- Topics: ${analysis.topics.join(', ')}`;
    video.prompts = {
      master: base('Balanced', 30),
      alternatives: [base('Dynamic', 15), base('Emotional', 30), base('Educational', 60)],
      optimized: [],
    };

    await ws.save();
    return res.status(200).json(video.prompts);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}