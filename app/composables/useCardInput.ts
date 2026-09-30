export function useCardInput() {
  // Solo permitir números
  function onlyNumbers(e: KeyboardEvent) {
    if (!/\d/.test(e.key)) {
      e.preventDefault()
    }
  }

  // Solo permitir números o slash (para fecha)
  function onlyNumbersOrSlash(e: KeyboardEvent) {
    if (!/[\d/]/.test(e.key)) {
      e.preventDefault()
    }
  }

  // Formatear número de tarjeta: 0000 0000 0000 0000
  function formatCardNumber(value: string): string {
    const digits = value.replace(/\D/g, '').substring(0, 16)
    return digits.match(/.{1,4}/g)?.join(' ') || digits
  }

  // Formatear fecha de expiración: MM/AA
  function formatExpirationDate(value: string): string {
    const digits = value.replace(/\D/g, '').substring(0, 4)

    if (digits.length >= 2) {
      let month = digits.slice(0, 2)
      const monthNum = parseInt(month)

      if (monthNum > 12) month = '12'
      if (monthNum < 1 && digits.length >= 2) month = '01'

      return month + (digits.length > 2 ? '/' + digits.slice(2, 4) : '')
    }

    return digits
  }

  // Formatear referencia financiera: 8 dígitos
  function formatReferenceNumber(value: string): string {
    return value.replace(/\D/g, '').substring(0, 8)
  }

  // Formatear CVV: 3 dígitos
  function formatCvv(value: string): string {
    return value.replace(/\D/g, '').substring(0, 3)
  }

  // Obtener hint de tarjeta
  function getCardHint(cardNumber: string): string {
    const digits = cardNumber.replace(/\s/g, '').length
    return `${digits}/16 dígitos`
  }

  // Validar tarjeta completa (16 dígitos)
  function isValidCard(cardNumber: string): boolean {
    return cardNumber.replace(/\s/g, '').length === 16
  }

  // Validar fecha de expiración
  function isValidExpiration(expiration: string): boolean {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiration)) return false

    const [month = '', year = ''] = expiration.split('/')
    const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1)
    return expDate > new Date()
  }

  // Validar CVV (3 dígitos)
  function isValidCvv(cvv: string): boolean {
    return /^\d{3}$/.test(cvv)
  }

  // Validar referencia (8 dígitos)
  function isValidReference(reference: string): boolean {
    return /^\d{8}$/.test(reference)
  }

  return {
    // Eventos
    onlyNumbers,
    onlyNumbersOrSlash,
    // Formateo
    formatCardNumber,
    formatExpirationDate,
    formatReferenceNumber,
    formatCvv,
    // Hints
    getCardHint,
    // Validaciones
    isValidCard,
    isValidExpiration,
    isValidCvv,
    isValidReference
  }
}
