import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function VideoAnalysis({ video }) {
    if (!video?.analysis)
        return _jsx("div", { className: "text-neutral-400 text-sm", children: "No analysis yet." });
    return (_jsxs("div", { className: "text-sm", children: [_jsxs("div", { children: ["Viral Score: ", _jsx("span", { className: "font-semibold", children: video.analysis.viralScore })] }), _jsxs("div", { className: "mt-2", children: [_jsx("div", { className: "font-medium", children: "Key Moments" }), _jsx("ul", { className: "list-disc list-inside text-neutral-300", children: video.analysis.keyMoments.map((km, idx) => (_jsxs("li", { children: [Math.round(km.start), "-", Math.round(km.end), "s \u2014 ", km.summary] }, idx))) })] })] }));
}
