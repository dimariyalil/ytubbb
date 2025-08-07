export default function VideoAnalysis({ video }: { video: any }) {
  if (!video?.analysis) return <div className="text-neutral-400 text-sm">No analysis yet.</div>;
  return (
    <div className="text-sm">
      <div>Viral Score: <span className="font-semibold">{video.analysis.viralScore}</span></div>
      <div className="mt-2">
        <div className="font-medium">Key Moments</div>
        <ul className="list-disc list-inside text-neutral-300">
          {video.analysis.keyMoments.map((km: any, idx: number) => (
            <li key={idx}>{Math.round(km.start)}-{Math.round(km.end)}s — {km.summary}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}