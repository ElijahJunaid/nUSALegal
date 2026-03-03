import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from '#imports'

export default defineNuxtRouteMiddleware((to: any) => {
    const config = useRuntimeConfig()
    const isShutdown = config.public.isShutdown || false
    const shutdownPage = config.public.shutdownPage || '/shutdown'

    if (isShutdown && to.path !== shutdownPage) {
        return navigateTo(shutdownPage)
    }

    if (!isShutdown && to.path === shutdownPage) {
        return navigateTo('/')
    }
})