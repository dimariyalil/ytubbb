import { Request, Response } from 'express';
import { WorkspaceService } from '../services/workspace.service.js';

const service = new WorkspaceService();

export const createWorkspace = async (req: Request, res: Response) => {
  const { name, channelId } = req.body;
  const ws = await service.create({ name, channelId });
  res.json(ws);
};

export const listWorkspaces = async (_req: Request, res: Response) => {
  const items = await service.list();
  res.json(items);
};

export const getWorkspace = async (req: Request, res: Response) => {
  const ws = await service.get(req.params.id);
  if (!ws) return res.status(404).json({ error: 'Not found' });
  res.json(ws);
};

export const updateWorkspace = async (req: Request, res: Response) => {
  const ws = await service.update(req.params.id, req.body);
  if (!ws) return res.status(404).json({ error: 'Not found' });
  res.json(ws);
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  await service.remove(req.params.id);
  res.json({ ok: true });
};