import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import productsRouter from './routes/products.routes.js'
import authRoutes from './routes/auth.routes.js'
import { businessRouter } from './routes/business.routes.js'
import { teamRouter } from './routes/team.routes.js'
import { emailRouter } from './routes/email.routes.js'

const app = express()
const PORT = 3000

app.use(cors({
    origin: ['http://localhost:5173', 'https://precify-eta.vercel.app']
}))

app.use(express.json())

app.use('/api/products', productsRouter)
app.use('/api/auth', authRoutes)
app.use('/api/business', businessRouter)
app.use('/api/team', teamRouter)
app.use('/api/email', emailRouter)

app.get('/', (req, res) => {
    res.json({ message: 'API funcionando' })
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})