import { useState, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (name: string, price: string, unitPrice: string) => void;
  duplicateError: string;
}

export const AddProductModal = ({
  onClose,
  onAdd,
  duplicateError,
}: AddProductModalProps) => {
  const [productName, setProductName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [unitPrice, setUnitPrice] = useState<string>("");

  const priceRef = useRef<HTMLInputElement>(null);
  const unitPriceRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="modal-handle" />

      <div className="add-modal-header">
        <h2>Agregar Producto</h2>
        <button className="add-modal-close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="add-modal-body">
        <div className="form-group">
          <label>Nombre del producto</label>
          <input
            type="text"
            autoFocus
            placeholder="Ingrese el nombre..."
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="input-field"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                priceRef.current?.focus();
              }
            }}
          />
          {duplicateError && <p className="error-message">{duplicateError}</p>}
        </div>

        <div className="form-group">
          <label>Precio</label>
          <div className="input-prefix">
            <span>$</span>
            <input
              ref={priceRef}
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  unitPriceRef.current?.focus();
                }
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Precio Unitario</label>
          <div className="input-prefix">
            <span>$</span>
            <input
              ref={unitPriceRef}
              type="number"
              placeholder="0"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onAdd(productName, price, unitPrice);
              }}
            />
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <Button variant="neutral" onClick={onClose}>
          Cerrar
        </Button>
        <Button
          variant="confirm"
          onClick={() => onAdd(productName, price, unitPrice)}
        >
          Confirmar
        </Button>
      </div>
    </>
  );
};
