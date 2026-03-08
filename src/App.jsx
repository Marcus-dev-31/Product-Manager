import "./App.css";
import { useState, useEffect } from "react";
import { AddProductModal } from "./components/AddProductModal";
import { ProductDetailModal } from "./components/ProductDetailModal";

const STORAGE_KEY = "products";

function App() {
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
  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const handleTextChange = (e) => {
    setQuery(e.target.value);
  };

  const handleAdd = () => setIsAddOpen(true);

  const closeModal = () => setIsAddOpen(false);

  const closeDetailModal = () => {
    setSelectedProduct(null);
    setQuery("");
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    closeDetailModal();
  };

  const handleEdit = (newPrice) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProduct.id
          ? { ...p, price: Number(newPrice), updatedAt: new Date() }
          : p,
      ),
    );
    closeDetailModal();
  };

  const takeData = (name, price) => {
    const clean = name.trim();
    if (!clean) return;

    const newProduct = {
      id: crypto.randomUUID(),
      name: clean,
      price: price,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProducts((prev) => [...prev, newProduct]);
    closeModal();
  };

  const filteredProducts = products.filter((p) => {
    if (query === "") return false;

    return p.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <main>
      <h1>App Control Precios</h1>

      <input
        type="search"
        placeholder="Buscar Producto..."
        value={query}
        onChange={handleTextChange}
      />

      {filteredProducts.map((p) => (
        <div key={p.id} onClick={() => setSelectedProduct(p)}>
          {p.name}
        </div>
      ))}

      <button onClick={handleAdd}>Agregar</button>

      {isAddOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <AddProductModal onClose={closeModal} onAdd={takeData} />
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <ProductDetailModal
              onClose={closeDetailModal}
              onEdit={handleEdit}
              product={selectedProduct}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
