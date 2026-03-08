import { useState } from "react";

export const AddProductModal = ({ onClose, onAdd, duplicateError }) => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");

  const handleNameChange = (e) => setProductName(e.target.value);
  const handlePriceChange = (e) => setPrice(e.target.value);

  return (
    <div className="modal">
      <div className="modal-header">
        <h2>Delivery 31</h2>
      </div>

      <div className="modal-body">
        <div className="form-group">
          <label htmlFor="name">Nombre del producto</label>
          <input
            id="name"
            type="text"
            autoFocus
            placeholder="Ingrese el nombre..."
            value={productName}
            onChange={handleNameChange}
            className="input-field"
          />
          {duplicateError && <p className="error-message">{duplicateError}</p>}
        </div>

        

        <div className="form-group">
          <label htmlFor="price">Precio</label>
          <div className="input-prefix">
            <span>$</span>
            <input
              id="price"
              type="number"
              placeholder="Ingrese el precio"
              value={price}
              onChange={handlePriceChange}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button
          className="btn-confirm"
          onClick={() => onAdd(productName, price)}
        >
          Confirmar
        </button>
        <button className="btn-cancel" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};
