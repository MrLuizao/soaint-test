interface SaleData {
  amount: string
  customerName: string
  cardNumber: string
  expirationDate: string
  cvv: string
}

interface CancelRefundData {
  referenceNumber: string
  cardNumber: string
}

interface TransactionResponse {
  success: boolean
  message: string
  data: {
    approvalNumber: string
    referenceNumber: string
    maskedCard: string
    status: string
    timestamp: string
    amount?: string
    customerName?: string
    originalReference?: string
  }
}

interface Transaction {
  id: string
  approvalNumber: string
  referenceNumber: string
  maskedCard: string
  amount: string
  customerName: string
  type: string
  status: string
  timestamp: string
}

export function useTransactions() {
  const { getAuthHeaders } = useAuth()
  const { encryptCardData } = useCrypto()

  async function processSale(data: SaleData): Promise<TransactionResponse> {
    const encryptedData = encryptCardData(data.cardNumber, data.expirationDate, data.cvv)

    const response = await $fetch<TransactionResponse>('/api/transactions/sale', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: {
        amount: data.amount,
        customerName: data.customerName,
        encryptedData
      }
    })

    return response
  }

  async function getTransactions(): Promise<Transaction[]> {
    const response = await $fetch<{ success: boolean, data: Transaction[] }>('/api/transactions', {
      method: 'GET',
      headers: getAuthHeaders()
    })

    return response.data
  }

  async function cancelTransaction(data: CancelRefundData): Promise<TransactionResponse> {
    const response = await $fetch<TransactionResponse>('/api/transactions/cancel', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: data
    })

    return response
  }

  async function refundTransaction(data: CancelRefundData): Promise<TransactionResponse> {
    const response = await $fetch<TransactionResponse>('/api/transactions/refund', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: data
    })

    return response
  }

  // Helpers compartidos para mostrar transacciones
  function getStatusColor(status: string): 'success' | 'warning' | 'info' | 'neutral' {
    const colors: Record<string, 'success' | 'warning' | 'info'> = {
      approved: 'success',
      cancelled: 'warning',
      refunded: 'info'
    }
    return colors[status] || 'neutral'
  }

  function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      approved: 'Aprobada',
      cancelled: 'Cancelada',
      refunded: 'Devuelta'
    }
    return labels[status] || status
  }

  function formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleString('es-MX', {
      dateStyle: 'short',
      timeStyle: 'short'
    })
  }

  return {
    processSale,
    getTransactions,
    cancelTransaction,
    refundTransaction,
    getStatusColor,
    getStatusLabel,
    formatDate
  }
}
