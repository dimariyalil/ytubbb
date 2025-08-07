import { useWorkspaceStore } from '../store/workspace.store';
import { useWorkspaceDetail } from '../hooks/useWorkspace';
import VideoGrid from '../components/analysis/VideoGrid';
import VideoAnalysis from '../components/analysis/VideoAnalysis';
import TranscriptionView from '../components/analysis/TranscriptionView';
import PromptEditor from '../components/prompts/PromptEditor';
import PromptVariants from '../components/prompts/PromptVariants';
import PromptOptimizer from '../components/prompts/PromptOptimizer';
import { analyzeWorkspace } from '../services/api.service';

export default function WorkspaceDetail() {
  const id = useWorkspaceStore(s => s.selectedWorkspaceId);
  const { data: ws, refetch } = useWorkspaceDetail(id);

  if (!id) return <div>Select a workspace on the Dashboard.</div>;
  if (!ws) return <div>Loading...</div>;

  const first = ws.videos?.[0];

  const onAnalyze = async () => {
    await analyzeWorkspace(ws._id);
    await refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">{ws.name}</h1>
        <button className="ml-auto bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-sm" onClick={onAnalyze}>Analyze last 10 videos</button>
        <a className="text-sm bg-neutral-800 px-3 py-2 rounded" href={`/api/workspaces/${ws._id}/export?format=pdf`} target="_blank">Export PDF</a>
      </div>

      <VideoGrid workspace={ws} />

      {first && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h2 className="font-medium">Transcription</h2>
            <TranscriptionView video={first} />
            <h2 className="font-medium">Analysis</h2>
            <VideoAnalysis video={first} />
          </div>
          <div className="space-y-3">
            <h2 className="font-medium">Prompts</h2>
            <PromptEditor video={first} />
            <PromptVariants video={first} />
            <PromptOptimizer workspaceId={ws._id} video={first} />
          </div>
        </div>
      )}
    </div>
  );
}