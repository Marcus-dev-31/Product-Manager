import { useState } from "react";

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
            />
          </div>
        ) : (
          <span className="product-price">${product.price}</span>
        )}
      </div>

      <div className="product-dates">
        <p className="date-item">Creado: {new Date(product.createdAt).toLocaleDateString()}</p>
        <p className="date-item">Editado por última vez: {new Date(product.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>

    <div className="modal-footer">
      {isEditing ? (
        <>
          <button className="btn-confirm" onClick={handleConfirmEdit}>Confirmar</button>
          <button className="btn-cancel" onClick={handleCancelEdit}>Cancelar</button>
        </>
      ) : isDelete ? (
        <>
          <p>¿Estás seguro?</p>
          <button className="btn-confirm" onClick={() => onDelete(product.id)}>Sí, eliminar</button>
          <button className="btn-cancel" onClick={() => setIsDelete(false)}>No</button>
        </>
      ) : (
        <>
          <button className="btn-confirm" onClick={() => setIsEditing(true)}>Editar precio</button>
          <button className="btn-cancel" onClick={() => setIsDelete(true)}>Eliminar</button>
          <button className="btn-cancel" onClick={onClose}>Cerrar</button>
        </>
      )}
    </div>
  </>
);
};
