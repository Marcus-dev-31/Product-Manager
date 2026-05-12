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
import { BottomBar } from "./components/BottomBar";
import { Product } from "./services/productService";
import { TrendingUp } from "lucide-react";
import { formatARS } from "./utils/format";


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

  const [query, setQuery] = useState<string>("");
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<string>("");

  const lastEdit =
    products.length > 0
      ? [...products].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )[0]
      : null;

  const handleAdd = () => setIsAddOpen(true);

  const handleAddProduct = async (
    name: string,
    price: string,
    unitPrice: string,
  ) => {
    const success = await addProduct(name, price, unitPrice);
    if (success) {
      closeModal();
      showToast("Producto agregado");
    }
  };

  const handleEditProduct = async (newPrice: string, newUnitPrice: string) => {
    if (!selectedProduct) return;
    await handleEdit(selectedProduct.id, newPrice, newUnitPrice);
    setSelectedProduct((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        price: Number(newPrice),
        unitPrice: newUnitPrice ? Number(newUnitPrice) : prev.unitPrice,
      };
    });
    showToast("Precio actualizado");
  };

  const handleDeleteProduct = async (id: string) => {
    await handleDelete(id);
    closeDetailModal();
    showToast("Producto eliminado");
  };

  const closeModal = () => {
    setIsAddOpen(false);
    clearError();
  };

  const closeDetailModal = () => setSelectedProduct(null);
  const showToast = (message: string) => setToast(message);

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

      <header className="hero-card">
        <div className="hero-blob" aria-hidden />
        <div className="hero-row">
          <div>
            <span className="hero-eyebrow">Delivery 31</span>
            <h1>Gestor de Precios</h1>
          </div>
          <div className="hero-counter">
            <span className="hero-counter-num">{products.length}</span>
            <span className="hero-counter-label">Items</span>
          </div>
        </div>
        {lastEdit && (
          <div className="hero-trend">
            <TrendingUp size={13} />
            <span className="hero-trend-name">
              Último cambio: {lastEdit.name}
            </span>
            <span className="hero-trend-price">
              {formatARS(lastEdit.price)}
            </span>
          </div>
        )}
      </header>

      <main className="app-main">
        <div className="search-sticky">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
          />
        </div>

        {!query && products.length === 0 && !loading && (
          <p className="search-hint">
            No tenés productos aún. ¡Agregá el primero!
          </p>
        )}

        {!query && products.length >= 5 && (
          <RecentProducts products={products} onSelect={setSelectedProduct} />
        )}

        {!query && products.length > 0 && (
          <ProductList products={products} onSelect={setSelectedProduct} />
        )}

        {query && filteredProducts.length > 0 && (
          <ProductList
            products={filteredProducts}
            onSelect={setSelectedProduct}
          />
        )}

        {query && filteredProducts.length === 0 && (
          <p className="empty-results">No se encontraron productos</p>
        )}
      </main>

      <BottomBar onAdd={handleAdd} />

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
