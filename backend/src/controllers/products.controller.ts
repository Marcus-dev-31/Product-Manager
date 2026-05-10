import { Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { createProductSchema, updateProductSchema, CreateProductInput, UpdateProductInput } from '../schemas/products.schema.js'
import { AuthRequest } from '../middleware/auth.middleware.js'
import { ZodError } from 'zod'

export async function getProducts(req: AuthRequest, res: Response): Promise<void> {
    try {
        const products = await prisma.product.findMany({
            where: { businessId: req.user!.businessId },
            orderBy: { createdAt: 'desc' }
        })
        res.json(products)
    } catch {
        res.status(500).json({ error: 'Error del servidor' })
    }
}

export async function createProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
        const data: CreateProductInput = createProductSchema.parse(req.body)

        const product = await prisma.product.create({
            data: {
                ...data,
                businessId: req.user!.businessId
            }
        })
        res.status(201).json(product)
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ error: error.issues })
            return
        }
        res.status(500).json({ error: 'Error del servidor' })
    }
}

export async function updateProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
        const data: UpdateProductInput = updateProductSchema.parse(req.body)

        const product = await prisma.product.findFirst({
            where: {
                id: req.params.id as string,
                businessId: req.user!.businessId
            }
        })

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' })
            return
        }

        const updated = await prisma.product.update({
            where: { id: req.params.id as string },
            data
        })
        res.json(updated)
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ error: error.issues })
            return
        }
        res.status(500).json({ error: 'Error del servidor' })
    }
}

export async function deleteProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
        const product = await prisma.product.findFirst({
            where: {
                id: req.params.id as string,
                businessId: req.user!.businessId
            }
        })

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' })
            return
        }

        await prisma.product.delete({
            where: { id: req.params.id as string }
        })
        res.status(204).send()
    } catch {
        res.status(500).json({ error: 'Error del servidor' })
    }
}