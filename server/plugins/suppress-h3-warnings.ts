const _warn = console.warn.bind(console)
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('[h3] Implicit event handler conversion'))
    return
  if (typeof args[0] === 'string' && args[0].includes('util._extend')) return
  _warn(...args)
}

const _emitWarning = process.emitWarning.bind(process)
process.emitWarning = (warning: string | Error, ...args: unknown[]) => {
  const msg = typeof warning === 'string' ? warning : (warning?.message ?? '')
  if (msg.includes('util._extend')) return
  ;(_emitWarning as (...a: unknown[]) => void)(warning, ...args)
}

export default () => {}
