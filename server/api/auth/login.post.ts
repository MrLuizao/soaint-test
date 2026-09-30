import { mockUsers } from '../../utils/mock-data'
import { generateToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Usuario y contraseña son requeridos'
    })
  }

  const user = mockUsers.find(
    u => u.username === username && u.password === password
  )

  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Credenciales inválidas'
    })
  }

  const token = generateToken(user.id, user.role)

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role
    }
  }
})
