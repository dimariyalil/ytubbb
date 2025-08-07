import axios from 'axios';

const API_URL = import.meta.env.PROD ? 'https://ytubbb.vercel.app/api' : '/api';
const api = axios.create({ baseURL: API_URL });

export interface Workspace {
  _id: string;
  name: string;
  channelId: string;
  channelData?: any;
  videos: any[];
}

export const createWorkspace = (data: { name: string; channelId: string }) => api.post('/workspaces', data).then(r => r.data);
export const listWorkspaces = () => api.get('/workspaces').then(r => r.data as Workspace[]);
export const getWorkspace = (id: string) => api.get(`/workspaces/${id}`).then(r => r.data as Workspace);
export const analyzeWorkspace = (id: string) => api.post(`/workspaces/${id}/analyze`).then(r => r.data);
export const generatePrompts = (id: string, videoId: string) => api.post(`/workspaces/${id}/generate-prompts`, { videoId }).then(r => r.data);
export const optimizePrompts = (id: string, videoId: string, feedback: string) => api.post(`/workspaces/${id}/optimize`, { videoId, feedback }).then(r => r.data);