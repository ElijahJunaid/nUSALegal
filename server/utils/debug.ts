export const DEBUG = true

export const dLog = (...a: unknown[]) => {
  if (DEBUG) console.log(...a)
}
export const dWarn = (...a: unknown[]) => {
  if (DEBUG) console.warn(...a)
}
export const dError = (...a: unknown[]) => {
  if (DEBUG) console.error(...a)
}
