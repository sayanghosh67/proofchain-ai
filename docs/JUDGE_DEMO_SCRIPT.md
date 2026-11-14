# PROOFCHAIN.AI — 5-Minute Judge Demonstration Script

Follow this script to experience the complete autonomous verification and recovery workflow:

---

## ⏱️ Step 1: Launch Application & Worker (30 Seconds)

Ensure the isolated worker and Next.js application are running:

```bash
# Terminal 1: Worker Server
npm run worker

# Terminal 2: Next.js SaaS App
npm run dev
```

Open your browser to: **`http://127.0.0.1:3000`**

---

## ⏱️ Step 2: Mission Control & Demo Project Ingestion (1 Minute)

1. On the landing page, click **"Launch Live Demo Project"** or **"Mission Control"**.
2. Notice the pre-configured project: **"Nexus Pay & Cloud Portal v1.0"**.
3. Inspect the top telemetry cards:
   - **Audited Projects**: 1
   - **Extracted Claims**: 4
   - **Release Gate Verdict**: `NO-GO` (Score: 35/100)
4. Click on **"Nexus Pay & Cloud Portal v1.0"** to enter the Project Overview.

---

## ⏱️ Step 3: Inspect Claims vs. Ground Truth Evidence (1 Minute)

1. Click **"Claims & Requirements"** in the left sidebar (`/projects/demo-nexus-pay/claims`).
2. Observe the extracted claims:
   - Claim 1: *Merchant authentication is 100% functional* → **VERIFIED**
   - Claim 2: *Payment processing API is fully functional* → **CONTRADICTED**
   - Claim 3: *All documentation links are verified* → **CONTRADICTED**
   - Claim 4: *Layout supports all mobile devices* → **UNSUPPORTED**
3. Review the **"Extract New Claims with Google Gemini"** box:
   - Enter: *"Our checkout flow is complete, discount codes work, and order confirmation emails are sent."*
   - Click **"Extract Claims"** to see live Gemini structured JSON output (when `GEMINI_API_KEY` is configured).

---

## ⏱️ Step 4: Empirical Testing & Defect Discovery (1 Minute)

1. Click **"Test Execution Center"** in the left sidebar (`/projects/demo-nexus-pay/tests`).
2. Run the quick demo tests by clicking **"Run Test Now"**:
   - Test 1: *Verify Merchant Login Workflow* (`/fixture/login`) → **PASSED (HTTP 200 OK)**
   - Test 2: *Verify Payment Processing Endpoint* (`/fixture/api/payment`) → **FAILED (HTTP 500 Connection Refused)**
   - Test 3: *Verify Documentation Route* (`/fixture/docs`) → **FAILED (HTTP 404 Route Missing)**
3. Notice how test durations, exact HTTP status codes, and observed behaviors are recorded in real-time.

---

## ⏱️ Step 5: Root Cause Diagnostics & Autonomous Recovery (1 Minute)

1. Click **"Bug Intelligence"** (`/projects/demo-nexus-pay/bugs`):
   - Review the diagnosed root cause: *Typo in fixture navigation route: "/fixture/broken-docs-404" instead of "/fixture/docs-valid".*
   - Inspect the ranked hypotheses with supporting and missing evidence.
2. Click **"Fix in Recovery Studio"** (`/projects/demo-nexus-pay/recovery`):
   - Inspect the unified patch diff:
     ```diff
     - <a id="nav-docs" href="/fixture/broken-docs-404">API Docs</a>
     + <a id="nav-docs" href="/fixture/docs-valid">API Docs</a>
     ```
   - Click **"Approve Patch & Retest"**.
   - Watch the recovery engine apply the patch in the isolated worker, trigger an automatic retest, and verify the fix:
     - **Before**: `HTTP 404 Route Missing`
     - **After**: `HTTP 200 OK (Route Verified)`
   - Claim 3 is now updated to **`VERIFIED`**!

---

## ⏱️ Step 6: Export Tamper-Evident Audit Dossier (30 Seconds)

1. Click **"Audit Reports"** (`/projects/demo-nexus-pay/reports`).
2. Click **"Download PDF Dossier"** to stream the generated audit certificate (`.pdf`).
3. Click **"Download JSON"** to export the structured machine-readable dossier.

---

## ⚡ Automated CLI Demonstration

Prefer running the entire sequence from your terminal? Run:
```bash
npm run demo
```
All 5 stages execute with real network checks, patch dispatch, and automated retesting.

