import { useState } from "react";
import { Pencil, Trash2, Calendar, X } from "lucide-react";
import { Button } from "./Button";

export const ProductDetailModal = ({ onClose, product, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState("");
  const [newUnitPrice, setNewUnitPrice] = useState("");
  const [isDelete, setIsDelete] = useState(false);

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
      <div className="modal-handle" />
      <div className="modal-header">
        <h2>{product.name}</h2>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
      </div>

      <div className="modal-body">
        <div className="product-detail-card">
          <div className="product-detail-row">
            <span className="product-name">{product.name}</span>
            {!isEditing && <span className="product-price">${product.price}</span>}
          </div>

          {isEditing && (
            <div className="edit-prices">
              <div className="input-prefix">
                <span>$</span>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="input-field"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleConfirmEdit();
                  }}
                />
              </div>

              {product.unitPrice && (
                <div className="input-prefix">
                  <span>$</span>
                  <input
                    type="number"
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(e.target.value)}
                    className="input-field"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleConfirmEdit();
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {product.unitPrice && !isEditing && (
            <div className="product-detail-row">
              <span className="product-name">Precio Unitario</span>
              <span className="product-price">${product.unitPrice}</span>
            </div>
          )}

          <div className="product-dates">
            <p className="date-item">
              <Calendar size={13} /> Creado: {new Date(product.createdAt).toLocaleDateString()}
            </p>
            <p className="date-item">
              <Calendar size={13} /> Editado por última vez:{" "}
              {new Date(product.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {isDelete && (
          <p className="delete-warning">
            ¿Estás seguro que querés eliminar este producto?
          </p>
        )}
      </div>

      <div className="modal-footer">
        {isEditing ? (
          <>
            <Button variant="confirm" onClick={handleConfirmEdit}>
              Confirmar
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
            <Button variant="confirm" onClick={() => setIsEditing(true)}>
              <Pencil size={16} /> Editar Precio
            </Button>
            <Button variant="cancel" onClick={() => setIsDelete(true)}>
              <Trash2 size={16} /> Eliminar
            </Button>
          </>
        )}
      </div>
    </>
  );
};
