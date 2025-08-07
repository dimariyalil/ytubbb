import mongoose, { Schema, Document } from 'mongoose';

export type TranscriptionSource = 'youtube' | 'claude';

export interface VideoAnalysis {
  keyMoments: Array<{ start: number; end: number; summary: string }>;
  emotions: Array<{ timestamp: number; label: string; intensity: number }>;
  viralScore: number;
  topics: string[];
}

export interface VideoPrompts {
  master: string;
  alternatives: string[];
  optimized: string[];
}

export interface VideoItem {
  videoId: string;
  title: string;
  description: string;
  duration: string;
  statistics: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
  transcription?: {
    text: string;
    source: TranscriptionSource;
    language: string;
  };
  analysis?: VideoAnalysis;
  prompts?: VideoPrompts;
}

export interface WorkspaceDocument extends Document {
  name: string;
  channelId: string;
  channelData: {
    title: string;
    description: string;
    subscriberCount: number;
    videoCount: number;
    viewCount: number;
    thumbnails: Record<string, unknown>;
  };
  videos: VideoItem[];
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<VideoItem>({
  videoId: { type: String, required: true },
  title: String,
  description: String,
  duration: String,
  statistics: {
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  transcription: {
    text: String,
    source: { type: String, enum: ['youtube', 'claude'] },
    language: { type: String, default: 'en' },
  },
  analysis: {
    keyMoments: [{ start: Number, end: Number, summary: String }],
    emotions: [{ timestamp: Number, label: String, intensity: Number }],
    viralScore: { type: Number, min: 0, max: 100 },
    topics: [String],
  },
  prompts: {
    master: String,
    alternatives: [String],
    optimized: [String],
  },
});

const WorkspaceSchema = new Schema<WorkspaceDocument>({
  name: { type: String, required: true },
  channelId: { type: String, required: true },
  channelData: {
    title: String,
    description: String,
    subscriberCount: Number,
    videoCount: Number,
    viewCount: Number,
    thumbnails: Schema.Types.Mixed,
  },
  videos: [VideoSchema],
}, { timestamps: true });

export const Workspace = mongoose.model<WorkspaceDocument>('Workspace', WorkspaceSchema);