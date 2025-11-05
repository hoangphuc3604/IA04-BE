import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { User } from '../models/User'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../services/token'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
})

router.post('/register', async (req, res) => {
  const parse = authSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ message: 'Invalid payload' })
  const { email, password, name } = parse.data
  const exists = await User.findOne({ email })
  if (exists) return res.status(409).json({ message: 'Email already used' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ email, name, passwordHash })
  const payload = { sub: user.id, email: user.email, role: user.role }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)
  return res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    tokens: { accessToken, refreshToken },
  })
})

router.post('/login', async (req, res) => {
  const parse = authSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ message: 'Invalid payload' })
  const { email, password } = parse.data
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
  const payload = { sub: user.id, email: user.email, role: user.role }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)
  return res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    tokens: { accessToken, refreshToken },
  })
})

router.post('/refresh', async (req, res) => {
  const refreshToken = req.body?.refreshToken as string | undefined
  if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' })
  try {
    const payload = verifyRefreshToken(refreshToken)
    const accessToken = signAccessToken({ sub: payload.sub, email: payload.email, role: payload.role })
    return res.json({ accessToken })
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' })
  }
})

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.sub
  const user = await User.findById(userId).lean()
  if (!user) return res.status(404).json({ message: 'Not found' })
  return res.json({ id: user._id.toString(), email: user.email, name: user.name, role: user.role })
})

router.post('/logout', (_req, res) => {
  // Stateless JWT: nothing to do server-side; client should clear tokens
  return res.status(204).end()
})

export default router


