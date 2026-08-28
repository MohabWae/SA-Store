import { Link } from "react-router-dom";

function ProductCard({ product }) {
  // تأمين القيم في حالة عدم وجود قيم افتراضية
  const stock = product?.stock ?? 0;
  const isAvailable = stock > 0 && product?.available !== false;
  const productName = product?.name || product?.title || "Product";
  const productPrice = product?.price ?? 0;
  const productImage = product?.image || "https://via.placeholder.com/300";
  const productCategory = product?.category || "Supplements";
  const productDescription = product?.description || "High-quality gym supplement for your training needs.";

  const whatsappNumber = "201033667327";

  const message = `Hello, I want to order:
${productName}
Price: ${productPrice} EGP`;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-wrapper">
        <img
          src={productImage}
          alt={productName}
          className="product-image"
        />
      </Link>

      <div className="product-content">
        <span className="product-category">
          {productCategory}
        </span>

        <Link to={`/products/${product.id}`}>
          <h3>{productName}</h3>
        </Link>

        <p className="product-description">
          {productDescription}
        </p>

        <div className="product-prices">
          <span className="current-price">
            {productPrice} EGP
          </span>

          {product.oldPrice && (
            <span className="old-price">
              {product.oldPrice} EGP
            </span>
          )}
        </div>

        <div
          className={
            isAvailable
              ? "stock available"
              : "stock unavailable"
          }
        >
          {isAvailable
            ? `● Available (${stock})`
            : "● Out of stock"}
        </div>

        {isAvailable ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            Order via WhatsApp
          </a>
        ) : (
          <button
            type="button"
            className="whatsapp-btn"
            disabled
          >
            Currently unavailable
          </button>
        )}
      </div>
    </article>
  );
}

export default ProductCard;