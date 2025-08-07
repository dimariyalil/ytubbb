import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Settings() {
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("h1", { className: "text-xl font-semibold", children: "Settings" }), _jsx("p", { className: "text-neutral-400 text-sm", children: "Configure environment variables on the server. This UI intentionally does not expose secrets." }), _jsxs("ul", { className: "list-disc list-inside text-sm text-neutral-300", children: [_jsx("li", { children: "YOUTUBE_API_KEY" }), _jsx("li", { children: "CLAUDE_API_KEY" }), _jsx("li", { children: "MONGODB_URI" }), _jsx("li", { children: "REDIS_URL" })] })] }));
}
