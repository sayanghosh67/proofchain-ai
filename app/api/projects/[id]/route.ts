import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const project = db.getProject(id);

  if (!project) {
    return NextResponse.json({ error: `Project ${id} not found` }, { status: 404 });
  }

  const claims = db.getClaims(id);
  const requirements = db.getRequirements(id);
  const evidence = db.getEvidenceItems(id);
  const auditRuns = db.getAuditRuns(id);
  const testRuns = db.getTestRuns(id);
  const findings = db.getFindings(id);
  const fixProposals = db.getFixProposals(id);
  const assessments = db.getReleaseAssessments(id);

  return NextResponse.json({
    project,
    counts: {
      claims: claims.length,
      requirements: requirements.length,
      evidence: evidence.length,
      auditRuns: auditRuns.length,
      testRuns: testRuns.length,
      findings: findings.length,
      fixProposals: fixProposals.length,
    },
    latestAssessment: assessments[0] || null,
  });
}

