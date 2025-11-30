// Stockage simple des utilisateurs pour l'exemple : en prod, brancher un IdP/OIDC.
import argon2 from 'argon2';

export interface UserRecord {
  username: string;
  passwordHash: string;
  roles: string[];
}

const bootstrapUsers: UserRecord[] = [];

export async function seedDefaultAdmin() {
  if (!bootstrapUsers.length) {
    const hash = await argon2.hash('password123');
    bootstrapUsers.push({ username: 'admin', passwordHash: hash, roles: ['admin'] });
  }
}

export function findUser(username: string): UserRecord | undefined {
  return bootstrapUsers.find((user) => user.username === username);
}
