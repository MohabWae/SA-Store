import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../utils/storage";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getProducts();
        const found = products.find((item) => String(item.id) === String(id));
        setProduct(found || null);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" }}>
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2>Product not found</h2>
        <button
          className="btn-primary"
          style={{ marginTop: "20px" }}
          onClick={() => navigate("/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const isAvailable = product.available !== false && (product.stock ?? 1) > 0;
  const whatsappMessage = encodeURIComponent(
    `Hello! I want to order "${product.name || product.title}" for ${product.price} EGP.`
  );
  // يمكنك استبدال الرقم برقم الهاتف الخاص بك
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          color: "var(--primary)",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "1rem",
          marginBottom: "20px",
        }}
      >
        ← Back
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "40px",
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          padding: "30px",
          borderRadius: "16px",
        }}
      >
        {/* Product Image */}
        <div style={{ width: "100%", maxHeight: "400px", borderRadius: "12px", overflow: "hidden", background: "#121214" }}>
          <img
            src={product.image || "https://via.placeholder.com/400"}
            alt={product.name || product.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Product Details */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "0.9rem", textTransform: "uppercase" }}>
            {product.category || "Supplements"}
          </span>
          <h1 style={{ fontSize: "2rem", margin: "10px 0 15px 0", color: "#fff" }}>
            {product.name || product.title}
          </h1>

          <div style={{ display: "flex", alignItems: "baseline", gap: "15px", marginBottom: "20px" }}>
            <span className="price-current" style={{ fontSize: "1.8rem" }}>
              {product.price} EGP
            </span>
            {product.oldPrice && (
              <span className="price-old" style={{ fontSize: "1.2rem" }}>
                {product.oldPrice} EGP
              </span>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <span
              className={`badge-stock ${isAvailable ? "badge-available" : "badge-out"}`}
              style={{ position: "static", display: "inline-block" }}
            >
              {isAvailable ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <p style={{ color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "30px" }}>
            {product.description || "No description provided for this product."}
          </p>

          <a
            href={isAvailable ? whatsappUrl : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-whatsapp ${!isAvailable ? "disabled" : ""}`}
            style={{ textAlign: "center", textDecoration: "none" }}
          >
            {isAvailable ? "Order via WhatsApp 💬" : "Currently Unavailable"}
          </a>
        </div>
      </div>
    </div>
  );
}