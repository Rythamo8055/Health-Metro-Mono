import crypto from 'crypto';

const SECRET_KEY = process.env.QR_SECRET_KEY || 'health-metro-default-secret-2026';

export function generateToken(clientId: string): string {
  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(clientId)
    .digest('hex')
    .slice(0, 16); // 16 chars is enough for this use case
}

export function verifyToken(clientId: string, token: string): boolean {
  const expectedToken = generateToken(clientId);
  return token === expectedToken;
}
