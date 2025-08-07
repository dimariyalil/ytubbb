import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useWorkspaces } from '../../hooks/useWorkspace';
import { useWorkspaceStore } from '../../store/workspace.store';
export default function WorkspaceList() {
    const { list } = useWorkspaces();
    const setSelected = useWorkspaceStore(s => s.setSelectedWorkspaceId);
    if (list.isLoading)
        return _jsx("div", { children: "Loading..." });
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4", children: list.data?.map(ws => (_jsxs("div", { className: "border border-neutral-800 rounded p-4 hover:bg-neutral-900 cursor-pointer", onClick: () => setSelected(ws._id), children: [_jsx("div", { className: "font-medium", children: ws.name }), _jsx("div", { className: "text-sm text-neutral-400", children: ws.channelData?.title || ws.channelId }), _jsxs("div", { className: "text-xs text-neutral-500 mt-1", children: ["Videos: ", ws.videos?.length || 0] })] }, ws._id))) }));
}
