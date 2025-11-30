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
});
