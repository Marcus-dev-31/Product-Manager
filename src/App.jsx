import "./styles/App.css";
import { useState } from "react";
import { AddProductModal } from "./components/AddProductModal";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { useProducts } from "./hooks/useProducts";
import { SearchInput } from "./components/SearchInput";
import { ProductList } from "./components/ProductList";
import { RecentProducts } from "./components/RecentProducts";
import { Toast } from "./components/Toast";
import { BottomBar } from "./components/BottomBar";

function App() {
  const {
    products,
    duplicateError,
    addProduct,
    handleEdit,
    handleDelete,
    clearError,
    importProducts
  } = useProducts();
  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState("");

  const handleTextChange = (e) => {
    setQuery(e.target.value);
  };

  const handleAdd = () => setIsAddOpen(true);

  const handleAddProduct = (name, price, unitPrice) => {
    const succes = addProduct(name, price, unitPrice);
    if (succes) {
      closeModal();
      showToast("Producto Agregado");
    }
  };

  const handleEditProduct = (newPrice, newUnitPrice) => {
    handleEdit(selectedProduct.id, newPrice, newUnitPrice);
    setSelectedProduct((prev) => ({ ...prev, price: Number(newPrice), unitPrice: newUnitPrice ? Number(newUnitPrice) : prev.unitPrice }));
  };

  const handleDeleteProduct = (id) => {
    handleDelete(id);
    closeDetailModal();
    showToast("Producto Eliminado");
  };

  const handleExport = () => {
    const data = localStorage.getItem("products");
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "productos.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const closeModal = () => {
    setIsAddOpen(false);
    clearError();
  };

  const closeDetailModal = () => {
    setSelectedProduct(null);
    setQuery("");
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const filteredProducts = products.filter((p) => {
    if (query === "") return false;

    return p.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gestor de Precios</h1>
        <span className="business-name">Delivery 31</span>
      </header>

      <main className="app-main">
        <section className="search-section">
          <SearchInput
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
            <span className="product-count">
              Total Productos Agregados: {products.length}
            </span>
          </div>

          {products.length >= 5 && (
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

      {/* modales */}

      {isAddOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <AddProductModal
              onClose={closeModal}
              onAdd={handleAddProduct}
              duplicateError={duplicateError}
            />
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <ProductDetailModal
              onClose={closeDetailModal}
              onEdit={handleEditProduct}
              product={selectedProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        </div>
      )}

      <BottomBar onExport={handleExport} onImport={importProducts} />

      <Toast message={toast} />
    </div>
  );
}

export default App;
