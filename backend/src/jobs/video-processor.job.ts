import Queue from 'bull';
import type Redis from 'ioredis';
import { YouTubeService } from '../services/youtube.service.js';
import { ClaudeService } from '../services/claude.service.js';
import { Workspace } from '../models/workspace.model.js';
import type { Server } from 'socket.io';
import { CacheService } from '../services/cache.service.js';
import { createAnthropic } from '../config/claude.js';

export interface AnalyzeJobData {
  workspaceId: string;
  channelId: string;
  maxVideos: number;
  apiKeys: { youtube: string; claude?: string };
}

export const createVideoQueue = (redis: Redis, io: Server) => {
  const queue = new Queue<AnalyzeJobData>('video-analysis', {
    createClient: function (type) {
      switch (type) {
        case 'client': return redis;
        case 'subscriber': return redis.duplicate();
        default: return redis.duplicate();
      }
    },
  });

  queue.process(2, async (job) => {
    const { workspaceId, channelId, maxVideos, apiKeys } = job.data;
    io.to(workspaceId).emit('analysis:update', { stage: 'start', message: 'Starting analysis...' });

    const cache = new CacheService(redis, true);
    const yt = new YouTubeService(apiKeys.youtube, cache);
    const result = await yt.getChannelAndVideos(channelId, maxVideos);
    io.to(workspaceId).emit('analysis:update', { stage: 'fetched', message: 'Fetched channel and videos' });

    const ws = await Workspace.findById(workspaceId);
    if (!ws) throw new Error('Workspace not found');

    ws.channelData = result.channel;
    ws.videos = result.videos;
    await ws.save();

    const anthropic = createAnthropic(apiKeys.claude);
    const claudeSvc = new ClaudeService(anthropic);

    for (const video of ws.videos) {
      io.to(workspaceId).emit('analysis:update', { stage: 'video', message: `Processing ${video.title}` });
      const tr = await yt.getTranscript(video.videoId);
      const text = tr?.text || (await claudeSvc.transcribeFallback(video.title, video.description)).text;
      const analysis = await claudeSvc.analyze(text);
      const prompts = claudeSvc.generatePrompts(analysis);
      video.transcription = tr || { text, language: 'en', source: 'claude' };
      video.analysis = analysis;
      video.prompts = { master: prompts.master, alternatives: prompts.alternatives, optimized: [] };
      await ws.save();
    }

    io.to(workspaceId).emit('analysis:update', { stage: 'done', message: 'Analysis complete' });
    return { ok: true };
  });

  return queue;
};