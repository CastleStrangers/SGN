import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
// Deriving a 32-byte key from our secret env var
const SECRET = crypto.createHash('sha256').update(process.env.ENCRYPTION_SECRET || 'sgn-default-super-secret-key-2026').digest();

export function encryptBuffer(buffer: Buffer): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  
  // Format: iv_hex:tag_hex:encrypted_hex
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptBuffer(encryptedString: string): Buffer {
  const parts = encryptedString.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }
  const iv = Buffer.from(parts[0], 'hex');
  const tag = Buffer.from(parts[1], 'hex');
  const encrypted = Buffer.from(parts[2], 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}
