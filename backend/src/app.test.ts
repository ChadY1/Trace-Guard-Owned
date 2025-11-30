import { buildApp } from './app';

describe('TraceGuard API', () => {
  it('expose un endpoint health', async () => {
    const app = await buildApp();
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
  });

  it('refuse les requêtes protégées sans JWT', async () => {
    const app = await buildApp();
    const res = await app.inject({ method: 'GET', url: '/audit' });
    expect(res.statusCode).toBe(401);
  });

  it('permet un login de démonstration', async () => {
    process.env.JWT_SECRET = 'test-secret';
    const app = await buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { username: 'admin', password: 'password123' },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.accessToken).toBeDefined();
    expect(body.expiresIn).toBeGreaterThan(0);
  });

  it('expose une vue synthétique des modules IMINT/OSINT/GEO après authentification', async () => {
    process.env.JWT_SECRET = 'test-secret';
    const app = await buildApp();
    const login = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { username: 'admin', password: 'password123' },
    });

    const token = login.json().accessToken as string;
    const res = await app.inject({
      method: 'GET',
      url: '/intel/overview',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const overview = res.json();
    expect(overview.imint.activeSources).toBeGreaterThan(0);
    expect(overview.osint.activeStreams).toBeGreaterThan(0);
    expect(overview.geopolitics.sampleSignals.length).toBeGreaterThan(0);
  });
});
