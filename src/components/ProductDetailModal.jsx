import { useState } from "react";
import { Button } from "./Button";

export const ProductDetailModal = ({ onClose, product, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState("");
  const [isDelete, setIsDelete] = useState(false);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewPrice("");
  };

  const handleConfirmEdit = () => {
    onEdit(newPrice);
    setNewPrice("");
    setIsEditing(false);
  };

  return (
    <>
      <div className="modal-header">
        <h2>Delivery 31</h2>
      </div>

      <div className="modal-body">
        <div className="product-detail-row">
          <span className="product-name">{product.name}</span>

          {isEditing ? (
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
          ) : (
            <span className="product-price">${product.price}</span>
          )}
        </div>

        <div className="product-dates">
          <p className="date-item">
            Creado: {new Date(product.createdAt).toLocaleDateString()}
          </p>
          <p className="date-item">
            Editado por última vez:{" "}
            {new Date(product.updatedAt).toLocaleDateString()}
          </p>
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
              Editar Precio
            </Button>
            <Button variant="cancel" onClick={() => setIsDelete(true)}>
              Eliminar
            </Button>
            <Button variant="neutral" onClick={onClose}>
              Cerrar
            </Button>
          </>
        )}
      </div>
    </>
  );
};
