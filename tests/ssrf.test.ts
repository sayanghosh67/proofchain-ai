import { describe, it, expect } from 'vitest';
import { isPrivateOrReservedIp, validateTargetUrl } from '../lib/security/ssrf';

describe('SSRF & Network Boundary Protection', () => {
  it('identifies private IPv4 addresses correctly', () => {
    expect(isPrivateOrReservedIp('127.0.0.1')).toBe(true);
    expect(isPrivateOrReservedIp('10.0.0.1')).toBe(true);
    expect(isPrivateOrReservedIp('172.16.0.1')).toBe(true);
    expect(isPrivateOrReservedIp('192.168.1.1')).toBe(true);
    expect(isPrivateOrReservedIp('0.0.0.0')).toBe(true);
  });

  it('blocks cloud metadata endpoint 169.254.169.254', () => {
    expect(isPrivateOrReservedIp('169.254.169.254')).toBe(true);
  });

  it('identifies IPv6 loopback', () => {
    expect(isPrivateOrReservedIp('::1')).toBe(true);
  });

  it('allows public Internet IPs', () => {
    expect(isPrivateOrReservedIp('8.8.8.8')).toBe(false);
    expect(isPrivateOrReservedIp('1.1.1.1')).toBe(false);
  });

  it('blocks localhost in validateTargetUrl', async () => {
    const res = await validateTargetUrl('http://localhost:8080/admin');
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('forbidden');
  });

  it('blocks direct private IP in validateTargetUrl', async () => {
    const res = await validateTargetUrl('http://192.168.1.50/api');
    expect(res.allowed).toBe(false);
  });

  it('allows authorized test worker on loopback when explicitly permitted', async () => {
    const res = await validateTargetUrl('http://127.0.0.1:4319/fixture/login', {
      allowFixtureHost: 'http://127.0.0.1:4319',
    });
    expect(res.allowed).toBe(true);
  });
});
