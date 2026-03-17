import { Button } from "./Button";

export const SearchInput = ({ value, onChange, onClick }) => {
  return (
    <div className="search-bar">
      <input
        className="input-field"
        type="search"
        placeholder="Buscar Producto..."
        value={value}
        onChange={onChange}
      />
      <Button variant="add" onClick={onClick}>+ Agregar Producto</Button>
    </div>
  );
};
