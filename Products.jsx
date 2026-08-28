import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../utils/storage";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const productName = product.name || product.title || "";
    const productCategory = product.category || "";

    const matchesSearch = productName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || productCategory === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main>
      <section className="products-section">
        <div className="section-heading">
          <span className="section-label">OUR PRODUCTS</span>
          <h1>All Products</h1>
          <p>Find the right supplements for your training.</p>
        </div>

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <FilterBar
          category={category}
          setCategory={setCategory}
        />

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            <p>Loading products...</p>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </section>
    </main>
  );
}

export default Products;