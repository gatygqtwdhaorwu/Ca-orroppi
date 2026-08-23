/* ============================================================
   api.js — MimmoStore OFFLINE (dati locali, nessun server)
   ============================================================ */
window.MimmoApp = (function () {
  'use strict';

  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  var WA = 'https://wa.me/393510570879';
  var waLink = function (text) {
    return WA + '?text=' + encodeURIComponent(text);
  };

  /* ---------- Prodotti reali (estratti dal mirror originale) ---------- */
  var products = [
    {
      id: 1, brand: 'Balenciaga', name: 'Runner Demna', sizes: '35-46',
      tags: ['Balenciaga', 'Scarpe sportive'],
      img: 'https://xcimg.szwego.com/img/8e48037b/20240727/i1722013702_1144_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
      images: [
        'https://xcimg.szwego.com/img/8e48037b/20240727/i1722013702_1144_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
        'https://xcimg.szwego.com/img/8e48037b/20240727/i1722013702_2562_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
        'https://xcimg.szwego.com/img/8e48037b/20240727/i1722013702_6018_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
        'https://xcimg.szwego.com/img/8e48037b/20240727/i1722013700_2618_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg'
      ],
      desc: 'Scarpe sportive Balenciaga Runner Demna. Qualità top 🔝, taglie 35-46.'
    },
    {
      id: 2, brand: 'Louis Vuitton', name: 'LV 1:1 LOGO — Ciabatte', sizes: '35-42',
      tags: ['Louis Vuitton', 'LV', 'Ciabatte e Sandali'],
      img: 'https://xcimg.szwego.com/img/d4919494/20250505/i1746382079445_5330_0_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
      images: [
        'https://xcimg.szwego.com/img/d4919494/20250505/i1746382079445_5330_0_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
        'https://xcimg.szwego.com/img/d4919494/20250505/i1746382054077_6963_0_1.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
        'https://xcimg.szwego.com/img/d4919494/20250505/i1746382079444_1115_0_2.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
        'https://xcimg.szwego.com/img/d4919494/20250505/i1746382054065_7527_0_3.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg'
      ],
      desc: 'Louis Vuitton 1:1 LOGO ❤️ ⭐ — Ciabatte, taglie 35-42.'
    },
    {
      id: 3, brand: 'Louis Vuitton', name: 'LV Venice 2024 Damier (Chiaro)', sizes: '38-45',
      tags: ['Louis Vuitton', 'LV', 'Ciabatte e Sandali'],
      img: 'https://xcimg.szwego.com/imgHD/9301c5e6/20250324/cmp_i1742745710252_9239_0_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
      images: [
        'https://xcimg.szwego.com/imgHD/9301c5e6/20250324/cmp_i1742745710252_9239_0_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
        'https://xcimg.szwego.com/imgHD/9301c5e6/20250324/cmp_i1742745715619_8832_0_1.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
        'https://xcimg.szwego.com/imgHD/9301c5e6/20250324/cmp_i1742745710347_953_0_2.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
        'https://xcimg.szwego.com/imgHD/9301c5e6/20250324/cmp_i1742745715603_6343_0_3.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg'
      ],
      desc: 'LV Venice 2024 Damier — Marque L. Vuitton Déposée. TPU, 2CM. Taglie 38-45.'
    },
    {
      id: 4, brand: 'Louis Vuitton', name: 'LV Venice 2024 Damier (Scuro)', sizes: '38-45',
      tags: ['Louis Vuitton', 'LV', 'Ciabatte e Sandali'],
      img: 'https://xcimg.szwego.com/imgHD/9301c5e6/20250324/cmp_i1742745698455_8178_0_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
      images: [
        'https://xcimg.szwego.com/imgHD/9301c5e6/20250324/cmp_i1742745698455_8178_0_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
        'https://xcimg.szwego.com/imgHD/9301c5e6/20250324/cmp_i1742745698502_8593_0_1.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
        'https://xcimg.szwego.com/imgHD/9301c5e6/20250324/cmp_i1742745690277_9205_0_2.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg',
        'https://xcimg.szwego.com/imgHD/9301c5e6/20250324/cmp_i1742745690236_2397_0_3.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg'
      ],
      desc: 'LV Venice 2024 Damier — variante scura. Marque L. Vuitton Déposée. Taglie 38-45.'
    },
    {
      id: 5, brand: 'Nike', name: "Air Force 1 '07", sizes: '36-45',
      tags: ['Nike', 'Air Force'],
      img: 'https://xcimg.szwego.com/img/db3fc9ae/20250405/i1743855089_1792_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg',
      images: ['https://xcimg.szwego.com/img/db3fc9ae/20250405/i1743855089_1792_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg'],
      desc: "Nike Air Force 1 '07 — classico intramontabile, taglie 36-45."
    },
    {
      id: 6, brand: 'New Balance', name: '550 — Bianco Rosso Blu', sizes: '40-46',
      tags: ['New Balance'],
      img: 'https://xcimg.szwego.com/normal/db3fc9ae/i1764945402338_3928_1_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg',
      images: ['https://xcimg.szwego.com/normal/db3fc9ae/i1764945402338_3928_1_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg'],
      desc: 'New Balance 550 — colorway Bianco Rosso Blu, taglie 40-46.'
    },
    {
      id: 7, brand: 'Gucci', name: 'Slide GG', sizes: '38-44',
      tags: ['Gucci', 'Ciabatte e Sandali'],
      img: 'https://xcimg.szwego.com/img/4e551478/20250329/i1743185606_2138_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg',
      images: ['https://xcimg.szwego.com/img/4e551478/20250329/i1743185606_2138_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg'],
      desc: 'Gucci Slide GG — ciabatte firmate, taglie 38-44.'
    },
    {
      id: 8, brand: 'Dior', name: 'B23 High', sizes: '38-45',
      tags: ['Dior'],
      img: 'https://xcimg.szwego.com/normal/db3fc9ae/i1764943783452_4968_1_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg',
      images: ['https://xcimg.szwego.com/normal/db3fc9ae/i1764943783452_4968_1_0.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg'],
      desc: 'Dior B23 High — sneakers di lusso, taglie 38-45.'
    },
    {
      id: 9, brand: 'Adidas', name: 'Yeezy 350 V2', sizes: '38-46',
      tags: ['Adidas', 'Yeezy'],
      img: 'https://xcimg.szwego.com/normal/4e551478/20260509/a1778316865396_2154.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg',
      images: ['https://xcimg.szwego.com/normal/4e551478/20260509/a1778316865396_2154.jpg?imageMogr2/auto-orient/thumbnail/!310x310r/quality/100/format/jpg'],
      desc: 'Adidas Yeezy 350 V2 — comfort e stile, taglie 38-46.'
    }
  ];

  /* ---------- Funzioni ---------- */
  var getProduct = function (id) {
    return products.find(function (p) { return String(p.id) === String(id); });
  };

  var byTag = function (tag) {
    var t = String(tag || '').toLowerCase().trim();
    if (!t) return products;
    return products.filter(function (p) {
      return p.brand.toLowerCase().includes(t) ||
             p.name.toLowerCase().includes(t) ||
             p.tags.some(function (x) { return String(x).toLowerCase().includes(t); });
    });
  };

  var card = function (p) {
    return '<a class="product-card" href="prodotto.html?id=' + p.id + '" style="text-decoration:none;color:inherit">' +
      '<img src="' + p.img + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.remove()"/>' +
      '<div class="product-body">' +
        '<span class="brand">' + esc(p.brand) + '</span>' +
        '<h3>' + esc(p.name) + '</h3>' +
        '<span class="size">📏 Taglie: ' + esc(p.sizes) + '</span>' +
      '</div></a>';
  };

  var renderProducts = function (list, containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = list.map(card).join('');
    var empty = document.getElementById('noResults');
    if (empty) empty.style.display = list.length ? 'none' : 'block';
    var count = document.getElementById('catCount');
    if (count) count.textContent = list.length + ' prodotti';
  };

  return {
    products: products,
    getProduct: getProduct,
    byTag: byTag,
    waLink: waLink,
    esc: esc,
    renderProducts: renderProducts,
    card: card
  };
})();
