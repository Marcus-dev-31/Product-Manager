import express from 'express'
import productsRouter from './src/routes/products.routes.js'

const app = express()
const PORT = 3000

app.use(express.json())

app.use('/api/products', productsRouter)

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})