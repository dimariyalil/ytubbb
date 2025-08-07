import { Workspace, WorkspaceDocument, VideoItem } from '../models/workspace.model.js';

export class WorkspaceService {
  async create(data: { name: string; channelId: string; channelData?: any }): Promise<WorkspaceDocument> {
    const ws = await Workspace.create({ ...data, videos: [] });
    return ws;
  }

  async list(): Promise<WorkspaceDocument[]> {
    return Workspace.find().sort({ updatedAt: -1 });
  }

  async get(id: string): Promise<WorkspaceDocument | null> {
    return Workspace.findById(id);
  }

  async update(id: string, data: Partial<WorkspaceDocument>): Promise<WorkspaceDocument | null> {
    return Workspace.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id: string): Promise<void> {
    await Workspace.findByIdAndDelete(id);
  }

  async upsertVideos(id: string, videos: VideoItem[], channelData: any): Promise<WorkspaceDocument | null> {
    const ws = await Workspace.findById(id);
    if (!ws) return null;
    ws.channelData = channelData;
    const existingIds = new Set(ws.videos.map(v => v.videoId));
    const merged = [...videos.filter(v => !existingIds.has(v.videoId)), ...ws.videos];
    ws.videos = merged.slice(0, 50); // cap
    await ws.save();
    return ws;
  }
}