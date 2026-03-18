import { useState, useEffect } from "react";

const STORAGE_KEY = "products";

export const useProducts = () => {
  const [products, setProducts] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const saved = JSON.parse(raw);
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [duplicateError, setDuplicateError] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = (name, price) => {
    const clean = name.trim();
    if (!clean) return false;
    if (!price || Number(price) <= 0) return false;

    const exist = products.some(
      (p) => p.name.toLowerCase() === clean.toLowerCase(),
    );
    if (exist) {
      setDuplicateError("Éste producto ya existe");
      return false;
    }

    const newProduct = {
      id: crypto.randomUUID(),
      name: clean,
      price: Number(price),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProducts((prev) => [...prev, newProduct]);
    return true;
  };

  const handleEdit = (id, newPrice) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, price: Number(newPrice), updatedAt: new Date() }
          : p,
      ),
    );
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const clearError = () => setDuplicateError("");

  const importProducts = (file) => {
  const reader = new FileReader()
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result)
      if (Array.isArray(data)) {
        setProducts(data)
      }
    } catch {
      // archivo inválido
    }
  }
  reader.readAsText(file)
}

  return {
    products,
    duplicateError,
    addProduct,
    handleEdit,
    handleDelete,
    clearError,
    importProducts
  };
};
