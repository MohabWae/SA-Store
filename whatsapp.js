const STORE_WHATSAPP_NUMBER = "201033667327";

export const generateWhatsAppLink = (productName, price) => {
  const message = `أهلاً C/Muhammad 👋\nأنا مهتم بشراء المنتج التالي من متجر S&A:\n\n📌 *اسم المنتج:* ${productName}\n💰 *السعر:* ${price} جنيه\n\nهل المنتج متوفر حالياً لتأكيد الطلب؟`;
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const SOCIAL_LINKS = {
  whatsappGroup: "https://chat.whatsapp.com/DT9XkXnM7wPGSVmj4tsyiO",
  facebook: "https://www.facebook.com/share/1CyUPbaLa7/",
  ownerPhone: "+20 10 33667327"
};