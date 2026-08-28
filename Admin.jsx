import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../utils/storage";

const ADMIN_UID = "VqXfAoTc4UNQeMu6Q95k2hzhJuo1";

function Admin() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // حالة التحكم في النموذج (إضافة / تعديل)
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    oldPrice: "",
    stock: "",
    category: "Supplements",
    image: "",
    description: "",
    available: true,
  });

  const loadData = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        navigate("/login");
        return;
      }

      if (currentUser.uid !== ADMIN_UID) {
        setUser(null);
        setLoading(false);
        navigate("/");
        return;
      }

      setUser(currentUser);
      await loadData();
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      oldPrice: "",
      stock: "",
      category: "Supplements",
      image: "",
      description: "",
      available: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || "",
      price: product.price ?? "",
      oldPrice: product.oldPrice ?? "",
      stock: product.stock ?? "",
      category: product.category || "Supplements",
      image: product.image || "",
      description: product.description || "",
      available: product.available ?? true,
    });
    setShowForm(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      alert("Please fill all required fields (Name, Price, Stock).");
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      stock: Number(formData.stock),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setProducts((prev) =>
          prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item))
        );
      } else {
        const createdProduct = await addProduct(payload);
        setProducts((prev) => [...prev, createdProduct]);
      }
      resetForm();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save product.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product.");
    }
  };

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-loading">Checking access...</div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <span>ADMIN PANEL</span>
          <h1>S&A Dashboard</h1>
          <p>Welcome back, {user?.displayName || "Admin"}.</p>
        </div>

        <button
          type="button"
          className="admin-back-btn"
          onClick={() => navigate("/")}
        >
          Back to Store
        </button>
      </section>

      <section className="admin-stats">
        <div className="admin-stat-card">
          <span>PRODUCTS</span>
          <strong>{products.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>STOCK</span>
          <strong>
            {products.reduce(
              (total, product) => total + Number(product.stock || 0),
              0
            )}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>STATUS</span>
          <strong>ACTIVE</strong>
        </div>
      </section>

      <section className="admin-products">
        <div className="admin-section-title">
          <div>
            <span>STORE MANAGEMENT</span>
            <h2>Products</h2>
          </div>

          <button
            type="button"
            className="admin-add-btn"
            onClick={() => {
              if (showForm && editingId) {
                resetForm();
              } else {
                setShowForm(!showForm);
              }
            }}
          >
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* Dynamic Form */}
        {showForm && (
          <form className="admin-form" onSubmit={handleSubmitForm} style={{ marginBottom: "30px" }}>
            <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  className="form-input"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Price (EGP) *</label>
                <input
                  type="number"
                  name="price"
                  className="form-input"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Old Price (Optional)</label>
                <input
                  type="number"
                  name="oldPrice"
                  className="form-input"
                  value={formData.oldPrice}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Stock *</label>
                <input
                  type="number"
                  name="stock"
                  className="form-input"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  className="form-input"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: "10px" }}>
              <label>Description</label>
              <textarea
                name="description"
                className="form-textarea"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group" style={{ marginTop: "10px" }}>
              <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                />
                Product Available
              </label>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button type="submit" className="btn-primary">
                {editingId ? "Update Product" : "Save Product"}
              </button>
              <button type="button" className="btn-danger" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Product List */}
        {products.length === 0 ? (
          <div className="admin-empty">
            <h3>No products found</h3>
            <p>There are currently no products in Firestore.</p>
          </div>
        ) : (
          <div className="admin-product-list">
            {products.map((product) => (
              <div className="admin-product-row" key={product.id}>
                <div className="admin-product-info">
                  <h3>{product.name}</h3>
                  <p>Price: {product.price ?? 0} EGP</p>
                  <p>Stock: {product.stock ?? 0}</p>
                </div>

                <div className="admin-product-actions">
                  <button
                    type="button"
                    className="admin-edit-btn"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Admin;