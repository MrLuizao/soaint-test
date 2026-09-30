interface SuccessModalOptions {
  title: string
  description: string
  icon?: string
  details?: { label: string, value: string }[]
}

interface SuccessModalState {
  isOpen: boolean
  options: SuccessModalOptions
}

const successState = reactive<SuccessModalState>({
  isOpen: false,
  options: {
    title: '',
    description: '',
    icon: 'i-lucide-check-circle',
    details: []
  }
})

export function useSuccessModal() {
  function showSuccess(options: SuccessModalOptions) {
    successState.options = {
      icon: 'i-lucide-check-circle',
      details: [],
      ...options
    }
    successState.isOpen = true
  }

  function closeSuccess() {
    successState.isOpen = false
  }

  // Éxito de venta
  function showSaleSuccess(data: {
    approvalNumber: string
    referenceNumber: string
    maskedCard: string
    amount: string
    customerName: string
  }) {
    showSuccess({
      title: 'Venta Exitosa',
      description: 'La transacción se ha procesado correctamente.',
      icon: 'i-lucide-shopping-cart',
      details: [
        { label: 'No. Aprobación', value: data.approvalNumber },
        { label: 'Referencia', value: data.referenceNumber },
        { label: 'Tarjeta', value: data.maskedCard },
        { label: 'Importe', value: `$${data.amount}` },
        { label: 'Cliente', value: data.customerName }
      ]
    })
  }

  // Éxito de cancelación
  function showCancelSuccess(data: {
    approvalNumber: string
    referenceNumber: string
    maskedCard: string
  }) {
    showSuccess({
      title: 'Cancelación Exitosa',
      description: 'La transacción ha sido cancelada correctamente.',
      icon: 'i-lucide-x-circle',
      details: [
        { label: 'No. Aprobación', value: data.approvalNumber },
        { label: 'Referencia', value: data.referenceNumber },
        { label: 'Tarjeta', value: data.maskedCard },
        { label: 'Estado', value: 'Cancelada' }
      ]
    })
  }

  // Éxito de devolución
  function showRefundSuccess(data: {
    approvalNumber: string
    referenceNumber: string
    maskedCard: string
  }) {
    showSuccess({
      title: 'Devolución Exitosa',
      description: 'La devolución se ha procesado correctamente.',
      icon: 'i-lucide-rotate-ccw',
      details: [
        { label: 'No. Aprobación', value: data.approvalNumber },
        { label: 'Referencia', value: data.referenceNumber },
        { label: 'Tarjeta', value: data.maskedCard },
        { label: 'Estado', value: 'Devuelta' }
      ]
    })
  }

  return {
    successState,
    showSuccess,
    closeSuccess,
    showSaleSuccess,
    showCancelSuccess,
    showRefundSuccess
  }
}
