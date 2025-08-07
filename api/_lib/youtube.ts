import axios from 'axios';

const API_KEY = process.env.YOUTUBE_API_KEY as string;
const BASE = 'https://www.googleapis.com/youtube/v3';

export async function getChannelById(channelId: string) {
  const { data } = await axios.get(`${BASE}/channels`, {
    params: { part: 'snippet,statistics,contentDetails', id: channelId, key: API_KEY },
    timeout: 15000,
  });
  return data;
}

export async function searchVideos(channelId: string, maxResults: number) {
  const { data } = await axios.get(`${BASE}/search`, {
    params: { part: 'snippet', channelId, maxResults, order: 'date', type: 'video', key: API_KEY },
    timeout: 15000,
  });
  return data;
}

export async function getVideosDetails(videoIdsCsv: string) {
  const { data } = await axios.get(`${BASE}/videos`, {
    params: { part: 'snippet,statistics,contentDetails', id: videoIdsCsv, key: API_KEY },
    timeout: 15000,
  });
  return data;
}