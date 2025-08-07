import { jsxs as _jsxs } from "react/jsx-runtime";
export default function TranscriptionView({ video }) {
    const text = video?.transcription?.text || '';
    const src = video?.transcription?.source || 'unknown';
    return (_jsxs("div", { className: "text-xs text-neutral-300 whitespace-pre-wrap bg-neutral-900 rounded p-3 border border-neutral-800", children: [_jsxs("div", { className: "text-neutral-400 mb-2", children: ["Source: ", src] }), text.slice(0, 2000), text.length > 2000 ? '…' : ''] }));
}
