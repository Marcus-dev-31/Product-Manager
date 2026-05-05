import "./styles/App.css";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { AddProductModal } from "./components/AddProductModal";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { useProducts } from "./hooks/useProducts";
import { SearchBar } from "./components/SearchBar";
import { ProductList } from "./components/ProductList";
import { RecentProducts } from "./components/RecentProducts";
import { Toast } from "./components/Toast";

function App() {
  const {
    products,
    loading,
    error,
    duplicateError,
    addProduct,
    handleEdit,
    handleDelete,
    clearError,
  } = useProducts();

  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState("");

  const handleTextChange = (e) => setQuery(e.target.value);
  const handleAdd = () => setIsAddOpen(true);

  const handleAddProduct = async (name, price, unitPrice) => {
    const success = await addProduct(name, price, unitPrice);
    if (success) {
      closeModal();
      showToast("Producto Agregado");
    }
  };

  const handleEditProduct = async (newPrice, newUnitPrice) => {
    await handleEdit(selectedProduct.id, newPrice, newUnitPrice);
    setSelectedProduct((prev) => ({
      ...prev,
      price: Number(newPrice),
      unitPrice: newUnitPrice ? Number(newUnitPrice) : prev.unitPrice,
    }));
  };

  const handleDeleteProduct = async (id) => {
    await handleDelete(id);
    closeDetailModal();
    showToast("Producto Eliminado");
  };

  const closeModal = () => {
    setIsAddOpen(false);
    clearError();
  };

  const closeDetailModal = () => setSelectedProduct(null);

  const showToast = (message) => setToast(message);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredProducts = products.filter((p) => {
    if (query === "") return false;
    return p.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="app">
      {loading && <div className="app-loading">Cargando productos...</div>}
      {error && <div className="app-error">{error}</div>}
      <header className="app-header">
        <div>
          <h1>Gestor de Precios</h1>
          <span className="product-count">
            Total Productos: {products.length}
          </span>
        </div>
        <span className="business-name">Delivery 31</span>
      </header>

      <main className="app-main">
        <section className="search-section">
          <SearchBar
            value={query}
            onChange={handleTextChange}
            onClick={handleAdd}
          />
          <div className="search-info">
            {!query && (
              <p className="search-hint">
                Escribe el nombre de un producto para buscarlo.
              </p>
            )}
          </div>

          {!query && products.length >= 5 && (
            <RecentProducts products={products} onSelect={setSelectedProduct} />
          )}

          {filteredProducts.length > 0 && (
            <ProductList
              products={filteredProducts}
              onSelect={setSelectedProduct}
            />
          )}

          {query && filteredProducts.length === 0 && (
            <p className="empty-results">No se encontraron productos</p>
          )}
        </section>
      </main>

      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            className="modal-overlay"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <AddProductModal
                onClose={closeModal}
                onAdd={handleAddProduct}
                duplicateError={duplicateError}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="modal-overlay"
            onClick={closeDetailModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <ProductDetailModal
                onClose={closeDetailModal}
                onEdit={handleEditProduct}
                product={selectedProduct}
                onDelete={handleDeleteProduct}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast message={toast} />
    </div>
  );
}

export default App;
