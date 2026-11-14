import { getDb } from '@/lib/db';
import { tools } from './tools';
import { isGeminiConfigured, getGeminiModelName } from '@/lib/gemini/client';
import { GoogleGenAI } from '@google/genai';

export interface AuditRunProgress {
  step: number;
  toolName: string;
  status: 'running' | 'success' | 'error';
  details?: Record<string, unknown>;
}

export async function runAutonomousAudit(
  projectId: string,
  onProgress?: (progress: AuditRunProgress) => void
): Promise<string> {
  const db = getDb();
  const project = db.getProject(projectId);
  if (!project) throw new Error(`Project ${projectId} not found`);

  const auditRunId = `audit-${Date.now()}`;
  const auditRun = db.createAuditRun({
    id: auditRunId,
    projectId,
    initiatedAt: new Date().toISOString(),
    status: 'running',
    stepsExecuted: 0,
    totalClaims: 0,
    verifiedClaims: 0,
    contradictedClaims: 0,
    unsupportedClaims: 0,
    inconclusiveClaims: 0,
  });

  const MAX_STEPS = 8;
  let currentStep = 0;

  async function executeStep(toolName: string, args: Record<string, unknown>) {
    currentStep++;
    const stepStart = Date.now();
    const toolDef = tools[toolName];

    if (!toolDef) {
      throw new Error(`Tool "${toolName}" is not registered.`);
    }

    onProgress?.({ step: currentStep, toolName, status: 'running' });

    let outputResult: Record<string, unknown> | undefined;
    let stepStatus: 'success' | 'error' = 'success';
    let errorMessage: string | undefined;

    try {
      // Validate arguments with Zod
      const validatedArgs = toolDef.parameters.parse(args);
      outputResult = await toolDef.execute(validatedArgs, { auditRunId, projectId });
    } catch (err: unknown) {
      stepStatus = 'error';
      errorMessage = err instanceof Error ? err.message : String(err);
      outputResult = { error: errorMessage };
    }

    const durationMs = Date.now() - stepStart;

    db.createAgentToolCall({
      id: `call-${Date.now()}-${currentStep}`,
      auditRunId,
      stepNumber: currentStep,
      toolName,
      inputArguments: args,
      outputResult,
      status: stepStatus,
      latencyMs: durationMs,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    onProgress?.({ step: currentStep, toolName, status: stepStatus, details: outputResult });
    return outputResult;
  }

  try {
    // Step 1: Retrieve formal project requirements
    await executeStep('retrieve_project_requirements', { projectId });

    // Step 2: Search indexed evidence for payment
    await executeStep('search_evidence', { projectId, query: 'payment' });

    // Step 3: Check live login fixture endpoint
    const fixtureBase = project.targetUrl || 'http://127.0.0.1:4319/fixture';
    await executeStep('check_public_endpoint', {
      url: `${fixtureBase}/login`,
      method: 'GET',
    });

    // Step 4: Check payment endpoint
    const payResult = await executeStep('check_public_endpoint', {
      url: `${fixtureBase}/api/payment`,
      method: 'POST',
      payload: { amount: 100, currency: 'USD' },
    });

    const payRecord = payResult as Record<string, any> | undefined;
    if (payRecord && payRecord.statusCode === 500) {
      // Step 5: Record critical finding for payment 500
      await executeStep('record_finding', {
        projectId,
        title: 'Payment Gateway Fails with HTTP 500',
        severity: 'critical',
        category: 'api_payments',
        description: 'Endpoint /fixture/api/payment failed with 500: connection refused on port 9042.',
        failureTrace: 'MockPaymentGatewayConnectionRefused: 127.0.0.1:9042',
      });
    }

    // Step 6: Check documentation navigation route
    const navResult = await executeStep('check_public_endpoint', {
      url: `${fixtureBase}/docs`,
      method: 'GET',
    });

    const navRecord = navResult as Record<string, any> | undefined;
    if (
      navRecord &&
      (navRecord.statusCode === 404 ||
        (typeof navRecord.locationHeader === 'string' &&
          navRecord.locationHeader.includes('broken-docs-404')))
    ) {
      // Step 7: Record navigation finding
      await executeStep('record_finding', {
        projectId,
        title: 'Broken Navigation: Documentation Target Routes to 404',
        severity: 'high',
        category: 'navigation',
        description: 'Documentation link anchor redirects to broken-docs-404 route.',
        failureTrace: 'HTTP 404 Not Found: /fixture/broken-docs-404',
      });
    }

    // Step 8: Final release verification summary
    await executeStep('generate_verification_summary', { projectId, auditRunId });

    // Complete audit run
    const claims = db.getClaims(projectId);
    const verified = claims.filter((c) => c.status === 'verified').length;
    const contradicted = claims.filter((c) => c.status === 'contradicted').length;
    const unsupported = claims.filter((c) => c.status === 'unsupported').length;
    const inconclusive = claims.filter((c) => c.status === 'inconclusive').length;

    db.updateAuditRun(auditRunId, {
      completedAt: new Date().toISOString(),
      status: 'completed',
      stepsExecuted: currentStep,
      totalClaims: claims.length,
      verifiedClaims: verified,
      contradictedClaims: contradicted,
      unsupportedClaims: unsupported,
      inconclusiveClaims: inconclusive,
      summary: `Autonomous audit finished with ${currentStep} tool steps. Verified ${verified}/${claims.length} claims. Discovered ${contradicted} contradicted claims.`,
    });

    return auditRunId;
  } catch (err: unknown) {
    db.updateAuditRun(auditRunId, {
      completedAt: new Date().toISOString(),
      status: 'failed',
      stepsExecuted: currentStep,
      summary: `Audit execution halted with error: ${err instanceof Error ? err.message : String(err)}`,
    });
    throw err;
  }
}
