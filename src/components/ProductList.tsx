import { ChevronRight } from "lucide-react";
import { Product } from "../services/productService";
import { relativeDate } from "../utils/date";
import { formatARS } from "../utils/format";

interface ProductListProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export const ProductList = ({ products, onSelect }: ProductListProps) => {
  return (
    <>
      <div className="section-label">
        <span className="section-label-title">Todos los productos</span>
        <span className="section-label-count">{products.length}</span>
      </div>
      <div className="products-container">
        {products.map((p) => (
          <button
            key={p.id}
            className="product-row"
            onClick={() => onSelect(p)}
          >
            <div className="product-left">
              <div className="product-avatar">{p.name.charAt(0)}</div>
              <div className="product-info">
                <span className="product-name">{p.name}</span>
                <span className="product-date">
                  {relativeDate(p.updatedAt)}
                </span>
              </div>
            </div>
            <div className="product-right">
              <span className="product-price">{formatARS(p.price)}</span>
              <ChevronRight size={16} className="product-chevron" />
            </div>
          </button>
        ))}
      </div>
    </>
  );
};
