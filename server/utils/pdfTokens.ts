import crypto from 'crypto'

const SECRET_KEY = process.env.TOKEN_SECRET || 'your-secret-key-change-in-production'
const TOKEN_EXPIRY_MINUTES = process.env.TOKEN_EXPIRY ? parseFloat(process.env.TOKEN_EXPIRY) : 5
const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_MINUTES * 60 * 1000 

interface TokenPayload {
    filePath: string
    expiresAt: number
}

export function generatePdfToken(filePath: string): string {
    const expiresAt = Date.now() + TOKEN_EXPIRY_MS

    const payload: TokenPayload = {
        filePath,
        expiresAt
    }

    const payloadStr = JSON.stringify(payload)
    const payloadBase64 = Buffer.from(payloadStr).toString('base64url')

    const signature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(payloadBase64)
        .digest('base64url')

    return `${payloadBase64}.${signature}`
}

export function validatePdfToken(token: string): string | null {
    try {
        const [payloadBase64, signature] = token.split('.')

        if (!payloadBase64 || !signature) {
            return null
        }

        const expectedSignature = crypto
            .createHmac('sha256', SECRET_KEY)
            .update(payloadBase64)
            .digest('base64url')

        if (signature !== expectedSignature) {
            return null
        }

        const payloadStr = Buffer.from(payloadBase64, 'base64url').toString()
        const payload: TokenPayload = JSON.parse(payloadStr)

        if (Date.now() > payload.expiresAt) {
            return null
        }

        return payload.filePath
    } catch (error) {
        return null
    }
}
