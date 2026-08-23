/* ========================================
   🛒 MimmoStore - Local Mock API
   يحاكي API السيرفر الأصلي محلياً
   ======================================== */

// تحميل الإعدادات
const config = window.CONFIG || {};

class MimmoStoreAPI {
  constructor() {
    this.baseURL = "";
    this.cache = {};
    this.init();
  }

  // بدء التشغيل
  init() {
    console.log("✅ MimmoStore Local API initialized");
    this.interceptFetch();
    this.interceptXHR();
  }

  // === المنتجات المسترجعة من الميرور ===
  getMockProducts() {
    return [
      {
        id: "1",
        title: "Air Max Plus",
        brand: "Nike",
        price: 170,
        currency: "€",
        image: "https://xcimg.szwego.com/img/d4919494/20250208/i1739020768342_43_0_0.jpg",
        category: "Scarpe",
        inStock: true,
      },
      {
        id: "2",
        title: "Air Force 1",
        brand: "Nike",
        price: 130,
        currency: "€",
        image: "https://xcimg.szwego.com/img/d4919494/20250208/i1739020768342_43_0_0.jpg",
        category: "Scarpe",
        inStock: true,
      },
      {
        id: "3",
        title: "New Balance 550",
        brand: "New Balance",
        price: 150,
        currency: "€",
        image: "https://xcimg.szwego.com/img/d4919494/20250208/i1739020768342_43_0_0.jpg",
        category: "Scarpe",
        inStock: true,
      },
      {
        id: "4",
        title: "Gucci Slide",
        brand: "Gucci",
        price: 350,
        currency: "€",
        image: "https://xcimg.szwego.com/img/d4919494/20250208/i1739020769715_657_0_0.jpg",
        category: "Ciabatte e Sandali",
        inStock: true,
      },
      {
        id: "5",
        title: "Louis Vuitton LOGO",
        brand: "Louis Vuitton",
        price: 420,
        currency: "€",
        image: "https://xcimg.szwego.com/img/d4919494/20250208/i1739020811961_3025_0_0.jpg",
        category: "Ciabatte e Sandali",
        inStock: true,
      },
    ];
  }

  // === التصنيفات ===
  getMockCategories() {
    return [
      { tagId: 82715179, tagName: "W Ciabatte e Sandali", count: 2 },
      { tagId: 82715180, tagName: "Scarpe Uomo", count: 3 },
      { tagId: 82715181, tagName: "Borse e Accessori", count: 0 },
      { tagId: 82715182, tagName: "Abbigliamento", count: 0 },
    ];
  }

  // === اعتراض Fetch API ===
  interceptFetch() {
    const originalFetch = window.fetch;
    const self = this;

    window.fetch = async function (...args) {
      const url = typeof args[0] === "string" ? args[0] : args[0].url;

      // إذا كان الطلب للـ API الأصلي — اعترضه
      if (self.shouldIntercept(url)) {
        console.log(`🔄 API Mock intercepted: ${url}`);
        return self.handleRequest(url, args[1]);
      }

      // وإلا — استخدم fetch الأصلي
      return originalFetch.apply(this, args);
    };

    console.log("✅ Fetch API intercepted");
  }

  // === اعتراض XMLHttpRequest ===
  interceptXHR() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const self = this;

    XMLHttpRequest.prototype.open = function (method, url) {
      if (self.shouldIntercept(url)) {
        console.log(`🔄 XHR Mock intercepted: ${url}`);
        this._mocked = true;
        this._mockUrl = url;

        // تجاوز الإرسال
        this.send = function () {
          const event = new ProgressEvent("load");
          Object.defineProperty(this, "responseText", {
            value: JSON.stringify(self.getMockResponse(url)),
          });
          Object.defineProperty(this, "status", { value: 200 });
          Object.defineProperty(this, "readyState", { value: 4 });
          this.dispatchEvent(event);
          if (this.onload) this.onload(event);
        };
      }

      return originalOpen.apply(this, arguments);
    };

    console.log("✅ XHR API intercepted");
  }

  // === هل يجب اعتراض هذا الرابط؟ ===
  shouldIntercept(url) {
    if (!url) return false;
    return (
      url.includes("/api/") ||
      url.includes("mimmostore.org") ||
      url.includes("_server") ||
      url.includes("loaderData") ||
      url.includes("trpc")
    );
  }

  // === معالجة الطلب ===
  async handleRequest(url, options) {
    const data = this.getMockResponse(url);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // === الحصول على الرد المناسب ===
  getMockResponse(url) {
    if (url.includes("/api/products") || url.includes("feed")) {
      return { products: this.getMockProducts(), success: true };
    }
    if (url.includes("/api/tags") || url.includes("tags")) {
      return { tags: this.getMockCategories(), success: true };
    }
    if (url.includes("/api/tag/") || url.includes("tagId")) {
      return {
        products: this.getMockProducts(),
        tagTitle: "Ciabatte e Sandali",
        success: true,
      };
    }
    return { data: [], success: true };
  }
}

// === تشغيل API تلقائياً بعد تحميل الصفحة ===
if (typeof window !== "undefined") {
  // الانتظار حتى تحميل الإعدادات
  const waitForConfig = setInterval(() => {
    if (window.CONFIG) {
      clearInterval(waitForConfig);
      window.mimmoAPI = new MimmoStoreAPI();
    }
  }, 100);

  // إذا لم توجد إعدادات بعد 3 ثوان — شغّل API افتراضياً
  setTimeout(() => {
    if (!window.mimmoAPI) {
      window.mimmoAPI = new MimmoStoreAPI();
    }
  }, 3000);
        }
