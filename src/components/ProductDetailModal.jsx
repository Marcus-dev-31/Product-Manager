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
    <div>
      <h2>Nombre del negocio</h2>
      <h3>{product.name}</h3>
      {isEditing ? (
        <>
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
          <button onClick={handleConfirmEdit}>✓</button>
          <button onClick={handleCancelEdit}>✗</button>
        </>
      ) : (
        <>
          <p>{product.price}</p>
          <button onClick={() => setIsEditing(true)}>Editar</button>
        </>
      )}

      <p>{new Date(product.createdAt).toLocaleDateString()}</p>
      <p>{new Date(product.updatedAt).toLocaleDateString()}</p>

      {isDelete ? (
        <>
          <p>Estas Seguro?</p>
          <button onClick={onDelete}>✓</button>
          <button onClick={() => setIsDelete(false)}>✗</button>
        </>
      ) : (
        <>
          <button onClick={() => setIsDelete(true)}>Eliminar</button>
        </>
      )}
      
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};
