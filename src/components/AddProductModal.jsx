import { useState } from "react";

export const AddProductModal = ({ onClose, onAdd }) => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");

  const handleNameChange = (e) => setProductName(e.target.value);
  const handlePriceChange = (e) => setPrice(e.target.value);

  return (
    <div className="modal">
      <h2>Nombre del negocio</h2>

      <label htmlFor="name">Nombre del producto</label>
      <input
        id="name"
        type="text"
        placeholder="Ingrese el nombre..."
        value={productName}
        onChange={handleNameChange}
      />

      <label htmlFor="price">Precio</label>
      <div className="input-prefix">
        <span>$</span>
        <input
          id="price"
          type="number"
          placeholder="0"
          value={price}
          onChange={handlePriceChange}
        />
      </div>

      <button onClick={() => onAdd(productName, price)}>Confirmar</button>
      <button onClick={onClose}>Cerrar</button>
    </div>

    
  );
};
