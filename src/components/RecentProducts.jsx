import { Package, ChevronRight } from "lucide-react";

export const RecentProducts = ({ products, onSelect }) => {

    const recentProducts = [...products]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5)

    return (
        <>
            <h2 className="title-products-list"><span className="title-icon"><Package size={20} /></span> Últimos Productos</h2>
            <ul className="search-results">
                {recentProducts.map((p) => (
                    <li key={p.id} className="product-row" onClick={() => onSelect(p)}>
                        <div className="product-info">
                            <span className="product-name">{p.name}</span>
                            <span className="product-date">Editado: {new Date(p.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="product-price-wrap">
                            <span className="item-price">${p.price}</span>
                            <ChevronRight size={16} />
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}
