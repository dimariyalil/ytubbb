import mongoose from 'mongoose';
import Redis from 'ioredis';

let redisClient: Redis | null = null;

export const connectMongo = async (uri: string): Promise<void> => {
  await mongoose.connect(uri);
};

export const getRedis = (redisUrl: string): Redis => {
  if (!redisClient) {
    redisClient = new Redis(redisUrl);
  }
  return redisClient;
};

export const disconnect = async (): Promise<void> => {
  await mongoose.disconnect();
  if (redisClient) await redisClient.quit();
};