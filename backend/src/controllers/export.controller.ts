import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { Workspace } from '../models/workspace.model.js';

export const exportWorkspace = async (req: Request, res: Response) => {
  const id = req.params.id;
  const format = (req.query.format as string) || 'json';
  const ws = await Workspace.findById(id);
  if (!ws) return res.status(404).json({ error: 'Not found' });

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify(ws.toJSON(), null, 2));
  }

  if (format === 'txt') {
    const lines: string[] = [];
    lines.push(`# Workspace: ${ws.name}`);
    lines.push(`Channel: ${ws.channelData?.title}`);
    lines.push('');
    for (const v of ws.videos) {
      lines.push(`- ${v.title} (${v.videoId})`);
      if (v.prompts) {
        lines.push(`  Master: ${v.prompts.master}`);
        v.prompts.alternatives?.forEach((p, idx) => lines.push(`  Alt${idx + 1}: ${p}`));
      }
      lines.push('');
    }
    res.setHeader('Content-Type', 'text/plain');
    return res.send(lines.join('\n'));
  }

  if (format === 'pdf') {
    res.setHeader('Content-Type', 'application/pdf');
    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);
    doc.fontSize(18).text(`Workspace: ${ws.name}`, { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Channel: ${ws.channelData?.title}`);
    doc.moveDown();
    ws.videos.forEach((v) => {
      doc.fontSize(14).text(v.title);
      if (v.analysis) {
        doc.fontSize(10).text(`Viral Score: ${v.analysis.viralScore}`);
      }
      if (v.prompts) {
        doc.moveDown(0.3);
        doc.fontSize(11).text('Master Prompt');
        doc.fontSize(9).text(v.prompts.master);
        v.prompts.alternatives?.forEach((p, idx) => {
          doc.moveDown(0.3);
          doc.fontSize(11).text(`Alt ${idx + 1}`);
          doc.fontSize(9).text(p);
        });
      }
      doc.moveDown();
    });
    doc.end();
    return;
  }

  res.status(400).json({ error: 'Unsupported format' });
};