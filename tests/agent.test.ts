import { describe, it, expect } from 'vitest';
import { tools } from '../lib/agent/tools';
import { getDb } from '../lib/db';

describe('Agent Tools & Verification Logic', () => {
  it('retrieve_project_requirements returns project requirements', async () => {
    const tool = tools.retrieve_project_requirements;
    const result = await tool.execute(
      { projectId: 'demo-nexus-pay' },
      { auditRunId: 'test-run', projectId: 'demo-nexus-pay' }
    );

    expect(result.requirementsCount).toBeGreaterThanOrEqual(1);
    expect(result.requirements[0]).toHaveProperty('title');
  });

  it('search_evidence filters evidence items by keyword query', async () => {
    const tool = tools.search_evidence;
    const result = await tool.execute(
      { projectId: 'demo-nexus-pay', query: 'payment' },
      { auditRunId: 'test-run', projectId: 'demo-nexus-pay' }
    );

    expect(result.query).toBe('payment');
    expect(result.results.length).toBeGreaterThanOrEqual(1);
  });

  it('inspect_source_file prevents directory traversal attempts', async () => {
    const tool = tools.inspect_source_file;
    const result = await tool.execute(
      { filePath: '../../etc/passwd' },
      { auditRunId: 'test-run', projectId: 'demo-nexus-pay' }
    );

    expect(result.error).toContain('traversal forbidden');
  });

  it('record_finding records an empirical defect finding', async () => {
    const tool = tools.record_finding;
    const result = await tool.execute(
      {
        projectId: 'demo-nexus-pay',
        title: 'Vitest Automated Finding',
        severity: 'high',
        category: 'Testing',
        description: 'Recorded via automated agent test.',
      },
      { auditRunId: 'test-run-finding', projectId: 'demo-nexus-pay' }
    );

    expect(result.status).toBe('recorded');
    expect(result.findingId).toBeDefined();

    const db = getDb();
    const recorded = db.getFinding(result.findingId);
    expect(recorded).toBeDefined();
    expect(recorded?.title).toBe('Vitest Automated Finding');
  });
});
