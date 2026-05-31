import {
  getCachedProducts,
  cacheProducts,
  updateCachedProduct,
  deleteCachedProduct,
  enqueueOperation,
  createOptimisticProduct,
} from "./offlineProductService.js";

const API_URL =
  "https://product-manager-production-e899.up.railway.app/api/products";

export interface Product {
  id: string;
  name: string;
  price: number;
  unitPrice?: number;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  price: number;
  unitPrice?: number;
}

export interface UpdateProductData {
  price: number;
  unitPrice?: number;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const getProducts = async (): Promise<Product[]> => {
  if (!navigator.onLine) {
    return getCachedProducts();
  }
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener productos");
  const products = await res.json();
  await cacheProducts(products);
  return products;
};

export const createProduct = async (
  data: CreateProductData,
): Promise<Product> => {
  if (!navigator.onLine) {
    const businessId = localStorage.getItem("businessId") ?? "";
    const optimistic = createOptimisticProduct(data, businessId);
    await updateCachedProduct(optimistic);
    await enqueueOperation("create", { ...data });
    return optimistic;
  }
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
};

export const updateProduct = async (
  id: string,
  data: UpdateProductData,
): Promise<Product> => {
  if (!navigator.onLine) {
    const cached = await getCachedProducts();
    const existing = cached.find((p) => p.id === id);
    if (!existing) throw new Error("Producto no encontrado en caché");
    const updated: Product = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await updateCachedProduct(updated);
    await enqueueOperation("update", { id, ...data });
    return updated;
  }
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (!navigator.onLine) {
    await deleteCachedProduct(id);
    await enqueueOperation("delete", { id });
    return;
  }
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
};
