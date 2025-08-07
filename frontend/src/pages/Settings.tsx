export default function Settings() {
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Settings</h1>
      <p className="text-neutral-400 text-sm">Configure environment variables on the server. This UI intentionally does not expose secrets.</p>
      <ul className="list-disc list-inside text-sm text-neutral-300">
        <li>YOUTUBE_API_KEY</li>
        <li>CLAUDE_API_KEY</li>
        <li>MONGODB_URI</li>
        <li>REDIS_URL</li>
      </ul>
    </div>
  );
}