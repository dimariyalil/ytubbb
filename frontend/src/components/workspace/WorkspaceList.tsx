import { useWorkspaces } from '../../hooks/useWorkspace';
import { useWorkspaceStore } from '../../store/workspace.store';

export default function WorkspaceList() {
  const { list } = useWorkspaces();
  const setSelected = useWorkspaceStore(s => s.setSelectedWorkspaceId);

  if (list.isLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {list.data?.map(ws => (
        <div key={ws._id} className="border border-neutral-800 rounded p-4 hover:bg-neutral-900 cursor-pointer" onClick={() => setSelected(ws._id)}>
          <div className="font-medium">{ws.name}</div>
          <div className="text-sm text-neutral-400">{ws.channelData?.title || ws.channelId}</div>
          <div className="text-xs text-neutral-500 mt-1">Videos: {ws.videos?.length || 0}</div>
        </div>
      ))}
    </div>
  );
}