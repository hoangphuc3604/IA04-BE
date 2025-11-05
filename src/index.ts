import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRouter from './routes/auth'

dotenv.config()

const app = express()
app.use(cors({ origin: '*', credentials: false }))
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


