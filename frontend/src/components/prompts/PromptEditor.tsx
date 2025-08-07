export default function PromptEditor({ video }: { video: any }) {
  if (!video?.prompts) return <div className="text-neutral-400 text-sm">No prompts yet.</div>;
  return (
    <div className="space-y-2">
      <div>
        <div className="text-sm text-neutral-400">Master</div>
        <textarea className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-sm" rows={5} defaultValue={video.prompts.master} />
      </div>
    </div>
  );
}