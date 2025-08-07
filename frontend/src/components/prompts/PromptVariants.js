import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
export default function PromptVariants({ video }) {
    if (!video?.prompts)
        return null;
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: video.prompts.alternatives?.map((p, idx) => (_jsxs("div", { className: "bg-neutral-900 border border-neutral-800 rounded p-3 text-sm whitespace-pre-wrap", children: [_jsxs("div", { className: "text-neutral-400 mb-1", children: ["Variant ", idx + 1] }), p] }, idx))) }));
}
