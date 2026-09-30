interface LoaderState {
  isLoading: boolean
  message: string
}

const loaderState = reactive<LoaderState>({
  isLoading: false,
  message: ''
})

export function useLoader() {
  function showLoader(message: string = 'Procesando...') {
    loaderState.message = message
    loaderState.isLoading = true
  }

  function hideLoader() {
    loaderState.isLoading = false
    loaderState.message = ''
  }

  // Wrapper para ejecutar funciones con loader
  async function withLoader<T>(fn: () => Promise<T>, message?: string): Promise<T> {
    showLoader(message)
    try {
      return await fn()
    } finally {
      hideLoader()
    }
  }

  return {
    loaderState,
    showLoader,
    hideLoader,
    withLoader
  }
}
