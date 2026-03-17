export const ProductItem = ({ product, onSelect, showPrice = false }) => {
  return (
    <li
      key={product.id}
      onClick={() => onSelect(product)}
      className="search-item"
    >
     <span>{product.name}</span> 
     {showPrice && <span className="item-price">${product.price}</span>}
    </li>
  );
};
