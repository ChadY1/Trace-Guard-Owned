/* eslint-disable @typescript-eslint/no-unused-vars */
// Déclarations pour étendre Fastify avec la méthode authenticate.
import { FastifyReply, FastifyRequest } from 'fastify';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string; roles: string[] };
    user: { sub: string; roles: string[] };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    user: { sub: string; roles: string[] };
  }

  interface FastifyRequest {
    user: { sub: string; roles: string[] };
  }
}
