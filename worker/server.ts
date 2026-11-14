import http from 'node:http';
import { parse as parseUrl } from 'node:url';
import {
  fixtureState,
  applyDocsPatch,
  revertDocsPatch,
  applyPaymentPatch,
  revertPaymentPatch,
  resetFixtureState,
} from './fixture';

const PORT = parseInt(process.env.PORT || '4319', 10);
const HOST = '127.0.0.1'; // strictly loopback only

function sendJson(res: http.ServerResponse, statusCode: number, data: unknown) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-worker-secret',
  });
  res.end(body);
}

function sendHtml(res: http.ServerResponse, statusCode: number, html: string) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(html);
}

const server = http.createServer(async (req, res) => {
  const parsed = parseUrl(req.url || '/', true);
  const pathname = parsed.pathname || '/';
  const method = req.method?.toUpperCase() || 'GET';

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-worker-secret',
    });
    res.end();
    return;
  }

  // 1. Health & State Check
  if (pathname === '/health') {
    return sendJson(res, 200, {
      status: 'ok',
      service: 'proofchain-test-worker',
      loopbackOnly: true,
      timestamp: new Date().toISOString(),
      fixtureState,
    });
  }

  // 2. Fixture State
  if (pathname === '/fixture-state' && method === 'GET') {
    return sendJson(res, 200, { fixtureState });
  }

  // 3. Demo Target Fixture: Overview
  if (pathname === '/fixture') {
    const docsLink = fixtureState.docsPatched ? '/fixture/docs-valid' : '/fixture/broken-docs-404';
    const docsStatusText = fixtureState.docsPatched ? 'PATCHED (Valid)' : 'DEFAULT (Broken 404)';

    return sendHtml(
      res,
      200,
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>[DEMO FIXTURE] Nexus Pay & Cloud Portal</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0B1120; color: #E2E8F0; margin: 0; padding: 24px; }
    .banner { background: #B45309; color: #FEF3C7; padding: 12px 16px; border-radius: 6px; font-weight: bold; margin-bottom: 24px; }
    .card { background: #1E293B; border: 1px solid #334155; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
    nav a { color: #38BDF8; text-decoration: none; margin-right: 16px; font-weight: 500; }
    nav a:hover { text-decoration: underline; }
    code { background: #0F172A; padding: 2px 6px; border-radius: 4px; color: #F43F5E; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .badge-ok { background: #065F46; color: #6EE7B7; }
    .badge-err { background: #991B1B; color: #FCA5A5; }
  </style>
</head>
<body>
  <div class="banner">⚠️ HACKATHON DEMO TARGET FIXTURE — ISOLATED TESTING ENVIRONMENT</div>
  <h1>Nexus Pay & Merchant Cloud Portal</h1>
  <p>Status: <span class="badge ${fixtureState.docsPatched ? 'badge-ok' : 'badge-err'}">Docs Status: ${docsStatusText}</span></p>

  <nav class="card">
    <strong>Navigation Menu:</strong><br><br>
    <a href="/fixture/login">Merchant Login</a>
    <a id="nav-docs" href="${docsLink}">API Documentation (${docsLink})</a>
    <a href="/fixture/dashboard">Mobile Dashboard View</a>
    <a href="/fixture-state">Inspect Fixture State JSON</a>
  </nav>

  <div class="card">
    <h3>Simulated Endpoints</h3>
    <ul>
      <li><code>POST /fixture/login</code> — Working authentication fixture. Valid: demo@proofchain.ai / demo123</li>
      <li><code>GET /fixture/docs</code> — Navigation router link. Currently targets <code>${docsLink}</code></li>
      <li><code>POST /fixture/api/payment</code> — Mock payment processing endpoint. Configured port: <code>${fixtureState.paymentPort}</code></li>
      <li><code>GET /fixture/dashboard</code> — Dashboard with unscrollable 650px container (fails mobile overflow check)</li>
    </ul>
  </div>
</body>
</html>`
    );
  }

  // 4. Demo Target Fixture: Login
  if (pathname === '/fixture/login') {
    if (method === 'GET') {
      return sendHtml(
        res,
        200,
        `<!DOCTYPE html>
<html>
<head><title>Merchant Login</title><style>body{background:#0F172A;color:#F8FAFC;font-family:sans-serif;padding:40px;}</style></head>
<body>
  <h2>Merchant Login Portal</h2>
  <form method="POST" action="/fixture/login">
    <p><label>Email: <input type="email" name="email" value="demo@proofchain.ai" required></label></p>
    <p><label>Password: <input type="password" name="password" value="demo123" required></label></p>
    <p><button type="submit" id="btn-submit">Sign In</button></p>
  </form>
</body>
</html>`
      );
    }

    if (method === 'POST') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        let email = '';
        let password = '';
        try {
          const json = JSON.parse(body);
          email = json.email;
          password = json.password;
        } catch {
          const params = new URLSearchParams(body);
          email = params.get('email') || '';
          password = params.get('password') || '';
        }

        if (email === 'demo@proofchain.ai' && password === 'demo123') {
          return sendJson(res, 200, {
            authenticated: true,
            user: { email, role: 'merchant_admin' },
            sessionToken: 'jwt_mock_token_proofchain_982138',
            expiresInSeconds: 3600,
          });
        }

        return sendJson(res, 401, {
          authenticated: false,
          error: 'Unauthorized',
          message: 'Invalid credentials. Expected demo@proofchain.ai / demo123',
        });
      });
      return;
    }
  }

  // 5. Demo Target Fixture: Documentation Route
  if (pathname === '/fixture/docs') {
    // If not patched, it routes to broken 404
    if (!fixtureState.docsPatched) {
      res.writeHead(302, { Location: '/fixture/broken-docs-404' });
      res.end();
      return;
    }
    res.writeHead(302, { Location: '/fixture/docs-valid' });
    res.end();
    return;
  }

  if (pathname === '/fixture/broken-docs-404') {
    return sendHtml(
      res,
      404,
      `<!DOCTYPE html>
<html>
<head><title>404 Not Found</title><style>body{background:#111;color:#fff;font-family:monospace;padding:50px;}</style></head>
<body>
  <h1>404 Not Found</h1>
  <p>The requested URL <code>/fixture/broken-docs-404</code> does not exist on this server.</p>
  <p><em>(Defect: Demo fixture unpatched broken navigation link)</em></p>
</body>
</html>`
    );
  }

  if (pathname === '/fixture/docs-valid') {
    return sendHtml(
      res,
      200,
      `<!DOCTYPE html>
<html>
<head><title>Nexus Merchant Documentation</title><style>body{background:#0D1424;color:#E2E8F0;font-family:sans-serif;padding:40px;line-height:1.6;}</style></head>
<body>
  <div style="background:#065F46;color:#6EE7B7;padding:8px 12px;border-radius:4px;display:inline-block;margin-bottom:16px;">
    ✓ Verified Active Route (Patch Successful)
  </div>
  <h1>Nexus Merchant API Documentation v1.0</h1>
  <p>Welcome to the official developer guide. All payment and webhook endpoints are documented below.</p>
  <ul>
    <li>Authentication: Bearer JWT header</li>
    <li>Payments: <code>POST /fixture/api/payment</code></li>
    <li>Webhooks: <code>POST /fixture/api/webhooks</code></li>
  </ul>
</body>
</html>`
    );
  }

  // 6. Demo Target Fixture: Payment Endpoint
  if (pathname === '/fixture/api/payment' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      // If configured port is 9042, simulate payment gateway unreachable error
      if (fixtureState.paymentPort === 9042) {
        return sendJson(res, 500, {
          status: 'error',
          code: 'PAYMENT_GATEWAY_CONNECTION_REFUSED',
          error: 'MockPaymentGatewayConnectionRefused',
          message: 'Failed to establish connection to cluster 127.0.0.1:9042. Socket closed unexpectedly.',
          configuredPort: 9042,
          hint: 'Legacy port 9042 is deprecated. Switch connector to port 4319.',
        });
      }

      // If patched to 4319
      return sendJson(res, 200, {
        status: 'approved',
        transactionId: `tx_proofchain_${Date.now()}`,
        amount: 49.99,
        currency: 'USD',
        processedAt: new Date().toISOString(),
      });
    });
    return;
  }

  // 7. Demo Target Fixture: Mobile Dashboard (Overflow)
  if (pathname === '/fixture/dashboard') {
    return sendHtml(
      res,
      200,
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Merchant Dashboard</title>
  <style>
    body { margin: 0; background: #0B1120; color: #FFF; font-family: sans-serif; }
    .container { width: 100%; overflow: hidden; }
    /* DEFECT: Unresponsive wide table element with rigid min-width causing mobile horizontal scroll */
    .unresponsive-table { min-width: 650px; background: #1E293B; border-collapse: collapse; margin: 20px; }
    .unresponsive-table th, .unresponsive-table td { border: 1px solid #475569; padding: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Merchant Transactions Dashboard</h2>
    <table class="unresponsive-table" id="transactions-table">
      <thead>
        <tr><th>ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Timestamp</th></tr>
      </thead>
      <tbody>
        <tr><td>TX101</td><td>Acme Corp</td><td>$1,200.00</td><td>Settled</td><td>2026-11-14 09:30</td></tr>
      </tbody>
    </table>
  </div>
</body>
</html>`
    );
  }

  // 8. Test Execution Center API: POST /execute-test
  if (pathname === '/execute-test' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      try {
        const { testType, targetUrl, method: testMethod = 'GET', payload } = JSON.parse(body || '{}');

        if (!targetUrl) {
          return sendJson(res, 400, { error: 'targetUrl is required' });
        }

        const startTime = Date.now();

        // Perform actual HTTP check
        const fetchOptions: RequestInit = {
          method: testMethod,
          headers: { 'Content-Type': 'application/json' },
          redirect: 'manual', // do not auto follow so we can inspect redirects and 302/404
        };

        if (testMethod === 'POST' && payload) {
          fetchOptions.body = typeof payload === 'string' ? payload : JSON.stringify(payload);
        }

        const testRes = await fetch(targetUrl, fetchOptions);
        const durationMs = Date.now() - startTime;
        const resText = await testRes.text();

        let passed = testRes.status >= 200 && testRes.status < 300;
        let observed = `HTTP ${testRes.status} ${testRes.statusText}`;

        if (testRes.status === 302 || testRes.status === 301) {
          const loc = testRes.headers.get('location');
          observed = `HTTP ${testRes.status} Redirect to ${loc}`;
          // Check destination
          if (loc?.includes('broken-docs-404')) {
            passed = false;
            observed = `Failed: Navigation redirects to 404 broken route (${loc})`;
          } else if (loc?.includes('docs-valid')) {
            passed = true;
            observed = `Passed: Navigation redirects to valid docs route (${loc})`;
          }
        } else if (testRes.status === 404) {
          passed = false;
          observed = `Failed: Target returned HTTP 404 Not Found`;
        } else if (testRes.status === 500) {
          passed = false;
          observed = `Failed: Target returned HTTP 500 Internal Server Error`;
        }

        return sendJson(res, 200, {
          status: passed ? 'passed' : 'failed',
          statusCode: testRes.status,
          durationMs,
          observedBehavior: observed,
          responseSnippet: resText.slice(0, 500),
          headers: Object.fromEntries(testRes.headers.entries()),
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return sendJson(res, 500, {
          status: 'error',
          error: message,
          durationMs: 0,
          observedBehavior: `Connection error: ${message}`,
        });
      }
    });
    return;
  }

  // 9. Autonomous Recovery Studio: POST /apply-patch
  if (pathname === '/apply-patch' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const { patchType } = JSON.parse(body || '{}');

        if (patchType === 'docs_nav' || patchType === 'fix-docs-nav') {
          applyDocsPatch();
          return sendJson(res, 200, {
            success: true,
            patchApplied: 'docs_nav',
            message: 'Navigation anchor updated to /fixture/docs-valid.',
            fixtureState,
          });
        }

        if (patchType === 'payment_port') {
          applyPaymentPatch();
          return sendJson(res, 200, {
            success: true,
            patchApplied: 'payment_port',
            message: 'Payment cluster connector updated to port 4319.',
            fixtureState,
          });
        }

        return sendJson(res, 400, { error: `Unknown patchType: ${patchType}` });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return sendJson(res, 500, { error: message });
      }
    });
    return;
  }

  // 10. Autonomous Recovery Studio: POST /revert-patch
  if (pathname === '/revert-patch' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const { patchType } = JSON.parse(body || '{}');

        if (patchType === 'docs_nav' || patchType === 'fix-docs-nav') {
          revertDocsPatch();
          return sendJson(res, 200, {
            success: true,
            reverted: 'docs_nav',
            message: 'Navigation anchor reverted to broken state.',
            fixtureState,
          });
        }

        if (patchType === 'all') {
          resetFixtureState();
          return sendJson(res, 200, {
            success: true,
            reverted: 'all',
            message: 'All fixtures reset to default imperfect demo state.',
            fixtureState,
          });
        }

        return sendJson(res, 400, { error: `Unknown patchType: ${patchType}` });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return sendJson(res, 500, { error: message });
      }
    });
    return;
  }

  // 404 for other worker routes
  return sendJson(res, 404, { error: 'Worker endpoint not found' });
});

server.listen(PORT, HOST, () => {
  console.log(`[PROOFCHAIN TEST WORKER] Running securely on http://${HOST}:${PORT}`);
  console.log(`[DEMO FIXTURE] Available at http://${HOST}:${PORT}/fixture`);
});

