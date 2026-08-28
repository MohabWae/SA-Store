import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { defaultProducts } from "../data/products";

const PRODUCTS_COLLECTION = "products";

// جلب جميع المنتجات من Firestore
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    let products = [];
    
    querySnapshot.forEach((docSnap) => {
      products.push({ id: docSnap.id, ...docSnap.data() });
    });

    // لو الفايربيس فاضي، نرفعلوا المنتجات الافتراضية لأول مرة
    if (products.length === 0 && defaultProducts && defaultProducts.length > 0) {
      console.log("Firestore empty. Seeding default products...");
      await seedDefaultProducts();
      return defaultProducts;
    }

    return products;
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
};

// رفع المنتجات الافتراضية
export const seedDefaultProducts = async () => {
  try {
    for (const product of defaultProducts) {
      const productRef = doc(db, PRODUCTS_COLLECTION, String(product.id));
      await setDoc(productRef, product);
    }
    console.log("Default products uploaded to Firestore successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
};

// إضافة منتج جديد
export const addProduct = async (productData) => {
  try {
    const newDocRef = doc(collection(db, PRODUCTS_COLLECTION));
    const newProduct = { ...productData, id: newDocRef.id };
    await setDoc(newDocRef, newProduct);
    return newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// تعديل منتج
export const updateProduct = async (id, updatedData) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, String(id));
    await updateDoc(productRef, updatedData);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// حذف منتج
export const deleteProduct = async (id) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, String(id));
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};