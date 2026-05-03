import prisma from '../lib/prisma.js'

export const getProducts = async (req, res) => {
  const products = await prisma.product.findMany()
  res.json(products)
}

export const createProduct = async (req, res) => {
  const { name, price, unitPrice } = req.body
  const product = await prisma.product.create({
    data: { name, price, unitPrice }
  })
  res.json(product)
}

export const updateProduct = async (req, res) => {
  const { id } = req.params
  const { price, unitPrice } = req.body
  const product = await prisma.product.update({
    where: { id },
    data: { price, unitPrice }
  })
  res.json(product)
}

export const deleteProduct = async (req, res) => {
  const { id } = req.params
  await prisma.product.delete({
    where: { id }
  })
  res.json({ success: true })
}