import ipaddr from 'ipaddr.js';
import dns from 'node:dns/promises';

export interface UrlValidationResult {
  allowed: boolean;
  reason?: string;
  sanitizedUrl?: string;
}

/**
 * Checks if an IP string belongs to private, loopback, link-local, or cloud metadata ranges.
 */
export function isPrivateOrReservedIp(ipString: string): boolean {
  try {
    const addr = ipaddr.process(ipString);
    const range = addr.range();

    // ipaddr.js ranges:
    // IPv4: 'unspecified', 'broadcast', 'multicast', 'linkLocal', 'loopback', 'carrierGradeNat', 'private', 'reserved'
    // IPv6: 'unspecified', 'linkLocal', 'multicast', 'loopback', 'uniqueLocal', 'ipv4Mapped', 'rfc6145', 'rfc6052', '6to4', 'teredo', 'reserved'
    const forbiddenRanges = [
      'unspecified',
      'broadcast',
      'multicast',
      'linkLocal',
      'loopback',
      'carrierGradeNat',
      'private',
      'reserved',
      'uniqueLocal',
    ];

    if (forbiddenRanges.includes(range)) {
      return true;
    }

    // Explicit check for AWS/GCP/Azure link-local metadata 169.254.169.254
    if (ipString === '169.254.169.254') {
      return true;
    }

    return false;
  } catch {
    // If it cannot be parsed as valid IP, treat with extreme suspicion
    return true;
  }
}

/**
 * Validate a public target URL strictly against SSRF and unauthorized local network access.
 * If allowLocalFixture is explicitly enabled (e.g. for the local isolated test worker/demo fixture on 127.0.0.1),
 * only the exact authorized fixture port is permitted.
 */
export async function validateTargetUrl(
  rawUrl: string,
  options: { allowFixtureHost?: string } = {}
): Promise<UrlValidationResult> {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { allowed: false, reason: 'URL is required.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { allowed: false, reason: 'Invalid URL format.' };
  }

  // Only http and https
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { allowed: false, reason: `Unsupported protocol "${parsed.protocol}". Only HTTP and HTTPS are permitted.` };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Explicit demo fixture host exception (e.g. 127.0.0.1:4319)
  if (options.allowFixtureHost && (hostname === '127.0.0.1' || hostname === 'localhost')) {
    const fixturePort = new URL(options.allowFixtureHost).port || '4319';
    if (parsed.port === fixturePort) {
      return { allowed: true, sanitizedUrl: parsed.toString() };
    }
  }

  // Check against PUBLIC_CHECK_HOSTS whitelist if configured
  const allowedHostsEnv = process.env.PUBLIC_CHECK_HOSTS;
  if (allowedHostsEnv && allowedHostsEnv.trim().length > 0) {
    const allowedHosts = allowedHostsEnv
      .split(',')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);
    if (!allowedHosts.includes(hostname)) {
      return {
        allowed: false,
        reason: `Host "${hostname}" is not in the authorized PUBLIC_CHECK_HOSTS allowlist.`,
      };
    }
  }

  // Reject obvious localhost / local names
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal')
  ) {
    return { allowed: false, reason: 'Requests to internal/localhost domains are forbidden.' };
  }

  // Check if hostname is direct IP literal
  if (ipaddr.isValid(hostname)) {
    if (isPrivateOrReservedIp(hostname)) {
      return { allowed: false, reason: `Target IP ${hostname} is a private or reserved network address.` };
    }
    return { allowed: true, sanitizedUrl: parsed.toString() };
  }

  // Resolve DNS to verify all destination IPs
  try {
    const lookupResults = await dns.lookup(hostname, { all: true });
    if (!lookupResults || lookupResults.length === 0) {
      return { allowed: false, reason: `Failed to resolve hostname "${hostname}".` };
    }

    for (const record of lookupResults) {
      if (isPrivateOrReservedIp(record.address)) {
        return {
          allowed: false,
          reason: `Hostname "${hostname}" resolves to private/reserved IP ${record.address}. SSRF check blocked.`,
        };
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'DNS lookup failed';
    return { allowed: false, reason: `DNS resolution failed for host "${hostname}": ${message}` };
  }

  return { allowed: true, sanitizedUrl: parsed.toString() };
}
