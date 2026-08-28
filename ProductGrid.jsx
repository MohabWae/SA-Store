import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="empty-products">
        <h2>No products found</h2>
        <p>Try another search or category.</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}

export default ProductGrid;