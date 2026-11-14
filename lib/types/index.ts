export type ProjectStatus = 'draft' | 'auditing' | 'healthy' | 'at_risk' | 'critical';

export interface Project {
  id: string;
  name: string;
  description?: string;
  repositoryUrl?: string;
  targetUrl?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export type RequirementCategory =
  | 'authentication'
  | 'api_payments'
  | 'responsiveness'
  | 'performance'
  | 'security'
  | 'core_flow'
  | 'data_integrity';

export type RequirementPriority = 'low' | 'medium' | 'high' | 'critical';

export type RequirementStatus =
  | 'verified'
  | 'partially_verified'
  | 'unsupported'
  | 'contradicted'
  | 'not_tested';

export interface Requirement {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category: RequirementCategory;
  priority: RequirementPriority;
  status: RequirementStatus;
  source?: string;
  createdAt: string;
}

export type ClaimCategory =
  | 'authentication'
  | 'api_payments'
  | 'responsiveness'
  | 'performance'
  | 'security'
  | 'navigation'
  | 'data_display'
  | 'general';

export type ClaimTestability = 'automated' | 'semi_automated' | 'manual_only' | 'untestable';

export type ClaimStatus =
  | 'verified'
  | 'unsupported'
  | 'contradicted'
  | 'inconclusive'
  | 'untested';

export interface Claim {
  id: string;
  projectId: string;
  requirementId?: string;
  text: string;
  category: ClaimCategory;
  testability: ClaimTestability;
  requiredEvidence: string;
  suggestedVerificationMethod: string;
  status: ClaimStatus;
  confidence: number; // 0 to 1
  sourceReference: string;
  reasoning?: string;
  createdAt: string;
  updatedAt: string;
}

export type EvidenceType =
  | 'screenshot'
  | 'pdf'
  | 'log'
  | 'source_file'
  | 'test_output'
  | 'api_response'
  | 'repo_metadata'
  | 'manual_note';

export interface EvidenceItem {
  id: string;
  projectId: string;
  type: EvidenceType;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  contentText?: string;
  metadata?: Record<string, unknown>;
  fileUrl?: string;
  createdAt: string;
}

export interface EvidenceChunk {
  id: string;
  evidenceId: string;
  projectId: string;
  chunkIndex: number;
  content: string;
  metadata?: Record<string, unknown>;
}

export type LinkRelationType = 'supports' | 'contradicts' | 'insufficient';

export interface ClaimEvidenceLink {
  id: string;
  claimId: string;
  evidenceId: string;
  relationType: LinkRelationType;
  confidence: number;
  snippet: string;
  explanation: string;
}

export type AuditStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface AuditRun {
  id: string;
  projectId: string;
  initiatedAt: string;
  completedAt?: string;
  status: AuditStatus;
  summary?: string;
  stepsExecuted: number;
  totalClaims: number;
  verifiedClaims: number;
  contradictedClaims: number;
  unsupportedClaims: number;
  inconclusiveClaims: number;
}

export interface AgentToolCall {
  id: string;
  auditRunId: string;
  stepNumber: number;
  toolName: string;
  inputArguments: Record<string, unknown>;
  outputResult?: Record<string, unknown>;
  status: 'running' | 'success' | 'error';
  latencyMs?: number;
  error?: string;
  timestamp: string;
}

export type TestCategory =
  | 'availability'
  | 'endpoint_status'
  | 'api_contract'
  | 'navigation'
  | 'responsiveness'
  | 'accessibility'
  | 'workflow';

export interface TestCase {
  id: string;
  projectId: string;
  claimId?: string;
  name: string;
  category: TestCategory;
  targetUrl: string;
  method: 'GET' | 'POST' | 'BROWSER';
  parameters?: Record<string, unknown>;
  expectedBehavior: string;
  isAutomated: boolean;
  createdAt: string;
}

export interface TestRun {
  id: string;
  projectId: string;
  testCaseId: string;
  claimId?: string;
  status: 'passed' | 'failed' | 'error';
  durationMs: number;
  executedAt: string;
  observedBehavior: string;
  expectedBehavior: string;
  errorLogs?: string;
  screenshotUrl?: string;
  diagnostics?: Record<string, unknown>;
}

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type FindingStatus = 'open' | 'investigating' | 'fix_proposed' | 'resolved' | 'wont_fix';

export interface RootCauseHypothesis {
  id: string;
  description: string;
  supportingEvidence: string[];
  missingEvidence: string[];
  confidence: number;
  proposedNextTest: string;
  isConfirmed: boolean;
}

export interface Finding {
  id: string;
  projectId: string;
  auditRunId?: string;
  claimId?: string;
  testRunId?: string;
  title: string;
  severity: FindingSeverity;
  category: string;
  description: string;
  failureTrace?: string;
  hypotheses: RootCauseHypothesis[];
  confirmedRootCause?: string;
  status: FindingStatus;
  createdAt: string;
  updatedAt: string;
}

export type ProposalStatus =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'applied'
  | 'reverted';

export interface FixProposal {
  id: string;
  findingId: string;
  projectId: string;
  title: string;
  explanation: string;
  patchDiff: string;
  targetFile: string;
  risks: string[];
  expectedImpact: string;
  requiredRetests: string[];
  status: ProposalStatus;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface FixAttempt {
  id: string;
  proposalId: string;
  projectId: string;
  appliedAt: string;
  resultStatus: 'verified' | 'unsuccessful' | 'regression' | 'reverted';
  retestRunId?: string;
  beforeTestOutcome: string;
  afterTestOutcome: string;
  notes?: string;
}

export interface DependencyNode {
  id: string;
  projectId: string;
  name: string;
  type: 'page' | 'component' | 'api' | 'table' | 'service' | 'test';
  status?: 'healthy' | 'warning' | 'failing';
  metadata?: Record<string, unknown>;
}

export interface DependencyEdge {
  id: string;
  projectId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: 'calls' | 'imports' | 'depends_on' | 'validates';
  verified: boolean;
}

export interface RemediationTask {
  id: string;
  projectId: string;
  findingId?: string;
  title: string;
  problem: string;
  evidence: string;
  severity: FindingSeverity;
  estimatedEffort: 'XS' | 'S' | 'M' | 'L' | 'XL';
  dependencies: string[];
  ownerRole: string;
  acceptanceCriteria: string;
  verificationMethod: string;
  status: 'todo' | 'in_progress' | 'done';
  createdAt: string;
}

export type ReleaseVerdict = 'GO' | 'CONDITIONAL_GO' | 'NO-GO' | 'UNKNOWN';

export interface ReleaseAssessment {
  id: string;
  projectId: string;
  auditRunId?: string;
  verdict: ReleaseVerdict;
  score: number; // 0 to 100
  formulaExplanation: string;
  metricsBreakdown: {
    claimVerificationCoverage: number; // %
    testPassRate: number; // %
    criticalUnresolvedIssues: number; // count
    requirementCoverage: number; // %
    evidenceCompleteness: number; // %
  };
  reasons: string[];
  createdAt: string;
}

