import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectMongo, mongoose } from '../_lib/mongodb';

const VideoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  description: String,
  duration: String,
  statistics: { viewCount: Number, likeCount: Number, commentCount: Number },
  transcription: { text: String, source: String, language: String },
  analysis: { keyMoments: Array, emotions: Array, viralScore: Number, topics: [String] },
  prompts: { master: String, alternatives: [String], optimized: [String] },
});

const WorkspaceSchema = new mongoose.Schema({
  name: String,
  channelId: String,
  channelData: {
    title: String,
    description: String,
    subscriberCount: Number,
    videoCount: Number,
    viewCount: Number,
    thumbnails: mongoose.Schema.Types.Mixed,
  },
  videos: [VideoSchema],
}, { timestamps: true });

const Workspace = mongoose.models.Workspace || mongoose.model('Workspace', WorkspaceSchema);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectMongo();
    if (req.method === 'GET') {
      const items = await Workspace.find().sort({ updatedAt: -1 }).lean();
      return res.status(200).json(items);
    }
    if (req.method === 'POST') {
      const { name, channelId } = req.body || {};
      if (!name || !channelId) return res.status(400).json({ error: 'Missing name or channelId' });
      const ws = await Workspace.create({ name, channelId, videos: [] });
      return res.status(201).json(ws);
    }
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}