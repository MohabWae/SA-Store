import React, { useState, useEffect } from "react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../utils/storage";
import { CATEGORIES } from "../data/products";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    name: "",
    category: CATEGORIES[1] || "Creatine",
    price: "",
    oldPrice: "",
    stock: 10,
    description: "",
    image: "/images/product-01.jpg",
    available: true,
  };

  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // تجهيز البيانات المراد إرسالها مع الحفاظ على القيم الأصلية لو المستخدم مسحها بالغلط
    const payload = {
      name: formData.name,
      category: formData.category,
      price: formData.price !== "" ? Number(formData.price) : 0,
      oldPrice: formData.oldPrice !== "" ? Number(formData.oldPrice) : null,
      stock: formData.stock !== "" ? Number(formData.stock) : 0,
      description: formData.description,
      image: formData.image,
      available: formData.available,
    };

    if (editingId) {
      console.log("Updating product with ID:", editingId, payload);
      await updateProduct(editingId, payload);
      setEditingId(null);
    } else {
      await addProduct(payload);
    }

    setFormData(initialForm);
    loadData();
  };

  const handleEdit = (product) => {
    console.log("Clicked product for edit:", product);
    setEditingId(product.id);
    setFormData({
      name: product.name ?? "",
      category: product.category ?? CATEGORIES[1],
      price: product.price ?? "",
      oldPrice: product.oldPrice ?? "",
      stock: product.stock ?? 10,
      description: product.description ?? "",
      image: product.image ?? "/images/product-01.jpg",
      available: product.available ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      await deleteProduct(id);
      loadData();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <h1 style={{ color: "var(--primary)", marginBottom: "20px" }}>
        👑 لوحة تحكم Admin — S&A Store
      </h1>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--card-bg)",
          border: editingId ? "2px solid var(--primary)" : "1px solid var(--card-border)",
          padding: "25px",
          borderRadius: "16px",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ fontSize: "1.2rem", marginBottom: "20px", color: editingId ? "var(--primary)" : "#fff" }}>
          {editingId ? "✏️ تعديل منتج (جاري التعديل...)" : "➕ إضافة منتج جديد"}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "15px" }}>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "5px" }}>اسم المنتج</label>
            <input
              type="text"
              name="name"
              className="search-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "5px" }}>التصنيف (Category)</label>
            <select
              name="category"
              className="search-input"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "5px" }}>السعر الحالي (ج.م)</label>
            <input
              type="number"
              name="price"
              className="search-input"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "5px" }}>السعر القديم (اختياري)</label>
            <input
              type="number"
              name="oldPrice"
              className="search-input"
              value={formData.oldPrice}
              onChange={handleChange}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "5px" }}>المخزون (Stock)</label>
            <input
              type="number"
              name="stock"
              className="search-input"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "5px" }}>مسار الصورة</label>
            <input
              type="text"
              name="image"
              className="search-input"
              placeholder="/images/product-01.jpg"
              value={formData.image}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ marginTop: "15px" }}>
          <label style={{ display: "block", color: "var(--text-muted)", marginBottom: "5px" }}>الوصف</label>
          <textarea
            name="description"
            className="search-input"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div style={{ marginTop: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            name="available"
            id="available"
            checked={formData.available}
            onChange={handleChange}
          />
          <label htmlFor="available" style={{ color: "#fff", cursor: "pointer" }}>
            المنتج متوفر للبيع
          </label>
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button type="submit" className="btn-whatsapp" style={{ width: "auto", padding: "10px 25px" }}>
            {editingId ? "حفظ التعديلات" : "إضافة المنتج"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              style={{
                background: "#333",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              إلغاء
            </button>
          )}
        </div>
      </form>

      {/* Table Section */}
      <h2 style={{ fontSize: "1.3rem", marginBottom: "15px" }}>قائمة المنتجات الحالية ({products.length})</h2>
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>جاري تحميل البيانات من Firestore...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "var(--card-bg)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "#121215", textAlign: "right", color: "var(--primary)" }}>
                <th style={{ padding: "12px" }}>الصورة</th>
                <th style={{ padding: "12px" }}>الاسم</th>
                <th style={{ padding: "12px" }}>التصنيف</th>
                <th style={{ padding: "12px" }}>السعر</th>
                <th style={{ padding: "12px" }}>المخزون</th>
                <th style={{ padding: "12px" }}>الحالة</th>
                <th style={{ padding: "12px" }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td style={{ padding: "12px" }}>
                    <img src={p.image} alt={p.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }} />
                  </td>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>{p.name}</td>
                  <td style={{ padding: "12px", color: "var(--primary)" }}>{p.category}</td>
                  <td style={{ padding: "12px" }}>{p.price} ج.م</td>
                  <td style={{ padding: "12px" }}>{p.stock}</td>
                  <td style={{ padding: "12px" }}>{p.available && p.stock > 0 ? "🟢 متوفر" : "🔴 غير متوفر"}</td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleEdit(p)}
                        style={{
                          background: "#3b82f6",
                          color: "#ffffff",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        style={{
                          background: "rgba(239, 68, 68, 0.2)",
                          color: "#ef4444",
                          border: "1px solid #ef4444",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;