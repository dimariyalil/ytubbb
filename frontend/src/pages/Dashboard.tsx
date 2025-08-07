import CreateWorkspace from '../components/workspace/CreateWorkspace';
import WorkspaceList from '../components/workspace/WorkspaceList';

export default function Dashboard({ onOpenWorkspace }: { onOpenWorkspace: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="mt-4"><CreateWorkspace /></div>
      <WorkspaceList />
      <div className="mt-6">
        <button onClick={onOpenWorkspace} className="text-sm text-blue-400">Open selected workspace →</button>
      </div>
    </div>
  );
}