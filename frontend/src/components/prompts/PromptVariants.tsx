export default function PromptVariants({ video }: { video: any }) {
  if (!video?.prompts) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {video.prompts.alternatives?.map((p: string, idx: number) => (
        <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded p-3 text-sm whitespace-pre-wrap">
          <div className="text-neutral-400 mb-1">Variant {idx + 1}</div>
          {p}
        </div>
      ))}
    </div>
  );
}