const API_URL = 'http://localhost:3000/api/products'

export const getProducts = async () => {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error('Error al obtener productos')
  return res.json()
}

export const createProduct = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Error al crear producto')
  return res.json()
}

export const updateProduct = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Error al actualizar producto')
  return res.json()
}

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Error al eliminar producto')
  return res.json()
}