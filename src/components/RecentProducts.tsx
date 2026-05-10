import { Product } from "../services/productService";
import { relativeDate } from "../utils/date";
import { formatARS } from "../utils/format";

interface RecentProductsProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export const RecentProducts = ({ products, onSelect }: RecentProductsProps) => {
  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <>
      <div className="section-label">
        <span className="section-label-title">Editados recién</span>
        <span className="section-label-count">{recentProducts.length}</span>
      </div>
      <div className="recent-row">
        {recentProducts.map((p, index) => (
          <button
            key={p.id}
            className={`recent-chip ${index === 0 ? "is-newest" : ""}`}
            onClick={() => onSelect(p)}
          >
            <span className="recent-chip-time">
              {relativeDate(p.updatedAt)}
            </span>
            <span className="recent-chip-name">{p.name}</span>
            <span className="recent-chip-price">{formatARS(p.price)}</span>
          </button>
        ))}
      </div>
    </>
  );
};
