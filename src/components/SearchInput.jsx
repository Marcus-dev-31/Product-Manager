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
      <button className="btn-add" onClick={onClick}>
        + Agregar producto
      </button>
    </div>
  );
};
