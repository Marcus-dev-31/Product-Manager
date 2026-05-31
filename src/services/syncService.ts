import { getSyncQueue, clearSyncQueue, cacheProducts } from './offlineProductService.js'
import { getProducts, createProduct, updateProduct, deleteProduct } from './productService.js'
import { CreateProductData, UpdateProductData } from './productService.js'

export const syncWithServer = async (): Promise<void> => {
  const queue = await getSyncQueue()

  if (queue.length === 0) return

  for (const item of queue) {
    try {
      if (item.operation === 'create') {
        await createProduct(item.payload as unknown as CreateProductData)
      }

      if (item.operation === 'update') {
        const { id, ...data } = item.payload as unknown as { id: string } & UpdateProductData
        await updateProduct(id, data)
      }

      if (item.operation === 'delete') {
        await deleteProduct(item.payload.id as string)
      }
    } catch (error) {
      console.error('Error sincronizando operación:', item, error)
    }
  }

  await clearSyncQueue()

  const freshProducts = await getProducts()
  await cacheProducts(freshProducts)
}

export const initSyncListener = (): void => {
  window.addEventListener('online', () => {
    syncWithServer()
  })
}