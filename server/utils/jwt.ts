import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'nuxt-pos-secret-key-2026'

export interface JwtPayload {
  iss: string
  iat: number
  exp: number
  aud: string
  sub: string
  Role: 'Supervisor' | 'Operador'
}

export function generateToken(userId: string, role: 'Supervisor' | 'Operador'): string {
  const now = Math.floor(Date.now() / 1000)

  const payload: JwtPayload = {
    iss: 'nuxt-pos-app',
    iat: now,
    exp: now + (60 * 60 * 24), // 24 horas
    aud: 'pos-frontend',
    sub: userId,
    Role: role
  }

  return jwt.sign(payload, JWT_SECRET)
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload
  } catch {
    return null
  }
}
