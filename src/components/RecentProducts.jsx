import { ProductItem } from "./ProductItem"

export const RecentProducts = ({products, onSelect}) => {

    const recentProducts = [...products]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5)

    return (
        <>
        <h2 className="title-products-list">Últimos Productos Modificados </h2>
        <ul className="search-results">
              {recentProducts.map((p) => (
                <ProductItem
                    key={p.id}
                    product={p}
                    onSelect={onSelect}
                    showPrice={true}
                />
              ))}
            </ul>
        </>

    )
}
