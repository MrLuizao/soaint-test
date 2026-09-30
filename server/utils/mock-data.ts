// Usuarios mock para autenticación
export const mockUsers = [
  {
    id: '1',
    username: 'supervisor',
    password: 'supervisor123',
    role: 'Supervisor' as const,
    name: 'Linus Torvalds'
  },
  {
    id: '2',
    username: 'operador',
    password: 'operador123',
    role: 'Operador' as const,
    name: 'Ada Lovelace'
  }
]

// Generar número aleatorio de n dígitos
function generateNumber(digits: number): string {
  return Math.floor(Math.random() * Math.pow(10, digits))
    .toString()
    .padStart(digits, '0')
}

// Enmascarar tarjeta (1234*****1234)
export function maskCard(cardNumber: string): string {
  const clean = cardNumber.replace(/\s/g, '')
  if (clean.length < 8) return clean
  const first4 = clean.slice(0, 4)
  const last4 = clean.slice(-4)
  return `${first4}*****${last4}`
}

// Generar respuesta de venta
export function generateSaleResponse(cardNumber: string) {
  return {
    approvalNumber: generateNumber(6),
    referenceNumber: generateNumber(8),
    maskedCard: maskCard(cardNumber),
    status: 'approved',
    timestamp: new Date().toISOString()
  }
}

// Generar respuesta de cancelación/devolución
export function generateCancelRefundResponse(cardNumber: string, type: 'cancel' | 'refund') {
  return {
    approvalNumber: generateNumber(6),
    referenceNumber: generateNumber(8),
    maskedCard: maskCard(cardNumber),
    status: type === 'cancel' ? 'cancelled' : 'refunded',
    timestamp: new Date().toISOString()
  }
}

// Generar transacciones mock para consulta
export function generateMockTransactions(count: number = 10) {
  const types = ['sale', 'cancel', 'refund']
  const statuses = ['approved', 'cancelled', 'refunded']
  const names = [
    'Dennis Ritchie', 'Grace Hopper', 'Ken Thompson', 'Margaret Hamilton',
    'Bjarne Stroustrup', 'Radia Perlman', 'Guido van Rossum', 'Barbara Liskov',
    'James Gosling', 'Frances Allen', 'Alan Turing', 'Edsger Dijkstra'
  ]

  return Array.from({ length: count }, (_, i) => {
    const typeIndex = i % 3
    return {
      id: generateNumber(10),
      approvalNumber: generateNumber(6),
      referenceNumber: generateNumber(8),
      maskedCard: `${generateNumber(4)}*****${generateNumber(4)}`,
      amount: (Math.random() * 9999 + 1).toFixed(2),
      customerName: names[i % names.length],
      type: types[typeIndex],
      status: statuses[typeIndex],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
