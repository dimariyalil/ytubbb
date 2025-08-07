import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function PromptEditor({ video }) {
    if (!video?.prompts)
        return _jsx("div", { className: "text-neutral-400 text-sm", children: "No prompts yet." });
    return (_jsx("div", { className: "space-y-2", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm text-neutral-400", children: "Master" }), _jsx("textarea", { className: "w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-sm", rows: 5, defaultValue: video.prompts.master })] }) }));
}
