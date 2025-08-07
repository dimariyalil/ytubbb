import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectMongo, mongoose } from '../_lib/mongodb';

const Workspace = mongoose.models.Workspace || mongoose.model('Workspace');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectMongo();
    const id = req.query.id as string;

    if (req.method === 'GET') {
      const ws = await Workspace.findById(id);
      if (!ws) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(ws);
    }

    if (req.method === 'PUT') {
      const ws = await Workspace.findByIdAndUpdate(id, req.body, { new: true });
      if (!ws) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(ws);
    }

    if (req.method === 'DELETE') {
      await Workspace.findByIdAndDelete(id);
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}