interface ErrorAlertState {
  isVisible: boolean
  title: string
  message: string
  details?: string
}

const errorState = reactive<ErrorAlertState>({
  isVisible: false,
  title: '',
  message: '',
  details: undefined
})

let dismissTimer: ReturnType<typeof setTimeout> | null = null

export function useErrorAlert() {
  function showError(options: { title?: string, message: string, details?: string }) {
    if (dismissTimer) clearTimeout(dismissTimer)

    errorState.title = options.title || 'Error'
    errorState.message = options.message
    errorState.details = options.details
    errorState.isVisible = true

    // Auto-dismiss después de 6 segundos
    dismissTimer = setTimeout(() => {
      errorState.isVisible = false
    }, 6000)
  }

  function closeError() {
    if (dismissTimer) clearTimeout(dismissTimer)
    errorState.isVisible = false
  }

  // Extraer mensaje de error de diferentes formatos
  function parseError(error: unknown): string {
    if (typeof error === 'string') return error
    const e = error as { data?: { statusMessage?: string, message?: string }, statusMessage?: string, message?: string }
    if (e?.data?.statusMessage) return e.data.statusMessage
    if (e?.data?.message) return e.data.message
    if (e?.statusMessage) return e.statusMessage
    if (e?.message) return e.message
    return 'Ha ocurrido un error inesperado'
  }

  // Mostrar error de autenticación
  function showAuthError(error: unknown) {
    showError({
      title: 'Error de Autenticación',
      message: parseError(error),
      details: 'Verifica tus credenciales e intenta nuevamente.'
    })
  }

  // Mostrar error de transacción
  function showTransactionError(error: unknown, type: 'sale' | 'cancel' | 'refund' | 'query') {
    const titles: Record<string, string> = {
      sale: 'Error en Venta',
      cancel: 'Error en Cancelación',
      refund: 'Error en Devolución',
      query: 'Error en Consulta'
    }

    showError({
      title: titles[type],
      message: parseError(error),
      details: 'Por favor verifica los datos e intenta nuevamente.'
    })
  }

  return {
    errorState,
    showError,
    closeError,
    parseError,
    showAuthError,
    showTransactionError
  }
}
