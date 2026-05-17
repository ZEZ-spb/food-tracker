import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRouter from './modules/auth/auth.router'
import productsRouter from './modules/products/products.router'
import transactionsRouter from './modules/transactions/transactions.router'
import { errorHandler } from './middlewares/errorHandler'
import { AppDataSource } from './config/database'

dotenv.config()

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://fortunate-light-production-3396.up.railway.app'
  ]
}))

app.use(express.json())

app.get('/api/health', async (req, res) => {
    try {
        await AppDataSource.query('SELECT 1')
        res.json({ status: 'ok' })
    } catch (error) {
        res.status(500).json({ status: 'error' })
    }
})

app.use('/api/auth', authRouter)
app.use('/api/products', productsRouter)
app.use('/api/transactions', transactionsRouter)

app.use(errorHandler)

export default app