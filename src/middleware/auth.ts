import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, JwtPayload } from '../services/token'

export interface AuthRequest extends Request {
  user?: JwtPayload
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })
  const token = header.slice(7)
  try {
    const payload = verifyAccessToken(token)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}


