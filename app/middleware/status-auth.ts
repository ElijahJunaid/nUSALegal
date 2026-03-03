export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()
  const adminKey = config.public.statusAdminKey || ''
  
  const providedKey = to.query.key as string
  
  if (providedKey !== adminKey || !adminKey) {
    return navigateTo('/')
  }
})
