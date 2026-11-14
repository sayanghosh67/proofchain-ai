import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { validateTargetUrl } from '@/lib/security/ssrf';
import { TestRun } from '@/lib/types';
import { z } from 'zod';

const RunTestSchema = z.object({
  targetUrl: z.string().url(),
  method: z.enum(['GET', 'POST']).default('GET'),
  testCaseId: z.string().optional(),
  claimId: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
  expectedBehavior: z.string().default('Returns HTTP 200 OK'),
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

  try {
    const json = await req.json();
    const data = RunTestSchema.parse(json);

    // SSRF Check
    const ssrf = await validateTargetUrl(data.targetUrl, {
      allowFixtureHost: process.env.TEST_WORKER_URL || 'http://127.0.0.1:4319',
    });

    if (!ssrf.allowed) {
      return NextResponse.json(
        { error: `Security Policy Violation: ${ssrf.reason}`, code: 'SSRF_BLOCKED' },
        { status: 403 }
      );
    }

    const startTime = Date.now();
    let status: 'passed' | 'failed' | 'error' = 'failed';
    let observedBehavior = '';
    let errorLogs: string | undefined;

    try {
      const fetchOptions: RequestInit = {
        method: data.method,
        headers: { 'Content-Type': 'application/json' },
        redirect: 'manual',
      };
      if (data.method === 'POST' && data.payload) {
        fetchOptions.body = JSON.stringify(data.payload);
      }

      const res = await fetch(data.targetUrl, fetchOptions);
      const text = await res.text();
      const durationMs = Date.now() - startTime;

      if (res.status >= 200 && res.status < 300) {
        status = 'passed';
        observedBehavior = `HTTP ${res.status} ${res.statusText}. Response body verified.`;
      } else if (res.status === 301 || res.status === 302) {
        const loc = res.headers.get('location');
        if (loc?.includes('broken-docs-404')) {
          status = 'failed';
          observedBehavior = `Redirects to broken 404 target: ${loc}`;
          errorLogs = `HTTP 404 Route Missing at destination`;
        } else {
          status = 'passed';
          observedBehavior = `HTTP ${res.status} Redirects to valid target: ${loc}`;
        }
      } else {
        status = 'failed';
        observedBehavior = `HTTP ${res.status} ${res.statusText}`;
        errorLogs = text.slice(0, 300);
      }

      const run: TestRun = {
        id: `tr-${Date.now()}`,
        projectId: id,
        testCaseId: data.testCaseId || `tc-${Date.now()}`,
        claimId: data.claimId,
        status,
        durationMs,
        executedAt: new Date().toISOString(),
        observedBehavior,
        expectedBehavior: data.expectedBehavior,
        errorLogs,
      };

      db.createTestRun(run);

      // If claimId provided, update claim status empirically!
      if (data.claimId) {
        db.updateClaim(data.claimId, {
          status: status === 'passed' ? 'verified' : 'contradicted',
          reasoning: `Updated by empirical test run: ${observedBehavior}`,
        });
      }

      return NextResponse.json({ testRun: run });
    } catch (fetchErr: unknown) {
      const durationMs = Date.now() - startTime;
      const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);

      const run: TestRun = {
        id: `tr-${Date.now()}`,
        projectId: id,
        testCaseId: data.testCaseId || `tc-${Date.now()}`,
        claimId: data.claimId,
        status: 'error',
        durationMs,
        executedAt: new Date().toISOString(),
        observedBehavior: `Connection failed: ${msg}`,
        expectedBehavior: data.expectedBehavior,
        errorLogs: msg,
      };

      db.createTestRun(run);
      return NextResponse.json({ testRun: run });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  return NextResponse.json({
    testRuns: db.getTestRuns(id),
    testCases: db.getTestCases(id),
  });
}
