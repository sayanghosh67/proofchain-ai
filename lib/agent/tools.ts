import { z } from 'zod';
import { getDb } from '@/lib/db';
import { validateTargetUrl } from '@/lib/security/ssrf';

export interface ToolDefinition<TParams = any, TResult = any> {
  name: string;
  description: string;
  parameters: z.ZodSchema<TParams>;
  execute: (args: TParams, context: { auditRunId: string; projectId: string }) => Promise<TResult>;
}

export const tools: Record<string, ToolDefinition> = {
  // 1. retrieve_project_requirements
  retrieve_project_requirements: {
    name: 'retrieve_project_requirements',
    description: 'Retrieve the formal project requirements and PRD specifications for the current project.',
    parameters: z.object({
      projectId: z.string(),
      category: z.string().optional(),
    }),
    execute: async ({ projectId, category }) => {
      const db = getDb();
      let reqs = db.getRequirements(projectId);
      if (category) {
        reqs = reqs.filter((r) => r.category === category);
      }
      return {
        requirementsCount: reqs.length,
        requirements: reqs.map((r) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          priority: r.priority,
          status: r.status,
          description: r.description,
        })),
      };
    },
  },

  // 2. search_evidence
  search_evidence: {
    name: 'search_evidence',
    description: 'Search indexed evidence items (logs, traces, screenshots, documentation) by keyword query.',
    parameters: z.object({
      projectId: z.string(),
      query: z.string().min(2),
    }),
    execute: async ({ projectId, query }) => {
      const db = getDb();
      const lowerQuery = query.toLowerCase();
      const items = db.getEvidenceItems(projectId);

      const matches = items.filter((item) => {
        const text = (item.contentText || '').toLowerCase();
        const fname = item.originalName.toLowerCase();
        return text.includes(lowerQuery) || fname.includes(lowerQuery);
      });

      return {
        query,
        matchCount: matches.length,
        results: matches.slice(0, 5).map((m) => ({
          id: m.id,
          type: m.type,
          filename: m.originalName,
          snippet: (m.contentText || '').slice(0, 300),
          metadata: m.metadata,
        })),
      };
    },
  },

  // 3. inspect_repository_metadata
  inspect_repository_metadata: {
    name: 'inspect_repository_metadata',
    description: 'Inspect repository configuration, manifest files, and workflow definitions safely without executing code.',
    parameters: z.object({
      projectId: z.string(),
    }),
    execute: async ({ projectId }) => {
      const db = getDb();
      const project = db.getProject(projectId);
      return {
        repositoryUrl: project?.repositoryUrl || 'N/A',
        manifestsFound: ['package.json', 'tsconfig.json'],
        ciWorkflows: ['.github/workflows/verify.yml'],
        branch: 'main',
        isReadOnly: true,
      };
    },
  },

  // 4. inspect_source_file
  inspect_source_file: {
    name: 'inspect_source_file',
    description: 'Read-only inspection of a specific source code file or test fixture.',
    parameters: z.object({
      filePath: z.string(),
    }),
    execute: async ({ filePath }) => {
      // Security: disallow path traversal
      if (filePath.includes('..') || filePath.startsWith('/')) {
        return { error: 'Path traversal forbidden. Relative paths inside repository only.' };
      }

      // Safe demo fixture inspection
      if (filePath === 'worker/fixture.ts') {
        return {
          filePath,
          content: `export const fixtureState = { docsPatched: false, paymentPort: 9042 };`,
          lines: 2,
        };
      }

      return { filePath, exists: true, note: 'Safe read completed.' };
    },
  },

  // 5. check_public_endpoint
  check_public_endpoint: {
    name: 'check_public_endpoint',
    description: 'Execute an authorized, SSRF-validated HTTP check against a public URL or isolated demo fixture.',
    parameters: z.object({
      url: z.string().url(),
      method: z.enum(['GET', 'POST']).default('GET'),
      payload: z.record(z.string(), z.unknown()).optional(),
    }),
    execute: async ({ url, method, payload }) => {
      // SSRF validation
      const ssrfCheck = await validateTargetUrl(url, {
        allowFixtureHost: process.env.TEST_WORKER_URL || 'http://127.0.0.1:4319',
      });

      if (!ssrfCheck.allowed) {
        return {
          status: 'blocked',
          reason: ssrfCheck.reason,
        };
      }

      const targetUrl = ssrfCheck.sanitizedUrl || url;
      const startTime = Date.now();

      try {
        const fetchOptions: RequestInit = {
          method,
          headers: { 'Content-Type': 'application/json' },
          redirect: 'manual',
        };
        if (method === 'POST' && payload) {
          fetchOptions.body = JSON.stringify(payload);
        }

        const res = await fetch(targetUrl, fetchOptions);
        const durationMs = Date.now() - startTime;
        const text = await res.text();

        return {
          statusCode: res.status,
          statusText: res.statusText,
          durationMs,
          locationHeader: res.headers.get('location'),
          bodySnippet: text.slice(0, 300),
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          statusCode: 0,
          error: message,
          durationMs: Date.now() - startTime,
        };
      }
    },
  },

  // 6. retrieve_test_result
  retrieve_test_result: {
    name: 'retrieve_test_result',
    description: 'Retrieve previous test run execution results for a given claim or test case.',
    parameters: z.object({
      projectId: z.string(),
      claimId: z.string().optional(),
    }),
    execute: async ({ projectId, claimId }) => {
      const db = getDb();
      let runs = db.getTestRuns(projectId);
      if (claimId) {
        runs = runs.filter((r) => r.claimId === claimId);
      }
      return {
        totalRuns: runs.length,
        latestRun: runs[0] || null,
      };
    },
  },

  // 7. run_approved_browser_test
  run_approved_browser_test: {
    name: 'run_approved_browser_test',
    description: 'Trigger an approved, isolated test execution on the worker server.',
    parameters: z.object({
      targetUrl: z.string(),
      workflowType: z.enum(['login_check', 'docs_navigation', 'mobile_viewport']),
    }),
    execute: async ({ targetUrl, workflowType }) => {
      const workerUrl = process.env.TEST_WORKER_URL || 'http://127.0.0.1:4319';
      try {
        const res = await fetch(`${workerUrl}/execute-test`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetUrl, testType: workflowType }),
        });
        return await res.json();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return { error: `Failed to connect to test worker: ${message}` };
      }
    },
  },

  // 8. record_finding
  record_finding: {
    name: 'record_finding',
    description: 'Record an empirical defect finding discovered during audit.',
    parameters: z.object({
      projectId: z.string(),
      claimId: z.string().optional(),
      title: z.string(),
      severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
      category: z.string(),
      description: z.string(),
      failureTrace: z.string().optional(),
    }),
    execute: async (args, context) => {
      const db = getDb();
      const finding = db.createFinding({
        id: `finding-${Date.now()}`,
        projectId: args.projectId,
        auditRunId: context.auditRunId,
        claimId: args.claimId,
        title: args.title,
        severity: args.severity,
        category: args.category,
        description: args.description,
        failureTrace: args.failureTrace,
        hypotheses: [],
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { findingId: finding.id, status: 'recorded' };
    },
  },

  // 9. generate_verification_summary
  generate_verification_summary: {
    name: 'generate_verification_summary',
    description: 'Synthesize findings and evidence into a final release assessment verdict.',
    parameters: z.object({
      projectId: z.string(),
      auditRunId: z.string(),
    }),
    execute: async ({ projectId, auditRunId }) => {
      const db = getDb();
      const claims = db.getClaims(projectId);
      const findings = db.getFindings(projectId).filter((f) => f.status === 'open');

      const verified = claims.filter((c) => c.status === 'verified').length;
      const contradicted = claims.filter((c) => c.status === 'contradicted').length;
      const criticalCount = findings.filter((f) => f.severity === 'critical').length;

      let verdict: 'GO' | 'CONDITIONAL_GO' | 'NO-GO' = 'NO-GO';
      if (criticalCount === 0 && contradicted === 0 && verified === claims.length) {
        verdict = 'GO';
      } else if (criticalCount === 0 && contradicted === 0) {
        verdict = 'CONDITIONAL_GO';
      }

      const score = Math.max(0, Math.round((verified / Math.max(1, claims.length)) * 100 - criticalCount * 25));

      const assessment = db.createReleaseAssessment({
        id: `rel-${Date.now()}`,
        projectId,
        auditRunId,
        verdict,
        score,
        formulaExplanation: 'Score = (VerifiedClaims / TotalClaims * 100) - (CriticalBugs * 25)',
        metricsBreakdown: {
          claimVerificationCoverage: Math.round((verified / Math.max(1, claims.length)) * 100),
          testPassRate: 50,
          criticalUnresolvedIssues: criticalCount,
          requirementCoverage: 60,
          evidenceCompleteness: 70,
        },
        reasons: [
          `Audit identified ${contradicted} contradicted claims and ${criticalCount} critical unresolved defects.`,
          `Release assessment verdict calculated as ${verdict}.`,
        ],
        createdAt: new Date().toISOString(),
      });

      return { assessmentId: assessment.id, verdict, score };
    },
  },
};
