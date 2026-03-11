import { defineEventHandler } from 'h3'
import { validateOrigin, setCorsHeaders } from '../../utils/validateOrigin'
import { generatePdfToken } from '../../utils/pdfTokens'
import { validationSchemas } from '../../utils/validation'
import { validateAndReplaceBody } from '../../middleware/safe-body'

interface PdfTokenRequestBody {
  pdfPath: string
}

export default defineEventHandler(async event => {
  validateOrigin(event)

  setCorsHeaders(event)

  // Validate and replace body first to prevent unvalidated access detection
  const validatedBody = await validateAndReplaceBody<PdfTokenRequestBody>(
    event,
    validationSchemas.pdfToken
  )
  const { pdfPath } = validatedBody

  const token = generatePdfToken(pdfPath)

  return {
    token,
    url: `/api/pdf/${token}`
  }
})
