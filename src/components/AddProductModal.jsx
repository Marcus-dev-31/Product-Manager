import { useState, useRef } from "react";
import { Button } from "./Button";

export const AddProductModal = ({ onClose, onAdd, duplicateError }) => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const priceRef = useRef(null);
  const unitPriceRef = useRef(null);

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
            onChange={(e) => setProductName(e.target.value)}
            className="input-field"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (priceRef.current) priceRef.current.focus();
              }
            }}
          />
          {duplicateError && <p className="error-message">{duplicateError}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Precio</label>
          <div className="input-prefix">
            <span>$</span>
            <input
              id="price"
              ref={priceRef}
              type="number"
              placeholder="Ingrese el precio"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-field"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (unitPriceRef.current) unitPriceRef.current.focus();
                }
              }}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="unitPrice">Precio Unitario</label>
          <div className="input-prefix">
            <span>$</span>
            <input
              id="unitPrice"
              ref={unitPriceRef}
              type="number"
              placeholder="Ingrese el precio"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="input-field"
              onKeyDown={(e) => {
                if (e.key === "Enter") onAdd(productName, price, unitPrice);
              }}
            />
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <Button
          variant="confirm"
          onClick={() => onAdd(productName, price, unitPrice)}
        >
          Confirmar
        </Button>
        <Button variant="neutral" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
};
