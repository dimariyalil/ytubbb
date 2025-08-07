import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import WorkspaceDetail from './pages/WorkspaceDetail';
import Settings from './pages/Settings';
import { useWorkspaceStore } from './store/workspace.store';

export default function App() {
  const [tab, setTab] = useState<'dashboard' | 'workspace' | 'settings'>('dashboard');
  const selected = useWorkspaceStore(s => s.selectedWorkspaceId);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="font-semibold">YT Workspace Analyzer</div>
          <nav className="ml-auto flex gap-2">
            <button className={`px-3 py-1 rounded ${tab==='dashboard'?'bg-neutral-700':''}`} onClick={() => setTab('dashboard')}>Dashboard</button>
            <button className={`px-3 py-1 rounded ${tab==='workspace'?'bg-neutral-700':''}`} onClick={() => setTab('workspace')} disabled={!selected}>Workspace</button>
            <button className={`px-3 py-1 rounded ${tab==='settings'?'bg-neutral-700':''}`} onClick={() => setTab('settings')}>Settings</button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab === 'dashboard' && <Dashboard onOpenWorkspace={() => setTab('workspace')} />}
        {tab === 'workspace' && <WorkspaceDetail />}
        {tab === 'settings' && <Settings />}
      </main>
    </div>
  );
}