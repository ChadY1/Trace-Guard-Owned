// Déclarations pour étendre Fastify avec la méthode authenticate.
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
  }
}
