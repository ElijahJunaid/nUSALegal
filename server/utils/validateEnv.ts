
export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'TOKEN_SECRET',
    'SESSION_SECRET'
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`❌ Missing required environment variables: ${missing.join(', ')}`)
  }

  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
    throw new Error('❌ SESSION_SECRET must be at least 32 characters long')
  }
  
  if (process.env.TOKEN_SECRET && process.env.TOKEN_SECRET.length < 32) {
    throw new Error('❌ TOKEN_SECRET must be at least 32 characters long')
  }

  if (process.env.DATABASE_URL) {
    const dbUrl = process.env.DATABASE_URL
    const isValid = 
      dbUrl.startsWith('postgresql://') ||
      dbUrl.startsWith('file:') || 
      dbUrl.startsWith('mysql://') ||
      dbUrl.startsWith('sqlite:')
    
    if (!isValid) {
      throw new Error('❌ DATABASE_URL must be a valid database connection string')
    }
  }
  
  console.log('✅ Environment variables validated successfully')
}

if (process.env.NODE_ENV === 'production') {
  validateEnv()
}
