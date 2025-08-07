import { useState } from 'react';
import { useWorkspaces } from '../../hooks/useWorkspace';

export default function CreateWorkspace() {
  const [name, setName] = useState('');
  const [channel, setChannel] = useState('');
  const { create } = useWorkspaces();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !channel) return;
    await create.mutateAsync({ name, channelId: channel });
    setName('');
    setChannel('');
  };

  return (
    <form className="flex gap-2" onSubmit={onSubmit}>
      <input className="bg-neutral-800 px-3 py-2 rounded w-64" placeholder="Workspace name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="bg-neutral-800 px-3 py-2 rounded flex-1" placeholder="Channel URL or ID" value={channel} onChange={e=>setChannel(e.target.value)} />
      <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded" type="submit">Create</button>
    </form>
  );
}