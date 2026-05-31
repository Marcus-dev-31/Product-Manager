import { openDB, DBSchema, IDBPDatabase } from 'idb'

const DB_NAME = 'precify-db'
const DB_VERSION = 1

interface PrecifyDB extends DBSchema {
  products: {
    key: string
    value: {
      id: string
      name: string
      price: number
      unitPrice?: number
      businessId: string
      createdAt: string
      updatedAt: string
    }
  }
  syncQueue: {
    key: number
    value: {
      id?: number
      operation: 'create' | 'update' | 'delete'
      payload: Record<string, unknown>
      timestamp: number
    }
    autoIncrement: true
  }
}

let dbInstance: IDBPDatabase<PrecifyDB> | null = null

export const getDB = async (): Promise<IDBPDatabase<PrecifyDB>> => {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<PrecifyDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', {
          keyPath: 'id',
          autoIncrement: true
        })
      }
    }
  })

  return dbInstance
}