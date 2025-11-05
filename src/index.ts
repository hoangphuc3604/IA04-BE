import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRouter from './routes/auth'

dotenv.config()

const app = express()

// Explicit CORS for deployed FE
const allowedOrigins = [
  'http://localhost:5173',
  'https://ia04-fe.onrender.com',
]
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true) // allow non-browser tools
    if (allowedOrigins.includes(origin)) return cb(null, true)
    return cb(new Error('Not allowed by CORS'))
  },
  credentials: false,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}))
// Ensure preflight handled
app.options('*', cors({
  origin: allowedOrigins,
  credentials: false,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}))
app.use(express.json())

app.use('/auth', authRouter)

const PORT = process.env.PORT || 3001
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ia04'

async function start() {
  await mongoose.connect(MONGO_URI)
  console.log('MongoDB connected')
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})


