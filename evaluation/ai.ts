import { isGeminiConfigured, extractClaimsWithGemini, getGeminiModelName } from '../lib/gemini/client';

async function runAiEvaluation() {
  console.log('===============================================================');
  console.log('       PROOFCHAIN.AI — GEMINI AI INTELLIGENCE BENCHMARK        ');
  console.log('===============================================================\n');

  if (!isGeminiConfigured()) {
    console.warn('[NOTICE] GEMINI_API_KEY is not configured in environment variables.');
    console.warn('To execute live Gemini extraction benchmarking, please set:');
    console.warn('  export GEMINI_API_KEY="your-api-key"');
    console.warn('  export GEMINI_MODEL="gemini-2.5-flash"');
    console.log('\nHonest Report: Skipping live Gemini evaluation without real credentials.');
    return;
  }

  console.log(`Using Model: ${getGeminiModelName()}`);
  console.log('Executing live structured claim extraction with Gemini...\n');

  const testReport = `
Our merchant platform release 1.0 is complete and production ready:
1. User login with valid email and password authenticates and issues a session token.
2. Credit card transactions process immediately through the payment API with 200 OK.
3. The developer documentation link routes to active API reference documentation.
4. The merchant portal layout has zero horizontal overflow on mobile viewports.
`;

  const startTime = Date.now();
  try {
    const claims = await extractClaimsWithGemini(testReport, 'Benchmark Evaluation Report');
    const elapsed = Date.now() - startTime;

    console.log(`Gemini Extracted ${claims.length} claims in ${elapsed}ms:`);
    claims.forEach((c, i) => {
      console.log(`  ${i + 1}. [${c.category.toUpperCase()}] ${c.text}`);
      console.log(`     Testability: ${c.testability} | Confidence: ${c.confidence}`);
      console.log(`     Suggested Method: ${c.suggestedVerificationMethod}`);
    });

    console.log('\n[PASS] Gemini Structured Extraction Benchmark Succeeded.');
  } catch (err: unknown) {
    console.error('Gemini live evaluation failed:', err);
    process.exit(1);
  }
}

runAiEvaluation().catch(console.error);

