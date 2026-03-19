import { Search, Plus } from "lucide-react";
import { Button } from "./Button";

export const SearchBar = ({ value, onChange, onClick }) => {
  return (
    <div className="search-bar">
      <div className="search-input-wrap">
        <span className="search-icon"><Search size={18} /></span>
        <input
          className="input-field"
          type="search"
          placeholder="Buscar Producto..."
          value={value}
          onChange={onChange}
        />
      </div>
      <Button variant="add" onClick={onClick}><Plus size={18} /> Agregar Producto</Button>
    </div>
  );
};
