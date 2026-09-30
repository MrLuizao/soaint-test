interface ConfirmModalOptions {
  title: string
  description: string
  icon?: string
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
  confirmText?: string
  cancelText?: string
  details?: { label: string, value: string }[]
}

interface ConfirmModalState {
  isOpen: boolean
  options: ConfirmModalOptions
  onConfirm: (() => void) | null
  onCancel: (() => void) | null
}

const modalState = reactive<ConfirmModalState>({
  isOpen: false,
  options: {
    title: '',
    description: '',
    icon: 'i-lucide-alert-circle',
    color: 'primary',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    details: []
  },
  onConfirm: null,
  onCancel: null
})

export function useConfirmModal() {
  function confirm(options: ConfirmModalOptions): Promise<boolean> {
    return new Promise((resolve) => {
      modalState.options = {
        icon: 'i-lucide-alert-circle',
        color: 'primary',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        details: [],
        ...options
      }

      modalState.onConfirm = () => {
        modalState.isOpen = false
        resolve(true)
      }

      modalState.onCancel = () => {
        modalState.isOpen = false
        resolve(false)
      }

      modalState.isOpen = true
    })
  }

  // Confirmación para venta
  function confirmSale(data: { amount: string, customerName: string, maskedCard: string }) {
    return confirm({
      title: '¿Confirmar Venta?',
      description: 'Estás a punto de procesar la siguiente venta:',
      icon: 'i-lucide-shopping-cart',
      color: 'success',
      confirmText: 'Procesar Venta',
      details: [
        { label: 'Importe', value: `$${data.amount}` },
        { label: 'Cliente', value: data.customerName },
        { label: 'Tarjeta', value: data.maskedCard }
      ]
    })
  }

  // Confirmación para cancelación
  function confirmCancel(data: { referenceNumber: string, maskedCard: string }) {
    return confirm({
      title: '¿Confirmar Cancelación?',
      description: 'Estás a punto de cancelar la siguiente transacción:',
      icon: 'i-lucide-x-circle',
      color: 'warning',
      confirmText: 'Procesar Cancelación',
      details: [
        { label: 'Referencia', value: data.referenceNumber },
        { label: 'Tarjeta', value: data.maskedCard }
      ]
    })
  }

  // Confirmación para devolución
  function confirmRefund(data: { referenceNumber: string, maskedCard: string }) {
    return confirm({
      title: '¿Confirmar Devolución?',
      description: 'Estás a punto de procesar la siguiente devolución:',
      icon: 'i-lucide-rotate-ccw',
      color: 'info',
      confirmText: 'Procesar Devolución',
      details: [
        { label: 'Referencia', value: data.referenceNumber },
        { label: 'Tarjeta', value: data.maskedCard }
      ]
    })
  }

  // Confirmación para cerrar sesión
  function confirmLogout() {
    return confirm({
      title: '¿Cerrar Sesión?',
      description: '¿Estás seguro que deseas cerrar tu sesión actual?',
      icon: 'i-lucide-log-out',
      color: 'neutral',
      confirmText: 'Cerrar Sesión',
      cancelText: 'Cancelar'
    })
  }

  // Función para enmascarar tarjeta
  function maskCard(cardNumber: string): string {
    const clean = cardNumber.replace(/\s/g, '')
    if (clean.length < 8) return clean
    return `${clean.slice(0, 4)}****${clean.slice(-4)}`
  }

  return {
    // Estado del modal (para el componente)
    modalState,
    // Funciones
    confirm,
    confirmSale,
    confirmCancel,
    confirmRefund,
    confirmLogout,
    maskCard
  }
}
