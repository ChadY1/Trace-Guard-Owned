// Service d'authentification basique (ébauche) pour TraceGuard.
import { FastifyInstance } from 'fastify';
import argon2 from 'argon2';
import { loginSchema, LoginInput } from './auth.schema';
import { findUser, seedDefaultAdmin } from './user.store';

export class AuthService {
  constructor(private app: FastifyInstance) {}

  async login(payload: LoginInput) {
    await seedDefaultAdmin();
    const parsed = loginSchema.parse(payload);
    const user = findUser(parsed.username);
    if (!user) return this.app.httpErrors.unauthorized('invalid credentials');
    const isValid = await argon2.verify(user.passwordHash, parsed.password);
    if (!isValid) return this.app.httpErrors.unauthorized('invalid credentials');
    const token = this.app.jwt.sign({ sub: parsed.username, roles: user.roles }, { expiresIn: '1h' });
    return { accessToken: token, expiresIn: 3600 };
  }
}
