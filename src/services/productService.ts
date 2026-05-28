const API_URL = 'https://product-manager-production-e899.up.railway.app/api/products'

export interface Product {
    id: string
    name: string
    price: number
    unitPrice?: number
    businessId: string
    createdAt: string
    updatedAt: string
}

export interface CreateProductData {
    name: string
    price: number
    unitPrice?: number
}

export interface UpdateProductData {
    price: number
    unitPrice?: number
}

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token')
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

export const getProducts = async (): Promise<Product[]> => {
    const res = await fetch(API_URL, {
        headers: getAuthHeaders()
    })
    if (!res.ok) throw new Error('Error al obtener productos')
    return res.json()
}

export const createProduct = async (data: CreateProductData): Promise<Product> => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Error al crear producto')
    return res.json()
}

export const updateProduct = async (id: string, data: UpdateProductData): Promise<Product> => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Error al actualizar producto')
    return res.json()
}

export const deleteProduct = async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    })
    if (!res.ok) throw new Error('Error al eliminar producto')
}