import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { generatePrompts } from '../../services/api.service';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
export default function VideoGrid({ workspace }) {
    const onGenerate = async (videoId) => {
        await generatePrompts(workspace._id, videoId);
        window.location.reload();
    };
    return (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: workspace.videos?.map((v) => (_jsxs("div", { className: "border border-neutral-800 rounded p-3", children: [_jsx("div", { className: "font-medium line-clamp-2", children: v.title }), _jsxs("div", { className: "text-xs text-neutral-400", children: ["Views: ", v.statistics?.viewCount ?? 0, " \u2022 Likes: ", v.statistics?.likeCount ?? 0] }), _jsx("div", { className: "h-16 mt-2", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsx(LineChart, { data: [{ x: 0, y: 0 }, { x: 1, y: v.statistics?.viewCount ?? 0 }], children: _jsx(Line, { type: "monotone", dataKey: "y", stroke: "#60a5fa", strokeWidth: 2, dot: false }) }) }) }), _jsxs("div", { className: "mt-2 flex gap-2", children: [_jsx("a", { className: "text-blue-400 text-sm", href: `https://youtu.be/${v.videoId}`, target: "_blank", rel: "noreferrer", children: "Open" }), _jsx("button", { className: "ml-auto text-xs bg-blue-600 px-2 py-1 rounded", onClick: () => onGenerate(v.videoId), children: "Generate Prompts" })] })] }, v.videoId))) }));
}
