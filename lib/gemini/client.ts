import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { ClaimCategory, ClaimTestability, FindingSeverity } from '@/lib/types';

export class GeminiServiceError extends Error {
  constructor(message: string, public code: 'MISSING_API_KEY' | 'API_ERROR' | 'VALIDATION_ERROR' | 'TIMEOUT') {
    super(message);
    this.name = 'GeminiServiceError';
  }
}

export function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim().length > 0);
}

export function getGeminiModelName(): string {
  return process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
}

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiServiceError(
      'GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your environment or .env.local file.',
      'MISSING_API_KEY'
    );
  }
  return new GoogleGenAI({ apiKey });
}

// Schemas
export const ExtractedClaimSchema = z.object({
  claims: z.array(
    z.object({
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
      ] as const),
      testability: z.enum(['automated', 'semi_automated', 'manual_only', 'untestable'] as const),
      requiredEvidence: z.string(),
      suggestedVerificationMethod: z.string(),
      confidence: z.number().min(0).max(1),
      reasoning: z.string().optional(),
    })
  ),
});

export type ExtractedClaim = z.infer<typeof ExtractedClaimSchema>['claims'][number];

/**
 * MODULE 3 — GEMINI CLAIM INTELLIGENCE
 * Extracts atomic, testable claims from unstructured project text or reports.
 */
export async function extractClaimsWithGemini(
  content: string,
  sourceReference = 'User Provided Document'
): Promise<ExtractedClaim[]> {
  const ai = getClient();
  const model = getGeminiModelName();

  const prompt = `You are the lead claims intelligence analyst for PROOFCHAIN.AI.
Analyze the following project document/report and extract atomic, testable claims regarding functionality, completion, readiness, and performance.
Rules:
1. Break compound sentences into atomic, individually testable claims.
2. For each claim, determine its category (authentication, api_payments, responsiveness, performance, security, navigation, data_display, general).
3. Classify testability (automated, semi_automated, manual_only, untestable).
4. Specify the exact concrete evidence required to prove or disprove this claim.
5. Suggest an empirical verification method (e.g. browser workflow test, GET/POST endpoint status, accessibility scan, mobile viewport check).
6. Give a confidence score (0.0 to 1.0).
7. Respond strictly in valid JSON matching the schema.

Project Report Content:
"""
${content}
"""`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new GeminiServiceError('Empty response received from Gemini API.', 'API_ERROR');
    }

    const parsedJson = JSON.parse(responseText);
    const validated = ExtractedClaimSchema.parse(parsedJson);
    return validated.claims;
  } catch (err: unknown) {
    if (err instanceof GeminiServiceError) throw err;
    if (err instanceof z.ZodError) {
      throw new GeminiServiceError(`Gemini structured response schema mismatch: ${err.message}`, 'VALIDATION_ERROR');
    }
    const message = err instanceof Error ? err.message : String(err);
    throw new GeminiServiceError(`Gemini claim extraction failed: ${message}`, 'API_ERROR');
  }
}

// Root Cause Analysis Schema
export const RootCauseSchema = z.object({
  confirmedRootCause: z.string().optional(),
  hypotheses: z.array(
    z.object({
      description: z.string(),
      supportingEvidence: z.array(z.string()),
      missingEvidence: z.array(z.string()),
      confidence: z.number().min(0).max(1),
      proposedNextTest: z.string(),
      isConfirmed: z.boolean(),
    })
  ),
  recommendedAction: z.string(),
});

export type RootCauseAnalysis = z.infer<typeof RootCauseSchema>;

/**
 * MODULE 8 — AI ROOT CAUSE INVESTIGATOR
 */
export async function investigateRootCauseWithGemini(
  failureTrace: string,
  observedBehavior: string,
  contextCode?: string
): Promise<RootCauseAnalysis> {
  const ai = getClient();
  const model = getGeminiModelName();

  const prompt = `You are a Principal Software Diagnostic Engineer for PROOFCHAIN.AI.
Investigate the following software test failure and determine plausible root causes.
Rules:
- Never confuse a hypothesis with a confirmed root cause without irrefutable proof.
- Rank hypotheses by evidence.
- Identify what evidence is present and what is missing.
- Provide targeted verification steps and a recommended action.
- Return strictly JSON matching the required schema.

Observed Behavior:
${observedBehavior}

Failure Trace / Error Logs:
${failureTrace}

${contextCode ? `Relevant Code / Configuration:\n${contextCode}` : ''}
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new GeminiServiceError('Empty response received from Gemini API.', 'API_ERROR');
    }

    const parsedJson = JSON.parse(responseText);
    return RootCauseSchema.parse(parsedJson);
  } catch (err: unknown) {
    if (err instanceof GeminiServiceError) throw err;
    const message = err instanceof Error ? err.message : String(err);
    throw new GeminiServiceError(`Gemini root cause investigation failed: ${message}`, 'API_ERROR');
  }
}

// Fix Proposal Schema
export const FixProposalSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  patchDiff: z.string(),
  targetFile: z.string(),
  risks: z.array(z.string()),
  expectedImpact: z.string(),
  requiredRetests: z.array(z.string()),
});

export type FixProposalAiResult = z.infer<typeof FixProposalSchema>;

/**
 * MODULE 10 — AUTONOMOUS RECOVERY STUDIO (Fix Proposal Generation)
 */
export async function generateFixProposalWithGemini(
  findingTitle: string,
  findingDescription: string,
  targetFile: string,
  fileContent: string
): Promise<FixProposalAiResult> {
  const ai = getClient();
  const model = getGeminiModelName();

  const prompt = `You are an Application Security & Recovery Architect for PROOFCHAIN.AI.
Generate a safe, minimal patch diff to resolve the specified finding.
Rules:
1. Do not modify unrelated code.
2. Produce a standard unified diff format (--- a/... +++ b/...).
3. List explicit risks, expected impact, and required regression tests.
4. Return strictly JSON matching the schema.

Finding: ${findingTitle}
Description: ${findingDescription}
Target File: ${targetFile}

Current File Content:
"""
${fileContent}
"""
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new GeminiServiceError('Empty response received from Gemini API.', 'API_ERROR');
    }

    return FixProposalSchema.parse(JSON.parse(responseText));
  } catch (err: unknown) {
    if (err instanceof GeminiServiceError) throw err;
    const message = err instanceof Error ? err.message : String(err);
    throw new GeminiServiceError(`Gemini fix proposal generation failed: ${message}`, 'API_ERROR');
  }
}

/**
 * MODULE 4 & MULTIMODAL — Analyze screenshot or document with Gemini
 */
export async function analyzeMultimodalEvidenceWithGemini(
  mimeType: string,
  base64Data: string,
  userPrompt = 'Analyze this evidence for visual defects, layout overflow, missing accessibility elements, or error dialogs.'
): Promise<{ summary: string; defectsDetected: string[]; confidence: number }> {
  const ai = getClient();
  const model = getGeminiModelName();

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
        {
          text: `${userPrompt} Output in JSON with keys: "summary" (string), "defectsDetected" (array of strings), "confidence" (number 0-1).`,
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new GeminiServiceError('Empty response from multimodal analysis.', 'API_ERROR');
    }

    return JSON.parse(responseText);
  } catch (err: unknown) {
    if (err instanceof GeminiServiceError) throw err;
    const message = err instanceof Error ? err.message : String(err);
    throw new GeminiServiceError(`Multimodal evidence analysis failed: ${message}`, 'API_ERROR');
  }
}
