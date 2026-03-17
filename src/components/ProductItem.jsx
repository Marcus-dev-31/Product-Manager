export const ProductItem = ({ product, onSelect }) => {
  return (
    <li
      key={product.id}
      onClick={() => onSelect(product)}
      className="search-item"
    >
      {product.name}
    </li>
  );
};
