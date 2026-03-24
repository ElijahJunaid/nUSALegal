import { dLog } from '../utils/debug'

export default () => {
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  dLog('Nitro plugin initialized')
}
