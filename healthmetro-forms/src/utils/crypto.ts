import crypto from 'crypto';

const SECRET_KEY = process.env.QR_SECRET_KEY || 'health-metro-default-secret-2026';

export function generateToken(clientId: string): string {
  // Use a fallback for client-side if needed, but this should ideally be server-side
  // Next.js polyfills 'crypto' in many environments, but for pure client-side
  // it might be tricky. Let's assume this runs in a Server Action or Component.
  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(clientId)
    .digest('hex')
    .slice(0, 16);
}

export function verifyToken(clientId: string, token: string): boolean {
  if (!clientId || !token) return false;
  const expectedToken = generateToken(clientId);
  return token === expectedToken;
}
