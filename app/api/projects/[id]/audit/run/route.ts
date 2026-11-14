import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { runAutonomousAudit } from '@/lib/agent/runner';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const project = db.getProject(id);

  if (!project) {
    return NextResponse.json({ error: `Project ${id} not found` }, { status: 404 });
  }

  try {
    const auditRunId = await runAutonomousAudit(id);
    const run = db.getAuditRun(auditRunId);
    const toolCalls = db.getAgentToolCalls(auditRunId);

    return NextResponse.json({
      success: true,
      auditRun: run,
      toolCalls,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const runs = db.getAuditRuns(id);

  const enriched = runs.map((r) => ({
    ...r,
    toolCalls: db.getAgentToolCalls(r.id),
  }));

  return NextResponse.json({ auditRuns: enriched });
}
