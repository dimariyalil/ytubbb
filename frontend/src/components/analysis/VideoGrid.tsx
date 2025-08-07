import { generatePrompts } from '../../services/api.service';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function VideoGrid({ workspace }: { workspace: any }) {
  const onGenerate = async (videoId: string) => {
    await generatePrompts(workspace._id, videoId);
    window.location.reload();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {workspace.videos?.map((v: any) => (
        <div key={v.videoId} className="border border-neutral-800 rounded p-3">
          <div className="font-medium line-clamp-2">{v.title}</div>
          <div className="text-xs text-neutral-400">Views: {v.statistics?.viewCount ?? 0} • Likes: {v.statistics?.likeCount ?? 0}</div>
          <div className="h-16 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{ x: 0, y: 0 }, { x: 1, y: v.statistics?.viewCount ?? 0 }] }>
                <Line type="monotone" dataKey="y" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex gap-2">
            <a className="text-blue-400 text-sm" href={`https://youtu.be/${v.videoId}`} target="_blank" rel="noreferrer">Open</a>
            <button className="ml-auto text-xs bg-blue-600 px-2 py-1 rounded" onClick={() => onGenerate(v.videoId)}>Generate Prompts</button>
          </div>
        </div>
      ))}
    </div>
  );
}