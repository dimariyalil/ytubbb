export default function TranscriptionView({ video }: { video: any }) {
  const text = video?.transcription?.text || '';
  const src = video?.transcription?.source || 'unknown';
  return (
    <div className="text-xs text-neutral-300 whitespace-pre-wrap bg-neutral-900 rounded p-3 border border-neutral-800">
      <div className="text-neutral-400 mb-2">Source: {src}</div>
      {text.slice(0, 2000)}{text.length > 2000 ? '…' : ''}
    </div>
  );
}