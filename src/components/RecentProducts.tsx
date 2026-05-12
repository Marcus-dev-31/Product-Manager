import { useRef } from "react";
import { Product } from "../services/productService";
import { relativeDate } from "../utils/date";
import { formatARS } from "../utils/format";

interface RecentProductsProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export const RecentProducts = ({ products, onSelect }: RecentProductsProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const scrollLeft = useRef<number>(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (rowRef.current?.offsetLeft ?? 0);
    scrollLeft.current = rowRef.current?.scrollLeft ?? 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (rowRef.current?.offsetLeft ?? 0);
    const walk = x - startX.current;
    if (rowRef.current) rowRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

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
      <div
        ref={rowRef}
        className="recent-row"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
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
