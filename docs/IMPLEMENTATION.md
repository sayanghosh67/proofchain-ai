# Build plan

1. Foundation: Next.js, responsive shell, project persistence, local session, Supabase adapter and RLS migration.
2. Intelligence and evidence: structured Gemini services, authenticated uploads, chunk search, claim citations.
3. Verification: isolated local fixture worker, parameterized browser checks, persisted evidence and findings.
4. Recovery: fixed navigation patch, explicit approval, isolated configuration, regression tests, rollback.
5. Reporting: traceability, scope-aware release gate, PDF/JSON, labeled evaluation dataset.
6. Verification: unit/security tests, end-to-end demo, TypeScript, production build, responsive inspection.

No credentials were supplied at initialization. Live Gemini/Supabase acceptance is pending credentials; deterministic fixture checks must run independently. Requested deliverable is a working local Next.js application plus deployment instructions. Production publication is deferred until durable cloud storage, identity, and a hardened worker are configured.
