import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products.controller.js'

const router = Router()

router.use(authenticate)

router.get('/', getProducts)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router