// ============================================================
// MimmoStore - Local Mock API Interceptor
// ============================================================
(function() {
  'use strict';

  // Skip if already loaded
  if (window.__MIMO_API_LOADED__) return;
  window.__MIMO_API_LOADED__ = true;

  const API_BASE = 'https://api-gw.szwego.com';
  const config = window.MIMOCONFIG || {};

  // ==================== MOCK DATA ====================
  
  const mockTags = [
    { tagId: 82142254, tagName: "Louis Vuitton Scarpe LV", customName: "LV", tagImage: "https://xcimg.szwego.com/img/4e551478/20250328/i1743174041_3497_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg" },
    { tagId: 92881556, tagName: "Dior Scarpe", customName: "Dior", tagImage: "https://xcimg.szwego.com/normal/db3fc9ae/i1764943783452_4968_1_0.jpg" },
    { tagId: 82142268, tagName: "Gucci Scarpe", customName: "Gucci", tagImage: "https://xcimg.szwego.com/img/4e551478/20250328/i1743173243_6646_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg" },
    { tagId: 82142549, tagName: "Alexander McQueen", customName: "McQueen", tagImage: "https://xcimg.szwego.com/img/4e551478/20250328/i1743173286_982_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg" },
    { tagId: 82142511, tagName: "Chanel Scarpe", customName: "Chanel", tagImage: "https://xcimg.szwego.com/img/4e551478/20250328/i1743174083_3530_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg" },
    { tagId: 82142418, tagName: "Balenciaga Scarpe", customName: "Balenciaga", tagImage: "https://xcimg.szwego.com/img/4e551478/20250328/i1743174231_8108_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg" },
    { tagId: 82142576, tagName: "Fendi Scarpe", customName: "Fendi", tagImage: "https://xcimg.szwego.com/img/4e551478/20250328/i1743175396_1905_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg" },
    { tagId: 94076786, tagName: "Christian Louboutin", customName: "Louboutin", tagImage: "https://xcimg.szwego.com/normal/db3fc9ae/i1764948911037_9548_1_0.jpg" },
    { tagId: 82142614, tagName: "Burberry Scarpe", customName: "Burberry", tagImage: "https://xcimg.szwego.com/img/4e551478/20250328/i1743175339_4799_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg" },
    { tagId: 82142669, tagName: "Prada Scarpe", customName: "Prada", tagImage: "https://xcimg.szwego.com/img/4e551478/20250328/i1743174482_3362_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg" }
  ];

  const mockItems = [
    {
      goods_id: "demo_001",
      title: "Nike Air Max 270 — 🔥 Original Quality 1:1",
      imgs: ["https://xcimg.szwego.com/img/8e48037b/20240727/i1722013702_1144_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg"],
      tags: [{ tagId: 82127029, tagName: "Nike Scarpe" }]
    },
    {
      goods_id: "demo_002",
      title: "Nike Air Force 1 — Premium Edition ✅",
      imgs: ["https://xcimg.szwego.com/img/db3fc9ae/20250405/i1743855089_1792_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg"],
      tags: [{ tagId: 82807792, tagName: "Air Force" }]
    },
    {
      goods_id: "demo_003",
      title: "New Balance 550 — 🔥 New Collection",
      imgs: ["https://xcimg.szwego.com/img/4e551478/20250329/i1743186630_118_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg"],
      tags: [{ tagId: 82127012, tagName: "New Balance" }]
    },
    {
      goods_id: "demo_004",
      title: "Gucci Slide — Sandali Ciabatte 1:1",
      imgs: ["https://xcimg.szwego.com/img/4e551478/20250328/i1743173243_6646_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg"],
      tags: [{ tagId: 82156732, tagName: "Ciabatte uomo" }]
    },
    {
      goods_id: "demo_005",
      title: "Louis Vuitton LOGO — Sneakers 1:1 ✅",
      imgs: ["https://xcimg.szwego.com/img/4e551478/20250328/i1743174041_3497_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg"],
      tags: [{ tagId: 82142254, tagName: "LV" }]
    }
  ];

  // ==================== INTERCEPTOR ====================

  // Intercept fetch
  const origFetch = window.fetch;
  window.fetch = function(input, init) {
    const url = typeof input === 'string' ? input : (input.url || '');
    
    // Block API calls to original server
    if (url.includes(API_BASE) || url.includes('api-gw.szwego.com') || url.includes('/api/')) {
      console.log('[MimmoStore API] Intercepted:', url);
      
      // Simulate network delay
      return new Promise((resolve) => {
        setTimeout(() => {
          const responseData = getMockResponse(url);
          const blob = new Blob([JSON.stringify(responseData)], { type: 'application/json' });
          const response = new Response(blob, {
            status: 200,
            statusText: 'OK',
            headers: new Headers({ 'Content-Type': 'application/json' })
          });
          resolve(response);
        }, 200 + Math.random() * 300);
      });
    }
    
    return origFetch.call(this, input, init);
  };

  // Intercept XMLHttpRequest
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    this._mimoUrl = typeof url === 'string' ? url : (url || '');
    return origOpen.apply(this, arguments);
  };

  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(data) {
    const url = this._mimoUrl || '';
    
    if (url.includes(API_BASE) || url.includes('api-gw.szwego.com') || url.includes('/api/')) {
      console.log('[MimmoStore XHR] Intercepted:', url);
      
      const self = this;
      const responseData = getMockResponse(url);
      
      setTimeout(() => {
        Object.defineProperty(self, 'responseText', {
          value: JSON.stringify(responseData),
          writable: false
        });
        Object.defineProperty(self, 'readyState', { value: 4, writable: false });
        Object.defineProperty(self, 'status', { value: 200, writable: false });
        if (self.onreadystatechange) self.onreadystatechange();
        if (self.onload) self.onload();
      }, 200 + Math.random() * 300);
      
      return;
    }
    
    return origSend.call(this, data);
  };

  // ==================== RESPONSE BUILDER ====================

  function getMockResponse(url) {
    if (url.includes('cms/home')) {
      return {
        code: 200,
        data: {
          components: [
            { componentId: "navigate", title: "Nuove offerte da Mimmo 😍", details: [] }
          ],
          tags: mockTags,
          items: { items: mockItems, nextTimestamp: 0 },
          newItemCount: 11440,
          popularity: 5441
        }
      };
    }
    if (url.includes('tag/search')) {
      return { code: 200, data: { tags: mockTags } };
    }
    if (url.includes('search') || url.includes('list')) {
      return { code: 200, data: { items: mockItems, nextTimestamp: 0 } };
    }
    // Default
    return { code: 200, data: { tags: mockTags, items: mockItems } };
  }

  // ==================== AUTO INIT ====================

  function init() {
    console.log('[MimmoStore] Local API interceptor activated ✅');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Fallback: also try on window load
  if (document.readyState !== 'complete') {
    window.addEventListener('load', function() {
      console.log('[MimmoStore] API interceptor confirmed on load');
    });
  }
})();
