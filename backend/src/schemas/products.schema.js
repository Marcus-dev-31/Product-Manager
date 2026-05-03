import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  price: z.number().positive('El precio debe ser mayor a cero'),
  unitPrice: z.number().positive('El precio unitario debe ser mayor a cero').optional()
})

export const updateProductSchema = z.object({
  price: z.number().positive('El precio debe ser mayor a cero'),
  unitPrice: z.number().positive('El precio unitario debe ser mayor a cero').optional()
})