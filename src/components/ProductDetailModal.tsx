import { useState } from "react";
import { Pencil, Trash2, Calendar, Clock, X } from "lucide-react";
import { Button } from "./Button";
import { Product } from "../services/productService";
import { relativeDate } from "../utils/date";
import { formatARS } from "../utils/format";

interface ProductDetailModalProps {
  onClose: () => void;
  product: Product;
  onDelete: (id: string) => void;
  onEdit: (newPrice: string, newUnitPrice: string) => void;
}

export const ProductDetailModal = ({
  onClose,
  product,
  onDelete,
  onEdit,
}: ProductDetailModalProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newPrice, setNewPrice] = useState<string>("");
  const [newUnitPrice, setNewUnitPrice] = useState<string>("");
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewPrice("");
    setNewUnitPrice("");
  };

  const handleConfirmEdit = () => {
    onEdit(newPrice, newUnitPrice);
    setNewPrice("");
    setNewUnitPrice("");
    setIsEditing(false);
  };

  return (
    <>
      

      <div className="detail-hero">
        <div className="modal-handle" />
        <div className="detail-blob" aria-hidden />
        <div className="detail-hero-row">
          <div>
            <span className="detail-hero-eyebrow">
              {isEditing ? "Editando" : "Producto"}
            </span>
            <h2>{product.name}</h2>
          </div>
          <button className="detail-hero-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="detail-body">
        {!isEditing ? (
          <>
            <div className="detail-price-row">
              <span className="detail-price-label">Precio</span>
              <span className="detail-price-value">
                {formatARS(product.price)}
              </span>
            </div>

            {product.unitPrice && (
              <div className="detail-unit-row">
                <span className="detail-unit-label">Precio Unitario</span>
                <span className="detail-unit-value">
                  {formatARS(product.unitPrice)}
                </span>
              </div>
            )}

            <div className="detail-dates">
              <span className="date-item">
                <Calendar size={13} /> creado {relativeDate(product.createdAt)}
              </span>
              <span className="date-item">
                <Clock size={13} /> editado {relativeDate(product.updatedAt)}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Precio</label>
              <div className="input-prefix">
                <span>$</span>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleConfirmEdit();
                  }}
                />
              </div>
            </div>

            {product.unitPrice && (
              <div className="form-group">
                <label>Precio Unitario</label>
                <div className="input-prefix">
                  <span>$</span>
                  <input
                    type="number"
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleConfirmEdit();
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isDelete && (
        <div className="delete-warning-box">¿Eliminar este producto?</div>
      )}

      <div className="detail-footer">
        {isEditing ? (
          <>
            <Button variant="confirm" onClick={handleConfirmEdit}>
              <Pencil size={15} /> Guardar
            </Button>
            <Button variant="cancel" onClick={handleCancelEdit}>
              Cancelar
            </Button>
          </>
        ) : isDelete ? (
          <>
            <Button variant="confirm" onClick={() => onDelete(product.id)}>
              Sí, eliminar
            </Button>
            <Button variant="cancel" onClick={() => setIsDelete(false)}>
              No
            </Button>
          </>
        ) : (
          <>
            <Button variant="cancel" onClick={() => setIsDelete(true)}>
              <Trash2 size={15} /> Eliminar
            </Button>
            <Button variant="confirm" onClick={() => setIsEditing(true)}>
              <Pencil size={15} /> Editar precio
            </Button>
          </>
        )}
      </div>
    </>
  );
};
