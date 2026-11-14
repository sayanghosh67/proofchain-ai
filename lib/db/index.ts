import fs from 'node:fs';
import path from 'node:path';
import {
  Project,
  Requirement,
  Claim,
  EvidenceItem,
  EvidenceChunk,
  ClaimEvidenceLink,
  AuditRun,
  AgentToolCall,
  TestCase,
  TestRun,
  Finding,
  FixProposal,
  FixAttempt,
  DependencyNode,
  DependencyEdge,
  RemediationTask,
  ReleaseAssessment,
} from '@/lib/types';

interface DatabaseSchema {
  projects: Project[];
  requirements: Requirement[];
  claims: Claim[];
  evidenceItems: EvidenceItem[];
  evidenceChunks: EvidenceChunk[];
  claimEvidenceLinks: ClaimEvidenceLink[];
  auditRuns: AuditRun[];
  agentToolCalls: AgentToolCall[];
  testCases: TestCase[];
  testRuns: TestRun[];
  findings: Finding[];
  fixProposals: FixProposal[];
  fixAttempts: FixAttempt[];
  dependencyNodes: DependencyNode[];
  dependencyEdges: DependencyEdge[];
  remediationTasks: RemediationTask[];
  releaseAssessments: ReleaseAssessment[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial seed data for the Deliberately Imperfect Demo Project
function getSeedData(): DatabaseSchema {
  const demoProjectId = 'demo-nexus-pay';
  const now = new Date().toISOString();

  const demoProject: Project = {
    id: demoProjectId,
    name: 'Nexus Pay & Cloud Portal v1.0',
    description:
      'Enterprise payment gateway and merchant dashboard claiming 100% test completion and release readiness.',
    repositoryUrl: 'https://github.com/demo-fixtures/nexus-pay-portal',
    targetUrl: 'http://127.0.0.1:4319/fixture',
    status: 'at_risk',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: now,
    metadata: {
      isDemo: true,
      leadAuditor: 'AI Autonomous Investigator',
      targetWorker: 'http://127.0.0.1:4319',
    },
  };

  const requirements: Requirement[] = [
    {
      id: 'req-auth-1',
      projectId: demoProjectId,
      title: 'Merchant Authentication',
      description: 'Merchants must be able to securely sign in using valid credentials.',
      category: 'authentication',
      priority: 'critical',
      status: 'verified',
      source: 'PRD v2.1 Section 3.1',
      createdAt: now,
    },
    {
      id: 'req-pay-1',
      projectId: demoProjectId,
      title: 'Payment Gateway Processing',
      description: 'The API must process credit card transactions and return transaction IDs.',
      category: 'api_payments',
      priority: 'critical',
      status: 'contradicted',
      source: 'PRD v2.1 Section 4.2',
      createdAt: now,
    },
    {
      id: 'req-nav-1',
      projectId: demoProjectId,
      title: 'Merchant Documentation Access',
      description: 'All documentation navigation links must route merchants to active help resources.',
      category: 'core_flow',
      priority: 'high',
      status: 'contradicted',
      source: 'PRD v2.1 Section 1.4',
      createdAt: now,
    },
    {
      id: 'req-mob-1',
      projectId: demoProjectId,
      title: 'Responsive Merchant Dashboard',
      description: 'Dashboard layout must support mobile viewports down to 375px without horizontal scroll.',
      category: 'responsiveness',
      priority: 'medium',
      status: 'unsupported',
      source: 'PRD v2.1 Section 2.2',
      createdAt: now,
    },
  ];

  const claims: Claim[] = [
    {
      id: 'claim-1',
      projectId: demoProjectId,
      requirementId: 'req-auth-1',
      text: 'Merchant authentication is 100% functional with zero session vulnerabilities.',
      category: 'authentication',
      testability: 'automated',
      requiredEvidence: 'Browser authentication test logs and HTTP 200 session cookie token',
      suggestedVerificationMethod: 'Controlled browser credential flow',
      status: 'verified',
      confidence: 0.95,
      sourceReference: 'Sprint 14 Release Report - Page 3',
      reasoning: 'Verified by automated Playwright browser test on /fixture/login.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'claim-2',
      projectId: demoProjectId,
      requirementId: 'req-pay-1',
      text: 'Payment processing API is fully functional and production-ready.',
      category: 'api_payments',
      testability: 'automated',
      requiredEvidence: 'Successful API response with 200 OK and valid charge ID',
      suggestedVerificationMethod: 'POST check to /fixture/api/payment with sandbox payload',
      status: 'contradicted',
      confidence: 0.99,
      sourceReference: 'Sprint 14 Release Report - Page 4',
      reasoning: 'Contradicted by live test: endpoint returned HTTP 500 Gateway Connection Refused.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'claim-3',
      projectId: demoProjectId,
      requirementId: 'req-nav-1',
      text: 'All documentation and portal navigation links are fully verified.',
      category: 'navigation',
      testability: 'automated',
      requiredEvidence: 'HTTP 200 status on all navigation anchors',
      suggestedVerificationMethod: 'GET check on /fixture/docs target',
      status: 'contradicted',
      confidence: 0.98,
      sourceReference: 'Sprint 14 Release Report - Page 2',
      reasoning: 'Contradicted by live test: Documentation link routes to 404 broken endpoint.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'claim-4',
      projectId: demoProjectId,
      requirementId: 'req-mob-1',
      text: 'Merchant portal layout seamlessly supports all mobile devices.',
      category: 'responsiveness',
      testability: 'automated',
      requiredEvidence: 'Viewport test at 375px width with zero horizontal overflow',
      suggestedVerificationMethod: 'DOM scrollWidth check on mobile viewport',
      status: 'unsupported',
      confidence: 0.92,
      sourceReference: 'Sprint 14 Release Report - Page 5',
      reasoning: 'Unsupported by evidence: fixed table container forces 640px minimum width.',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const evidenceItems: EvidenceItem[] = [
    {
      id: 'ev-1',
      projectId: demoProjectId,
      type: 'test_output',
      filename: 'login-test-trace.json',
      originalName: 'auth_suite_run_104.json',
      mimeType: 'application/json',
      sizeBytes: 14200,
      contentText:
        'Test Suite: Auth\nPassed: 1/1\nObserved: user demo@proofchain.ai authenticated successfully. Auth token issued.',
      metadata: { target: '/fixture/login', durationMs: 142 },
      createdAt: now,
    },
    {
      id: 'ev-2',
      projectId: demoProjectId,
      type: 'log',
      filename: 'payment-error-500.log',
      originalName: 'payment_gateway_stderr.log',
      mimeType: 'text/plain',
      sizeBytes: 8320,
      contentText:
        'CRITICAL [2026-11-14T04:12:00Z] POST /fixture/api/payment failed: MockPaymentGatewayConnectionRefused: Failed to connect to payment cluster on port 9042.',
      metadata: { httpStatus: 500, error: 'PaymentGatewayConnectionRefused' },
      createdAt: now,
    },
    {
      id: 'ev-3',
      projectId: demoProjectId,
      type: 'screenshot',
      filename: 'broken-docs-404.png',
      originalName: 'docs_link_click.png',
      mimeType: 'image/png',
      sizeBytes: 124500,
      contentText: 'Visual 404 Error: The requested URL /fixture/broken-docs-404 was not found on this server.',
      metadata: { targetUrl: 'http://127.0.0.1:4319/fixture/broken-docs-404', statusCode: 404 },
      fileUrl: '/fixtures/broken-docs-404.png',
      createdAt: now,
    },
  ];

  const evidenceChunks: EvidenceChunk[] = [
    {
      id: 'chunk-1',
      evidenceId: 'ev-1',
      projectId: demoProjectId,
      chunkIndex: 0,
      content: 'Auth token issued successfully for user demo@proofchain.ai.',
    },
    {
      id: 'chunk-2',
      evidenceId: 'ev-2',
      projectId: demoProjectId,
      chunkIndex: 0,
      content: 'POST /fixture/api/payment failed: MockPaymentGatewayConnectionRefused.',
    },
    {
      id: 'chunk-3',
      evidenceId: 'ev-3',
      projectId: demoProjectId,
      chunkIndex: 0,
      content: 'HTTP 404 Error: /fixture/broken-docs-404 not found on server.',
    },
  ];

  const claimEvidenceLinks: ClaimEvidenceLink[] = [
    {
      id: 'link-1',
      claimId: 'claim-1',
      evidenceId: 'ev-1',
      relationType: 'supports',
      confidence: 0.98,
      snippet: 'Auth token issued successfully for demo user.',
      explanation: 'Observed automated login completed in 142ms with HTTP 200.',
    },
    {
      id: 'link-2',
      claimId: 'claim-2',
      evidenceId: 'ev-2',
      relationType: 'contradicts',
      confidence: 0.99,
      snippet: 'CRITICAL: MockPaymentGatewayConnectionRefused (HTTP 500)',
      explanation: 'Live execution proves payment processing fails with 500 error.',
    },
    {
      id: 'link-3',
      claimId: 'claim-3',
      evidenceId: 'ev-3',
      relationType: 'contradicts',
      confidence: 0.98,
      snippet: 'Visual 404 Error: /fixture/broken-docs-404 was not found',
      explanation: 'Documentation link anchor points to missing route.',
    },
  ];

  const auditRuns: AuditRun[] = [
    {
      id: 'audit-run-1',
      projectId: demoProjectId,
      initiatedAt: new Date(Date.now() - 1800000).toISOString(),
      completedAt: new Date(Date.now() - 1650000).toISOString(),
      status: 'completed',
      summary:
        'Investigated 4 project claims against live execution fixtures. Discovered 2 contradicted claims and 1 unsupported claim. Release verdict: NO-GO.',
      stepsExecuted: 6,
      totalClaims: 4,
      verifiedClaims: 1,
      contradictedClaims: 2,
      unsupportedClaims: 1,
      inconclusiveClaims: 0,
    },
  ];

  const agentToolCalls: AgentToolCall[] = [
    {
      id: 'call-1',
      auditRunId: 'audit-run-1',
      stepNumber: 1,
      toolName: 'retrieve_project_requirements',
      inputArguments: { projectId: demoProjectId },
      outputResult: { requirementsCount: 4 },
      status: 'success',
      latencyMs: 84,
      timestamp: new Date(Date.now() - 1790000).toISOString(),
    },
    {
      id: 'call-2',
      auditRunId: 'audit-run-1',
      stepNumber: 2,
      toolName: 'check_public_endpoint',
      inputArguments: { url: 'http://127.0.0.1:4319/fixture/login', method: 'GET' },
      outputResult: { statusCode: 200, statusText: 'OK' },
      status: 'success',
      latencyMs: 120,
      timestamp: new Date(Date.now() - 1760000).toISOString(),
    },
    {
      id: 'call-3',
      auditRunId: 'audit-run-1',
      stepNumber: 3,
      toolName: 'check_public_endpoint',
      inputArguments: { url: 'http://127.0.0.1:4319/fixture/api/payment', method: 'POST' },
      outputResult: { statusCode: 500, error: 'Internal Server Error' },
      status: 'success',
      latencyMs: 195,
      timestamp: new Date(Date.now() - 1730000).toISOString(),
    },
    {
      id: 'call-4',
      auditRunId: 'audit-run-1',
      stepNumber: 4,
      toolName: 'check_public_endpoint',
      inputArguments: { url: 'http://127.0.0.1:4319/fixture/docs', method: 'GET' },
      outputResult: { statusCode: 404, error: 'Not Found' },
      status: 'success',
      latencyMs: 65,
      timestamp: new Date(Date.now() - 1700000).toISOString(),
    },
    {
      id: 'call-5',
      auditRunId: 'audit-run-1',
      stepNumber: 5,
      toolName: 'record_finding',
      inputArguments: {
        title: 'Payment Processing Returns HTTP 500',
        severity: 'critical',
      },
      outputResult: { findingId: 'finding-pay-500' },
      status: 'success',
      latencyMs: 40,
      timestamp: new Date(Date.now() - 1680000).toISOString(),
    },
    {
      id: 'call-6',
      auditRunId: 'audit-run-1',
      stepNumber: 6,
      toolName: 'generate_verification_summary',
      inputArguments: { auditRunId: 'audit-run-1' },
      outputResult: { verdict: 'NO-GO', confidence: 0.98 },
      status: 'success',
      latencyMs: 110,
      timestamp: new Date(Date.now() - 1655000).toISOString(),
    },
  ];

  const testCases: TestCase[] = [
    {
      id: 'tc-auth',
      projectId: demoProjectId,
      claimId: 'claim-1',
      name: 'Verify Merchant Login Workflow',
      category: 'workflow',
      targetUrl: 'http://127.0.0.1:4319/fixture/login',
      method: 'BROWSER',
      expectedBehavior: 'Login form accepts valid demo credentials and issues session token.',
      isAutomated: true,
      createdAt: now,
    },
    {
      id: 'tc-pay',
      projectId: demoProjectId,
      claimId: 'claim-2',
      name: 'Verify Payment Processing Endpoint',
      category: 'endpoint_status',
      targetUrl: 'http://127.0.0.1:4319/fixture/api/payment',
      method: 'POST',
      parameters: { amount: 49.99, currency: 'USD' },
      expectedBehavior: 'Returns HTTP 200 with status "approved" and charge ID.',
      isAutomated: true,
      createdAt: now,
    },
    {
      id: 'tc-docs',
      projectId: demoProjectId,
      claimId: 'claim-3',
      name: 'Verify Documentation Navigation Route',
      category: 'navigation',
      targetUrl: 'http://127.0.0.1:4319/fixture/docs',
      method: 'GET',
      expectedBehavior: 'Returns HTTP 200 with documentation page body.',
      isAutomated: true,
      createdAt: now,
    },
  ];

  const testRuns: TestRun[] = [
    {
      id: 'tr-1',
      projectId: demoProjectId,
      testCaseId: 'tc-auth',
      claimId: 'claim-1',
      status: 'passed',
      durationMs: 240,
      executedAt: new Date(Date.now() - 1760000).toISOString(),
      observedBehavior: 'Login succeeded with HTTP 200. Cookie session set.',
      expectedBehavior: 'Returns HTTP 200 and session token.',
    },
    {
      id: 'tr-2',
      projectId: demoProjectId,
      testCaseId: 'tc-pay',
      claimId: 'claim-2',
      status: 'failed',
      durationMs: 195,
      executedAt: new Date(Date.now() - 1730000).toISOString(),
      observedBehavior: 'Received HTTP 500 Internal Server Error. Gateway cluster unreachable.',
      expectedBehavior: 'Returns HTTP 200 with status approved.',
      errorLogs: 'Internal Server Error: MockPaymentGatewayConnectionRefused on port 9042',
    },
    {
      id: 'tr-3',
      projectId: demoProjectId,
      testCaseId: 'tc-docs',
      claimId: 'claim-3',
      status: 'failed',
      durationMs: 65,
      executedAt: new Date(Date.now() - 1700000).toISOString(),
      observedBehavior: 'Received HTTP 404 Not Found at /fixture/broken-docs-404',
      expectedBehavior: 'Returns HTTP 200 with valid docs page.',
      errorLogs: '404 Not Found: destination link points to nonexistent route.',
    },
  ];

  const findings: Finding[] = [
    {
      id: 'finding-pay-500',
      projectId: demoProjectId,
      auditRunId: 'audit-run-1',
      claimId: 'claim-2',
      testRunId: 'tr-2',
      title: 'Payment Gateway Fails With HTTP 500',
      severity: 'critical',
      category: 'API / Payments',
      description:
        'The production payment endpoint fails on all transaction attempts because the gateway cluster connector configuration is pointing to an invalid port.',
      failureTrace: 'MockPaymentGatewayConnectionRefused: Connect to 127.0.0.1:9042 failed (ECONNREFUSED)',
      hypotheses: [
        {
          id: 'hypo-1',
          description: 'Payment gateway configuration points to unrouted legacy port 9042 instead of active mock sandbox port.',
          supportingEvidence: ['Error log references port 9042', 'Configuration file worker/fixture.ts sets port=9042'],
          missingEvidence: ['No TLS handshake error observed'],
          confidence: 0.94,
          proposedNextTest: 'Run sandbox health check with port=4319',
          isConfirmed: true,
        },
      ],
      confirmedRootCause: 'Payment gateway mock configuration has port mismatch in worker/fixture.ts',
      status: 'open',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'finding-docs-404',
      projectId: demoProjectId,
      auditRunId: 'audit-run-1',
      claimId: 'claim-3',
      testRunId: 'tr-3',
      title: 'Broken Navigation: Documentation Link Returns 404',
      severity: 'high',
      category: 'Navigation',
      description:
        'The primary documentation navigation link routes merchants to /fixture/broken-docs-404 which does not exist.',
      failureTrace: 'HTTP 404 Not Found: GET /fixture/broken-docs-404',
      hypotheses: [
        {
          id: 'hypo-2',
          description: 'The navbar anchor href is hardcoded to a legacy broken path instead of /fixture/docs-valid.',
          supportingEvidence: ['Test response 404', 'DOM anchor inspected href="/fixture/broken-docs-404"'],
          missingEvidence: [],
          confidence: 0.99,
          proposedNextTest: 'Update href to /fixture/docs-valid and re-execute GET check',
          isConfirmed: true,
        },
      ],
      confirmedRootCause: 'Typo in fixture navigation route: "/fixture/broken-docs-404" instead of "/fixture/docs-valid".',
      status: 'open',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const fixProposals: FixProposal[] = [
    {
      id: 'fix-docs-nav',
      findingId: 'finding-docs-404',
      projectId: demoProjectId,
      title: 'Repair Navigation Anchor Target for Documentation',
      explanation:
        'Patches the documentation link in the demo fixture navbar to point to the active /fixture/docs-valid route.',
      patchDiff: `--- a/worker/fixture.ts
+++ b/worker/fixture.ts
@@ -42,3 +42,3 @@
-  <a id="nav-docs" href="/fixture/broken-docs-404">API Docs</a>
+  <a id="nav-docs" href="/fixture/docs-valid">API Docs</a>
`,
      targetFile: 'worker/fixture.ts',
      risks: ['Low risk: affects only navigation anchor for documentation route.'],
      expectedImpact: 'Resolves 404 navigation error; verifies claim 3.',
      requiredRetests: ['Verify Documentation Navigation Route (tc-docs)'],
      status: 'pending_review',
      createdAt: now,
    },
  ];

  const dependencyNodes: DependencyNode[] = [
    { id: 'node-auth', projectId: demoProjectId, name: 'Auth Controller', type: 'api', status: 'healthy' },
    { id: 'node-pay', projectId: demoProjectId, name: 'Payment Engine', type: 'service', status: 'failing' },
    { id: 'node-nav', projectId: demoProjectId, name: 'Documentation Hub', type: 'page', status: 'warning' },
    { id: 'node-db', projectId: demoProjectId, name: 'Postgres Transactions', type: 'table', status: 'healthy' },
    { id: 'node-test-auth', projectId: demoProjectId, name: 'Auth Test Suite', type: 'test', status: 'healthy' },
    { id: 'node-test-pay', projectId: demoProjectId, name: 'Payment Test Suite', type: 'test', status: 'failing' },
  ];

  const dependencyEdges: DependencyEdge[] = [
    { id: 'edge-1', projectId: demoProjectId, sourceNodeId: 'node-pay', targetNodeId: 'node-db', relationType: 'calls', verified: true },
    { id: 'edge-2', projectId: demoProjectId, sourceNodeId: 'node-test-pay', targetNodeId: 'node-pay', relationType: 'validates', verified: true },
    { id: 'edge-3', projectId: demoProjectId, sourceNodeId: 'node-test-auth', targetNodeId: 'node-auth', relationType: 'validates', verified: true },
  ];

  const remediationTasks: RemediationTask[] = [
    {
      id: 'task-1',
      projectId: demoProjectId,
      findingId: 'finding-pay-500',
      title: 'Fix Payment Gateway Connection Configuration',
      problem: 'Payment endpoint returns 500 because connector uses obsolete port 9042.',
      evidence: 'Log payment-error-500.log showing MockPaymentGatewayConnectionRefused',
      severity: 'critical',
      estimatedEffort: 'S',
      dependencies: [],
      ownerRole: 'Backend Engineer',
      acceptanceCriteria: 'POST /fixture/api/payment returns HTTP 200 with valid charge confirmation.',
      verificationMethod: 'Automated test case tc-pay',
      status: 'todo',
      createdAt: now,
    },
    {
      id: 'task-2',
      projectId: demoProjectId,
      findingId: 'finding-docs-404',
      title: 'Apply Navigation Patch for Docs Route',
      problem: 'Documentation anchor link points to 404 URL.',
      evidence: 'Test run tr-3 screenshot and 404 response',
      severity: 'high',
      estimatedEffort: 'XS',
      dependencies: [],
      ownerRole: 'Frontend Engineer',
      acceptanceCriteria: 'GET /fixture/docs navigates cleanly with HTTP 200.',
      verificationMethod: 'Automated test case tc-docs',
      status: 'in_progress',
      createdAt: now,
    },
  ];

  const releaseAssessments: ReleaseAssessment[] = [
    {
      id: 'rel-1',
      projectId: demoProjectId,
      auditRunId: 'audit-run-1',
      verdict: 'NO-GO',
      score: 35.0,
      formulaExplanation:
        'Score = (ClaimCoverage * 0.35) + (TestPassRate * 0.35) + (EvidenceCompleteness * 0.15) + (ReqCoverage * 0.15) - (CriticalIssues * 25)',
      metricsBreakdown: {
        claimVerificationCoverage: 25.0, // 1 of 4 verified
        testPassRate: 33.3, // 1 of 3 passed
        criticalUnresolvedIssues: 1, // Payment 500
        requirementCoverage: 50.0,
        evidenceCompleteness: 60.0,
      },
      reasons: [
        'Critical payment endpoint failed with HTTP 500.',
        'High severity broken navigation link found on documentation portal.',
        'Only 25% of submitted claims verified by empirical evidence.',
      ],
      createdAt: now,
    },
  ];

  return {
    projects: [demoProject],
    requirements,
    claims,
    evidenceItems,
    evidenceChunks,
    claimEvidenceLinks,
    auditRuns,
    agentToolCalls,
    testCases,
    testRuns,
    findings,
    fixProposals,
    fixAttempts: [],
    dependencyNodes,
    dependencyEdges,
    remediationTasks,
    releaseAssessments,
  };
}

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read existing db.json, generating fresh seed data:', err);
    }
    const seed = getSeedData();
    this.saveData(seed);
    return seed;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  private persist(): void {
    this.saveData(this.data);
  }

  // --- Projects ---
  getProjects(): Project[] {
    return this.data.projects;
  }

  getProject(id: string): Project | undefined {
    return this.data.projects.find((p) => p.id === id);
  }

  createProject(project: Project): Project {
    this.data.projects.unshift(project);
    this.persist();
    return project;
  }

  updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const idx = this.data.projects.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.data.projects[idx] = {
      ...this.data.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.projects[idx];
  }

  deleteProject(id: string): boolean {
    const prevLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    if (this.data.projects.length !== prevLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Requirements ---
  getRequirements(projectId: string): Requirement[] {
    return this.data.requirements.filter((r) => r.projectId === projectId);
  }

  createRequirement(req: Requirement): Requirement {
    this.data.requirements.push(req);
    this.persist();
    return req;
  }

  updateRequirement(id: string, updates: Partial<Requirement>): Requirement | undefined {
    const idx = this.data.requirements.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    this.data.requirements[idx] = { ...this.data.requirements[idx], ...updates };
    this.persist();
    return this.data.requirements[idx];
  }

  // --- Claims ---
  getClaims(projectId: string): Claim[] {
    return this.data.claims.filter((c) => c.projectId === projectId);
  }

  getClaim(id: string): Claim | undefined {
    return this.data.claims.find((c) => c.id === id);
  }

  createClaim(claim: Claim): Claim {
    this.data.claims.push(claim);
    this.persist();
    return claim;
  }

  updateClaim(id: string, updates: Partial<Claim>): Claim | undefined {
    const idx = this.data.claims.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    this.data.claims[idx] = {
      ...this.data.claims[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.claims[idx];
  }

  // --- Evidence Items ---
  getEvidenceItems(projectId: string): EvidenceItem[] {
    return this.data.evidenceItems.filter((e) => e.projectId === projectId);
  }

  getEvidenceItem(id: string): EvidenceItem | undefined {
    return this.data.evidenceItems.find((e) => e.id === id);
  }

  createEvidenceItem(item: EvidenceItem): EvidenceItem {
    this.data.evidenceItems.push(item);
    this.persist();
    return item;
  }

  // --- Evidence Chunks & Links ---
  getEvidenceChunks(projectId: string): EvidenceChunk[] {
    return this.data.evidenceChunks.filter((c) => c.projectId === projectId);
  }

  createEvidenceChunk(chunk: EvidenceChunk): EvidenceChunk {
    this.data.evidenceChunks.push(chunk);
    this.persist();
    return chunk;
  }

  getClaimEvidenceLinks(claimId: string): ClaimEvidenceLink[] {
    return this.data.claimEvidenceLinks.filter((l) => l.claimId === claimId);
  }

  getAllClaimEvidenceLinks(projectId: string): ClaimEvidenceLink[] {
    const claimIds = new Set(this.getClaims(projectId).map((c) => c.id));
    return this.data.claimEvidenceLinks.filter((l) => claimIds.has(l.claimId));
  }

  createClaimEvidenceLink(link: ClaimEvidenceLink): ClaimEvidenceLink {
    this.data.claimEvidenceLinks.push(link);
    this.persist();
    return link;
  }

  // --- Audit Runs ---
  getAuditRuns(projectId: string): AuditRun[] {
    return this.data.auditRuns.filter((a) => a.projectId === projectId);
  }

  getAuditRun(id: string): AuditRun | undefined {
    return this.data.auditRuns.find((a) => a.id === id);
  }

  createAuditRun(run: AuditRun): AuditRun {
    this.data.auditRuns.unshift(run);
    this.persist();
    return run;
  }

  updateAuditRun(id: string, updates: Partial<AuditRun>): AuditRun | undefined {
    const idx = this.data.auditRuns.findIndex((a) => a.id === id);
    if (idx === -1) return undefined;
    this.data.auditRuns[idx] = { ...this.data.auditRuns[idx], ...updates };
    this.persist();
    return this.data.auditRuns[idx];
  }

  // --- Agent Tool Calls ---
  getAgentToolCalls(auditRunId: string): AgentToolCall[] {
    return this.data.agentToolCalls.filter((c) => c.auditRunId === auditRunId);
  }

  createAgentToolCall(call: AgentToolCall): AgentToolCall {
    this.data.agentToolCalls.push(call);
    this.persist();
    return call;
  }

  // --- Test Cases & Runs ---
  getTestCases(projectId: string): TestCase[] {
    return this.data.testCases.filter((t) => t.projectId === projectId);
  }

  createTestCase(tc: TestCase): TestCase {
    this.data.testCases.push(tc);
    this.persist();
    return tc;
  }

  getTestRuns(projectId: string): TestRun[] {
    return this.data.testRuns.filter((t) => t.projectId === projectId);
  }

  createTestRun(run: TestRun): TestRun {
    this.data.testRuns.unshift(run);
    this.persist();
    return run;
  }

  // --- Findings ---
  getFindings(projectId: string): Finding[] {
    return this.data.findings.filter((f) => f.projectId === projectId);
  }

  getFinding(id: string): Finding | undefined {
    return this.data.findings.find((f) => f.id === id);
  }

  createFinding(finding: Finding): Finding {
    this.data.findings.unshift(finding);
    this.persist();
    return finding;
  }

  updateFinding(id: string, updates: Partial<Finding>): Finding | undefined {
    const idx = this.data.findings.findIndex((f) => f.id === id);
    if (idx === -1) return undefined;
    this.data.findings[idx] = {
      ...this.data.findings[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.findings[idx];
  }

  // --- Fix Proposals & Attempts ---
  getFixProposals(projectId: string): FixProposal[] {
    return this.data.fixProposals.filter((p) => p.projectId === projectId);
  }

  getFixProposal(id: string): FixProposal | undefined {
    return this.data.fixProposals.find((p) => p.id === id);
  }

  createFixProposal(proposal: FixProposal): FixProposal {
    this.data.fixProposals.unshift(proposal);
    this.persist();
    return proposal;
  }

  updateFixProposal(id: string, updates: Partial<FixProposal>): FixProposal | undefined {
    const idx = this.data.fixProposals.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.data.fixProposals[idx] = { ...this.data.fixProposals[idx], ...updates };
    this.persist();
    return this.data.fixProposals[idx];
  }

  getFixAttempts(projectId: string): FixAttempt[] {
    return this.data.fixAttempts.filter((a) => a.projectId === projectId);
  }

  createFixAttempt(attempt: FixAttempt): FixAttempt {
    this.data.fixAttempts.unshift(attempt);
    this.persist();
    return attempt;
  }

  // --- Dependency Graph ---
  getDependencyGraph(projectId: string) {
    return {
      nodes: this.data.dependencyNodes.filter((n) => n.projectId === projectId),
      edges: this.data.dependencyEdges.filter((e) => e.projectId === projectId),
    };
  }

  saveDependencyGraph(
    projectId: string,
    nodes: DependencyNode[],
    edges: DependencyEdge[]
  ): void {
    this.data.dependencyNodes = [
      ...this.data.dependencyNodes.filter((n) => n.projectId !== projectId),
      ...nodes,
    ];
    this.data.dependencyEdges = [
      ...this.data.dependencyEdges.filter((e) => e.projectId !== projectId),
      ...edges,
    ];
    this.persist();
  }

  // --- Remediation Tasks ---
  getRemediationTasks(projectId: string): RemediationTask[] {
    return this.data.remediationTasks.filter((t) => t.projectId === projectId);
  }

  createRemediationTask(task: RemediationTask): RemediationTask {
    this.data.remediationTasks.push(task);
    this.persist();
    return task;
  }

  updateRemediationTask(id: string, updates: Partial<RemediationTask>): RemediationTask | undefined {
    const idx = this.data.remediationTasks.findIndex((t) => t.id === id);
    if (idx === -1) return undefined;
    this.data.remediationTasks[idx] = { ...this.data.remediationTasks[idx], ...updates };
    this.persist();
    return this.data.remediationTasks[idx];
  }

  // --- Release Assessments ---
  getReleaseAssessments(projectId: string): ReleaseAssessment[] {
    return this.data.releaseAssessments.filter((r) => r.projectId === projectId);
  }

  createReleaseAssessment(assessment: ReleaseAssessment): ReleaseAssessment {
    this.data.releaseAssessments.unshift(assessment);
    this.persist();
    return assessment;
  }
}

// Global singleton instance
declare global {
  var __proofchainDb: DatabaseStore | undefined;
}

export function getDb(): DatabaseStore {
  if (!global.__proofchainDb) {
    global.__proofchainDb = new DatabaseStore();
  }
  return global.__proofchainDb;
}

