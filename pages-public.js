/* Bazaar BD – pages-public.js (Part 3). Paste in the SAME <script type="module"> block as core.js, below it.
   Pages: home, shop, category, search, product, seller, auth, seller-apply, buyer-dash. */
(function () {
  const B = window.BV;
  const { F, db, esc, t } = B;

  B.addI18n({
    bn: {
      noReviews: "রিভিউ নেই", newest: "নতুন আগে", priceLow: "দাম: কম থেকে বেশি", priceHigh: "দাম: বেশি থেকে কম",
      allCats: "সব ক্যাটাগরি", allDistricts: "সব জেলা", allConds: "সব অবস্থা", minPrice: "সর্বনিম্ন দাম", maxPrice: "সর্বোচ্চ দাম",
      filter: "ফিল্টার", sortBy: "সাজান", category: "ক্যাটাগরি", district: "জেলা", condition: "অবস্থা",
      searchResult: "খোঁজার ফল", searchEmpty: "কী খুঁজবেন লিখুন।", searchTip: "টিপস: পুরো শব্দ লিখুন (যেমন: মোবাইল, ফ্যান, সোফা)।",
      latest: "নতুন পণ্য", recent: "সম্প্রতি দেখেছেন", seeAll: "সব দেখুন", cats: "ক্যাটাগরি",
      how: "কীভাবে কিনবেন", how1: "পছন্দের পণ্য বেছে অর্ডার করুন", how2: "{p}% অগ্রিম বিকাশ/নগদ/রকেটে পাঠিয়ে ট্রানজ্যাকশন আইডি দিন", how3: "অ্যাডমিন যাচাই করলে পণ্য পাঠানো হবে; বাকি টাকা ডেলিভারিতে দিন",
      prodNotFound: "পণ্যটি পাওয়া যায়নি বা এখন দেখা যাচ্ছে না।", addCart: "কার্টে রাখুন", buyNow: "এখনই কিনুন", added: "কার্টে যোগ হয়েছে।", qty: "পরিমাণ",
      inStock: "স্টকে আছে: {n}টি", defects: "জানা ত্রুটি / সমস্যা", noDefects: "বিক্রেতার মতে কোনো জানা ত্রুটি নেই।", desc: "বিবরণ", features: "মূল সুবিধা",
      accessories: "সাথে যা পাবেন", warranty: "ওয়ারেন্টি", usage: "কতদিন ব্যবহার", purchased: "কেনার বছর", brand: "ব্র্যান্ড", model: "মডেল",
      location: "এলাকা", delivery: "ডেলিভারি", pickup: "সরাসরি নিয়ে যাওয়া", homeDelivery: "হোম ডেলিভারি", negotiable: "দর-কষাকষি করা যাবে", fixedPrice: "দাম নির্ধারিত",
      sellerNotes: "বিক্রেতার নোট", returnPolicy: "রিটার্ন / সমস্যা নিষ্পত্তি", seller: "বিক্রেতা", viewShop: "প্রোফাইল দেখুন", report: "রিপোর্ট করুন",
      related: "আরও পণ্য", reviews: "রিভিউ", ownProduct: "এটি আপনার নিজের পণ্য।", notPublished: "এই পণ্য এখনো প্রকাশিত নয় (শুধু আপনি দেখছেন)।",
      wish: "পছন্দ", wishAdd: "পছন্দের তালিকায় রাখুন", wishRemove: "তালিকা থেকে সরান", advanceNote: "অর্ডারের সময় মূল্যের {p}% অগ্রিম দিতে হবে, বাকিটা ডেলিভারিতে।",
      joined: "যোগ দিয়েছেন", listings: "প্রকাশিত পণ্য", sales: "সম্পন্ন বিক্রি", rating: "গড় রেটিং", suspendedSeller: "এই বিক্রেতা সাময়িকভাবে বন্ধ।",
      // auth
      authTitle: "লগইন / রেজিস্টার", name: "পুরো নাম", email: "ইমেইল", phone: "মোবাইল নম্বর", password: "পাসওয়ার্ড", accType: "আপনি কী করতে চান?",
      buyerType: "কিনতে চাই", sellerType: "বিক্রি করতে চাই", agreeTerms: "আমি শর্তাবলি ও গোপনীয়তা নীতি মেনে নিচ্ছি।", forgot: "পাসওয়ার্ড ভুলে গেছেন?",
      resetSent: "ইমেইল ঠিক থাকলে পাসওয়ার্ড বদলের লিংক পাঠানো হয়েছে।", sendReset: "লিংক পাঠান", haveAcc: "অ্যাকাউন্ট আছে? লগইন", noAcc: "নতুন? রেজিস্টার করুন",
      badPhone: "মোবাইল নম্বর ঠিকভাবে লিখুন (যেমন 01712345678)।", badName: "নাম কমপক্ষে ২ অক্ষর।", mustAgree: "শর্তাবলিতে সম্মতি দিন।",
      signedAs: "আপনি লগইন করা আছেন:", regDone: "রেজিস্ট্রেশন হয়েছে!", regDoneMsg: "আপনার ইমেইলে একটি ভেরিফিকেশন লিংক পাঠানো হয়েছে। লিংকে ক্লিক করে ফিরে এসে নিচের বাটন চাপুন।",
      continue: "এগিয়ে যান",
      // seller apply
      applyTitle: "বিক্রেতা হওয়ার আবেদন", shopName: "দোকান / বিক্রেতার নাম", area: "এলাকা (থানা/মহল্লা)", about: "নিজের সম্পর্কে লিখুন (কী বিক্রি করবেন)",
      applyNote: "অ্যাডমিন যাচাই করে অনুমোদন দিলে আপনি পণ্য দিতে পারবেন। চুরির বা নকল পণ্য বিক্রি নিষিদ্ধ।",
      appPending: "আপনার আবেদন যাচাই চলছে। অনুমোদন হলে এখানে জানতে পারবেন।", appRejected: "আপনার আবেদন গ্রহণ হয়নি।", adminNote: "অ্যাডমিনের নোট", reapply: "আবার আবেদন করুন",
      appApproved: "আপনি অনুমোদিত বিক্রেতা!", goDash: "সেলার ড্যাশবোর্ডে যান", apply: "আবেদন জমা দিন", applied: "আবেদন জমা হয়েছে।",
      profileSetup: "পাবলিক বিক্রেতা প্রোফাইল", bio: "সংক্ষিপ্ত পরিচয়", photo: "প্রোফাইল ছবি (ঐচ্ছিক)", saveProfile: "প্রোফাইল সংরক্ষণ", saved: "সংরক্ষিত হয়েছে।",
      // account
      myAccount: "আমার অ্যাকাউন্ট", editProfile: "তথ্য বদলান", accStatus: "অ্যাকাউন্ট স্ট্যাটাস", verified: "ইমেইল ভেরিফাইড", notVerified: "ইমেইল ভেরিফাই হয়নি",
      sellerStatus: "বিক্রেতা স্ট্যাটাস", wishlist: "পছন্দের তালিকা", completeProfile: "প্রোফাইল সম্পূর্ণ করুন", resetPw: "পাসওয়ার্ড বদলের ইমেইল পাঠান",
      ss_none: "বিক্রেতা নন", ss_approved: "অনুমোদিত", ss_rejected: "আবেদন বাতিল", ss_suspended: "স্থগিত", as_active: "সচল", as_suspended: "স্থগিত",
    },
    en: {
      noReviews: "No reviews", newest: "Newest", priceLow: "Price: low to high", priceHigh: "Price: high to low",
      allCats: "All categories", allDistricts: "All districts", allConds: "Any condition", minPrice: "Min price", maxPrice: "Max price",
      filter: "Filter", sortBy: "Sort", category: "Category", district: "District", condition: "Condition",
      searchResult: "Search results", searchEmpty: "Type what you want to find.", searchTip: "Tip: use whole words (e.g. phone, fan, sofa).",
      latest: "Latest listings", recent: "Recently viewed", seeAll: "See all", cats: "Categories",
      how: "How to buy", how1: "Pick an item and place the order", how2: "Send {p}% advance by bKash/Nagad/Rocket and enter the transaction ID", how3: "Admin verifies, item is dispatched; pay the rest on delivery",
      prodNotFound: "This product was not found or is not available.", addCart: "Add to cart", buyNow: "Buy now", added: "Added to cart.", qty: "Quantity",
      inStock: "In stock: {n}", defects: "Known defects / problems", noDefects: "Seller reports no known defects.", desc: "Description", features: "Key features",
      accessories: "Included accessories", warranty: "Warranty", usage: "Time used", purchased: "Purchase year", brand: "Brand", model: "Model",
      location: "Location", delivery: "Delivery", pickup: "Pickup", homeDelivery: "Home delivery", negotiable: "Price negotiable", fixedPrice: "Fixed price",
      sellerNotes: "Seller notes", returnPolicy: "Return / dispute policy", seller: "Seller", viewShop: "View profile", report: "Report",
      related: "More items", reviews: "Reviews", ownProduct: "This is your own listing.", notPublished: "Not published yet (only you can see this).",
      wish: "Wishlist", wishAdd: "Add to wishlist", wishRemove: "Remove from wishlist", advanceNote: "{p}% advance is paid when ordering; the rest on delivery.",
      joined: "Joined", listings: "Live listings", sales: "Completed sales", rating: "Average rating", suspendedSeller: "This seller is temporarily suspended.",
      authTitle: "Log in / Sign up", name: "Full name", email: "Email", phone: "Mobile number", password: "Password", accType: "What do you want to do?",
      buyerType: "Buy", sellerType: "Sell", agreeTerms: "I accept the Terms and Privacy policy.", forgot: "Forgot password?",
      resetSent: "If the email exists, a reset link has been sent.", sendReset: "Send link", haveAcc: "Have an account? Log in", noAcc: "New? Sign up",
      badPhone: "Enter a valid mobile number (e.g. 01712345678).", badName: "Name must be at least 2 characters.", mustAgree: "Please accept the terms.",
      signedAs: "Signed in as:", regDone: "Account created!", regDoneMsg: "A verification link was emailed to you. Click it, come back, then press the button below.",
      continue: "Continue",
      applyTitle: "Apply to become a seller", shopName: "Shop / seller name", area: "Area", about: "About you (what will you sell)",
      applyNote: "An admin reviews every application. Selling stolen or fake goods is prohibited.",
      appPending: "Your application is under review.", appRejected: "Your application was not accepted.", adminNote: "Admin note", reapply: "Apply again",
      appApproved: "You are an approved seller!", goDash: "Go to seller dashboard", apply: "Submit application", applied: "Application submitted.",
      profileSetup: "Public seller profile", bio: "Short bio", photo: "Profile photo (optional)", saveProfile: "Save profile", saved: "Saved.",
      myAccount: "My account", editProfile: "Edit details", accStatus: "Account status", verified: "Email verified", notVerified: "Email not verified",
      sellerStatus: "Seller status", wishlist: "Wishlist", completeProfile: "Complete your profile", resetPw: "Email me a password reset link",
      ss_none: "Not a seller", ss_approved: "Approved", ss_rejected: "Application rejected", ss_suspended: "Suspended", as_active: "Active", as_suspended: "Suspended",
    },
  });

  /* ---------- shared helpers ---------- */
  const nl2br = (s) => esc(s).replace(/\n/g, "<br>");
  const safeNext = (n) => (typeof n === "string" && /^\/(?![\/\\])[^\s]*$/.test(n) ? n : "/");
  const toLogin = () => { location.href = B.url("login") + "?next=" + encodeURIComponent(location.pathname + location.search); };
  const num1 = (n) => new Intl.NumberFormat(B.lang === "bn" ? "bn-BD" : "en-BD", { maximumFractionDigits: 1 }).format(n);
  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  let _cats = null;
  async function loadCats() {
    if (_cats) return _cats;
    try {
      const s = await F.getDocs(F.query(F.collection(db, "categories"), F.orderBy("sortOrder")));
      _cats = s.docs.map((d) => ({ id: d.id, ...d.data() })).filter((c) => c.active);
    } catch (e) { _cats = []; }
    return _cats;
  }
  const catName = (c) => (B.lang === "bn" ? c.nameBn || c.nameEn : c.nameEn);

  const _stats = {};
  async function loadStats(ids) {
    await Promise.all([...new Set(ids)].filter((i) => i && !(i in _stats)).map(async (i) => {
      try { const s = await F.getDoc(F.doc(db, "sellerStats", i)); _stats[i] = s.exists() ? s.data() : null; } catch (e) { _stats[i] = null; }
    }));
  }
  const ratingHtml = (sid) => {
    const s = _stats[sid];
    if (!s || !s.ratingCount) return `<span class="bv-meta">${esc(t("noReviews"))}</span>`;
    return `<span class="bv-meta">★ ${num1(s.ratingSum / s.ratingCount)} (${B.num(s.ratingCount)})</span>`;
  };

  async function loadWish() {
    if (!B.user || B.wish) return;
    B.wish = new Set();
    try { const s = await F.getDocs(F.query(F.collection(db, "users", B.user.uid, "wishlist"), F.limit(200))); s.forEach((d) => B.wish.add(d.id)); } catch (e) { /* ignore */ }
  }
  async function toggleWish(pid) {
    if (!B.user) { toLogin(); return null; }
    if (!B.user.emailVerified) { B.toast(t("needVerify"), "bad"); return null; }
    await loadWish();
    const ref = F.doc(db, "users", B.user.uid, "wishlist", pid);
    if (B.wish.has(pid)) { await F.deleteDoc(ref); B.wish.delete(pid); return false; }
    await F.setDoc(ref, { productId: pid, addedAt: F.serverTimestamp() });
    B.wish.add(pid); return true;
  }
  async function addToCart(p, qty) {
    if (!B.user) { toLogin(); return false; }
    if (!B.user.emailVerified) { B.toast(t("needVerify"), "bad"); return false; }
    const ref = F.doc(db, "users", B.user.uid, "cart", p.id);
    let addedAt = F.serverTimestamp(), q = qty;
    try { const cur = await F.getDoc(ref); if (cur.exists()) { addedAt = cur.data().addedAt; q = cur.data().qty + qty; } } catch (e) { /* new item */ }
    q = Math.max(1, Math.min(q, p.stock, 99));
    await F.setDoc(ref, { productId: p.id, qty: q, addedAt, updatedAt: F.serverTimestamp() });
    B.refreshCounts();
    return true;
  }
  B.addToCart = addToCart; B.toggleWish = toggleWish; B.loadStats = loadStats; B.loadCats = loadCats; B.catName = catName;

  const card = (p) => {
    const img = B.img(p.images && p.images[0], 400);
    return `<div class="bv-card" style="position:relative">
      <a class="bv-pcard" href="${B.url("product", { id: p.id })}">
        ${img ? `<img class="img" loading="lazy" src="${esc(img)}" alt="${esc(p.title)}">` : `<span class="img"></span>`}
        <div class="body"><div class="t">${esc(p.title)}</div>
          <div><span class="bv-price">${B.taka(p.price)}</span>${p.originalPrice > p.price ? `<span class="bv-old">${B.taka(p.originalPrice)}</span>` : ""}</div>
          <div class="bv-row" style="margin-top:4px"><span class="bv-chip">${esc(t("cond_" + p.condition))}</span><span class="bv-meta">${esc(B.districtName(p.district))}</span></div>
          <div>${ratingHtml(p.sellerId)}</div></div></a>
      <button class="bv-heart" data-wish="${esc(p.id)}" aria-label="${esc(t("wish"))}">${B.wish && B.wish.has(p.id) ? "♥" : "♡"}</button></div>`;
  };
  B.productCard = card;
  function bindHearts(root) {
    root.querySelectorAll("[data-wish]").forEach((b) => {
      if (b._b) return; b._b = 1;
      b.onclick = async (e) => {
        e.preventDefault();
        try { const r = await toggleWish(b.dataset.wish); if (r !== null) b.textContent = r ? "♥" : "♡"; } catch (er) { B.toast(B.errMsg(er), "bad"); }
      };
    });
  }
  const fromDocs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  function setTag(sel, make, attrs) {
    let el = document.head.querySelector(sel);
    if (!el) { el = document.createElement(make); document.head.appendChild(el); }
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  }
  B.setMeta = ({ title, desc, image, url }) => {
    document.title = title + " | " + B.settings.siteName;
    if (desc) { setTag('meta[name="description"]', "meta", { name: "description", content: desc.slice(0, 300) }); setTag('meta[property="og:description"]', "meta", { property: "og:description", content: desc.slice(0, 300) }); }
    setTag('meta[property="og:title"]', "meta", { property: "og:title", content: title });
    setTag('meta[property="og:type"]', "meta", { property: "og:type", content: "website" });
    if (image) setTag('meta[property="og:image"]', "meta", { property: "og:image", content: image });
    if (url) { setTag('link[rel="canonical"]', "link", { rel: "canonical", href: url }); setTag('meta[property="og:url"]', "meta", { property: "og:url", content: url }); }
  };
  function setJsonLd(obj) {
    let s = document.getElementById("bv-ld");
    if (!s) { s = document.createElement("script"); s.type = "application/ld+json"; s.id = "bv-ld"; document.head.appendChild(s); }
    s.textContent = JSON.stringify(obj);
  }
  const pushRecent = (id) => { try { const a = JSON.parse(localStorage.getItem("bv_recent") || "[]").filter((x) => x !== id); a.unshift(id); localStorage.setItem("bv_recent", JSON.stringify(a.slice(0, 12))); } catch (e) { /* ignore */ } };
  const getRecent = () => { try { const a = JSON.parse(localStorage.getItem("bv_recent") || "[]"); return Array.isArray(a) ? a.filter((x) => /^[A-Za-z0-9_-]{1,60}$/.test(x)).slice(0, 12) : []; } catch (e) { return []; } };

  /* ---------- product listing engine (shop / category / search) ---------- */
  async function listProducts(mount, { fixedCat, q, title }) {
    const qs = B.qs, cats = await loadCats();
    const f = { c: fixedCat || qs.get("c") || "", d: qs.get("d") || "", k: qs.get("k") || "", s: qs.get("s") || "new",
      min: Number(qs.get("min")) || 0, max: Number(qs.get("max")) || 0 };
    const toks = q ? B.tokens(q) : [];
    const mainTok = toks.slice().sort((a, b) => b.length - a.length)[0] || "";
    const opt = (v, l, sel) => `<option value="${esc(v)}"${sel ? " selected" : ""}>${esc(l)}</option>`;
    mount.innerHTML = `
      <h1 class="bv-h1">${esc(title)}</h1>
      <form class="bv-card bv-pad" method="get" id="bv-flt">
        ${q !== undefined ? `<input type="hidden" name="q" value="${esc(q)}">` : ""}
        ${fixedCat ? `<input type="hidden" name="c" value="${esc(fixedCat)}">` : ""}
        <div class="bv-row" style="align-items:flex-end">
          ${fixedCat ? "" : `<div style="flex:1;min-width:140px"><label for="f-c">${esc(t("category"))}</label><select id="f-c" name="c">${opt("", t("allCats"), !f.c)}${cats.map((c) => opt(c.id, catName(c), c.id === f.c)).join("")}</select></div>`}
          <div style="flex:1;min-width:140px"><label for="f-d">${esc(t("district"))}</label><select id="f-d" name="d">${opt("", t("allDistricts"), !f.d)}${B.districtOptions(f.d)}</select></div>
          <div style="flex:1;min-width:140px"><label for="f-k">${esc(t("condition"))}</label><select id="f-k" name="k">${opt("", t("allConds"), !f.k)}${["brand_new", "like_new", "good", "fair", "for_parts"].map((c) => opt(c, t("cond_" + c), c === f.k)).join("")}</select></div>
          <div style="flex:1;min-width:110px"><label for="f-min">${esc(t("minPrice"))}</label><input id="f-min" name="min" type="number" min="0" inputmode="numeric" value="${f.min || ""}"></div>
          <div style="flex:1;min-width:110px"><label for="f-max">${esc(t("maxPrice"))}</label><input id="f-max" name="max" type="number" min="0" inputmode="numeric" value="${f.max || ""}"></div>
          <div style="flex:1;min-width:140px"><label for="f-s">${esc(t("sortBy"))}</label><select id="f-s" name="s">${opt("new", t("newest"), f.s === "new")}${opt("plh", t("priceLow"), f.s === "plh")}${opt("phl", t("priceHigh"), f.s === "phl")}</select></div>
          <button class="bv-btn" type="submit">${esc(t("filter"))}</button>
        </div></form>
      ${q !== undefined && !toks.length ? B.ui.empty(t("searchEmpty")) : `<div id="bv-res" class="bv-grid" style="margin-top:12px"></div><div id="bv-st"></div><div class="bv-row" style="justify-content:center;margin-top:12px"><button class="bv-btn sec" id="bv-more" hidden>${esc(t("loadMore"))}</button></div>`}
      ${q !== undefined ? `<p class="bv-hint">${esc(t("searchTip"))}</p>` : ""}`;
    if (q !== undefined && !toks.length) return;

    const res = mount.querySelector("#bv-res"), st = mount.querySelector("#bv-st"), more = mount.querySelector("#bv-more");
    let cursor = null, done = false, total = 0;
    const priceSort = f.s === "plh" || f.s === "phl";
    const match = (p) =>
      (!f.c || p.categoryId === f.c) && (!f.d || p.district === f.d) && (!f.k || p.condition === f.k) &&
      (!f.min || p.price >= f.min) && (!f.max || p.price <= f.max) &&
      toks.every((w) => (p.searchTokens || []).includes(w) || String(p.title || "").toLowerCase().includes(w));

    async function fetchPage() {
      const out = []; let rounds = 0;
      while (out.length < 20 && !done && rounds < 5) {
        rounds++;
        const cs = [F.where("status", "==", "published")];
        let ord;
        if (priceSort) ord = F.orderBy("price", f.s === "plh" ? "asc" : "desc");
        else {
          if (mainTok) cs.push(F.where("searchTokens", "array-contains", mainTok));
          else if (f.c) cs.push(F.where("categoryId", "==", f.c));
          else if (f.d) cs.push(F.where("district", "==", f.d));
          else if (f.k) cs.push(F.where("condition", "==", f.k));
          ord = F.orderBy("createdAt", "desc");
        }
        const args = [...cs, ord]; if (cursor) args.push(F.startAfter(cursor)); args.push(F.limit(30));
        const snap = await F.getDocs(F.query(F.collection(db, "products"), ...args));
        if (snap.docs.length < 30) done = true;
        if (snap.docs.length) cursor = snap.docs[snap.docs.length - 1];
        for (const p of fromDocs(snap)) if (match(p)) out.push(p);
      }
      return out;
    }
    async function loadMore() {
      more.disabled = true; st.innerHTML = B.ui.loading();
      try {
        const items = await fetchPage();
        await Promise.all([loadStats(items.map((p) => p.sellerId)), loadWish()]);
        total += items.length;
        res.insertAdjacentHTML("beforeend", items.map(card).join(""));
        bindHearts(res);
        st.innerHTML = total === 0 && done ? B.ui.empty() : "";
        more.hidden = done;
      } catch (e) {
        console.error(e);
        st.innerHTML = B.ui.error(B.errMsg(e));
      } finally { more.disabled = false; }
    }
    more.onclick = loadMore;
    await loadMore();
  }

  B.registerPage("shop", (m) => { B.setMeta({ title: t("shop"), desc: B.settings.siteName }); return listProducts(m, { title: t("shop") }); });
  B.registerPage("category", async (m) => {
    const c = B.qs.get("c") || "", cats = await loadCats(), cat = cats.find((x) => x.id === c);
    const name = cat ? catName(cat) : t("category");
    B.setMeta({ title: name, desc: name + " – " + B.settings.siteName });
    return listProducts(m, { fixedCat: c, title: name });
  });
  B.registerPage("search", (m) => {
    const q = (B.qs.get("q") || "").trim().slice(0, 60);
    B.setMeta({ title: t("searchResult") + (q ? ": " + q : "") });
    return listProducts(m, { q, title: t("searchResult") + (q ? ": " + q : "") });
  });

  /* ---------- home ---------- */
  B.registerPage("home", async (m) => {
    B.setMeta({ title: B.settings.siteName, desc: t("footNote"), url: location.origin + "/" });
    const cats = await loadCats();
    let latest = [];
    try { latest = fromDocs(await F.getDocs(F.query(F.collection(db, "products"), F.where("status", "==", "published"), F.orderBy("createdAt", "desc"), F.limit(12)))); } catch (e) { console.warn(e.code); }
    const rid = getRecent(); let recent = [];
    await Promise.all(rid.map(async (id) => { try { const s = await F.getDoc(F.doc(db, "products", id)); if (s.exists() && s.data().status === "published") recent[rid.indexOf(id)] = { id, ...s.data() }; } catch (e) { /* skip */ } }));
    recent = recent.filter(Boolean).slice(0, 6);
    await Promise.all([loadStats([...latest, ...recent].map((p) => p.sellerId)), loadWish()]);
    const p = B.num(B.settings.advancePercent);
    m.innerHTML = `
      <section class="bv-card bv-pad" style="margin-bottom:16px"><h2 style="margin:0 0 8px">${esc(t("how"))}</h2>
        <ol style="margin:0;padding-left:20px"><li>${esc(t("how1"))}</li><li>${esc(t("how2", { p }))}</li><li>${esc(t("how3"))}</li></ol></section>
      ${cats.length ? `<h2 class="bv-h1">${esc(t("cats"))}</h2><div class="bv-row">${cats.map((c) => `<a class="bv-btn sec" href="${B.url("category", { c: c.id })}">${esc(catName(c))}</a>`).join("")}</div>` : ""}
      <div class="bv-row" style="justify-content:space-between;margin-top:20px"><h2 class="bv-h1" style="margin:0">${esc(t("latest"))}</h2><a href="${B.url("shop")}">${esc(t("seeAll"))} →</a></div>
      ${latest.length ? `<div class="bv-grid" id="bv-latest">${latest.map(card).join("")}</div>` : B.ui.empty()}
      ${recent.length ? `<h2 class="bv-h1" style="margin-top:20px">${esc(t("recent"))}</h2><div class="bv-grid" id="bv-rec">${recent.map(card).join("")}</div>` : ""}`;
    bindHearts(m);
  });

  /* ---------- product details ---------- */
  B.registerPage("product", async (m, qs) => {
    const id = qs.get("id") || "";
    if (!/^[A-Za-z0-9_-]{1,60}$/.test(id)) { m.innerHTML = B.ui.empty(t("prodNotFound")); return; }
    let snap;
    try { snap = await F.getDoc(F.doc(db, "products", id)); } catch (e) { m.innerHTML = B.ui.empty(t("prodNotFound")); return; }
    if (!snap.exists()) { m.innerHTML = B.ui.empty(t("prodNotFound")); return; }
    const p = { id, ...snap.data() };
    const published = p.status === "published";
    if (published) pushRecent(id);
    const imgs = (p.images || []).map((u) => B.safeUrl(u)).filter(Boolean);
    const cats = await loadCats(), cat = cats.find((c) => c.id === p.categoryId);
    let prof = null;
    try { const s = await F.getDoc(F.doc(db, "publicProfiles", p.sellerId)); if (s.exists()) prof = s.data(); } catch (e) { /* none */ }
    await Promise.all([loadStats([p.sellerId]), loadWish()]);
    let reviews = [];
    try { reviews = fromDocs(await F.getDocs(F.query(F.collection(db, "reviews"), F.where("productId", "==", id), F.where("status", "==", "visible"), F.orderBy("createdAt", "desc"), F.limit(5)))); } catch (e) { /* index may be missing */ }
    let related = [];
    try { related = fromDocs(await F.getDocs(F.query(F.collection(db, "products"), F.where("status", "==", "published"), F.where("categoryId", "==", p.categoryId), F.orderBy("createdAt", "desc"), F.limit(9)))).filter((x) => x.id !== id).slice(0, 8); } catch (e) { /* ignore */ }
    await loadStats(related.map((x) => x.sellerId));

    const url = location.origin + B.url("product", { id });
    const desc = String(p.description || "").slice(0, 160);
    B.setMeta({ title: p.title, desc, image: imgs[0], url });
    if (published) setJsonLd({ "@context": "https://schema.org", "@type": "Product", name: p.title, image: imgs, description: desc, url,
      ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
      itemCondition: p.condition === "brand_new" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      offers: { "@type": "Offer", price: p.price, priceCurrency: "BDT", url, availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", itemCondition: p.condition === "brand_new" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition" } });

    const own = B.user && B.user.uid === p.sellerId;
    const row = (k, v) => (v ? `<tr><th scope="row">${esc(t(k))}</th><td>${v}</td></tr>` : "");
    const dopts = (p.deliveryOptions || []).map((d) => esc(t(d === "pickup" ? "pickup" : "homeDelivery"))).join(", ");
    const can = published && p.stock > 0 && !own;
    m.innerHTML = `
      <nav class="bv-meta" aria-label="Breadcrumb"><a href="${B.url("home")}">${esc(t("home"))}</a> › <a href="${B.url("shop")}">${esc(t("shop"))}</a>${cat ? ` › <a href="${B.url("category", { c: cat.id })}">${esc(catName(cat))}</a>` : ""}</nav>
      ${!published ? `<div class="bv-banner" style="margin:8px 0">${esc(t("notPublished"))} ${B.ui.statusChip("p", p.status)}</div>` : ""}
      <div class="bv-card bv-pad" style="margin-top:8px"><div style="display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">
        <div>${imgs.length ? `<img id="bv-main" src="${esc(B.img(imgs[0], 900))}" alt="${esc(p.title)}" style="width:100%;border-radius:10px">` : ""}
          <div class="bv-row" style="margin-top:8px">${imgs.map((u, i) => `<img loading="lazy" data-i="${i}" src="${esc(B.img(u, 120))}" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:8px;cursor:pointer;border:1px solid var(--bv-border)">`).join("")}</div></div>
        <div>
          <h1 class="bv-h1" style="margin-top:0">${esc(p.title)}</h1>
          <div><span class="bv-price" style="font-size:1.6rem">${B.taka(p.price)}</span>${p.originalPrice > p.price ? `<span class="bv-old">${B.taka(p.originalPrice)}</span>` : ""}${p.offerNote ? ` <span class="bv-chip warn">${esc(p.offerNote)}</span>` : ""}</div>
          <div class="bv-row" style="margin:8px 0"><span class="bv-chip">${esc(t("cond_" + p.condition))}</span><span class="bv-chip gray">${esc(t(p.negotiable ? "negotiable" : "fixedPrice"))}</span>
            <span class="bv-meta">📍 ${esc(B.districtName(p.district))}, ${esc(p.area)}</span></div>
          <div class="bv-meta">${p.stock > 0 ? esc(t("inStock", { n: B.num(p.stock) })) : esc(t("pst_sold_out"))}</div>
          <div class="bv-card bv-pad" style="background:#fff8e6;border-color:#f3d28a;margin:12px 0"><strong>⚠ ${esc(t("defects"))}</strong><div>${nl2br(p.defects) || esc(t("noDefects"))}</div></div>
          ${can ? `<label for="bv-qty">${esc(t("qty"))}</label><input id="bv-qty" type="number" min="1" max="${Math.min(p.stock, 99)}" value="1" inputmode="numeric" style="max-width:120px">
            <p class="bv-hint">${esc(t("advanceNote", { p: B.num(B.settings.advancePercent) }))}</p>
            <div class="bv-row"><button class="bv-btn" id="bv-buy">${esc(t("buyNow"))}</button><button class="bv-btn sec" id="bv-cart">${esc(t("addCart"))}</button></div>` : own ? `<p class="bv-hint">${esc(t("ownProduct"))}</p>` : ""}
          <div class="bv-row" style="margin-top:10px"><button class="bv-btn sec" id="bv-wish">${B.wish && B.wish.has(id) ? "♥ " + esc(t("wishRemove")) : "♡ " + esc(t("wishAdd"))}</button>
            <a href="${B.url("report", { type: "product", id })}">⚑ ${esc(t("report"))}</a></div>
        </div></div></div>
      <div class="bv-card bv-pad" style="margin-top:12px"><div class="bv-scroll"><table class="bv-table"><tbody>
        ${row("brand", esc(p.brand || ""))}${row("model", esc(p.model || ""))}${row("usage", esc(p.usageDuration || ""))}${row("purchased", p.purchaseYear ? B.num(p.purchaseYear).replace(/,/g, "") : "")}
        ${row("accessories", nl2br(p.accessories || ""))}${row("warranty", nl2br(p.warrantyInfo || ""))}${row("delivery", dopts)}
        ${row("features", nl2br(p.features || ""))}${row("sellerNotes", nl2br(p.sellerNotes || ""))}${row("returnPolicy", nl2br(p.returnPolicy || ""))}
      </tbody></table></div>
        <h2 style="margin-bottom:4px">${esc(t("desc"))}</h2><p>${nl2br(p.description)}</p></div>
      <div class="bv-card bv-pad" style="margin-top:12px"><strong>${esc(t("seller"))}:</strong> ${esc((prof && prof.displayName) || p.sellerName)} ${ratingHtml(p.sellerId)}
        <div style="margin-top:8px"><a class="bv-btn sec" href="${B.url("seller", { id: p.sellerId })}">${esc(t("viewShop"))}</a></div></div>
      <h2 class="bv-h1" style="margin-top:16px">${esc(t("reviews"))}</h2>
      ${reviews.length ? reviews.map((r) => `<div class="bv-card bv-pad" style="margin-bottom:8px"><div style="color:#f59e0b" aria-label="${r.rating}/5">${stars(r.rating)}</div><div>${nl2br(r.comment || "")}</div><div class="bv-meta">${esc(r.buyerName || "")} · ${esc(B.fmtDate(r.createdAt, false))}</div></div>`).join("") : B.ui.empty(t("noReviews"))}
      ${related.length ? `<h2 class="bv-h1" style="margin-top:16px">${esc(t("related"))}</h2><div class="bv-grid" id="bv-rel">${related.map(card).join("")}</div>` : ""}`;
    bindHearts(m);
    m.querySelectorAll("[data-i]").forEach((th) => { th.onclick = () => { const main = m.querySelector("#bv-main"); if (main) main.src = B.img(imgs[Number(th.dataset.i)], 900); }; });
    const qtyVal = () => Math.max(1, Math.min(Number(m.querySelector("#bv-qty")?.value) || 1, p.stock, 99));
    const wishBtn = m.querySelector("#bv-wish");
    wishBtn.onclick = async () => { try { const r = await toggleWish(id); if (r !== null) wishBtn.textContent = r ? "♥ " + t("wishRemove") : "♡ " + t("wishAdd"); } catch (e) { B.toast(B.errMsg(e), "bad"); } };
    const cartBtn = m.querySelector("#bv-cart"), buyBtn = m.querySelector("#bv-buy");
    if (cartBtn) cartBtn.onclick = () => B.btnBusy(cartBtn, async () => { try { if (await addToCart(p, qtyVal())) B.toast(t("added"), "ok"); } catch (e) { B.toast(B.errMsg(e), "bad"); } });
    if (buyBtn) buyBtn.onclick = () => B.btnBusy(buyBtn, async () => { try { if (await addToCart(p, qtyVal())) location.href = B.url("cart"); } catch (e) { B.toast(B.errMsg(e), "bad"); } });
  });

  /* ---------- seller public profile ---------- */
  B.registerPage("seller", async (m, qs) => {
    const id = qs.get("id") || "";
    if (!/^[A-Za-z0-9_-]{1,60}$/.test(id)) { m.innerHTML = B.ui.empty(); return; }
    const ps = await F.getDoc(F.doc(db, "publicProfiles", id));
    if (!ps.exists()) { m.innerHTML = B.ui.empty(t("prodNotFound")); return; }
    const pr = ps.data();
    await loadStats([id]); const s = _stats[id];
    let count = 0, items = [], reviews = [];
    try { count = (await F.getCountFromServer(F.query(F.collection(db, "products"), F.where("status", "==", "published"), F.where("sellerId", "==", id)))).data().count; } catch (e) { /* ignore */ }
    try { items = fromDocs(await F.getDocs(F.query(F.collection(db, "products"), F.where("status", "==", "published"), F.where("sellerId", "==", id), F.orderBy("createdAt", "desc"), F.limit(20)))); } catch (e) { /* ignore */ }
    try { reviews = fromDocs(await F.getDocs(F.query(F.collection(db, "reviews"), F.where("sellerId", "==", id), F.where("status", "==", "visible"), F.orderBy("createdAt", "desc"), F.limit(10)))); } catch (e) { /* ignore */ }
    await loadWish();
    B.setMeta({ title: pr.displayName, desc: String(pr.bio || "").slice(0, 160) });
    const photo = B.img(pr.photoURL, 160);
    m.innerHTML = `
      <div class="bv-card bv-pad"><div class="bv-row">${photo ? `<img src="${esc(photo)}" alt="" style="width:80px;height:80px;border-radius:50%;object-fit:cover">` : ""}
        <div><h1 class="bv-h1" style="margin:0">${esc(pr.displayName)}</h1><div class="bv-meta">📍 ${esc(B.districtName(pr.district))}, ${esc(pr.area)} · ${esc(t("joined"))} ${esc(B.fmtDate(pr.joinedAt, false))}</div>
        ${pr.status === "suspended" ? `<span class="bv-chip bad">${esc(t("suspendedSeller"))}</span>` : ""}</div></div>
        <p>${nl2br(pr.bio || "")}</p>
        <div class="bv-row"><span class="bv-chip">${esc(t("listings"))}: ${B.num(count)}</span><span class="bv-chip">${esc(t("sales"))}: ${B.num(s ? s.completedSales : 0)}</span>
          <span class="bv-chip">${esc(t("rating"))}: ${s && s.ratingCount ? "★ " + num1(s.ratingSum / s.ratingCount) + " (" + B.num(s.ratingCount) + ")" : esc(t("noReviews"))}</span></div>
        <div style="margin-top:8px"><a href="${B.url("report", { type: "user", id })}">⚑ ${esc(t("report"))}</a></div></div>
      <h2 class="bv-h1" style="margin-top:16px">${esc(t("listings"))}</h2>
      ${items.length ? `<div class="bv-grid">${items.map(card).join("")}</div>` : B.ui.empty()}
      <h2 class="bv-h1" style="margin-top:16px">${esc(t("reviews"))}</h2>
      ${reviews.length ? reviews.map((r) => `<div class="bv-card bv-pad" style="margin-bottom:8px"><div style="color:#f59e0b">${stars(r.rating)}</div><div>${nl2br(r.comment || "")}</div><div class="bv-meta">${esc(r.buyerName || "")} · ${esc(r.productTitle || "")} · ${esc(B.fmtDate(r.createdAt, false))}</div></div>`).join("") : B.ui.empty(t("noReviews"))}`;
    bindHearts(m);
  });

  /* ---------- auth (login / register / reset) ---------- */
  B.registerPage("auth", async (m, qs) => {
    B.setMeta({ title: t("authTitle") });
    const next = safeNext(qs.get("next") || "/");
    if (B.user) {
      m.innerHTML = `<div class="bv-card bv-pad"><p>${esc(t("signedAs"))} <strong>${esc(B.user.email)}</strong></p><div class="bv-row"><a class="bv-btn" href="${esc(next)}">${esc(t("continue"))}</a><a class="bv-btn sec" href="${B.url("account")}">${esc(t("account"))}</a><button class="bv-btn sec" id="lo">${esc(t("logout"))}</button></div></div>`;
      m.querySelector("#lo").onclick = () => B.signOut(); return;
    }
    let mode = qs.get("mode") === "register" ? "register" : "login";
    const draw = () => {
      const reg = mode === "register", reset = mode === "reset";
      m.innerHTML = `<div class="bv-card bv-pad" style="max-width:480px;margin:0 auto"><h1 class="bv-h1">${esc(reset ? t("forgot") : reg ? t("register") : t("login"))}</h1>
        <form id="af" novalidate>
          ${reg ? `<label for="a-n">${esc(t("name"))}</label><input id="a-n" autocomplete="name" maxlength="60" required>` : ""}
          <label for="a-e">${esc(t("email"))}</label><input id="a-e" type="email" autocomplete="email" inputmode="email" required>
          ${reg ? `<label for="a-p">${esc(t("phone"))}</label><input id="a-p" type="tel" autocomplete="tel" inputmode="tel" placeholder="${esc(t("phoneHint"))}" required>` : ""}
          ${reset ? "" : `<label for="a-w">${esc(t("password"))}</label><input id="a-w" type="password" autocomplete="${reg ? "new-password" : "current-password"}" minlength="6" required>`}
          ${reg ? `<fieldset style="border:0;padding:0;margin:12px 0 0"><legend style="font-weight:600">${esc(t("accType"))}</legend>
            <label style="font-weight:400"><input type="radio" name="ty" value="buyer" checked style="width:auto;min-height:0"> ${esc(t("buyerType"))}</label>
            <label style="font-weight:400"><input type="radio" name="ty" value="seller" style="width:auto;min-height:0"> ${esc(t("sellerType"))}</label></fieldset>
            <label style="font-weight:400"><input type="checkbox" id="a-ag" style="width:auto;min-height:0"> ${esc(t("agreeTerms"))} (<a href="${B.url("terms")}" target="_blank" rel="noopener">${esc(t("terms"))}</a>, <a href="${B.url("privacy")}" target="_blank" rel="noopener">${esc(t("privacy"))}</a>)</label>` : ""}
          <div class="bv-err" id="a-err" role="alert"></div>
          <button class="bv-btn block" style="margin-top:12px" type="submit">${esc(reset ? t("sendReset") : reg ? t("register") : t("login"))}</button></form>
        <div class="bv-row" style="margin-top:12px;justify-content:space-between">
          <a href="#" data-m="${reg ? "login" : "register"}">${esc(reg ? t("haveAcc") : t("noAcc"))}</a>${mode === "login" ? `<a href="#" data-m="reset">${esc(t("forgot"))}</a>` : reset ? `<a href="#" data-m="login">${esc(t("login"))}</a>` : ""}</div></div>`;
      m.querySelectorAll("[data-m]").forEach((a) => { a.onclick = (e) => { e.preventDefault(); mode = a.dataset.m; draw(); }; });
      const form = m.querySelector("#af"), err = m.querySelector("#a-err"), btn = form.querySelector("button[type=submit]");
      form.onsubmit = (e) => { e.preventDefault(); B.btnBusy(btn, async () => {
        err.textContent = "";
        const v = (id) => (m.querySelector(id) ? m.querySelector(id).value : "");
        try {
          if (reset) { try { await B.resetPassword(v("#a-e")); } catch (x) { /* do not reveal if email exists */ } err.style.color = "var(--bv-ok)"; err.textContent = t("resetSent"); return; }
          if (!/^\S+@\S+\.\S+$/.test(v("#a-e").trim())) { err.textContent = B.errMsg({ code: "auth/invalid-email" }); return; }
          if (!reg) { await B.signIn(v("#a-e"), v("#a-w")); location.href = next; return; }
          if (v("#a-n").trim().length < 2) { err.textContent = t("badName"); return; }
          if (!B.normPhone(v("#a-p"))) { err.textContent = t("badPhone"); return; }
          if (v("#a-w").length < 6) { err.textContent = B.errMsg({ code: "auth/weak-password" }); return; }
          if (!m.querySelector("#a-ag").checked) { err.textContent = t("mustAgree"); return; }
          const type = m.querySelector("input[name=ty]:checked").value;
          await B.signUp({ name: v("#a-n"), email: v("#a-e"), password: v("#a-w"), phone: v("#a-p"), type });
          const go = type === "seller" ? B.url("becomeSeller") : next;
          m.innerHTML = `<div class="bv-card bv-pad" style="max-width:480px;margin:0 auto"><h1 class="bv-h1">${esc(t("regDone"))}</h1><p>${esc(t("regDoneMsg"))}</p><div class="bv-row"><a class="bv-btn" href="${esc(go)}">${esc(t("continue"))}</a></div></div>`;
        } catch (x) { err.textContent = B.errMsg(x); }
      }); };
    };
    draw();
  });

  /* ---------- seller application + public profile setup ---------- */
  B.registerPage("seller-apply", async (m) => {
    B.setMeta({ title: t("applyTitle") });
    if (!B.requireVerified(m)) return;
    if (!B.profile) { location.href = B.url("account"); return; }
    const uid = B.user.uid;
    const status = B.profile.sellerStatus;
    if (status === "suspended") { m.innerHTML = B.ui.error(t("suspended")); return; }

    if (status === "approved") {
      let prof = null; try { const s = await F.getDoc(F.doc(db, "publicProfiles", uid)); if (s.exists()) prof = s.data(); } catch (e) { /* none */ }
      let app = null; try { const s = await F.getDoc(F.doc(db, "sellerApplications", uid)); if (s.exists()) app = s.data(); } catch (e) { /* none */ }
      const d = prof || { displayName: (app && app.shopName) || B.profile.name, district: (app && app.district) || "Dhaka", area: (app && app.area) || "", bio: (app && app.about) || "" };
      m.innerHTML = `<div class="bv-card bv-pad"><h1 class="bv-h1">${esc(t("appApproved"))}</h1><a class="bv-btn" href="${B.url("sellerDash")}">${esc(t("goDash"))}</a></div>
        <div class="bv-card bv-pad" style="margin-top:12px"><h2 style="margin-top:0">${esc(t("profileSetup"))}</h2><form id="pf">
          <label for="p-n">${esc(t("shopName"))}</label><input id="p-n" maxlength="60" value="${esc(d.displayName)}">
          <label for="p-d">${esc(t("district"))}</label><select id="p-d">${B.districtOptions(d.district)}</select>
          <label for="p-a">${esc(t("area"))}</label><input id="p-a" maxlength="60" value="${esc(d.area)}">
          <label for="p-b">${esc(t("bio"))}</label><textarea id="p-b" maxlength="500">${esc(d.bio)}</textarea>
          <label for="p-f">${esc(t("photo"))}</label><input id="p-f" type="file" accept="image/jpeg,image/png,image/webp">
          <div class="bv-err" id="p-err" role="alert"></div><button class="bv-btn" style="margin-top:12px" type="submit">${esc(t("saveProfile"))}</button></form></div>`;
      const form = m.querySelector("#pf"), err = m.querySelector("#p-err");
      form.onsubmit = (e) => { e.preventDefault(); B.btnBusy(form.querySelector("button"), async () => {
        err.textContent = "";
        try {
          const name = m.querySelector("#p-n").value.trim(), area = m.querySelector("#p-a").value.trim();
          if (name.length < 2 || area.length < 2) { err.textContent = t("badName"); return; }
          const file = m.querySelector("#p-f").files[0];
          let photoURL = prof && prof.photoURL; if (file) photoURL = await B.uploadImage(file);
          const base = { displayName: name, district: m.querySelector("#p-d").value, area, bio: m.querySelector("#p-b").value.trim().slice(0, 500), updatedAt: F.serverTimestamp() };
          if (photoURL) base.photoURL = photoURL;
          if (prof) await F.updateDoc(F.doc(db, "publicProfiles", uid), base);
          else await F.setDoc(F.doc(db, "publicProfiles", uid), { ...base, joinedAt: F.serverTimestamp() });
          B.toast(t("saved"), "ok"); prof = prof || {};
        } catch (x) { err.textContent = x.code ? B.errMsg(x) : x.message; }
      }); };
      return;
    }

    let app = null; try { const s = await F.getDoc(F.doc(db, "sellerApplications", uid)); if (s.exists()) app = s.data(); } catch (e) { /* none */ }
    if (app && app.status === "pending") { m.innerHTML = `<div class="bv-card bv-pad"><h1 class="bv-h1">${esc(t("applyTitle"))}</h1><p>${esc(t("appPending"))}</p></div>`; return; }
    const d = app || { shopName: "", district: "Dhaka", area: "", about: "" };
    m.innerHTML = `<div class="bv-card bv-pad" style="max-width:560px;margin:0 auto"><h1 class="bv-h1">${esc(t("applyTitle"))}</h1>
      ${app && app.status === "rejected" ? `<div class="bv-banner" role="alert">${esc(t("appRejected"))}${app.adminNote ? `<br>${esc(t("adminNote"))}: ${esc(app.adminNote)}` : ""}</div>` : ""}
      <p class="bv-hint">${esc(t("applyNote"))}</p><form id="sf">
        <label for="s-n">${esc(t("shopName"))}</label><input id="s-n" maxlength="60" value="${esc(d.shopName)}" required>
        <label for="s-d">${esc(t("district"))}</label><select id="s-d">${B.districtOptions(d.district)}</select>
        <label for="s-a">${esc(t("area"))}</label><input id="s-a" maxlength="60" value="${esc(d.area)}" required>
        <label for="s-o">${esc(t("about"))}</label><textarea id="s-o" maxlength="800" required>${esc(d.about)}</textarea>
        <label style="font-weight:400"><input type="checkbox" id="s-ag" style="width:auto;min-height:0"> ${esc(t("agreeTerms"))}</label>
        <div class="bv-err" id="s-err" role="alert"></div><button class="bv-btn block" style="margin-top:12px" type="submit">${esc(app ? t("reapply") : t("apply"))}</button></form></div>`;
    const form = m.querySelector("#sf"), err = m.querySelector("#s-err");
    form.onsubmit = (e) => { e.preventDefault(); B.btnBusy(form.querySelector("button"), async () => {
      err.textContent = "";
      const shopName = m.querySelector("#s-n").value.trim(), area = m.querySelector("#s-a").value.trim(), about = m.querySelector("#s-o").value.trim();
      if (shopName.length < 2 || area.length < 2 || about.length < 10) { err.textContent = B.lang === "bn" ? "সব ঘর পূরণ করুন (বিবরণ কমপক্ষে ১০ অক্ষর)।" : "Fill all fields (about: min 10 characters)."; return; }
      if (!m.querySelector("#s-ag").checked) { err.textContent = t("mustAgree"); return; }
      const ts = F.serverTimestamp(), district = m.querySelector("#s-d").value;
      try {
        if (app) await F.updateDoc(F.doc(db, "sellerApplications", uid), { shopName, district, area, about, agreedTerms: true, status: "pending", updatedAt: ts });
        else await F.setDoc(F.doc(db, "sellerApplications", uid), { uid, shopName, district, area, about, agreedTerms: true, status: "pending", createdAt: ts, updatedAt: ts });
        B.toast(t("applied"), "ok"); B.pages["seller-apply"](m);
      } catch (x) { err.textContent = B.errMsg(x); }
    }); };
  });

  /* ---------- buyer dashboard / account ---------- */
  B.registerPage("buyer-dash", async (m) => {
    B.setMeta({ title: t("myAccount") });
    if (!B.requireLogin(m)) return;
    if (!B.profile) {
      m.innerHTML = `<div class="bv-card bv-pad" style="max-width:480px;margin:0 auto"><h1 class="bv-h1">${esc(t("completeProfile"))}</h1><form id="cf">
        <label for="c-n">${esc(t("name"))}</label><input id="c-n" maxlength="60" required><label for="c-p">${esc(t("phone"))}</label><input id="c-p" type="tel" inputmode="tel" placeholder="${esc(t("phoneHint"))}" required>
        <div class="bv-err" id="c-err" role="alert"></div><button class="bv-btn block" style="margin-top:12px" type="submit">${esc(t("save"))}</button></form></div>`;
      const form = m.querySelector("#cf"), err = m.querySelector("#c-err");
      form.onsubmit = (e) => { e.preventDefault(); B.btnBusy(form.querySelector("button"), async () => {
        const name = m.querySelector("#c-n").value.trim(), ph = B.normPhone(m.querySelector("#c-p").value);
        if (name.length < 2) { err.textContent = t("badName"); return; } if (!ph) { err.textContent = t("badPhone"); return; }
        const ts = F.serverTimestamp();
        try { await F.setDoc(F.doc(db, "users", B.user.uid), { uid: B.user.uid, name, email: B.user.email, phone: ph, requestedType: "buyer", role: "buyer", sellerStatus: "none", status: "active", createdAt: ts, updatedAt: ts }); location.reload(); }
        catch (x) { err.textContent = B.errMsg(x); }
      }); };
      return;
    }
    const pr = B.profile;
    await loadWish();
    const ids = [...(B.wish || [])].slice(0, 20); let wl = [];
    await Promise.all(ids.map(async (id) => { try { const s = await F.getDoc(F.doc(db, "products", id)); if (s.exists() && s.data().status === "published") wl.push({ id, ...s.data() }); } catch (e) { /* skip */ } }));
    await loadStats(wl.map((p) => p.sellerId));
    m.innerHTML = `
      <h1 class="bv-h1">${esc(t("myAccount"))}</h1>
      <div class="bv-card bv-pad"><div class="bv-row"><span class="bv-chip ${B.user.emailVerified ? "" : "warn"}">${esc(t(B.user.emailVerified ? "verified" : "notVerified"))}</span>
        <span class="bv-chip gray">${esc(t("accStatus"))}: ${esc(t("as_" + pr.status))}</span><span class="bv-chip gray">${esc(t("sellerStatus"))}: ${esc(t("ss_" + pr.sellerStatus))}</span></div>
        <p class="bv-meta">${esc(pr.email)}</p>
        <form id="ef"><label for="e-n">${esc(t("name"))}</label><input id="e-n" maxlength="60" value="${esc(pr.name)}"><label for="e-p">${esc(t("phone"))}</label><input id="e-p" type="tel" value="${esc(pr.phone)}">
          <div class="bv-err" id="e-err" role="alert"></div><button class="bv-btn" style="margin-top:12px" type="submit">${esc(t("editProfile"))}</button></form>
        <div class="bv-row" style="margin-top:12px"><a class="bv-btn sec" href="${B.url("orders")}">${esc(t("orders"))}</a>
          ${pr.sellerStatus === "approved" ? `<a class="bv-btn sec" href="${B.url("sellerDash")}">${esc(t("sellerDash"))}</a>` : `<a class="bv-btn sec" href="${B.url("becomeSeller")}">${esc(t("sell"))}</a>`}
          <button class="bv-btn sec" id="rp">${esc(t("resetPw"))}</button></div></div>
      <h2 class="bv-h1" style="margin-top:16px">${esc(t("wishlist"))}</h2>${wl.length ? `<div class="bv-grid">${wl.map(card).join("")}</div>` : B.ui.empty()}`;
    bindHearts(m);
    const form = m.querySelector("#ef"), err = m.querySelector("#e-err");
    form.onsubmit = (e) => { e.preventDefault(); B.btnBusy(form.querySelector("button"), async () => {
      err.textContent = "";
      const name = m.querySelector("#e-n").value.trim(), ph = B.normPhone(m.querySelector("#e-p").value);
      if (name.length < 2) { err.textContent = t("badName"); return; } if (!ph) { err.textContent = t("badPhone"); return; }
      try { await F.updateDoc(F.doc(db, "users", B.user.uid), { name, phone: ph, updatedAt: F.serverTimestamp() }); B.profile.name = name; B.profile.phone = ph; B.toast(t("saved"), "ok"); }
      catch (x) { err.textContent = B.errMsg(x); }
    }); };
    m.querySelector("#rp").onclick = async () => { try { await B.resetPassword(B.user.email); B.toast(t("resetSent"), "ok"); } catch (x) { B.toast(B.errMsg(x), "bad"); } };
  });
})();
