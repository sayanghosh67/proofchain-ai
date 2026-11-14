import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Project } from '@/lib/types';
import { z } from 'zod';

const CreateProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  repositoryUrl: z.string().optional(),
  targetUrl: z.string().optional(),
});

export async function GET() {
  const db = getDb();
  const projects = db.getProjects();

  // Attach aggregated statistics to each project
  const enriched = projects.map((p) => {
    const claims = db.getClaims(p.id);
    const findings = db.getFindings(p.id);
    const verified = claims.filter((c) => c.status === 'verified').length;
    const contradicted = claims.filter((c) => c.status === 'contradicted').length;
    const unsupported = claims.filter((c) => c.status === 'unsupported').length;
    const criticalIssues = findings.filter((f) => f.severity === 'critical' && f.status === 'open').length;

    return {
      ...p,
      stats: {
        totalClaims: claims.length,
        verified,
        contradicted,
        unsupported,
        criticalIssues,
        coveragePct: claims.length ? Math.round((verified / claims.length) * 100) : 0,
      },
    };
  });

  return NextResponse.json({ projects: enriched });
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = CreateProjectSchema.parse(json);
    const db = getDb();

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: data.name,
      description: data.description,
      repositoryUrl: data.repositoryUrl,
      targetUrl: data.targetUrl,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.createProject(newProject);
    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
