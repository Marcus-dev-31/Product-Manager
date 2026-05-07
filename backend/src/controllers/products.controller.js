import { prisma } from '../lib/prisma.js'
import { createProductSchema, updateProductSchema } from '../schemas/products.schema.js'
import { ZodError } from 'zod'

export async function getProducts(req, res) {
    try {
        const products = await prisma.product.findMany({
            where: { businessId: req.user.businessId },
            orderBy: { createdAt: 'desc' }
        })
        res.json(products)
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' })
    }
}

export async function createProduct(req, res) {
    try {
        const data = createProductSchema.parse(req.body)

        const product = await prisma.product.create({
            data: {
                ...data,
                businessId: req.user.businessId
            }
        })
        res.status(201).json(product)
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: error.issues })
        }
        res.status(500).json({ error: 'Error del servidor' })
    }
}

export async function updateProduct(req, res) {
    try {
        const data = updateProductSchema.parse(req.body)

        const product = await prisma.product.findFirst({
            where: {
                id: req.params.id,
                businessId: req.user.businessId
            }
        })

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }

        const updated = await prisma.product.update({
            where: { id: req.params.id },
            data
        })
        res.json(updated)
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: error.issues })
        }
        res.status(500).json({ error: 'Error del servidor' })
    }
}

export async function deleteProduct(req, res) {
    try {
        const product = await prisma.product.findFirst({
            where: {
                id: req.params.id,
                businessId: req.user.businessId
            }
        })

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }

        await prisma.product.delete({
            where: { id: req.params.id }
        })
        res.status(204).send()
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' })
    }
}