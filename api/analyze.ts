import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectMongo, mongoose } from './_lib/mongodb';
import { getChannelById, searchVideos, getVideosDetails } from './_lib/youtube';
import ytTranscript from 'youtube-transcript';
import { createAnthropic } from './_lib/claude';

const Workspace = mongoose.models.Workspace || mongoose.model('Workspace');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id } = req.query;
    await connectMongo();
    const ws = await Workspace.findById(id);
    if (!ws) return res.status(404).json({ error: 'Workspace not found' });

    const maxVideos = Number(process.env.MAX_VIDEOS_PER_CHANNEL || 10);
    const channelResp = await getChannelById(ws.channelId);
    if (!channelResp.items?.length) return res.status(400).json({ error: 'Channel not found' });
    const channel = channelResp.items[0];

    const searchResp = await searchVideos(ws.channelId, maxVideos);
    const videoIds = searchResp.items.map((i: any) => i.id.videoId).join(',');
    const videosResp = await getVideosDetails(videoIds);

    ws.channelData = {
      title: channel.snippet.title,
      description: channel.snippet.description,
      subscriberCount: Number(channel.statistics.subscriberCount || 0),
      videoCount: Number(channel.statistics.videoCount || 0),
      viewCount: Number(channel.statistics.viewCount || 0),
      thumbnails: channel.snippet.thumbnails || {},
    };

    ws.videos = videosResp.items.map((v: any) => ({
      videoId: v.id,
      title: v.snippet.title,
      description: v.snippet.description,
      duration: v.contentDetails.duration,
      statistics: {
        viewCount: Number(v.statistics.viewCount || 0),
        likeCount: Number(v.statistics.likeCount || 0),
        commentCount: Number(v.statistics.commentCount || 0),
      },
    }));

    const anthropic = createAnthropic();
    for (const video of ws.videos) {
      let transcriptText = '';
      try {
        const items = await (ytTranscript as any).fetchTranscript(video.videoId);
        transcriptText = items.map((i: any) => i.text).join(' ');
      } catch {
        transcriptText = `${video.title}. ${video.description}`;
      }

      video.transcription = { text: transcriptText, language: 'en', source: 'youtube' };

      // Basic heuristic analysis
      const topics = Array.from(new Set((transcriptText.toLowerCase().match(/#[a-z0-9_]+|\b(ai|tech|music|vlog|gaming|tutorial|review|news|finance|health|travel)\b/g) || []).map((m: string) => m.replace('#','')))).slice(0,8);
      const analysis = {
        keyMoments: [ { start: 0, end: 3, summary: 'Hook' }, { start: 3, end: 15, summary: 'Setup' }, { start: 15, end: 45, summary: 'Main' } ],
        emotions: [ { timestamp: 5, label: 'interest', intensity: 0.6 } ],
        topics,
        viralScore: Math.round(100 * (0.25*0.7 + 0.2*0.6 + 0.2*(topics.length/6) + 0.2*0.5 + 0.15*0.6)),
      };
      video.analysis = analysis;

      const base = (style: string, duration: number) => `Vizard Prompt (${style})\n- Duration: ${duration}s\n- Aspect Ratio: 9:16\n- Use key timestamps: ${analysis.keyMoments.map(k => `${k.start}-${k.end}s`).join(', ')}\n- Music: ${style}\n- Transitions: clean\n- Text overlays: hooks, claims, CTAs\n- Topics: ${analysis.topics.join(', ')}`;
      video.prompts = {
        master: base('Balanced', 30),
        alternatives: [base('Dynamic', 15), base('Emotional', 30), base('Educational', 60)],
        optimized: [],
      };
    }

    await ws.save();
    return res.status(200).json({ ok: true, videos: ws.videos.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}