// Service d'authentification basique (ébauche) pour TraceGuard.
import { FastifyInstance } from 'fastify';
import { loginSchema, LoginInput } from './auth.schema';

export class AuthService {
  constructor(private app: FastifyInstance) {}

  async login(payload: LoginInput) {
    // TODO: remplacer par une vraie vérification (OIDC/IdP, WebAuthn, MFA).
    if (payload.username === 'admin' && payload.password === 'password123') {
      const token = this.app.jwt.sign({ sub: payload.username, roles: ['admin'] }, { expiresIn: '1h' });
      return { accessToken: token, expiresIn: 3600 };
    }
    return this.app.httpErrors.unauthorized('invalid credentials');
  }
}
