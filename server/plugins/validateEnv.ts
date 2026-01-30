import { validateEnv } from '../utils/validateEnv'

export default () => {
  if (process.env.NODE_ENV !== 'production') {
    return
  }
  
  try {
    validateEnv()
  } catch (error) {
    console.error('Environment validation failed:', error)
    throw error 
  }
}