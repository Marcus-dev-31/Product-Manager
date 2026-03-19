import { ChevronRight } from "lucide-react";

export const ProductList = ({ products, onSelect }) => {
  return (
    <ul className="search-results">
      {products.map((p) => (
        <li key={p.id} className="search-item" onClick={() => onSelect(p)}>
          <span className="item-name">{p.name}</span>
          <div className="item-price-wrap">
            <span className="item-price">${p.price}</span>
            <ChevronRight size={16} />
          </div>
        </li>
      ))}
    </ul>
  );
};
