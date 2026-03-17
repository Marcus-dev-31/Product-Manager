import "./styles/App.css";
import { useState } from "react";
import { AddProductModal } from "./components/AddProductModal";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { useProducts } from "./hooks/useProducts";
import { SearchInput } from "./components/SearchInput";
import { ProductList } from "./components/ProductList";
import { RecentProducts } from "./components/RecentProducts";

function App() {
  const {
    products,
    duplicateError,
    addProduct,
    handleEdit,
    handleDelete,
    clearError,
  } = useProducts();
  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleTextChange = (e) => {
    setQuery(e.target.value);
  };

  const handleAdd = () => setIsAddOpen(true);

  const handleAddProduct = (name, price) => {
    const succes = addProduct(name, price);
    if (succes) closeModal();
  };

  const handleEditProduct = (newPrice) => {
    handleEdit(selectedProduct.id, newPrice);
    setSelectedProduct((prev) => ({ ...prev, price: Number(newPrice) }));
  };

  const handleDeleteProduct = (id) => {
    handleDelete(id);
    closeDetailModal();
  };

  const closeModal = () => {
    setIsAddOpen(false);
    clearError();
  };

  const closeDetailModal = () => {
    setSelectedProduct(null);
    setQuery("");
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
              <p className="search-hint">Escribe el nombre de un producto para buscarlo.</p>
            )}
            <span className="product-count">Total Productos Agregados: {products.length}</span>
          </div>

          {products.length >= 5 && (
            <RecentProducts
              products={products}
              onSelect={setSelectedProduct}
            />
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
    </div>
  );
}

export default App;
