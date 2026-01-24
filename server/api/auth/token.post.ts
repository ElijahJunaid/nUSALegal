interface AuthTokenRequestBody {
  endpoint: string
}

export default defineEventHandler(async (event) => {
    
    validateOrigin(event)

    setCorsHeaders(event)

    const body = await readBody(event) as AuthTokenRequestBody
    const { endpoint } = body

    if (!endpoint) {
        throw createError({
            status: 400,
            statusText: 'Endpoint is required'
        })
    }

    const allowedEndpoints = [
        'bills/congress',
        'bills/city-council',
        'courts/2',
        'courts/3',
        'courts/4',
        'courts/5',
        'courts/6',
        'courts/7',
        'courts/8',
        'courts/9',
        'courts/10',
        'courts/11',
        'courts/12',
        'courts/13',
        'courts/14',
        'courts/15',
        'courts/16',
        'courts/17',
        'federal-rules/frcp',
        'federal-rules/frcmp',
        'laws/federal',
        'laws/eo',
        'laws/municipal',
        'constitution/constitution',
        'constitution/constitution-amandments',
        'constitution/articles',
        'resources/definitions',
        'resources/files',
        'resources/court-procedure',
        'resources/office',
        'resources/vips',
    ]

    if (!allowedEndpoints.includes(endpoint)) {
        throw createError({
            status: 400,
            statusText: 'Invalid endpoint'
        })
    }

    const token = generateApiToken(endpoint)

    return {
        token,
        expiresIn: '5 minutes'
    }
})