# PROOFCHAIN.AI
### *The AI That Detects Fake Progress — And Helps Fix It*

> **"Never trust a project completion claim without verifiable evidence."**

PROOFCHAIN.AI is an autonomous AI software auditing, verification, diagnosis, and recovery platform built for the Google Gemini API Hackathon. It investigates what software claims to do, compares those claims with empirical evidence, executes isolated tests, identifies defects, diagnoses root causes, proposes user-approved patches, and verifies fixes with automated regression testing.

---

## 🏆 Hackathon Tracks & Capabilities

- **AI & Intelligent Systems**: Autonomous multi-tool verification agent, structured schema extraction, and closed-loop recovery studio.
- **Best Use of the Google Gemini API**: Multimodal evidence reasoning (PDF, images, logs, traces), atomic claim decomposition, diagnostic hypothesis generation, and patch diff synthesis using `@google/genai`.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js `>= 22.13.0`
- npm `>= 10.0.0`

### 2. Setup & Installation
```bash
# Clone and enter the repository
cd PROOFCHAIN.AI

# Install dependencies
npm install
```

### 3. Environment Configuration
Create `.env.local` based on `.env.example`:
```bash
cp .env.example .env.local
```

Configure your environment variables:
```env
# Operating Mode: local (zero-setup single-user) or supabase
APP_MODE=local

# Google Gemini API Key (optional for offline evaluation mode; required for live Gemini extraction)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# Test Worker & Isolation (loopback only)
TEST_WORKER_URL=http://127.0.0.1:4319
```

### 4. Running the Complete System

Open two terminal sessions:

**Terminal 1: Start Isolated Test Worker & Demo Fixtures**
```bash
npm run worker
# Serves test fixture on http://127.0.0.1:4319/fixture
```

**Terminal 2: Start Next.js SaaS Web Application**
```bash
npm run dev
# Opens at http://127.0.0.1:3000
```

---

## 🧪 Benchmark Evaluations & Demo Scripts

PROOFCHAIN.AI includes reproducible automated evaluation and demonstration scripts:

### 1. 5-Minute Live Judge Demo Walkthrough
Executes the full audit, defect discovery, patch proposal, user approval, retest, and verification loop:
```bash
npm run demo
```

### 2. Measurable Benchmark Evaluation (N = 20 Labeled Scenarios)
Measures SSRF firewall accuracy (10/10), dataset testability (90%), Precision@1 (100%), and release gate determinism:
```bash
npm run evaluate
```

### 3. Live Gemini Intelligence Evaluation
Benchmark live Gemini claim extraction against ground-truth PRDs:
```bash
npm run evaluate:ai
```

### 4. Vitest Unit & Security Test Suite
```bash
npm test
```

### 5. Typecheck & Production Build
```bash
npm run typecheck
npm run build
```

---

## 🗺️ Website Information Architecture (15 Modules)

| # | Page / Module | URL Route | Description |
|---|---|---|---|
| 1 | **Landing Page** | `/` | Product philosophy, 8-phase workflow pipeline, architecture highlights. |
| 2 | **Authentication** | `/auth` | Single-user auditor access, security boundary status. |
| 3 | **AI Mission Control** | `/dashboard` | Portfolio metrics, claim status distribution, health trends. |
| 4 | **New Project** | `/projects/new` | Ingest PRDs, Git repos, progress reports for autonomous audit. |
| 5 | **Project Overview** | `/projects/[id]` | Executive summary, release gate badge, quick navigation cards. |
| 6 | **Claims & Requirements** | `/projects/[id]/claims` | Atomic claims table, confidence, verification strategies, live Gemini extraction. |
| 7 | **Evidence Vault** | `/projects/[id]/evidence` | Ingested logs, traces, screenshots, full-text provenance index. |
| 8 | **AI Audit Workspace** | `/projects/[id]/audit` | Autonomous agent execution trace, step-by-step tool invocation logs. |
| 9 | **Test Execution Center** | `/projects/[id]/tests` | Interactive test runner, real HTTP checks, duration & observed outputs. |
| 10 | **Bug Intelligence** | `/projects/[id]/bugs` | Discovered defect findings, ranked root cause hypotheses. |
| 11 | **Recovery Studio** | `/projects/[id]/recovery` | Unified patch diff preview, user approval, controlled fix, automatic retest. |
| 12 | **Evidence Graph** | `/projects/[id]/graph` | Software digital twin dependency graph with "What-If" failure simulation. |
| 13 | **Release Readiness** | `/projects/[id]/readiness` | Explainable GO / CONDITIONAL_GO / NO-GO scoring formula. |
| 14 | **Audit Reports** | `/projects/[id]/reports` | Downloadable tamper-evident PDF dossier and structured JSON export. |
| 15 | **Settings** | `/settings` | System diagnostics, Gemini API keys, worker status, SSRF policy. |

---

## 🔒 Security & SSRF Defense Rules

PROOFCHAIN.AI enforces strict security controls:
1. **SSRF Prevention (`lib/security/ssrf.ts`)**: Ingress firewall actively validates every target URL against private IPv4 ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopbacks (`127.0.0.1`, `::1`), and cloud metadata (`169.254.169.254`).
2. **Untrusted Code Isolation**: Repository code and tests are never executed on the application host; all checks run inside the isolated worker server (`worker/server.ts`).
3. **No Arbitrary Shell Execution**: The AI verification agent is restricted to strict, schema-validated tool definitions.
4. **Controlled Patches**: No automatic modification of original user repositories. Fixes require explicit user approval and are verified in sandbox environments.

---

## ⚖️ Non-Negotiable Engineering Rules & Limitations

- **Zero Fabricated Metrics**: No claim is labeled verified without empirical test proof.
- **Offline Transparency**: When `GEMINI_API_KEY` is not supplied, the platform honestly flags Gemini as offline and executes deterministic baseline checks rather than hallucinating fake AI responses.
- **Simulated Payment Cluster**: To prevent fraudulent charges, payment processing tests interact exclusively with sandbox mock gateway clusters.

---

## 👥 Hackathon Team & Delivery

Developed for Hackmatrix Offline by the PROOFCHAIN.AI Engineering Team.

