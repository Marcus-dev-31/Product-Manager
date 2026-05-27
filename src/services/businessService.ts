const API_URL = 'http://localhost:3000/api/business'

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token')
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

export const updateBusiness = async (name: string): Promise<{ businessName: string }> => {
    const res = await fetch(API_URL, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name })
    })
    if (!res.ok) throw new Error('Error al actualizar el negocio')
    return res.json()
}