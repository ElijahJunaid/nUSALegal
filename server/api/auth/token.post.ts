import { defineEventHandler, getHeader, readBody } from 'h3'
import { validateOrigin, setCorsHeaders } from '../../utils/validateOrigin'
import { generateApiToken } from '../../utils/apiTokens'
import { validationSchemas, validateData } from '../../utils/validation'
import { dError } from '../../utils/debug'

interface AuthTokenRequestBody {
  endpoint: string
}

export default defineEventHandler(async event => {
  try {
    const body = await readBody<AuthTokenRequestBody>(event)
    const { endpoint } = validateData(validationSchemas.authToken, body)

    validateOrigin(event)

    setCorsHeaders(event)

    const token = generateApiToken(endpoint)

    return {
      token,
      expiresIn: '5 minutes'
    }
  } catch (err: unknown) {
    const e = err as Record<string, unknown>
    dError('AUTH_TOKEN_UNHANDLED_ERROR', {
      message: e?.message,
      name: e?.name,
      stack: e?.stack
    })
    const debugHeader =
      getHeader(event, 'x-debug') ||
      (event.node?.req?.headers as Record<string, string>)?.['x-debug']
    if (debugHeader === '1') {
      return {
        _debug: true,
        error: e?.message,
        name: e?.name,
        stack: (e?.stack as string)?.split?.('\n')?.slice?.(0, 15)
      }
    }
    throw err
  }
})
