import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Claim } from '@/lib/types';
import { z } from 'zod';

const AddClaimSchema = z.object({
  text: z.string().min(5),
  category: z.enum([
    'authentication',
    'api_payments',
    'responsiveness',
    'performance',
    'security',
    'navigation',
    'data_display',
    'general',
  ]),
  testability: z.enum(['automated', 'semi_automated', 'manual_only', 'untestable']),
  requiredEvidence: z.string(),
  suggestedVerificationMethod: z.string(),
  sourceReference: z.string(),
  requirementId: z.string().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const claims = db.getClaims(id);
  const links = db.getAllClaimEvidenceLinks(id);

  // Attach evidence links
  const enriched = claims.map((c) => ({
    ...c,
    evidenceLinks: links.filter((l) => l.claimId === c.id),
  }));

  return NextResponse.json({ claims: enriched });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  try {
    const json = await req.json();
    const data = AddClaimSchema.parse(json);

    const newClaim: Claim = {
      id: `claim-${Date.now()}`,
      projectId: id,
      requirementId: data.requirementId,
      text: data.text,
      category: data.category,
      testability: data.testability,
      requiredEvidence: data.requiredEvidence,
      suggestedVerificationMethod: data.suggestedVerificationMethod,
      sourceReference: data.sourceReference,
      status: 'untested',
      confidence: 0.9,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.createClaim(newClaim);
    return NextResponse.json({ claim: newClaim }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
