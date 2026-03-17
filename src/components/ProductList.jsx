import { ProductItem } from "./ProductItem";

export const ProductList = ({ products, onSelect }) => {
  return (
    <ul className="search-results">
      {products.map((p) => (
        <ProductItem
            key={p.id}
            product={p}
            onSelect={onSelect}
        />
      ))}
    </ul>
  );
};
