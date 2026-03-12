export default () => {
  const _warn = console.warn.bind(console)
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('[h3] Implicit event handler conversion'))
      return
    _warn(...args)
  }
}
