import {
  getCachedProducts,
  cacheProducts,
  updateCachedProduct,
  deleteCachedProduct,
  enqueueOperation,
  createOptimisticProduct,
} from "./offlineProductService.js";
import { apiFetch } from "../utils/http.js";
import { API_URL } from "../config.js";

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

export interface PriceHistoryEntry {
  id: string;
  price: number;
  productId: string;
  createdAt: string;
}

const PRODUCTS_URL = `${API_URL}/api/products`;

export const getProducts = async (): Promise<Product[]> => {
  if (!navigator.onLine) {
    return getCachedProducts();
  }
  const res = await apiFetch(PRODUCTS_URL);
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
  const res = await apiFetch(PRODUCTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
  const res = await apiFetch(`${PRODUCTS_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
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
  const res = await apiFetch(`${PRODUCTS_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
};

export const getProductHistory = async (
  id: string,
): Promise<PriceHistoryEntry[]> => {
  const res = await apiFetch(`${PRODUCTS_URL}/${id}/history`);
  if (!res.ok) throw new Error("Error al obtener el historial");
  return res.json();
};
