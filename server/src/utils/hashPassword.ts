import bcrypt from 'bcryptjs';

export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 12;
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  return hash;
}

export async function verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hash);
}