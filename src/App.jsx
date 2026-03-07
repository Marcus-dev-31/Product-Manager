import "./App.css";
import { useState } from "react";
import { AddProductModal } from "./components/AddProductModal";

function App() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleTextChange = (e) => {
    setQuery(e.target.value);
  };

  const handleAdd = () => setIsAddOpen(true);

  const closeModal = () => setIsAddOpen(false);

  const takeData = (name, price) => {
    const clean = name.trim();
    if(!clean) return;
    
    const newProduct = {
      id: crypto.randomUUID(),
      name: clean,
      price: price
    }

    setProducts( (prev) => [...prev, newProduct] );
    closeModal();
  }

  return (
    <main>
      <h1>App Control Precios</h1>

      <input
        type="search"
        placeholder="Buscar Producto..."
        value={query}
        onChange={handleTextChange}
      />

      <button onClick={handleAdd}>Agregar</button>

      {isAddOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <AddProductModal
            
              onClose={closeModal}
              onAdd={takeData}
            />
          </div>
          
        </div>
      )}
    </main>
  );
}

export default App;
