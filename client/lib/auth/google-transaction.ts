import 'server-only';
import {createCipheriv, createDecipheriv, randomBytes} from 'node:crypto';

export const GOOGLE_TRANSACTION_COOKIE = 'google_oauth_tx';
export const GOOGLE_TRANSACTION_TTL = 300; // 5 minutes

type GoogleTransaction = {
    state: string;
    nonce: string;
    codeVerifier: string;
    expiresAt: number;
};

function getEncryptionKey(): Buffer {
    const secret = process.env.GOOGLE_OAUTH_COOKIE_SECRET;

    if (!secret || !/^[a-fA-F0-9]{64}$/.test(secret)) {
        throw new Error('Invalid Google OAuth cookie secret');
    }

    return Buffer.from(secret, 'hex');
}

export function encryptGoogleTransaction(
    transaction: GoogleTransaction,
): string {
    const iv = randomBytes(12);

    const cipher = createCipheriv('aes-256-gcm', getEncryptionKey(), iv);

    const encrypted = Buffer.concat([
        cipher.update(JSON.stringify(transaction), 'utf8'),
        cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    return Buffer.concat([iv, tag, encrypted]).toString('base64url');
}

export function decryptGoogleTransaction(value: string): GoogleTransaction {
    const buffer = Buffer.from(value, 'base64url');

    if (buffer.length < 29) {
        throw new Error('Invalid OAuth transaction');
    }

    const decipher = createDecipheriv(
        'aes-256-gcm',
        getEncryptionKey(),
        buffer.subarray(0, 12),
    );

    decipher.setAuthTag(buffer.subarray(12, 28));

    const decrypted = Buffer.concat([
        decipher.update(buffer.subarray(28)),
        decipher.final(),
    ]);

    const transaction: unknown = JSON.parse(decrypted.toString('utf8'));

    if (
        !transaction ||
        typeof transaction !== 'object' ||
        !('state' in transaction) ||
        typeof transaction.state !== 'string' ||
        !('nonce' in transaction) ||
        typeof transaction.nonce !== 'string' ||
        !('codeVerifier' in transaction) ||
        typeof transaction.codeVerifier !== 'string' ||
        !('expiresAt' in transaction) ||
        typeof transaction.expiresAt !== 'number' ||
        transaction.expiresAt <= Date.now()
    ) {
        throw new Error('Invalid or expired OAuth transaction');
    }

    return transaction as GoogleTransaction;
}
