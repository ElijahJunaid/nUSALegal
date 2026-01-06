import crypto from 'crypto'

const SECRET_KEY = process.env.TOKEN_SECRET || 'your-secret-key-change-in-production'
const TOKEN_EXPIRY_MINUTES = process.env.TOKEN_EXPIRY ? parseFloat(process.env.TOKEN_EXPIRY) : 5
const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_MINUTES * 60 * 1000 

interface ApiTokenPayload {
    endpoint: string
    expiresAt: number
    
}

export function generateApiToken(endpoint: string): string {
    const expiresAt = Date.now() + TOKEN_EXPIRY_MS

    const payload: ApiTokenPayload = {
        endpoint,
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

export function validateApiToken(token: string, expectedEndpoint: string): boolean {
    try {
        const [payloadBase64, signature] = token.split('.')

        if (!payloadBase64 || !signature) {
            return false
        }

        const expectedSignature = crypto
            .createHmac('sha256', SECRET_KEY)
            .update(payloadBase64)
            .digest('base64url')

        if (signature !== expectedSignature) {
            return false
        }

        const payloadStr = Buffer.from(payloadBase64, 'base64url').toString()
        const payload: ApiTokenPayload = JSON.parse(payloadStr)

        if (Date.now() > payload.expiresAt) {
            return false
        }

        if (payload.endpoint !== expectedEndpoint) {
            return false
        }

        return true
    } catch (error) {
        return false
    }
}
