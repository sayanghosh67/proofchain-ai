import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { isGeminiConfigured, extractClaimsWithGemini, GeminiServiceError } from '@/lib/gemini/client';
import { Claim } from '@/lib/types';
import { z } from 'zod';

const ExtractPayloadSchema = z.object({
  content: z.string().min(10),
  sourceReference: z.string().default('Uploaded Document'),
});

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

  if (!isGeminiConfigured()) {
    return NextResponse.json(
      {
        error:
          'GEMINI_API_KEY is not configured in environment variables. Please provide a valid Gemini API Key in your environment or .env.local to run live claim extraction.',
        code: 'MISSING_API_KEY',
      },
      { status: 400 }
    );
  }

  try {
    const json = await req.json();
    const { content, sourceReference } = ExtractPayloadSchema.parse(json);

    // Call live Google Gemini model
    const extracted = await extractClaimsWithGemini(content, sourceReference);

    const savedClaims: Claim[] = [];
    const now = new Date().toISOString();

    for (const item of extracted) {
      const claim: Claim = {
        id: `claim-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        projectId: id,
        text: item.text,
        category: item.category,
        testability: item.testability,
        requiredEvidence: item.requiredEvidence,
        suggestedVerificationMethod: item.suggestedVerificationMethod,
        confidence: item.confidence,
        reasoning: item.reasoning,
        sourceReference,
        status: 'untested',
        createdAt: now,
        updatedAt: now,
      };

      db.createClaim(claim);
      savedClaims.push(claim);
    }

    return NextResponse.json({
      success: true,
      extractedCount: savedClaims.length,
      claims: savedClaims,
    });
  } catch (err: unknown) {
    if (err instanceof GeminiServiceError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 502 });
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
