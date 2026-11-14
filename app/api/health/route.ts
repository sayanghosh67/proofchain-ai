import { NextResponse } from 'next/server';
import { isGeminiConfigured, getGeminiModelName } from '@/lib/gemini/client';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const workerUrl = process.env.TEST_WORKER_URL || 'http://127.0.0.1:4319';

  let workerStatus = 'unreachable';
  try {
    const res = await fetch(`${workerUrl}/health`, { signal: AbortSignal.timeout(1000) });
    if (res.ok) workerStatus = 'connected';
  } catch {
    workerStatus = 'disconnected';
  }

  return NextResponse.json({
    status: 'healthy',
    platform: 'PROOFCHAIN.AI',
    appMode: process.env.APP_MODE || 'local',
    gemini: {
      configured: isGeminiConfigured(),
      model: getGeminiModelName(),
    },
    testWorker: {
      url: workerUrl,
      status: workerStatus,
    },
    totalProjects: db.getProjects().length,
    timestamp: new Date().toISOString(),
  });
}
