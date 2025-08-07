import { Request, Response } from 'express';
import type Redis from 'ioredis';
import Queue from 'bull';
import { Workspace } from '../models/workspace.model.js';
import { YouTubeService } from '../services/youtube.service.js';
import { CacheService } from '../services/cache.service.js';
import { ClaudeService } from '../services/claude.service.js';
import { AnalyzeJobData } from '../jobs/video-processor.job.js';

export const buildAnalyzeHandlers = (redis: Redis, queue: Queue.Queue<AnalyzeJobData>) => {
  const analyze = async (req: Request, res: Response) => {
    const workspaceId = req.params.id;
    const ws = await Workspace.findById(workspaceId);
    if (!ws) return res.status(404).json({ error: 'Workspace not found' });

    const maxVideos = Number(process.env.MAX_VIDEOS_PER_CHANNEL || 10);
    await queue.add({
      workspaceId: ws.id, 
      channelId: ws.channelId,
      maxVideos,
      apiKeys: {
        youtube: process.env.YOUTUBE_API_KEY || '',
        claude: process.env.CLAUDE_API_KEY || undefined,
      },
    }, { removeOnComplete: true, attempts: 2, backoff: { type: 'exponential', delay: 2000 } });

    res.json({ ok: true, message: 'Analysis queued' });
  };

  return { analyze };
};

export const generatePrompts = async (req: Request, res: Response) => {
  const workspaceId = req.params.id;
  const { videoId } = req.body;
  const ws = await Workspace.findById(workspaceId);
  if (!ws) return res.status(404).json({ error: 'Workspace not found' });
  const video = ws.videos.find(v => v.videoId === videoId);
  if (!video) return res.status(404).json({ error: 'Video not found' });

  const claude = new ClaudeService(null);
  const analysis = await claude.analyze(video.transcription?.text || `${video.title}. ${video.description}`);
  const prompts = claude.generatePrompts(analysis);
  video.analysis = analysis;
  video.prompts = { master: prompts.master, alternatives: prompts.alternatives, optimized: [] };
  await ws.save();
  res.json(video.prompts);
};

export const optimizePrompts = async (req: Request, res: Response) => {
  const workspaceId = req.params.id;
  const { videoId, feedback } = req.body;
  const ws = await Workspace.findById(workspaceId);
  if (!ws) return res.status(404).json({ error: 'Workspace not found' });
  const video = ws.videos.find(v => v.videoId === videoId);
  if (!video || !video.prompts) return res.status(404).json({ error: 'Prompts not found' });

  const claude = new ClaudeService(null);
  const optimized = claude.optimizePrompts([video.prompts.master, ...video.prompts.alternatives], feedback);
  video.prompts.optimized = optimized;
  await ws.save();
  res.json({ optimized });
};