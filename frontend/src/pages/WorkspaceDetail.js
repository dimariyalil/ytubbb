import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    if (!id)
        return _jsx("div", { children: "Select a workspace on the Dashboard." });
    if (!ws)
        return _jsx("div", { children: "Loading..." });
    const first = ws.videos?.[0];
    const onAnalyze = async () => {
        await analyzeWorkspace(ws._id);
        await refetch();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("h1", { className: "text-xl font-semibold", children: ws.name }), _jsx("button", { className: "ml-auto bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-sm", onClick: onAnalyze, children: "Analyze last 10 videos" }), _jsx("a", { className: "text-sm bg-neutral-800 px-3 py-2 rounded", href: `/api/workspaces/${ws._id}/export?format=pdf`, target: "_blank", children: "Export PDF" })] }), _jsx(VideoGrid, { workspace: ws }), first && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("h2", { className: "font-medium", children: "Transcription" }), _jsx(TranscriptionView, { video: first }), _jsx("h2", { className: "font-medium", children: "Analysis" }), _jsx(VideoAnalysis, { video: first })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h2", { className: "font-medium", children: "Prompts" }), _jsx(PromptEditor, { video: first }), _jsx(PromptVariants, { video: first }), _jsx(PromptOptimizer, { workspaceId: ws._id, video: first })] })] }))] }));
}
