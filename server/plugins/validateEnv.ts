import { validateEnv } from '../utils/validateEnv'

export default defineNitroPlugin(() => {
  
  try {
    validateEnv()
  } catch (error) {
    console.error('Environment validation failed:', error)
    if (process.env.NODE_ENV === 'production') {
      throw error 
    }
  }
})