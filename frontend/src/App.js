import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import WorkspaceDetail from './pages/WorkspaceDetail';
import Settings from './pages/Settings';
import { useWorkspaceStore } from './store/workspace.store';
export default function App() {
    const [tab, setTab] = useState('dashboard');
    const selected = useWorkspaceStore(s => s.selectedWorkspaceId);
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx("header", { className: "sticky top-0 z-10 bg-neutral-900 border-b border-neutral-800", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 py-3 flex items-center gap-4", children: [_jsx("div", { className: "font-semibold", children: "YT Workspace Analyzer" }), _jsxs("nav", { className: "ml-auto flex gap-2", children: [_jsx("button", { className: `px-3 py-1 rounded ${tab === 'dashboard' ? 'bg-neutral-700' : ''}`, onClick: () => setTab('dashboard'), children: "Dashboard" }), _jsx("button", { className: `px-3 py-1 rounded ${tab === 'workspace' ? 'bg-neutral-700' : ''}`, onClick: () => setTab('workspace'), disabled: !selected, children: "Workspace" }), _jsx("button", { className: `px-3 py-1 rounded ${tab === 'settings' ? 'bg-neutral-700' : ''}`, onClick: () => setTab('settings'), children: "Settings" })] })] }) }), _jsxs("main", { className: "max-w-6xl mx-auto px-4 py-6", children: [tab === 'dashboard' && _jsx(Dashboard, { onOpenWorkspace: () => setTab('workspace') }), tab === 'workspace' && _jsx(WorkspaceDetail, {}), tab === 'settings' && _jsx(Settings, {})] })] }));
}
