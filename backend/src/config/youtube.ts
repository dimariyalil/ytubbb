import axios from 'axios';

const YT_BASE = 'https://www.googleapis.com/youtube/v3';

export const yt = (apiKey: string) => {
  const client = axios.create({ baseURL: YT_BASE, timeout: 15000 });
  return {
    async getChannelById(channelId: string) {
      const { data } = await client.get('/channels', {
        params: {
          part: 'snippet,statistics,contentDetails',
          id: channelId,
          key: apiKey,
        },
      });
      return data;
    },
    async searchVideos(channelId: string, maxResults: number) {
      const { data } = await client.get('/search', {
        params: {
          part: 'snippet',
          channelId,
          maxResults,
          order: 'date',
          type: 'video',
          key: apiKey,
        },
      });
      return data;
    },
    async getVideosDetails(videoIdsCsv: string) {
      const { data } = await client.get('/videos', {
        params: {
          part: 'snippet,statistics,contentDetails',
          id: videoIdsCsv,
          key: apiKey,
        },
      });
      return data;
    },
  };
};