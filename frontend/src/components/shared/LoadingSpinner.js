import { jsx as _jsx } from "react/jsx-runtime";
export default function LoadingSpinner() {
    return (_jsx("div", { className: "flex items-center justify-center py-8", children: _jsx("div", { className: "w-6 h-6 border-2 border-neutral-500 border-t-neutral-200 rounded-full animate-spin" }) }));
}
