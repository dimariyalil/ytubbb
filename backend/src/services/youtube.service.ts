import { yt } from '../config/youtube.js';
import { CacheService } from './cache.service.js';
import { Transcript, transcript } from 'youtube-transcript';

export class YouTubeService {
  private apiKey: string;
  private cache: CacheService;

  constructor(apiKey: string, cache: CacheService) {
    this.apiKey = apiKey;
    this.cache = cache;
  }

  private extractChannelId(input: string): string {
    // Accept full URL or raw ID. For simplicity, if contains UC*, assume it's the ID.
    if (input.startsWith('UC')) return input;
    const match = input.match(/(?:channel\/)(UC[\w-]+)/);
    if (match) return match[1];
    // Try @handle via search is not supported here; expect channelId.
    return input;
  }

  async getChannelAndVideos(channelInput: string, maxResults = 10) {
    const channelId = this.extractChannelId(channelInput);
    const cacheKey = `yt:channel:${channelId}:max:${maxResults}`;
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) return cached;

    const client = yt(this.apiKey);
    const channelDataResp = await client.getChannelById(channelId);
    if (!channelDataResp.items?.length) {
      throw new Error('Channel not found');
    }
    const channel = channelDataResp.items[0];

    const searchResp = await client.searchVideos(channelId, maxResults);
    const videoIds = searchResp.items.map((i: any) => i.id.videoId).join(',');
    const videosResp = await client.getVideosDetails(videoIds);

    const result = {
      channel: {
        title: channel.snippet.title,
        description: channel.snippet.description,
        subscriberCount: Number(channel.statistics.subscriberCount || 0),
        videoCount: Number(channel.statistics.videoCount || 0),
        viewCount: Number(channel.statistics.viewCount || 0),
        thumbnails: channel.snippet.thumbnails || {},
      },
      videos: videosResp.items.map((v: any) => ({
        videoId: v.id,
        title: v.snippet.title,
        description: v.snippet.description,
        duration: v.contentDetails.duration,
        statistics: {
          viewCount: Number(v.statistics.viewCount || 0),
          likeCount: Number(v.statistics.likeCount || 0),
          commentCount: Number(v.statistics.commentCount || 0),
        },
      })),
    };

    await this.cache.set(cacheKey, result, 3600);
    return result;
  }

  async getTranscript(videoId: string): Promise<{ text: string; language: string; source: 'youtube' } | null> {
    try {
      const items: Transcript[] = await transcript(videoId);
      const text = items.map(i => i.text).join(' ');
      const language = items[0]?.lang || 'en';
      return { text, language, source: 'youtube' };
    } catch {
      return null;
    }
  }
}