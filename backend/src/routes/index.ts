import { Router } from 'express';
import type Redis from 'ioredis';
import Queue from 'bull';
import { apiRateLimiter } from '../middleware/rate-limit.middleware.js';
import { createWorkspace, deleteWorkspace, getWorkspace, listWorkspaces, updateWorkspace } from '../controllers/workspace.controller.js';
import { buildAnalyzeHandlers, generatePrompts, optimizePrompts } from '../controllers/analysis.controller.js';
import { exportWorkspace } from '../controllers/export.controller.js';
import { AnalyzeJobData } from '../jobs/video-processor.job.js';

export const buildRouter = (redis: Redis, queue: Queue.Queue<AnalyzeJobData>) => {
  const router = Router();
  router.use(apiRateLimiter);

  const { analyze } = buildAnalyzeHandlers(redis, queue);

  router.post('/workspaces', createWorkspace);
  router.get('/workspaces', listWorkspaces);
  router.get('/workspaces/:id', getWorkspace);
  router.put('/workspaces/:id', updateWorkspace);
  router.delete('/workspaces/:id', deleteWorkspace);

  router.post('/workspaces/:id/analyze', analyze);
  router.post('/workspaces/:id/generate-prompts', generatePrompts);
  router.post('/workspaces/:id/optimize', optimizePrompts);
  router.get('/workspaces/:id/export', exportWorkspace);

  return router;
};