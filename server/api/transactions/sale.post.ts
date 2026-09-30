import { generateSaleResponse } from '../../utils/mock-data'
import { verifyToken } from '../../utils/jwt'
import CryptoJS from 'crypto-js'

const AES_SECRET = process.env.AES_SECRET || 'nuxt-pos-aes-secret-2026'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token de autorización requerido'
    })
  }

  const token = authHeader.substring(7)
  const payload = verifyToken(token)

  if (!payload) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token inválido o expirado'
    })
  }

  if (payload.Role !== 'Operador') {
    throw createError({
      statusCode: 403,
      statusMessage: 'No tienes permisos para realizar ventas'
    })
  }

  const body = await readBody(event)
  const { amount, customerName, encryptedData } = body

  if (!amount || !customerName || !encryptedData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos incompletos para la venta'
    })
  }

  // Descifrar datos sensibles
  let cardData
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, AES_SECRET)
    cardData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Error al descifrar los datos de la tarjeta'
    })
  }

  const { cardNumber, expirationDate, cvv } = cardData

  if (!cardNumber || !expirationDate || !cvv) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos de tarjeta incompletos'
    })
  }

  // Simular procesamiento
  const response = generateSaleResponse(cardNumber)

  return {
    success: true,
    message: 'Venta procesada exitosamente',
    data: {
      ...response,
      amount,
      customerName
    }
  }
})
