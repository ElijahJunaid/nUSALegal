<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
    error: Object as () => NuxtError,
})

const countdown = ref(5)
const autoRedirect = ref(false)

const getErrorDetails = () => {
    const statusCode = props.error?.statusCode || 500
    const message = props.error?.message || 'An unexpected error occurred'

    if (statusCode === 403) {
        if (message.includes('expired token') || message.includes('Invalid or expired token')) {
            return {
                title: 'Link Expired',
                message: 'This PDF link has expired for security reasons.',
                icon: '⏱️'
            }
        }
        return {
            title: 'Access Denied',
            message: 'You do not have permission to access this resource.',
            suggestion: 'Please check your access rights or contact support.',
            icon: '🔒'
        }
    }

    if (statusCode === 404) {
        autoRedirect.value = true
        return {
            title: 'Page Not Found',
            message: 'The page you are looking for does not exist.',
            suggestion: 'The page may have been moved or deleted.',
            icon: '🔍'
        }
    }

    if (statusCode === 500) {
        return {
            title: 'Server Error',
            message: 'Something went wrong on our end.',
            suggestion: 'Please try again later or contact support if the problem persists.',
            icon: '⚠️'
        }
    }

    return {
        title: `Error ${statusCode}`,
        message: message,
        suggestion: 'Please try again or contact support if the issue persists.',
        icon: '❌'
    }
}

const errorDetails = getErrorDetails()
onMounted(() => {
    if (autoRedirect.value) {
        const interval = setInterval(() => {
            countdown.value--
            if (countdown.value <= 0) {
                clearInterval(interval)
                navigateTo('/')
            }
        }, 1000)
    }
})

const handleGoBack = () => {
    if (window.history.length > 1) {
        window.history.back()
    } else {
        navigateTo('/')
    }
}
</script>

<template>
    <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div class="card bg-base-100 shadow-2xl max-w-2xl w-full">
            <div class="card-body text-center">
                <div class="text-6xl mb-4">{{ errorDetails.icon }}</div>
                <h1 class="text-3xl font-bold mb-2">{{ errorDetails.title }}</h1>
                <div class="badge badge-error badge-lg mb-4 mx-auto">
                    Error Code: {{ error?.statusCode || 500 }}
                </div>

                <p class="text-lg mb-2">{{ errorDetails.message }}</p>

                <p class="text-sm text-base-content/70 mb-2">{{ errorDetails.suggestion }}</p>

                <div v-if="autoRedirect" class="mb-4">
                    <p class="text-base-content/60">Redirecting to home page in {{ countdown }} seconds...</p>
                </div>

                <div class="card-actions justify-center gap-2">
                    <button @click="handleGoBack" class="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Go Back
                    </button>
                    <NuxtLink to="/" class="btn btn-outline">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>