import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI');
}

let isConnected = 0 as 0 | 1;

export async function connectMongo(): Promise<typeof mongoose> {
  if (isConnected) return mongoose;
  const conn = await mongoose.connect(MONGODB_URI);
  isConnected = 1;
  return conn;
}

export { mongoose };