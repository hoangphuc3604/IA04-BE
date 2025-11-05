import jwt, { type Secret, type SignOptions } from 'jsonwebtoken'

const ACCESS_EXPIRES: SignOptions['expiresIn'] = (process.env.ACCESS_EXPIRES || '15m') as SignOptions['expiresIn']
const REFRESH_EXPIRES: SignOptions['expiresIn'] = (process.env.REFRESH_EXPIRES || '7d') as SignOptions['expiresIn']
const JWT_SECRET: Secret = (process.env.JWT_SECRET || 'dev-secret') as Secret
const REFRESH_SECRET: Secret = (process.env.REFRESH_SECRET || 'dev-refresh-secret') as Secret

export interface JwtPayload {
  sub: string
  email: string
  role?: string
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES })
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES })
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload
}


