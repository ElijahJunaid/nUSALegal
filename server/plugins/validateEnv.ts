import { validateEnv } from '../utils/validateEnv'
import { dError } from '../utils/debug'

export default () => {
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  try {
    validateEnv()
  } catch (error) {
    dError('Environment validation failed:', error)
    throw error
  }
}
