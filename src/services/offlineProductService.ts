import { getDB } from './db.js'
import { Product, CreateProductData} from './productService.js'

// Productos en caché 
export const getCachedProducts = async (): Promise<Product[]> => {
  const db = await getDB()
  return db.getAll('products')
}

export const cacheProducts = async (products: Product[]): Promise<void> => {
  const db = await getDB()
  const tx = db.transaction('products', 'readwrite')
  await tx.store.clear()
  await Promise.all(products.map((p) => tx.store.put(p)))
  await tx.done
}

export const updateCachedProduct = async (product: Product): Promise<void> => {
  const db = await getDB()
  await db.put('products', product)
}

export const deleteCachedProduct = async (id: string): Promise<void> => {
  const db = await getDB()
  await db.delete('products', id)
}

// Cola de sincronización
export const enqueueOperation = async (
  operation: 'create' | 'update' | 'delete',
  payload: Record<string, unknown>
): Promise<void> => {
  const db = await getDB()
  await db.add('syncQueue', {
    operation,
    payload,
    timestamp: Date.now()
  })
}

export const getSyncQueue = async () => {
  const db = await getDB()
  return db.getAll('syncQueue')
}

export const clearSyncQueue = async (): Promise<void> => {
  const db = await getDB()
  await db.clear('syncQueue')
}

// Producto optimista para offline
export const createOptimisticProduct = (
  data: CreateProductData,
  businessId: string
): Product => {
  return {
    id: `offline-${Date.now()}`,
    name: data.name,
    price: data.price,
    unitPrice: data.unitPrice,
    businessId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}