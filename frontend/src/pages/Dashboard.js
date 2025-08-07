import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CreateWorkspace from '../components/workspace/CreateWorkspace';
import WorkspaceList from '../components/workspace/WorkspaceList';
export default function Dashboard({ onOpenWorkspace }) {
    return (_jsxs("div", { children: [_jsx("div", { className: "flex items-center gap-3", children: _jsx("h1", { className: "text-xl font-semibold", children: "Dashboard" }) }), _jsx("div", { className: "mt-4", children: _jsx(CreateWorkspace, {}) }), _jsx(WorkspaceList, {}), _jsx("div", { className: "mt-6", children: _jsx("button", { onClick: onOpenWorkspace, className: "text-sm text-blue-400", children: "Open selected workspace \u2192" }) })] }));
}
