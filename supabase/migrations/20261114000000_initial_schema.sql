-- PROOFCHAIN.AI Database Schema
-- Production Supabase PostgreSQL Migration with RLS and Indexes

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    repository_url TEXT,
    target_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'auditing', 'healthy', 'at_risk', 'critical')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Project Members
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'auditor', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- 3. Project Sources
CREATE TABLE IF NOT EXISTS project_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL CHECK (source_type IN ('github', 'website', 'doc', 'log', 'manual')),
    url TEXT,
    branch TEXT,
    content_cache TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Requirements
CREATE TABLE IF NOT EXISTS requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'core_flow',
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'not_tested' CHECK (status IN ('verified', 'partially_verified', 'unsupported', 'contradicted', 'not_tested')),
    source TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Claims
CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES requirements(id) ON DELETE SET NULL,
    text TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    testability TEXT NOT NULL DEFAULT 'automated' CHECK (testability IN ('automated', 'semi_automated', 'manual_only', 'untestable')),
    required_evidence TEXT NOT NULL,
    suggested_verification_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'untested' CHECK (status IN ('verified', 'unsupported', 'contradicted', 'inconclusive', 'untested')),
    confidence NUMERIC(3, 2) NOT NULL DEFAULT 0.85,
    source_reference TEXT NOT NULL,
    reasoning TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Evidence Items
CREATE TABLE IF NOT EXISTS evidence_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('screenshot', 'pdf', 'log', 'source_file', 'test_output', 'api_response', 'repo_metadata', 'manual_note')),
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    content_text TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    file_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Evidence Chunks
CREATE TABLE IF NOT EXISTS evidence_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evidence_id UUID NOT NULL REFERENCES evidence_items(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 8. Claim Evidence Links
CREATE TABLE IF NOT EXISTS claim_evidence_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    evidence_id UUID NOT NULL REFERENCES evidence_items(id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL CHECK (relation_type IN ('supports', 'contradicts', 'insufficient')),
    confidence NUMERIC(3, 2) NOT NULL DEFAULT 0.90,
    snippet TEXT,
    explanation TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(claim_id, evidence_id)
);

-- 9. Audit Runs
CREATE TABLE IF NOT EXISTS audit_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    initiated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    summary TEXT,
    steps_executed INT NOT NULL DEFAULT 0,
    total_claims INT NOT NULL DEFAULT 0,
    verified_claims INT NOT NULL DEFAULT 0,
    contradicted_claims INT NOT NULL DEFAULT 0,
    unsupported_claims INT NOT NULL DEFAULT 0,
    inconclusive_claims INT NOT NULL DEFAULT 0
);

-- 10. Agent Tool Calls
CREATE TABLE IF NOT EXISTS agent_tool_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_run_id UUID NOT NULL REFERENCES audit_runs(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    tool_name TEXT NOT NULL,
    input_arguments JSONB NOT NULL,
    output_result JSONB,
    status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'error')),
    latency_ms INT,
    error TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Test Cases
CREATE TABLE IF NOT EXISTS test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    claim_id UUID REFERENCES claims(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'availability',
    target_url TEXT NOT NULL,
    method TEXT NOT NULL DEFAULT 'GET' CHECK (method IN ('GET', 'POST', 'BROWSER')),
    parameters JSONB DEFAULT '{}'::jsonb,
    expected_behavior TEXT NOT NULL,
    is_automated BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Test Runs
CREATE TABLE IF NOT EXISTS test_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    claim_id UUID REFERENCES claims(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'error')),
    duration_ms INT NOT NULL DEFAULT 0,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    observed_behavior TEXT NOT NULL,
    expected_behavior TEXT NOT NULL,
    error_logs TEXT,
    screenshot_url TEXT,
    diagnostics JSONB DEFAULT '{}'::jsonb
);

-- 13. Findings
CREATE TABLE IF NOT EXISTS findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    audit_run_id UUID REFERENCES audit_runs(id) ON DELETE SET NULL,
    claim_id UUID REFERENCES claims(id) ON DELETE SET NULL,
    test_run_id UUID REFERENCES test_runs(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    failure_trace TEXT,
    hypotheses JSONB DEFAULT '[]'::jsonb,
    confirmed_root_cause TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'fix_proposed', 'resolved', 'wont_fix')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Fix Proposals
CREATE TABLE IF NOT EXISTS fix_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    finding_id UUID NOT NULL REFERENCES findings(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    explanation TEXT NOT NULL,
    patch_diff TEXT NOT NULL,
    target_file TEXT NOT NULL,
    risks JSONB DEFAULT '[]'::jsonb,
    expected_impact TEXT NOT NULL,
    required_retests JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'applied', 'reverted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    approved_by TEXT
);

-- 15. Fix Attempts
CREATE TABLE IF NOT EXISTS fix_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID NOT NULL REFERENCES fix_proposals(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    result_status TEXT NOT NULL CHECK (result_status IN ('verified', 'unsuccessful', 'regression', 'reverted')),
    retest_run_id UUID REFERENCES test_runs(id) ON DELETE SET NULL,
    before_test_outcome TEXT NOT NULL,
    after_test_outcome TEXT NOT NULL,
    notes TEXT
);

-- 16. Dependency Graph
CREATE TABLE IF NOT EXISTS dependency_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('page', 'component', 'api', 'table', 'service', 'test')),
    status TEXT DEFAULT 'healthy' CHECK (status IN ('healthy', 'warning', 'failing')),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS dependency_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    source_node_id UUID NOT NULL REFERENCES dependency_nodes(id) ON DELETE CASCADE,
    target_node_id UUID NOT NULL REFERENCES dependency_nodes(id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL CHECK (relation_type IN ('calls', 'imports', 'depends_on', 'validates')),
    verified BOOLEAN NOT NULL DEFAULT false
);

-- 17. Remediation Tasks (AI Sprint Planner)
CREATE TABLE IF NOT EXISTS remediation_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    finding_id UUID REFERENCES findings(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    problem TEXT NOT NULL,
    evidence TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
    estimated_effort TEXT NOT NULL DEFAULT 'M' CHECK (estimated_effort IN ('XS', 'S', 'M', 'L', 'XL')),
    dependencies JSONB DEFAULT '[]'::jsonb,
    owner_role TEXT NOT NULL DEFAULT 'Senior Engineer',
    acceptance_criteria TEXT NOT NULL,
    verification_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. Release Assessments
CREATE TABLE IF NOT EXISTS release_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    audit_run_id UUID REFERENCES audit_runs(id) ON DELETE SET NULL,
    verdict TEXT NOT NULL CHECK (verdict IN ('GO', 'CONDITIONAL_GO', 'NO-GO', 'UNKNOWN')),
    score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    formula_explanation TEXT NOT NULL,
    metrics_breakdown JSONB NOT NULL,
    reasons JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance & retrieval
CREATE INDEX IF NOT EXISTS idx_requirements_project ON requirements(project_id);
CREATE INDEX IF NOT EXISTS idx_claims_project ON claims(project_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_evidence_project ON evidence_items(project_id);
CREATE INDEX IF NOT EXISTS idx_evidence_chunks_project ON evidence_chunks(project_id);
CREATE INDEX IF NOT EXISTS idx_claim_evidence_links_claim ON claim_evidence_links(claim_id);
CREATE INDEX IF NOT EXISTS idx_audit_runs_project ON audit_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_agent_tool_calls_run ON agent_tool_calls(audit_run_id);
CREATE INDEX IF NOT EXISTS idx_test_runs_project ON test_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_findings_project ON findings(project_id);
CREATE INDEX IF NOT EXISTS idx_fix_proposals_finding ON fix_proposals(finding_id);
CREATE INDEX IF NOT EXISTS idx_remediation_tasks_project ON remediation_tasks(project_id);
