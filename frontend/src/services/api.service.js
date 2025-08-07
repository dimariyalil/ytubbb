import axios from 'axios';
const api = axios.create({ baseURL: '/api' });
export const createWorkspace = (data) => api.post('/workspaces', data).then(r => r.data);
export const listWorkspaces = () => api.get('/workspaces').then(r => r.data);
export const getWorkspace = (id) => api.get(`/workspaces/${id}`).then(r => r.data);
export const analyzeWorkspace = (id) => api.post(`/workspaces/${id}/analyze`).then(r => r.data);
export const generatePrompts = (id, videoId) => api.post(`/workspaces/${id}/generate-prompts`, { videoId }).then(r => r.data);
export const optimizePrompts = (id, videoId, feedback) => api.post(`/workspaces/${id}/optimize`, { videoId, feedback }).then(r => r.data);
