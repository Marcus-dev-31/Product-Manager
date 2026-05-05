import { useState, useEffect } from 'react'
import * as productService from '../services/productService'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [duplicateError, setDuplicateError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts()
        setProducts(data)
      } catch (err) {
        setError('Error al cargar los productos')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const addProduct = async (name, price, unitPrice) => {
    const clean = name.trim()
    if (!clean) return false
    if (!price || Number(price) <= 0) return false

    const exist = products.some(
      (p) => p.name.toLowerCase() === clean.toLowerCase()
    )
    if (exist) {
      setDuplicateError('Éste producto ya existe')
      return false
    }

    try {
      const newProduct = await productService.createProduct({
        name: clean,
        price: Number(price),
        unitPrice: unitPrice ? Number(unitPrice) : undefined
      })
      setProducts((prev) => [...prev, newProduct])
      return true
    } catch (err) {
      setError('Error al crear el producto')
      return false
    }
  }

  const handleEdit = async (id, newPrice, newUnitPrice) => {
    try {
      const updated = await productService.updateProduct(id, {
        price: Number(newPrice),
        unitPrice: newUnitPrice ? Number(newUnitPrice) : undefined
      })
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      )
    } catch (err) {
      setError('Error al actualizar el producto')
    }
  }

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      setError('Error al eliminar el producto')
    }
  }

  const clearError = () => setDuplicateError('')

  return {
    products,
    loading,
    error,
    duplicateError,
    addProduct,
    handleEdit,
    handleDelete,
    clearError
  }
}