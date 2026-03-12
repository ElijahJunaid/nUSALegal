import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'nusalegal-theme'

export function useTheme() {
  const theme = ref<'light' | 'dark'>('light')

  onMounted(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null
    theme.value = saved || 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
  })

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem(STORAGE_KEY, theme.value)
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  return { theme, toggleTheme }
}
