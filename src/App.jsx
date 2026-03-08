import "./styles/App.css";
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
  const [duplicateError, setDuplicateError] = useState("")

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const handleTextChange = (e) => {
    setQuery(e.target.value);
  };

  const handleAdd = () => setIsAddOpen(true);

  const closeModal = () => {
    setIsAddOpen(false);
    setDuplicateError("");
  }

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
    setSelectedProduct((prev) => ({ ...prev, price: Number(newPrice) }));
  };

  const takeData = (name, price) => {
    const clean = name.trim();
    if (!clean) return;
    if (!price || Number(price) <= 0) return;

    const exist = products.some(
      (p) => p.name.toLowerCase() === clean.toLowerCase()
    );
    if (exist) {
      setDuplicateError("Éste producto ya existe");
      return;
    }

    const newProduct = {
      id: crypto.randomUUID(),
      name: clean,
      price: Number(price),
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
    <div className="app">
      <header className="app-header">
        <h1>Gestión de Precios</h1>
        <span className="business-name">Delivery 31</span>
      </header>

      <main className="app-main">
        <section className="search-section">
          <div className="search-bar">
            <input
              className="input-field"
              type="search"
              placeholder="Buscar Producto..."
              value={query}
              onChange={handleTextChange}
            />
            <button className="btn-add" onClick={handleAdd}>
              + Agregar producto
            </button>
          </div>

          {filteredProducts.length > 0 && (
            <ul className="search-results">
              {filteredProducts.map((p) => (
                <li
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="search-item"
                >
                  {p.name}
                </li>
              ))}
            </ul>
          )}

          {query && filteredProducts.length === 0 && (
            <p className="empty-results">No se encontraron productos</p>
          )}
        </section>
      </main>

      {/* modales */}

      {isAddOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <AddProductModal onClose={closeModal} onAdd={takeData} duplicateError={duplicateError}/>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <ProductDetailModal
              onClose={closeDetailModal}
              onEdit={handleEdit}
              product={selectedProduct}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
