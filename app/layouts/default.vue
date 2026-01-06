<template>
    <div class="drawer drawer-end" :data-theme="theme">
        <input id="nusalegal-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
            <div class="navbar custom-navbar">
                <div class="navbar-left">
                    <NuxtLink to="/" class="app-name">nUSA Legal</NuxtLink>
                    <NuxtLink to="/game" class="game-icon" title="Play Game">🎮</NuxtLink>
                </div>

                <template v-if="!isHome">
                    <div class="navbar-right">
                        <div class="hidden lg:flex">
                            <NuxtLink v-for="(menu, i) in menus" :key="i" :to="menu.to" class="nav-link">
                                {{ menu.label }}
                            </NuxtLink>
                        </div>
                        
                        <div class="flex lg:hidden">
                            <label for="nusalegal-drawer" aria-label="open sidebar" class="menu-toggle">
                                <img src="/svg/menu.svg">
                            </label>
                        </div>
                    </div>
                </template>
            </div>

            <div class="flex-1 p-6 flex gap-6">
                <div class="max-lg:hidden w-[30%] xl:w-[20%]">
                    <slot name="sub-menu" />
                </div>

                <div class="w-full lg:w-[70%] xl:w-[60%]">
                    <slot name="default" />
                </div>

                <div class="max-lg:hidden w-[20%]"></div>
            </div>
            <footer class="flex flex-col gap-2 text-center py-4">
                <p>&copy; 2024 nUSA Legal</p>
                <p>THIS IS NOT REAL LIFE!</p>
            </footer>

            <button @click="toggleTheme" class="theme-toggle" aria-label="Toggle theme">
                <span v-if="theme === 'light'">☀️</span>
                <span v-else>🌙</span>
            </button>

            <ChatbotWidget />
        </div>
        <div class="drawer-side">
            <label for="nusalegal-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
            <ul class="menu">
                <label for="nusalegal-drawer" aria-label="open sidebar" class="menu-toggle">
                    <img src="/svg/close.svg">
                </label>
                <template v-for="(menu, i) in menus" :key="i">
                    <li>
                        <NuxtLink :to="menu.to">{{ menu.label }}</NuxtLink>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
const route = useRoute();

const isHome = computed(() => route.path == '/')

interface Menu {
    to: string
    label: string
}

const menus: Menu[] = [
    {
        label: 'Courts',
        to: '/courts'
    },
    {
        label: 'Bills',
        to: '/bills'
    },
    {
        label: 'FRCP/FRCMP',
        to: '/frcp-frcmp'
    },
    {
        label: 'Laws',
        to: '/laws'
    },
    {
        label: 'Constitution',
        to: '/constitution'
    },
    {
        label: 'Mock Trial',
        to: '/mock-trial'
    },
]

const theme = ref<'light' | 'dark'>('light')

onMounted(() => {
    
    const savedTheme = localStorage.getItem('nusalegal-theme') as 'light' | 'dark' | null
    theme.value = savedTheme || 'light'
})

const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('nusalegal-theme', theme.value)
}
</script>

<style scoped>
.drawer-content {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.navbar.custom-navbar {
    background-color: rgba(51, 51, 51, 0.95);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    padding: 1rem 1.5rem;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.navbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
}

.navbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
}

.navbar-right > div {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
    white-space: nowrap;
    font-weight: 500;
}

.nav-link:hover {
    background-color: rgba(138, 99, 255, 0.2);
    color: #b39eff;
    transform: scale(1.05);
}

/* Dark mode vibrant links */
[data-theme='dark'] .nav-link {
    color: #b39eff;
}

[data-theme='dark'] .nav-link:hover {
    color: #d4c6ff;
    background-color: rgba(155, 127, 255, 0.3);
}

.app-name {
    font-size: 2rem;
    font-weight: 700;
    text-transform: none;
    white-space: nowrap;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
}

.app-name:hover {
    color: #8a63ff;
    text-decoration: underline;
    transform: scale(1.05);
}

.game-icon {
    font-size: 2rem;
    transition: transform 0.2s;
    white-space: nowrap;
    text-decoration: none;
}

.game-icon:hover {
    transform: scale(1.1);
}

.menu {
    background-color: oklch(var(--b1));
    color: oklch(var(--bc));
    min-height: 100%;
    width: 20rem;
    padding: 1rem;
}

.theme-toggle {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: oklch(var(--p));
    color: oklch(var(--pc));
    font-size: 1.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 50;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.theme-toggle:hover {
    transform: scale(1.05);
}
</style>