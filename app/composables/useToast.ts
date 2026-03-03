import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
  function show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = `toast-${Date.now()}-${Math.random()}`
    
    const toast: Toast = {
      id,
      message,
      type,
      duration
    }
    
    toasts.value.push(toast)

    setTimeout(() => {
      remove(id)
    }, duration)
    
    return id
  }
  
  function remove(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  function success(message: string, duration = 3000) {
    return show(message, 'success', duration)
  }
  
  function error(message: string, duration = 4000) {
    return show(message, 'error', duration)
  }
  
  function warning(message: string, duration = 3500) {
    return show(message, 'warning', duration)
  }
  
  function info(message: string, duration = 3000) {
    return show(message, 'info', duration)
  }
  
  return {
    toasts,
    show,
    remove,
    success,
    error,
    warning,
    info
  }
}