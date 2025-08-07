import { useState } from 'react';
import { optimizePrompts } from '../../services/api.service';

export default function PromptOptimizer({ workspaceId, video }: { workspaceId: string; video: any }) {
  const [feedback, setFeedback] = useState('shorter, more dynamic pacing');
  const onOptimize = async () => {
    await optimizePrompts(workspaceId, video.videoId, feedback);
    window.location.reload();
  };
  return (
    <div className="space-y-2">
      <textarea className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-sm" rows={3} value={feedback} onChange={e=>setFeedback(e.target.value)} />
      <button className="bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded text-sm" onClick={onOptimize}>Optimize</button>
    </div>
  );
}