import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const testFirebase = async () => {
  try {
    const snapshot = await getDocs(collection(db, "products"));

    console.log("Firebase connected successfully");
    console.log("Products:", snapshot.docs.map((doc) => doc.data()));
  } catch (error) {
    console.error("Firebase connection failed:", error);
  }
};

testFirebase();