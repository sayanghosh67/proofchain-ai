import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { EvidenceItem } from '@/lib/types';
import { z } from 'zod';

const EvidenceSchema = z.object({
  type: z.enum([
    'screenshot',
    'pdf',
    'log',
    'source_file',
    'test_output',
    'api_response',
    'repo_metadata',
    'manual_note',
  ]),
  originalName: z.string().min(1),
  mimeType: z.string().default('text/plain'),
  sizeBytes: z.number().default(100),
  contentText: z.string().optional(),
  fileUrl: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const evidence = db.getEvidenceItems(id);
  return NextResponse.json({ evidence });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  try {
    const json = await req.json();
    const data = EvidenceSchema.parse(json);

    const item: EvidenceItem = {
      id: `ev-${Date.now()}`,
      projectId: id,
      type: data.type,
      filename: `${Date.now()}-${data.originalName.replace(/\s+/g, '_')}`,
      originalName: data.originalName,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      contentText: data.contentText,
      fileUrl: data.fileUrl,
      metadata: data.metadata,
      createdAt: new Date().toISOString(),
    };

    db.createEvidenceItem(item);

    // If text is present, create evidence chunk
    if (data.contentText) {
      db.createEvidenceChunk({
        id: `chunk-${Date.now()}`,
        evidenceId: item.id,
        projectId: id,
        chunkIndex: 0,
        content: data.contentText.slice(0, 500),
      });
    }

    return NextResponse.json({ item }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

