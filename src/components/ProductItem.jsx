import { ChevronRight } from "lucide-react";

export const ProductItem = ({ product, onSelect, showPrice = false }) => {
  return (
    <li
      onClick={() => onSelect(product)}
      className="search-item"
    >
     <span>{product.name}</span>
     {showPrice && <span className="item-price">${product.price}</span>}
     <ChevronRight size={16} />
    </li>
  );
};
