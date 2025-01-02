import { createHmac } from 'node:crypto';

export function generatePassword(password: string, salt: string): string {
  return createHmac('sha256', salt).update(password).digest('hex');
}
