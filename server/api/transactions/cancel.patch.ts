import { generateCancelRefundResponse } from '../../utils/mock-data'
import { verifyToken } from '../../utils/jwt'

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

  if (payload.Role !== 'Supervisor') {
    throw createError({
      statusCode: 403,
      statusMessage: 'No tienes permisos para cancelar transacciones'
    })
  }

  const body = await readBody(event)
  const { referenceNumber, cardNumber } = body

  if (!referenceNumber || !cardNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Número de referencia y tarjeta son requeridos'
    })
  }

  // Simular procesamiento
  const response = generateCancelRefundResponse(cardNumber, 'cancel')

  return {
    success: true,
    message: 'Cancelación procesada exitosamente',
    data: {
      ...response,
      originalReference: referenceNumber
    }
  }
})
