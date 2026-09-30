import { generateMockTransactions } from '../../utils/mock-data'
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

  if (payload.Role !== 'Operador') {
    throw createError({
      statusCode: 403,
      statusMessage: 'No tienes permisos para consultar transacciones'
    })
  }

  const transactions = generateMockTransactions(10)

  return {
    success: true,
    data: transactions,
    total: transactions.length
  }
})
