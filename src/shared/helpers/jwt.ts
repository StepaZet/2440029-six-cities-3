import { SignJWT } from 'jose';

const JWT_EXPIRED = '2h';
const JWT_ALG = 'HS256';

export async function getToken(tokenData: Record<string, string>, secretKey: string): Promise<string> {
  const secretBytes = new TextEncoder().encode(secretKey);

  const accessToken = await new SignJWT(tokenData)
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRED)
    .setProtectedHeader({ alg: JWT_ALG })
    .sign(secretBytes);

  return accessToken;
}
