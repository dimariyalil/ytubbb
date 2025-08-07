# YouTube Workspace Analyzer

AI-powered workspace system to analyze YouTube channels and generate production-ready Vizard prompts using Claude AI.

## Features
- Workspace-based analysis per channel
- Fetch and analyze last 10 videos per channel
- AI transcription fallback and content analysis with Claude
- Prompt generation: Master, Dynamic, Emotional, Educational (15/30/60s)
- Viral score calculation and prompt optimization
- Real-time progress via WebSockets
- Export to JSON, TXT, and PDF
- Modern React 18 UI with Tailwind, Zustand, React Query, Recharts

## Tech Stack
- Backend: Node.js, Express, TypeScript, MongoDB (Mongoose), Redis (ioredis), Bull, Socket.io
- Frontend: React 18 + Vite + TypeScript, Tailwind CSS, shadcn-style components, Zustand, React Query, Recharts

## Monorepo Structure
```
/               Root scripts
/backend        API server and workers
/frontend       React app
```

## Getting Started (Cloud-only)

Use Vercel one-click deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dimariyalil/ytubbb&env=YOUTUBE_API_KEY,CLAUDE_API_KEY,MONGODB_URI,REDIS_URL)

Set these variables in Vercel:
- YOUTUBE_API_KEY
- CLAUDE_API_KEY
- MONGODB_URI (MongoDB Atlas)
- REDIS_URL (Upstash Redis)

No localhost required. The app will be available at your Vercel domain.

## API
Base path: `/api`

- POST `/api/workspaces` — create workspace
- GET `/api/workspaces` — list workspaces
- GET `/api/workspaces/:id` — get one
- PUT `/api/workspaces/:id` — update
- DELETE `/api/workspaces/:id` — delete
- POST `/api/workspaces/:id/analyze` — enqueue analysis for last N videos
- POST `/api/workspaces/:id/generate-prompts` — generate Vizard prompts
- POST `/api/workspaces/:id/optimize` — optimize prompts using feedback
- GET `/api/workspaces/:id/export?format=pdf|json|txt` — export

## Deployment
- Frontend + Serverless API: Vercel (builds `frontend`, functions in `/api`)
- Set environment variables in Vercel Project Settings
- MongoDB Atlas + Upstash Redis recommended

## Screenshots
- Dashboard (placeholder)
- Workspace detail (placeholder)

## Security
- Never commit environment secrets
- Rate limiting and basic API key support available

## License
MIT