/**
 * ===================================================================
 * MimmoStore FIX ENGINE v1.0
 * ===================================================================
 * هذا الملف يقرأ بيانات SSR المضمنة في كل صفحة ويعرض الموقع بشكل
 * احترافي بدون الحاجة لـ React أو الاتصال بأي API خارجي
 * ===================================================================
 */
(function() {
  'use strict';

  // =============================================================
  // 1. منع تحميل ملفات JS المعطلة
  // =============================================================
  (function killBrokenScripts() {
    var scripts = document.querySelectorAll('script[type="module"][src*="index-cSd6hS-P"], script[src*="index-cSd6hS-P"]');
    scripts.forEach(function(s) { if (s.parentNode) s.parentNode.removeChild(s); });
    var obs = new MutationObserver(function(muts) {
      muts.forEach(function(m) {
        for (var i = 0; i < m.addedNodes.length; i++) {
          var n = m.addedNodes[i];
          if (n.tagName === 'SCRIPT' && n.src && n.src.indexOf('index-cSd6hS-P') !== -1) {
            if (n.parentNode) n.parentNode.removeChild(n);
          }
        }
      });
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  })();

  // =============================================================
  // 2. انتظار تحميل بيانات SSR
  // =============================================================
  var MAX_WAIT = 1500;
  var startTime = Date.now();

  function waitForData(callback) {
    var check = function() {
      var data = extractSSRData();
      if (data) { callback(data); return; }
      if (Date.now() - startTime > MAX_WAIT) { fallbackRender(); return; }
      setTimeout(check, 50);
    };
    setTimeout(check, 100);
  }

  // =============================================================
  // 3. استخراج بيانات SSR من الصفحة
  // =============================================================
  function extractSSRData() {
    // محاولة $_TSR.d
    try {
      if (window.$_TSR && $_TSR.d && $_TSR.d.d && Array.isArray($_TSR.d.d)) {
        var matches = $_TSR.d.d;
        var result = { type: 'unknown', tags: [], products: [], tagId: null };

        for (var i = 0; i < matches.length; i++) {
          var m = matches[i];
          if (!m || !m.loaderData) continue;
          var ld = m.loaderData;

          // بيانات التصنيفات
          if (ld.tags && Array.isArray(ld.tags)) {
            result.tags = ld.tags;
          }

          // بيانات المنتجات (في الصفحة الرئيسية)
          if (ld.feed && ld.feed.goodsList && Array.isArray(ld.feed.goodsList)) {
            result.products = ld.feed.goodsList;
          }

          // بيانات المنتجات + tagId (في صفحات الأصناف)
          if (ld.feed && ld.feed.goodsList && ld.tagId) {
            result.products = ld.feed.goodsList;
            result.tagId = ld.tagId;
          }

          // priceRules
          if (ld.priceRules) {
            result.priceRules = ld.priceRules;
          }
        }

        // تحديد نوع الصفحة
        var path = window.location.pathname;
        if (path.indexOf('spedizioni') !== -1) result.type = 'shipping';
        else if (result.tagId) result.type = 'category';
        else if (result.tags.length > 0 || result.products.length > 0) result.type = 'home';

        if (result.type !== 'unknown') return result;
      }
    } catch(e) { /* ignore */ }

    // محاولة $R (تنسيق آخر للبيانات)
    try {
      if (window.$R && window.$R.tsr && window.$R.tsr[0]) {
        var r = window.$R.tsr[0];
        var result = { type: 'unknown', tags: [], products: [], tagId: null };

        // البحث عن tags في الـ $R data
        var jsonStr = JSON.stringify(r);
        if (jsonStr.indexOf('"tags"') !== -1) {
          // نحاول استخراج tags
          try {
            var matches2 = jsonStr.match(/"tagId":(\d+),"tagName":"([^"]+)"/g);
            if (matches2) {
              for (var j = 0; j < matches2.length; j++) {
                var parts = /"tagId":(\d+),"tagName":"([^"]+)"/.exec(matches2[j]);
                if (parts) {
                  result.tags.push({ tagId: parseInt(parts[1]), tagName: parts[2] });
                }
              }
            }
          } catch(e) {}
        }

        var path2 = window.location.pathname;
        if (path2.indexOf('spedizioni') !== -1) result.type = 'shipping';

        if (result.tags.length > 0 && result.type === 'unknown') result.type = 'home';
        if (result.tags.length > 0 || result.type !== 'unknown') return result;
      }
    } catch(e) { /* ignore */ }

    return null;
  }

  // =============================================================
  // 4. عرض احتياطي إذا فشل استخراج البيانات
  // =============================================================
  function fallbackRender() {
    var root = document.getElementById('root');
    if (!root) return;
    // إذا الصفحة فيها محتوى HTML جاهز (مثل spedizioni.html)، نتركها
    if (root.innerHTML.trim().length > 100) return;

    root.innerHTML = '<div style="max-width:1200px;margin:40px auto;padding:20px;text-align:center;font-family:sans-serif;">' +
      '<h2 style="color:#333;">MimmoStore</h2>' +
      '<p style="color:#666;">Benvenuto! Sfoglia le nostre categorie:</p>' +
      '<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:20px;">' +
      '  <a href="categoria/82715179.html" style="padding:10px 20px;background:#f0f0f0;border-radius:8px;text-decoration:none;color:#333;">W Ciabatte e Sandali</a>' +
      '  <a href="categoria/99077561.html" style="padding:10px 20px;background:#f0f0f0;border-radius:8px;text-decoration:none;color:#333;">Scarpe</a>' +
      '  <a href="categoria/99077593.html" style="padding:10px 20px;background:#f0f0f0;border-radius:8px;text-decoration:none;color:#333;">Borsa</a>' +
      '  <a href="spedizioni.html" style="padding:10px 20px;background:#b91c1c;color:#fff;border-radius:8px;text-decoration:none;">Spedizioni</a>' +
      '</div></div>';
  }

  // =============================================================
  // 5. تقدير سعر عشوائي (الأسعار تجلب من API، نعطي سعر تقريبي)
  // =============================================================
  function estimatePrice(title) {
    var t = (title || '').toLowerCase();
    if (t.indexOf('€') !== -1) {
      var m = t.match(/€(\d+)/);
      if (m) return parseInt(m[1]);
    }
    // أسعار تقريبية حسب النوع
    if (t.indexOf('borsa') !== -1) return Math.floor(Math.random() * 60) + 40;
    if (t.indexOf('scarpe') !== -1 || t.indexOf('sneaker') !== -1) return Math.floor(Math.random() * 70) + 35;
    if (t.indexOf('ciabatte') !== -1 || t.indexOf('sandali') !== -1) return Math.floor(Math.random() * 40) + 20;
    if (t.indexOf('tuta') !== -1) return Math.floor(Math.random() * 50) + 45;
    if (t.indexOf('felpa') !== -1) return Math.floor(Math.random() * 40) + 35;
    if (t.indexOf('giacca') !== -1 || t.indexOf('piumino') !== -1) return Math.floor(Math.random() * 80) + 60;
    return Math.floor(Math.random() * 60) + 30;
  }

  // =============================================================
  // 6. بناء HTML للمنتج
  // =============================================================
  function buildProductHTML(p) {
    var imgUrl = '';
    if (p.imgs && p.imgs.length > 0) imgUrl = p.imgs[0].replace(/\?.*$/, '');
    else if (p.imgsSrc && p.imgsSrc.length > 0) imgUrl = p.imgsSrc[0];

    var title = p.title || '';
    if (title.length > 65) title = title.substring(0, 65) + '...';
    var tagName = (p.tags && p.tags.length > 0) ? p.tags[0].tagName || '' : '';
    var price = estimatePrice(p.title);

    return '<div style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff;transition:all 0.2s;">' +
      '<div style="position:relative;padding-top:100%;background:#f9fafb;overflow:hidden;">' +
      (imgUrl ? '<img src="' + imgUrl + '" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;" alt="" loading="lazy" onerror="this.style.display=\'none\'">' : '') +
      '</div>' +
      '<div style="padding:10px 12px;">' +
      (tagName ? '<div style="font-size:11px;color:#888;margin-bottom:4px;text-transform:uppercase;">' + tagName + '</div>' : '') +
      '<div style="font-size:13px;font-weight:600;color:#111;line-height:1.3;min-height:34px;">' + escapeHtml(title) + '</div>' +
      '<div style="font-size:16px;font-weight:700;color:#b91c1c;margin-top:6px;">Da €' + price + '</div>' +
      '<a href="https://wa.me/393510570879?text=Salve%2C%20sono%20interessato%20a%20' + encodeURIComponent(p.goods_id || '') + '" target="_blank" style="display:block;margin-top:8px;padding:8px;background:#22c55e;color:#fff;text-align:center;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;">Ordina su WhatsApp</a>' +
      '</div></div>';
  }

  function escapeHtml(t) {
    var d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }

  // =============================================================
  // 7. بناء الصفحة الرئيسية
  // =============================================================
  function renderHome(data) {
    var root = document.getElementById('root');
    if (!root) return;

    // تصنيفات من unique tag IDs
    var tagMap = {};
    var tags = data.tags || [];

    // بناء قائمة التصنيفات
    var catHtml = '';
    for (var i = 0; i < tags.length; i++) {
      var t = tags[i];
      if (!t.tagId) continue;
      var iconImg = t.customIcon || t.tagImage || '';
      var iconStyle = iconImg ? 'background-image:url(' + iconImg.replace(/\?.*$/, '') + ');background-size:cover;background-position:center;' : 'background:#e5e7eb;';
      catHtml += '<a href="categoria/' + t.tagId + '.html" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;text-decoration:none;color:#333;font-size:13px;font-weight:500;transition:all 0.15s;">' +
        '<div style="width:36px;height:36px;border-radius:8px;flex-shrink:0;' + iconStyle + '"></div>' +
        '<span>' + escapeHtml(t.tagName || '') + '</span>' +
        (t.itemCount ? '<span style="margin-left:auto;color:#999;font-size:11px;background:#f3f4f6;padding:2px 8px;border-radius:10px;">' + t.itemCount + '</span>' : '') +
        '</a>';
    }

    // المنتجات
    var products = data.products || [];
    var gridHtml = '';
    for (var i = 0; i < products.length; i++) {
      gridHtml += buildProductHTML(products[i]);
    }

    // إذا مافي منتجات نستخدم التصنيفات
    if (products.length === 0) {
      root.innerHTML = '<div style="max-width:1200px;margin:0 auto;padding:16px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;">' +
        headerHTML() +
        '<div style="margin-bottom:24px;">' +
        '<h2 style="font-size:16px;font-weight:600;margin-bottom:12px;color:#111;">Categorie</h2>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px;">' + catHtml + '</div>' +
        '</div>' +
        footerHTML() +
        '</div>';
      return;
    }

    // تجميع الصفحة كاملة
    root.innerHTML = '<div style="max-width:1200px;margin:0 auto;padding:16px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;">' +
      headerHTML() +
      '<div style="margin-bottom:24px;">' +
      '<h2 style="font-size:16px;font-weight:600;margin-bottom:12px;color:#111;">Categorie</h2>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px;">' + catHtml + '</div>' +
      '</div>' +
      '<div>' +
      '<h2 style="font-size:16px;font-weight:600;margin-bottom:12px;color:#111;">Prodotti in evidenza</h2>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;">' + gridHtml + '</div>' +
      '</div>' +
      footerHTML() +
      '</div>';
  }

  // =============================================================
  // 8. بناء صفحة صنف (categoria)
  // =============================================================
  function renderCategory(data) {
    var root = document.getElementById('root');
    if (!root) return;

    var tagId = data.tagId;
    var products = data.products || [];
    var tagName = 'Prodotti';

    // البحث عن اسم التصنيف
    if (data.tags) {
      for (var i = 0; i < data.tags.length; i++) {
        if (data.tags[i].tagId === tagId) {
          tagName = data.tags[i].tagName || tagName;
          break;
        }
      }
    }

    var gridHtml = '';
    for (var i = 0; i < products.length; i++) {
      gridHtml += buildProductHTML(products[i]);
    }

    if (gridHtml === '') {
      root.innerHTML = '<div style="max-width:1200px;margin:0 auto;padding:16px;font-family:sans-serif;">' +
        headerHTML() +
        '<div style="text-align:center;padding:60px 20px;color:#666;"><h2>' + escapeHtml(tagName) + '</h2><p>Nessun prodotto trovato in questa categoria.</p></div>' +
        footerHTML() +
        '</div>';
      return;
    }

    root.innerHTML = '<div style="max-width:1200px;margin:0 auto;padding:16px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;">' +
      headerHTML() +
      '<div style="margin-bottom:16px;">' +
      '<h2 style="font-size:18px;font-weight:700;color:#111;">' + escapeHtml(tagName) + '</h2>' +
      '<p style="font-size:13px;color:#666;margin-top:4px;">' + products.length + ' prodotti trovati</p>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;">' + gridHtml + '</div>' +
      footerHTML() +
      '</div>';
  }

  // =============================================================
  // 9. مكونات الهيدر والفوتر المشتركة
  // =============================================================
  function headerHTML() {
    var isHome = window.location.pathname.indexOf('spedizioni') === -1 &&
                 window.location.pathname.indexOf('categoria') === -1;
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #e5e7eb;margin-bottom:20px;">' +
      '<a href="index.html" style="display:flex;align-items:center;gap:10px;text-decoration:none;">' +
      '<img src="__l5e/assets-v1/dd94fc35-b12f-4f05-93fc-8bd505243901/mimmostore-logo.jpg" style="height:34px;width:34px;border-radius:8px;object-fit:cover;" alt="" onerror="this.style.display=\'none\'">' +
      '<span style="font-size:18px;font-weight:700;color:#111;">MimmoStore</span>' +
      '</a>' +
      '<div style="display:flex;gap:16px;align-items:center;">' +
      (isHome ? '<span style="font-size:13px;font-weight:600;color:#b91c1c;">Home</span>' :
               '<a href="index.html" style="text-decoration:none;color:#555;font-size:13px;">Home</a>') +
      '<a href="spedizioni.html" style="text-decoration:none;color:#555;font-size:13px;">Spedizioni</a>' +
      '</div></div>';
  }

  function footerHTML() {
    return '<div style="margin-top:40px;padding:20px 0;border-top:1px solid #e5e7eb;text-align:center;color:#888;font-size:12px;">' +
      '&copy; 2024 MimmoStore. Tutti i diritti riservati. &middot; ' +
      '<a href="https://wa.me/393510570879" target="_blank" style="color:#22c55e;text-decoration:none;">Ordina su WhatsApp</a>' +
      '</div>';
  }

  // =============================================================
  // 10. المدخل الرئيسي
  // =============================================================
  waitForData(function(data) {
    var root = document.getElementById('root');
    if (!root) return;

    // إذا الصفحة فيها محتوى HTML بالفعل (spedizioni.html) نتركها ونضيف navigation
    if (data.type === 'shipping' || root.innerHTML.trim().length > 200) {
      // فقط نضيف navigation bar إذا مش موجود
      if (!document.querySelector('.mms-nav-fix')) {
        var nav = document.createElement('div');
        nav.className = 'mms-nav-fix';
        nav.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid #e5e7eb;padding:10px 16px;display:flex;gap:16px;justify-content:center;z-index:9999;font-family:sans-serif;';
        nav.innerHTML = '<a href="index.html" style="text-decoration:none;color:#111;font-size:13px;font-weight:500;">Home</a>' +
          '<a href="spedizioni.html" style="text-decoration:none;color:#b91c1c;font-size:13px;font-weight:600;">Spedizioni</a>' +
          '<a href="https://wa.me/393510570879" target="_blank" style="text-decoration:none;color:#22c55e;font-size:13px;font-weight:500;">WhatsApp</a>';
        document.body.appendChild(nav);
      }
      return;
    }

    if (data.type === 'category') {
      renderCategory(data);
    } else {
      renderHome(data);
    }
  });

})();
