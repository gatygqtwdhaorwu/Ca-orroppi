/* ========================================
   🛒 MimmoStore - Local Config
   ======================================== */

const CONFIG = {
  // اسم المتجر
  storeName: "MimmoStore",
  tagline: "Sneakers e accessori firmati",

  // اللغة الافتراضية
  language: "ar",

  // إعدادات الصفحة
  theme: {
    primaryColor: "#1a1a2e",
    secondaryColor: "#e94560",
    backgroundColor: "#f0f0f5",
    textColor: "#333333",
  },

  // معلومات الشحن
  shipping: {
    methods: ["DHL", "EMS", "ARAMEX"],
    deliveryTime: "5-7 giorni",
    freeShippingOver: 200, // EUR
  },

  // إعدادات الدفع
  payment: {
    methods: ["Bonifico", "Carta", "Apple Pay", "Google Pay"],
    currency: "€",
    currencyCode: "EUR",
  },

  // روابط التواصل
  contact: {
    whatsapp: "+393333333333",
    email: "info@mimmostore.org",
  },

  // تفعيل/تعطيل الوضع المحلي (بدون API خارجي)
  localMode: true,

  // وقت تخزين البيانات محلياً (بالدقائق)
  cacheDuration: 60,

  // المجلدات المحلية للملفات
  paths: {
    assets: "mimmostore.org/assets",
    images: "mimmostore.org/__l5e/assets-v1",
  },
};

// تصدير الإعدادات
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG;
}
