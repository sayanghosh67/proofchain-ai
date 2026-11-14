import { describe, it, expect } from 'vitest';
import { getDb } from '../lib/db';

describe('Database Store & Seed Data', () => {
  const db = getDb();

  it('loads the pre-configured demo project', () => {
    const projects = db.getProjects();
    expect(projects.length).toBeGreaterThanOrEqual(1);

    const demo = db.getProject('demo-nexus-pay');
    expect(demo).toBeDefined();
    expect(demo?.name).toContain('Nexus Pay');
  });

  it('retrieves claims associated with demo project', () => {
    const claims = db.getClaims('demo-nexus-pay');
    expect(claims.length).toBeGreaterThanOrEqual(4);

    const authClaim = claims.find((c) => c.category === 'authentication');
    expect(authClaim).toBeDefined();
    expect(authClaim?.status).toBe('verified');
  });

  it('creates and retrieves a new claim', () => {
    const newClaim = db.createClaim({
      id: `test-claim-${Date.now()}`,
      projectId: 'demo-nexus-pay',
      text: 'Test claim statement for unit testing.',
      category: 'security',
      testability: 'automated',
      requiredEvidence: 'Security header audit output',
      suggestedVerificationMethod: 'GET check on headers',
      status: 'untested',
      confidence: 0.9,
      sourceReference: 'Test Suite',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const retrieved = db.getClaim(newClaim.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.text).toBe(newClaim.text);
  });

  it('updates claim status empirically', () => {
    const claims = db.getClaims('demo-nexus-pay');
    const claim = claims[0];
    db.updateClaim(claim.id, { status: 'verified', reasoning: 'Verified by Vitest' });

    const updated = db.getClaim(claim.id);
    expect(updated?.status).toBe('verified');
    expect(updated?.reasoning).toBe('Verified by Vitest');
  });
});
