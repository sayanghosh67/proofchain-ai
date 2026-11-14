import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getDb } from '@/lib/db';

export async function generateProjectAuditPdf(projectId: string): Promise<Uint8Array> {
  const db = getDb();
  const project = db.getProject(projectId);
  if (!project) throw new Error(`Project ${projectId} not found`);

  const claims = db.getClaims(projectId);
  const requirements = db.getRequirements(projectId);
  const findings = db.getFindings(projectId);
  const testRuns = db.getTestRuns(projectId);
  const assessments = db.getReleaseAssessments(projectId);
  const latestAssessment = assessments[0];

  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  // Colors
  const bgDark = rgb(0.04, 0.07, 0.14);
  const textWhite = rgb(0.95, 0.96, 0.98);
  const textMuted = rgb(0.6, 0.65, 0.75);
  const emerald = rgb(0.06, 0.72, 0.51);
  const red = rgb(0.93, 0.27, 0.27);
  const amber = rgb(0.96, 0.62, 0.07);

  // Background Header Block
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width,
    height: 120,
    color: bgDark,
  });

  // Title
  page.drawText('PROOFCHAIN.AI — PROJECT AUDIT DOSSIER', {
    x: 40,
    y: height - 50,
    size: 18,
    font: fontBold,
    color: emerald,
  });

  page.drawText(`Project: ${project.name}`, {
    x: 40,
    y: height - 75,
    size: 13,
    font: fontBold,
    color: textWhite,
  });

  page.drawText(`Audit Generated: ${new Date().toISOString()}  |  Lead: Autonomous Verifier`, {
    x: 40,
    y: height - 95,
    size: 9,
    font: fontRegular,
    color: textMuted,
  });

  let currentY = height - 150;

  // Release Gate Verdict Badge
  const verdict = latestAssessment?.verdict || 'UNKNOWN';
  const verdictColor = verdict === 'GO' ? emerald : verdict === 'CONDITIONAL_GO' ? amber : red;

  page.drawText('RELEASE GATE ASSESSMENT:', {
    x: 40,
    y: currentY,
    size: 11,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText(`VERDICT: ${verdict}  (Score: ${latestAssessment?.score ?? 0}/100)`, {
    x: 220,
    y: currentY,
    size: 12,
    font: fontBold,
    color: verdictColor,
  });

  currentY -= 25;

  if (latestAssessment?.formulaExplanation) {
    page.drawText(`Formula: ${latestAssessment.formulaExplanation}`, {
      x: 40,
      y: currentY,
      size: 8,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });
    currentY -= 20;
  }

  // Divider
  page.drawLine({
    start: { x: 40, y: currentY },
    end: { x: width - 40, y: currentY },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  });
  currentY -= 25;

  // Section 1: Claims & Empirical Status
  page.drawText('1. INVESTIGATED CLAIMS VS. EVIDENCE', {
    x: 40,
    y: currentY,
    size: 12,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  currentY -= 18;

  for (const claim of claims.slice(0, 5)) {
    const statusColor = claim.status === 'verified' ? emerald : claim.status === 'contradicted' ? red : amber;
    page.drawText(`[${claim.status.toUpperCase()}]`, {
      x: 40,
      y: currentY,
      size: 9,
      font: fontBold,
      color: statusColor,
    });

    const truncatedText = claim.text.length > 70 ? claim.text.slice(0, 67) + '...' : claim.text;
    page.drawText(truncatedText, {
      x: 140,
      y: currentY,
      size: 9,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    });

    currentY -= 15;
  }

  currentY -= 15;
  page.drawLine({
    start: { x: 40, y: currentY },
    end: { x: width - 40, y: currentY },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  });
  currentY -= 25;

  // Section 2: Defect Findings & Root Causes
  page.drawText('2. CONFIRMED FINDINGS & ROOT CAUSES', {
    x: 40,
    y: currentY,
    size: 12,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  currentY -= 18;

  if (findings.length === 0) {
    page.drawText('Zero open defect findings recorded.', {
      x: 40,
      y: currentY,
      size: 9,
      font: fontRegular,
      color: emerald,
    });
    currentY -= 20;
  } else {
    for (const f of findings.slice(0, 4)) {
      const fColor = f.severity === 'critical' ? red : amber;
      page.drawText(`• [${f.severity.toUpperCase()}] ${f.title}`, {
        x: 40,
        y: currentY,
        size: 9,
        font: fontBold,
        color: fColor,
      });
      currentY -= 14;

      if (f.confirmedRootCause) {
        const rootText = `  Root Cause: ${f.confirmedRootCause.slice(0, 80)}`;
        page.drawText(rootText, {
          x: 40,
          y: currentY,
          size: 8,
          font: fontRegular,
          color: rgb(0.4, 0.4, 0.4),
        });
        currentY -= 14;
      }
    }
  }

  currentY -= 15;
  page.drawLine({
    start: { x: 40, y: currentY },
    end: { x: width - 40, y: currentY },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  });
  currentY -= 25;

  // Section 3: Executed Test Runs
  page.drawText('3. RECENT TEST RUN AUDIT TRAIL', {
    x: 40,
    y: currentY,
    size: 12,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  currentY -= 18;

  for (const tr of testRuns.slice(0, 4)) {
    const trColor = tr.status === 'passed' ? emerald : red;
    page.drawText(`${tr.status.toUpperCase()} (${tr.durationMs}ms): ${tr.observedBehavior.slice(0, 75)}`, {
      x: 40,
      y: currentY,
      size: 8.5,
      font: fontRegular,
      color: trColor,
    });
    currentY -= 15;
  }

  // Footer Disclaimer
  page.drawText(
    'PROOFCHAIN.AI Verification Guarantee: No claim is marked verified without empirical execution proof.',
    {
      x: 40,
      y: 30,
      size: 8,
      font: fontBold,
      color: emerald,
    }
  );

  return await pdfDoc.save();
}

export function generateProjectAuditJson(projectId: string): Record<string, unknown> {
  const db = getDb();
  const project = db.getProject(projectId);
  if (!project) throw new Error(`Project ${projectId} not found`);

  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      platform: 'PROOFCHAIN.AI v1.0',
      guarantee: 'Zero hallucinated metrics. Every claim anchored to inspectable evidence.',
    },
    project,
    requirements: db.getRequirements(projectId),
    claims: db.getClaims(projectId),
    evidenceItems: db.getEvidenceItems(projectId),
    claimEvidenceLinks: db.getAllClaimEvidenceLinks(projectId),
    auditRuns: db.getAuditRuns(projectId),
    testRuns: db.getTestRuns(projectId),
    findings: db.getFindings(projectId),
    fixProposals: db.getFixProposals(projectId),
    fixAttempts: db.getFixAttempts(projectId),
    remediationTasks: db.getRemediationTasks(projectId),
    releaseAssessments: db.getReleaseAssessments(projectId),
  };
}
