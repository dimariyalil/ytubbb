import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import { connectMongo, getRedis } from './config/database.js';
import { buildRouter } from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { createVideoQueue } from './jobs/video-processor.job.js';

const PORT = Number(process.env.PORT || 5000);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

async function main() {
  await connectMongo(process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-workspace');
  const redis = getRedis(process.env.REDIS_URL || 'redis://localhost:6379');

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: CLIENT_URL } });

  const queue = createVideoQueue(redis, io);

  app.use(cors({ origin: CLIENT_URL }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  io.on('connection', (socket) => {
    socket.on('join', (workspaceId: string) => {
      socket.join(workspaceId);
    });
  });

  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.use('/api', buildRouter(redis, queue));
  app.use(errorHandler);

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});