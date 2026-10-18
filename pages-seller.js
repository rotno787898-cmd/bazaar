/* Bazaar BD – pages-seller.js (Part 4). Paste in the SAME <script type="module"> block, BELOW pages-public.js.
   Pages: seller-dash, product-form. Needs B.loadCats / B.catName / B.loadStats from pages-public.js. */
(function () {
  const B = window.BV;
  const { F, db, esc, t } = B;

  B.addI18n({
    bn: {
      sdTitle: "সেলার ড্যাশবোর্ড", notSeller: "এই পেজ শুধু অনুমোদিত বিক্রেতাদের জন্য।", applyNow: "বিক্রেতা হওয়ার আবেদন করুন",
      noPublicProfile: "আপনার পাবলিক প্রোফাইল এখনো বানানো হয়নি। ক্রেতারা আপনাকে চিনতে পারবে না।", makeProfile: "প্রোফাইল বানান",
      addProduct: "নতুন পণ্য যোগ করুন", editProfile2: "প্রোফাইল বদলান",
      stTotal: "মোট পণ্য", stPending: "যাচাইয়ের অপেক্ষায়", stPublished: "প্রকাশিত", stRejected: "বাতিল", stDraft: "খসড়া", stPaused: "বন্ধ রাখা",
      stActiveOrders: "চলমান অর্ডার", stCompleted: "সম্পন্ন বিক্রি", stCancelled: "বাতিল অর্ডার", stUnits: "বিক্রি হওয়া পণ্য (সংখ্যা)", stRating: "গড় রেটিং",
      unitsNote: "সর্বশেষ ২০০টি সম্পন্ন অর্ডার থেকে গণনা", ratingNote: "অ্যাডমিন হিসাব হালনাগাদ করলে বদলায়",
      tabProducts: "আমার পণ্য", tabOrders: "অর্ডার ও বিক্রির ইতিহাস", tabReviews: "রিভিউ",
      allStatus: "সব অবস্থা", edit: "এডিট", delete: "মুছুন", pause: "বন্ধ রাখুন", resume: "চালু করুন", submitReview: "যাচাইয়ে পাঠান", saveStock: "স্টক সংরক্ষণ",
      stockLabel: "স্টক", reason: "বাতিলের কারণ", editNote: "দাম, অফার বা বিবরণ বদলাতে 'এডিট' চাপুন। প্রকাশিত পণ্যে বড় বদল করলে অ্যাডমিন আবার যাচাই করবেন, তখন পণ্য সাময়িক লুকানো থাকবে।",
      adminHold: "অ্যাডমিন এই পণ্য আটকে রেখেছেন", confirmDelete: "খসড়াটি স্থায়ীভাবে মুছবেন?", deleted: "মুছে ফেলা হয়েছে।", sentReview: "যাচাইয়ে পাঠানো হয়েছে।",
      stockSaved: "স্টক হালনাগাদ হয়েছে।", paused2: "পণ্য বন্ধ রাখা হয়েছে।", resumed: "পণ্য চালু হয়েছে।", noStockResume: "স্টক ০ থাকলে চালু করা যায় না।",
      markShipped: "পাঠিয়েছি", shipNote: "কুরিয়ার/ট্র্যাকিং নম্বর (ঐচ্ছিক)", shippedOk: "অর্ডার 'পাঠানো হয়েছে' করা হয়েছে।", viewOrder: "অর্ডার দেখুন",
      total: "মোট", cod: "ডেলিভারিতে", date: "তারিখ", viewsNote: "ভিউ সংখ্যা দেখানো হয় না: সার্ভার ছাড়া সঠিকভাবে গোনা যায় না।",
      violNote: "অভিযোগ বা নীতি লঙ্ঘনের খবর অ্যাডমিন নোটিফিকেশনে পাঠাবেন।", openNotes: "নোটিফিকেশন দেখুন",
      shipPayNote: "ক্রেতার ঠিকানা ও ফোন পেমেন্ট যাচাইয়ের পর অর্ডার পেজে দেখা যাবে।",
      // form
      pfNew: "নতুন পণ্য যোগ করুন", pfEdit: "পণ্য এডিট করুন", pfNotFound: "পণ্য পাওয়া যায়নি।", pfNotYours: "এটি আপনার পণ্য নয়।", pfRemoved: "এই পণ্য সরিয়ে ফেলা হয়েছে, এডিট করা যাবে না।",
      pfPubWarn: "এই পণ্য এখন প্রকাশিত। সেভ করলে অ্যাডমিন আবার যাচাই না করা পর্যন্ত এটি লুকানো থাকবে।",
      fTitle: "পণ্যের নাম", fCategory: "ক্যাটাগরি", fSub: "সাব-ক্যাটাগরি (ঐচ্ছিক)", fImages: "ছবি (১ থেকে ৬টি, প্রথমটি মূল ছবি)", fAddImg: "ছবি যোগ করুন",
      fPrice: "বিক্রয়মূল্য (টাকা)", fOrigPrice: "কেনার সময়ের দাম (ঐচ্ছিক)", fOffer: "অফার/ছাড়ের নোট (ঐচ্ছিক)", fNeg: "দর-কষাকষি করা যাবে?", fStock: "স্টক (পরিমাণ)",
      fCond: "পণ্যের অবস্থা", fUsage: "কতদিন ব্যবহার করেছেন", fYear: "কেনার বছর (ঐচ্ছিক)", fDesc: "বিবরণ", fFeat: "মূল সুবিধা (ঐচ্ছিক)",
      fDefects: "জানা ত্রুটি, সমস্যা ও মেরামতের ইতিহাস", fAcc: "সাথে কী কী পাবেন (ঐচ্ছিক)", fBrand: "ব্র্যান্ড (ঐচ্ছিক)", fModel: "মডেল (ঐচ্ছিক)", fWarranty: "ওয়ারেন্টি ও প্রমাণ (ঐচ্ছিক)",
      fDistrict: "জেলা", fArea: "এলাকা", fDelivery: "ডেলিভারি অপশন", fSellerNotes: "বিক্রেতার নোট (ঐচ্ছিক)", fReturn: "রিটার্ন/সমস্যা নিষ্পত্তির নিয়ম (ঐচ্ছিক)",
      fOwn: "আমি নিশ্চিত করছি এই পণ্যের মালিক আমি বা বিক্রির অনুমতি আমার আছে। চুরির বা নকল পণ্য নয়।",
      fDefectsHint: "সৎভাবে লিখুন। কিছু না থাকলে স্পষ্ট করে লিখুন (যেমন: কোনো ত্রুটি নেই)। ত্রুটি লুকালে অ্যাডমিন পণ্য সরাবেন ও অ্যাকাউন্ট স্থগিত করতে পারেন।",
      fPriceHint: "এটিই চূড়ান্ত দাম। অফার থাকলে ছাড়ের পরের দাম এখানে দিন, আগের দাম 'কেনার সময়ের দাম'-এ।",
      saveDraft: "খসড়া সংরক্ষণ", submitReview2: "যাচাইয়ের জন্য জমা দিন", uploading: "ছবি আপলোড হচ্ছে…", makeMain: "মূল ছবি করুন", remove: "সরান",
      maxImgs: "সর্বোচ্চ ৬টি ছবি।", needImg: "কমপক্ষে ১টি ছবি দিন।", savedDraft: "খসড়া সংরক্ষিত হয়েছে।", submitted: "যাচাইয়ের জন্য জমা হয়েছে।",
      eTitle: "নাম ৫ থেকে ১২০ অক্ষরের হতে হবে।", eCat: "ক্যাটাগরি বাছুন।", ePrice: "সঠিক দাম দিন (১ থেকে ১,০০,০০,০০০)।", eOrig: "কেনার সময়ের দাম সঠিক নয়।",
      eStock: "স্টক ১ থেকে ৯৯৯ এর মধ্যে হতে হবে।", eUsage: "ব্যবহৃত পণ্যে কতদিন ব্যবহার করেছেন লিখুন।", eYear: "বছর ১৯৯০ থেকে ২১০০ এর মধ্যে দিন।",
      eDesc: "বিবরণ কমপক্ষে ২০ অক্ষর।", eDefects: "ত্রুটির ঘরটি পূরণ করুন (কমপক্ষে ৫ অক্ষর)।", eArea: "এলাকা লিখুন।", eDelivery: "কমপক্ষে একটি ডেলিভারি অপশন বাছুন।",
      eOwn: "মালিকানার নিশ্চিতকরণে টিক দিন।", eLen: "কোনো ঘরের লেখা অনেক বড়।", noCats: "এখনো কোনো ক্যাটাগরি নেই। অ্যাডমিনকে ক্যাটাগরি যোগ করতে বলুন।",
    },
    en: {
      sdTitle: "Seller dashboard", notSeller: "This page is only for approved sellers.", applyNow: "Apply to become a seller",
      noPublicProfile: "Your public profile is not set up yet. Buyers will not know who you are.", makeProfile: "Set up profile",
      addProduct: "Add new product", editProfile2: "Edit profile",
      stTotal: "Total listings", stPending: "Pending review", stPublished: "Published", stRejected: "Rejected", stDraft: "Drafts", stPaused: "Paused",
      stActiveOrders: "Active orders", stCompleted: "Completed sales", stCancelled: "Cancelled orders", stUnits: "Units sold", stRating: "Average rating",
      unitsNote: "Counted from your latest 200 completed orders", ratingNote: "Changes when admin recalculates",
      tabProducts: "My products", tabOrders: "Orders & sales history", tabReviews: "Reviews",
      allStatus: "All statuses", edit: "Edit", delete: "Delete", pause: "Pause", resume: "Resume", submitReview: "Send for review", saveStock: "Save stock",
      stockLabel: "Stock", reason: "Rejection reason", editNote: "Use Edit to change price, offer or description. Big changes to a published listing are re-reviewed by an admin and the listing is hidden meanwhile.",
      adminHold: "An admin has put this listing on hold", confirmDelete: "Delete this draft permanently?", deleted: "Deleted.", sentReview: "Sent for review.",
      stockSaved: "Stock updated.", paused2: "Listing paused.", resumed: "Listing resumed.", noStockResume: "Cannot resume with zero stock.",
      markShipped: "Mark shipped", shipNote: "Courier / tracking number (optional)", shippedOk: "Order marked as shipped.", viewOrder: "View order",
      total: "Total", cod: "On delivery", date: "Date", viewsNote: "View counts are not shown: they cannot be counted accurately without a server.",
      violNote: "Reports or policy violations are sent to you by an admin as notifications.", openNotes: "Open notifications",
      shipPayNote: "Buyer address and phone appear on the order page after payment is verified.",
      pfNew: "Add a new product", pfEdit: "Edit product", pfNotFound: "Product not found.", pfNotYours: "This is not your product.", pfRemoved: "This listing was removed and cannot be edited.",
      pfPubWarn: "This listing is live. Saving hides it until an admin reviews it again.",
      fTitle: "Product name", fCategory: "Category", fSub: "Subcategory (optional)", fImages: "Photos (1 to 6, the first is the main photo)", fAddImg: "Add photos",
      fPrice: "Selling price (Taka)", fOrigPrice: "Original purchase price (optional)", fOffer: "Offer / discount note (optional)", fNeg: "Is the price negotiable?", fStock: "Stock (quantity)",
      fCond: "Condition", fUsage: "How long used", fYear: "Purchase year (optional)", fDesc: "Description", fFeat: "Main features (optional)",
      fDefects: "Known defects, problems and repair history", fAcc: "Included accessories (optional)", fBrand: "Brand (optional)", fModel: "Model (optional)", fWarranty: "Warranty and proof (optional)",
      fDistrict: "District", fArea: "Area", fDelivery: "Delivery options", fSellerNotes: "Seller notes (optional)", fReturn: "Return / dispute policy (optional)",
      fOwn: "I confirm I own this item or am authorised to sell it. It is not stolen or counterfeit.",
      fDefectsHint: "Be honest. If there are none, say so clearly (e.g. No defects). Hiding defects can get the listing removed and the account suspended.",
      fPriceHint: "This is the final price. For an offer, enter the price after discount here and the earlier price under original price.",
      saveDraft: "Save draft", submitReview2: "Submit for review", uploading: "Uploading photo…", makeMain: "Make main", remove: "Remove",
      maxImgs: "Maximum 6 photos.", needImg: "Add at least 1 photo.", savedDraft: "Draft saved.", submitted: "Submitted for review.",
      eTitle: "Name must be 5 to 120 characters.", eCat: "Choose a category.", ePrice: "Enter a valid price (1 to 10,000,000).", eOrig: "Original price is not valid.",
      eStock: "Stock must be between 1 and 999.", eUsage: "Tell us how long the item was used.", eYear: "Year must be between 1990 and 2100.",
      eDesc: "Description needs at least 20 characters.", eDefects: "Fill in the defects box (at least 5 characters).", eArea: "Enter the area.", eDelivery: "Choose at least one delivery option.",
      eOwn: "Please tick the ownership confirmation.", eLen: "One of the fields is too long.", noCats: "There are no categories yet. Ask the admin to add some.",
    },
  });

  const nl2br = (s) => esc(s).replace(/\n/g, "<br>");
  const digits = (s) => String(s || "").replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d));
  const toInt = (s) => { const x = digits(s).replace(/[^\d]/g, ""); return x ? Number(x) : NaN; };
  const fromDocs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const ACTIVE = ["payment_pending", "payment_submitted", "confirmed", "shipped", "delivered", "disputed"];
  const PSTATUS = ["draft", "pending_review", "published", "rejected", "paused", "sold_out", "removed"];

  function gate(m, needSeller) {
    if (!B.requireVerified(m)) return false;
    if (needSeller && !B.sellerApproved) {
      m.innerHTML = `<div class="bv-card bv-pad"><p>${esc(t("notSeller"))}</p><a class="bv-btn" href="${B.url("becomeSeller")}">${esc(t("applyNow"))}</a></div>`;
      return false;
    }
    return true;
  }

  /* ================= SELLER DASHBOARD ================= */
  B.registerPage("seller-dash", async (m) => {
    B.setMeta({ title: t("sdTitle") });
    if (!gate(m, true)) return;
    const uid = B.user.uid;
    const cnt = async (col, ...c) => { try { return (await F.getCountFromServer(F.query(F.collection(db, col), ...c))).data().count; } catch (e) { return 0; } };
    const pc = (s) => cnt("products", F.where("sellerId", "==", uid), F.where("status", "==", s));
    const [dr, pe, pu, rj, pa, so, rm, act, comp, canc] = await Promise.all([
      pc("draft"), pc("pending_review"), pc("published"), pc("rejected"), pc("paused"), pc("sold_out"), pc("removed"),
      cnt("orders", F.where("sellerId", "==", uid), F.where("status", "in", ACTIVE)),
      cnt("orders", F.where("sellerId", "==", uid), F.where("status", "==", "completed")),
      cnt("orders", F.where("sellerId", "==", uid), F.where("status", "==", "cancelled")),
    ]);
    let units = 0, unitsCapped = false;
    try {
      const s = await F.getDocs(F.query(F.collection(db, "orders"), F.where("sellerId", "==", uid), F.where("status", "==", "completed"), F.orderBy("createdAt", "desc"), F.limit(200)));
      s.forEach((d) => { units += Number(d.data().qty) || 0; }); unitsCapped = s.size >= 200;
    } catch (e) { /* index may be missing */ }
    let stats = null, hasProfile = false;
    try { const s = await F.getDoc(F.doc(db, "sellerStats", uid)); if (s.exists()) stats = s.data(); } catch (e) { /* none */ }
    try { hasProfile = (await F.getDoc(F.doc(db, "publicProfiles", uid))).exists(); } catch (e) { /* none */ }
    const total = dr + pe + pu + rj + pa + so;
    const tile = (label, val, note) => `<div class="bv-card bv-pad" style="text-align:center"><div style="font-size:1.6rem;font-weight:700;color:var(--bv-primary)">${val}</div><div>${esc(label)}</div>${note ? `<div class="bv-hint">${esc(note)}</div>` : ""}</div>`;
    m.innerHTML = `
      <div class="bv-row" style="justify-content:space-between"><h1 class="bv-h1" style="margin:0">${esc(t("sdTitle"))}</h1>
        <div class="bv-row"><a class="bv-btn" href="${B.url("sellForm")}">＋ ${esc(t("addProduct"))}</a><a class="bv-btn sec" href="${B.url("becomeSeller")}">${esc(t("editProfile2"))}</a></div></div>
      ${hasProfile ? "" : `<div class="bv-banner" style="margin-top:8px" role="alert">${esc(t("noPublicProfile"))} <a href="${B.url("becomeSeller")}">${esc(t("makeProfile"))}</a></div>`}
      <div class="bv-grid" style="margin-top:12px">
        ${tile(t("stTotal"), B.num(total))}${tile(t("stPending"), B.num(pe))}${tile(t("stPublished"), B.num(pu))}${tile(t("stRejected"), B.num(rj))}
        ${tile(t("stDraft"), B.num(dr))}${tile(t("stPaused"), B.num(pa + so))}${tile(t("stActiveOrders"), B.num(act))}${tile(t("stCompleted"), B.num(comp))}
        ${tile(t("stCancelled"), B.num(canc))}${tile(t("stUnits"), B.num(units) + (unitsCapped ? "+" : ""), t("unitsNote"))}
        ${tile(t("stRating"), stats && stats.ratingCount ? "★ " + new Intl.NumberFormat(B.lang === "bn" ? "bn-BD" : "en-BD", { maximumFractionDigits: 1 }).format(stats.ratingSum / stats.ratingCount) + " (" + B.num(stats.ratingCount) + ")" : "–", t("ratingNote"))}
      </div>
      <p class="bv-hint">${esc(t("viewsNote"))} ${esc(t("violNote"))} <a href="${B.url("notifications")}">${esc(t("openNotes"))}</a></p>
      <div class="bv-row" role="tablist" style="margin-top:12px">
        <button class="bv-btn" data-tab="p">${esc(t("tabProducts"))}</button><button class="bv-btn sec" data-tab="o">${esc(t("tabOrders"))}</button><button class="bv-btn sec" data-tab="r">${esc(t("tabReviews"))}</button></div>
      <div id="sd-tab" style="margin-top:12px"></div>`;
    const tabEl = m.querySelector("#sd-tab");
    const tabs = { p: productsTab, o: ordersTab, r: reviewsTab };
    m.querySelectorAll("[data-tab]").forEach((b) => { b.onclick = () => {
      m.querySelectorAll("[data-tab]").forEach((x) => { x.className = "bv-btn" + (x === b ? "" : " sec"); });
      tabs[b.dataset.tab](tabEl, uid);
    }; });
    productsTab(tabEl, uid);
  });

  /* ---- products tab ---- */
  async function productsTab(el, uid) {
    el.innerHTML = `<p class="bv-hint">${esc(t("editNote"))}</p>
      <label for="pt-s" class="bv-sr">${esc(t("allStatus"))}</label>
      <select id="pt-s" style="max-width:240px"><option value="">${esc(t("allStatus"))}</option>${PSTATUS.map((s) => `<option value="${s}">${esc(t("pst_" + s))}</option>`).join("")}</select>
      <div id="pt-list" style="margin-top:12px"></div><div id="pt-st"></div>
      <div class="bv-row" style="justify-content:center;margin-top:12px"><button class="bv-btn sec" id="pt-more" hidden>${esc(t("loadMore"))}</button></div>`;
    const list = el.querySelector("#pt-list"), st = el.querySelector("#pt-st"), more = el.querySelector("#pt-more"), sel = el.querySelector("#pt-s");
    let cursor = null, done = false, count = 0;
    const rowHtml = (p) => {
      const img = B.img(p.images && p.images[0], 160);
      const live = p.approved === true && !p.adminHold && ["published", "paused", "sold_out"].includes(p.status);
      return `<div class="bv-card bv-pad" style="margin-bottom:10px" data-pid="${esc(p.id)}">
        <div class="bv-row" style="align-items:flex-start;flex-wrap:nowrap">
          ${img ? `<img src="${esc(img)}" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:8px">` : ""}
          <div style="flex:1;min-width:0"><div style="font-weight:600">${esc(p.title)}</div>
            <div class="bv-meta">${B.taka(p.price)} · ${esc(t("stockLabel"))}: ${B.num(p.stock)} · ${esc(B.fmtDate(p.updatedAt, false))}</div>
            <div>${B.ui.statusChip("p", p.status)}${p.adminHold ? ` <span class="bv-chip bad">${esc(t("adminHold"))}</span>` : ""}</div>
            ${p.status === "rejected" && p.rejectionReason ? `<div class="bv-err">${esc(t("reason"))}: ${esc(p.rejectionReason)}</div>` : ""}</div></div>
        <div class="bv-row" style="margin-top:8px">
          ${p.status !== "removed" ? `<a class="bv-btn sec" href="${B.url("sellForm", { id: p.id })}">${esc(t("edit"))}</a>` : ""}
          ${p.status === "published" || p.status === "paused" ? `<a class="bv-btn sec" href="${B.url("product", { id: p.id })}">👁</a>` : ""}
          ${live ? `<input type="number" min="0" max="999" value="${Number(p.stock) || 0}" data-stock style="max-width:90px" aria-label="${esc(t("stockLabel"))}"><button class="bv-btn sec" data-act="stock">${esc(t("saveStock"))}</button>
            ${p.status === "paused" ? `<button class="bv-btn" data-act="resume">${esc(t("resume"))}</button>` : `<button class="bv-btn sec" data-act="pause">${esc(t("pause"))}</button>`}` : ""}
          ${p.status === "draft" ? `<button class="bv-btn" data-act="submit">${esc(t("submitReview"))}</button><button class="bv-btn danger" data-act="del">${esc(t("delete"))}</button>` : ""}
        </div></div>`;
    };
    const cache = {};
    async function load(reset) {
      if (reset) { list.innerHTML = ""; cursor = null; done = false; count = 0; }
      more.disabled = true; st.innerHTML = B.ui.loading();
      try {
        const c = [F.where("sellerId", "==", uid)]; if (sel.value) c.push(F.where("status", "==", sel.value));
        const args = [...c, F.orderBy("createdAt", "desc")]; if (cursor) args.push(F.startAfter(cursor)); args.push(F.limit(20));
        const snap = await F.getDocs(F.query(F.collection(db, "products"), ...args));
        if (snap.size < 20) done = true; if (snap.size) cursor = snap.docs[snap.size - 1];
        const items = fromDocs(snap); items.forEach((p) => { cache[p.id] = p; });
        count += items.length; list.insertAdjacentHTML("beforeend", items.map(rowHtml).join(""));
        st.innerHTML = count === 0 ? B.ui.empty() : ""; more.hidden = done;
      } catch (e) { console.error(e); st.innerHTML = B.ui.error(B.errMsg(e)); } finally { more.disabled = false; }
    }
    sel.onchange = () => load(true); more.onclick = () => load(false);
    list.onclick = async (e) => {
      const b = e.target.closest("[data-act]"); if (!b) return;
      const row = b.closest("[data-pid]"), id = row.dataset.pid, p = cache[id], ref = F.doc(db, "products", id);
      const ts = F.serverTimestamp();
      await B.btnBusy(b, async () => {
        try {
          if (b.dataset.act === "stock") {
            const v = toInt(row.querySelector("[data-stock]").value);
            if (!(v >= 0 && v <= 999)) { B.toast(t("eStock"), "bad"); return; }
            const status = v === 0 ? "sold_out" : p.status === "sold_out" ? "published" : p.status;
            await F.updateDoc(ref, { stock: v, status, updatedAt: ts }); B.toast(t("stockSaved"), "ok");
          } else if (b.dataset.act === "pause") { await F.updateDoc(ref, { status: "paused", updatedAt: ts }); B.toast(t("paused2"), "ok"); }
          else if (b.dataset.act === "resume") {
            if (!(p.stock > 0)) { B.toast(t("noStockResume"), "bad"); return; }
            await F.updateDoc(ref, { status: "published", updatedAt: ts }); B.toast(t("resumed"), "ok");
          } else if (b.dataset.act === "submit") { await F.updateDoc(ref, { status: "pending_review", updatedAt: ts }); B.toast(t("sentReview"), "ok"); }
          else if (b.dataset.act === "del") { if (!confirm(t("confirmDelete"))) return; await F.deleteDoc(ref); B.toast(t("deleted"), "ok"); }
          load(true);
        } catch (x) { B.toast(B.errMsg(x), "bad"); }
      });
    };
    load(true);
  }

  /* ---- orders tab ---- */
  async function ordersTab(el, uid) {
    const sts = ["payment_pending", "payment_submitted", "confirmed", "shipped", "delivered", "completed", "cancelled", "disputed"];
    el.innerHTML = `<p class="bv-hint">${esc(t("shipPayNote"))}</p>
      <select id="ot-s" style="max-width:240px" aria-label="${esc(t("allStatus"))}"><option value="">${esc(t("allStatus"))}</option>${sts.map((s) => `<option value="${s}">${esc(t("st_" + s))}</option>`).join("")}</select>
      <div id="ot-list" class="bv-scroll" style="margin-top:12px"></div><div id="ot-st"></div>
      <div class="bv-row" style="justify-content:center;margin-top:12px"><button class="bv-btn sec" id="ot-more" hidden>${esc(t("loadMore"))}</button></div>`;
    const list = el.querySelector("#ot-list"), st = el.querySelector("#ot-st"), more = el.querySelector("#ot-more"), sel = el.querySelector("#ot-s");
    let cursor = null, done = false, count = 0, table = null;
    const ocache = {};
    const row = (o) => `<tr data-oid="${esc(o.id)}"><td><a href="${B.url("order", { id: o.id })}">${esc(o.id)}</a><div class="bv-meta">${esc(B.fmtDate(o.createdAt))}</div></td>
      <td>${esc(o.productTitle)}<div class="bv-meta">× ${B.num(o.qty)}</div></td><td>${B.taka(o.totalAmount)}<div class="bv-meta">${esc(t("cod"))}: ${B.taka(o.codAmount)}</div></td>
      <td>${B.ui.statusChip("o", o.status)}</td><td>${o.status === "confirmed" ? `<button class="bv-btn" data-act="ship">${esc(t("markShipped"))}</button>` : `<a href="${B.url("order", { id: o.id })}">${esc(t("viewOrder"))}</a>`}</td></tr>`;
    async function load(reset) {
      if (reset) { list.innerHTML = ""; cursor = null; done = false; count = 0; table = null; }
      more.disabled = true; st.innerHTML = B.ui.loading();
      try {
        const c = [F.where("sellerId", "==", uid)]; if (sel.value) c.push(F.where("status", "==", sel.value));
        const args = [...c, F.orderBy("createdAt", "desc")]; if (cursor) args.push(F.startAfter(cursor)); args.push(F.limit(20));
        const snap = await F.getDocs(F.query(F.collection(db, "orders"), ...args));
        if (snap.size < 20) done = true; if (snap.size) cursor = snap.docs[snap.size - 1];
        if (!table && snap.size) { list.innerHTML = `<table class="bv-table"><thead><tr><th>${esc(t("orders"))}</th><th>${esc(t("fTitle"))}</th><th>${esc(t("total"))}</th><th></th><th></th></tr></thead><tbody></tbody></table>`; table = list.querySelector("tbody"); }
        const got = fromDocs(snap); got.forEach((o) => { ocache[o.id] = o; });
        if (table) table.insertAdjacentHTML("beforeend", got.map(row).join(""));
        count += snap.size; st.innerHTML = count === 0 ? B.ui.empty() : ""; more.hidden = done;
      } catch (e) { console.error(e); st.innerHTML = B.ui.error(B.errMsg(e)); } finally { more.disabled = false; }
    }
    sel.onchange = () => load(true); more.onclick = () => load(false);
    list.onclick = async (e) => {
      const b = e.target.closest("[data-act=ship]"); if (!b) return;
      const id = b.closest("[data-oid]").dataset.oid;
      const note = (prompt(t("shipNote")) || "").trim().slice(0, 300);
      await B.btnBusy(b, async () => {
        try {
          const ts = F.serverTimestamp(); const d = { status: "shipped", shippedAt: ts, updatedAt: ts }; if (note) d.shippingNote = note;
          await F.updateDoc(F.doc(db, "orders", id), d); B.toast(t("shippedOk"), "ok");
          if (B.notify && ocache[id]) B.notify(id, ocache[id].buyerId, t("shippedOk"), ocache[id].productTitle);
          load(true);
        } catch (x) { B.toast(B.errMsg(x), "bad"); }
      });
    };
    load(true);
  }

  /* ---- reviews tab ---- */
  async function reviewsTab(el, uid) {
    el.innerHTML = B.ui.loading();
    try {
      const rs = fromDocs(await F.getDocs(F.query(F.collection(db, "reviews"), F.where("sellerId", "==", uid), F.where("status", "==", "visible"), F.orderBy("createdAt", "desc"), F.limit(20))));
      el.innerHTML = rs.length ? rs.map((r) => `<div class="bv-card bv-pad" style="margin-bottom:8px"><div style="color:#f59e0b">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
        <div>${nl2br(r.comment || "")}</div><div class="bv-meta">${esc(r.buyerName || "")} · ${esc(r.productTitle || "")} · ${esc(B.fmtDate(r.createdAt, false))}</div></div>`).join("") : B.ui.empty(t("noReviews"));
    } catch (e) { console.error(e); el.innerHTML = B.ui.error(B.errMsg(e)); }
  }

  /* ================= PRODUCT FORM ================= */
  B.registerPage("product-form", async (m, qs) => {
    if (!gate(m, true)) return;
    const uid = B.user.uid, id = qs.get("id") || "";
    let p = null;
    if (id) {
      if (!/^[A-Za-z0-9_-]{1,60}$/.test(id)) { m.innerHTML = B.ui.empty(t("pfNotFound")); return; }
      const s = await F.getDoc(F.doc(db, "products", id));
      if (!s.exists()) { m.innerHTML = B.ui.empty(t("pfNotFound")); return; }
      p = { id, ...s.data() };
      if (p.sellerId !== uid) { m.innerHTML = B.ui.error(t("pfNotYours")); return; }
      if (p.status === "removed") { m.innerHTML = B.ui.error(t("pfRemoved")); return; }
    }
    B.setMeta({ title: t(p ? "pfEdit" : "pfNew") });
    const cats = await B.loadCats();
    if (!cats.length) { m.innerHTML = B.ui.error(t("noCats")); return; }
    let sellerName = B.profile.name;
    try { const s = await F.getDoc(F.doc(db, "publicProfiles", uid)); if (s.exists() && s.data().displayName) sellerName = s.data().displayName; } catch (e) { /* fallback */ }
    sellerName = String(sellerName || "").trim().slice(0, 60);

    const d = p || { title: "", categoryId: cats[0].id, price: "", negotiable: true, stock: 1, condition: "good", description: "", defects: "", district: "Dhaka", area: "", deliveryOptions: ["delivery", "pickup"], images: [], categoryFields: {} };
    let imgs = (d.images || []).filter((u) => B.safeUrl(u));
    let cf = Object.assign({}, d.categoryFields || {});
    const v = (x) => (x === undefined || x === null ? "" : x);
    const opt = (val, label, sel) => `<option value="${esc(val)}"${sel ? " selected" : ""}>${esc(label)}</option>`;

    m.innerHTML = `<div class="bv-card bv-pad" style="max-width:720px;margin:0 auto"><h1 class="bv-h1">${esc(t(p ? "pfEdit" : "pfNew"))}</h1>
      ${p && p.status === "published" ? `<div class="bv-banner" role="alert">${esc(t("pfPubWarn"))}</div>` : ""}
      ${p && p.status === "rejected" && p.rejectionReason ? `<div class="bv-banner" role="alert">${esc(t("reason"))}: ${esc(p.rejectionReason)}</div>` : ""}
      <form id="pf" novalidate>
        <label for="f-title">${esc(t("fTitle"))}</label><input id="f-title" maxlength="120" value="${esc(d.title)}">
        <label for="f-cat">${esc(t("fCategory"))}</label><select id="f-cat">${cats.map((c) => opt(c.id, B.catName(c), c.id === d.categoryId)).join("")}</select>
        <div id="f-cf"></div>
        <label for="f-sub">${esc(t("fSub"))}</label><input id="f-sub" maxlength="60" value="${esc(v(d.subcategory))}">
        <label>${esc(t("fImages"))}</label><div id="f-imgs" class="bv-row"></div>
        <input id="f-file" type="file" accept="image/jpeg,image/png,image/webp" multiple style="margin-top:8px"><div class="bv-hint" id="f-imgst"></div>
        <label for="f-price">${esc(t("fPrice"))}</label><input id="f-price" inputmode="numeric" value="${esc(v(d.price))}"><div class="bv-hint">${esc(t("fPriceHint"))}</div>
        <label for="f-orig">${esc(t("fOrigPrice"))}</label><input id="f-orig" inputmode="numeric" value="${esc(v(d.originalPrice))}">
        <label for="f-offer">${esc(t("fOffer"))}</label><input id="f-offer" maxlength="120" value="${esc(v(d.offerNote))}">
        <fieldset style="border:0;padding:0;margin:12px 0 0"><legend style="font-weight:600">${esc(t("fNeg"))}</legend>
          <label style="font-weight:400;display:inline-block;margin-right:16px"><input type="radio" name="neg" value="1" style="width:auto;min-height:0"${d.negotiable ? " checked" : ""}> ${esc(t("yes"))}</label>
          <label style="font-weight:400;display:inline-block"><input type="radio" name="neg" value="0" style="width:auto;min-height:0"${d.negotiable ? "" : " checked"}> ${esc(t("no"))}</label></fieldset>
        <label for="f-stock">${esc(t("fStock"))}</label><input id="f-stock" inputmode="numeric" value="${esc(v(d.stock))}">
        <label for="f-cond">${esc(t("fCond"))}</label><select id="f-cond">${["brand_new", "like_new", "good", "fair", "for_parts"].map((c) => opt(c, t("cond_" + c), c === d.condition)).join("")}</select>
        <div id="f-usewrap"><label for="f-use">${esc(t("fUsage"))}</label><input id="f-use" maxlength="60" value="${esc(v(d.usageDuration))}"></div>
        <label for="f-year">${esc(t("fYear"))}</label><input id="f-year" inputmode="numeric" maxlength="4" value="${esc(v(d.purchaseYear))}">
        <label for="f-desc">${esc(t("fDesc"))}</label><textarea id="f-desc" maxlength="5000">${esc(d.description)}</textarea>
        <label for="f-feat">${esc(t("fFeat"))}</label><textarea id="f-feat" maxlength="2000">${esc(v(d.features))}</textarea>
        <label for="f-def">${esc(t("fDefects"))}</label><textarea id="f-def" maxlength="2000" style="border-color:#f3d28a">${esc(d.defects)}</textarea><div class="bv-hint">${esc(t("fDefectsHint"))}</div>
        <label for="f-acc">${esc(t("fAcc"))}</label><input id="f-acc" maxlength="500" value="${esc(v(d.accessories))}">
        <label for="f-brand">${esc(t("fBrand"))}</label><input id="f-brand" maxlength="60" value="${esc(v(d.brand))}">
        <label for="f-model">${esc(t("fModel"))}</label><input id="f-model" maxlength="60" value="${esc(v(d.model))}">
        <label for="f-war">${esc(t("fWarranty"))}</label><input id="f-war" maxlength="500" value="${esc(v(d.warrantyInfo))}">
        <label for="f-dist">${esc(t("fDistrict"))}</label><select id="f-dist">${B.districtOptions(d.district)}</select>
        <label for="f-area">${esc(t("fArea"))}</label><input id="f-area" maxlength="60" value="${esc(d.area)}">
        <fieldset style="border:0;padding:0;margin:12px 0 0"><legend style="font-weight:600">${esc(t("fDelivery"))}</legend>
          <label style="font-weight:400;display:inline-block;margin-right:16px"><input type="checkbox" id="f-del" style="width:auto;min-height:0"${(d.deliveryOptions || []).includes("delivery") ? " checked" : ""}> ${esc(t("homeDelivery"))}</label>
          <label style="font-weight:400;display:inline-block"><input type="checkbox" id="f-pick" style="width:auto;min-height:0"${(d.deliveryOptions || []).includes("pickup") ? " checked" : ""}> ${esc(t("pickup"))}</label></fieldset>
        <label for="f-sn">${esc(t("fSellerNotes"))}</label><textarea id="f-sn" maxlength="1000">${esc(v(d.sellerNotes))}</textarea>
        <label for="f-ret">${esc(t("fReturn"))}</label><textarea id="f-ret" maxlength="1000">${esc(v(d.returnPolicy))}</textarea>
        <label style="font-weight:400;margin-top:16px"><input type="checkbox" id="f-own" style="width:auto;min-height:0"${p && p.ownershipConfirmed ? " checked" : ""}> ${esc(t("fOwn"))}</label>
        <div class="bv-err" id="f-err" role="alert"></div>
        <div class="bv-row" style="margin-top:12px"><button class="bv-btn sec" type="button" data-save="draft">${esc(t("saveDraft"))}</button><button class="bv-btn" type="button" data-save="pending_review">${esc(t("submitReview2"))}</button></div>
      </form></div>`;

    const $ = (s) => m.querySelector(s);
    const err = $("#f-err"), imgBox = $("#f-imgs"), imgSt = $("#f-imgst");

    function drawCf() {
      const cat = cats.find((c) => c.id === $("#f-cat").value);
      const fields = cat && Array.isArray(cat.fields) ? cat.fields.filter((f) => f && /^[A-Za-z0-9_]{1,30}$/.test(f.key || "")) : [];
      $("#f-cf").innerHTML = fields.map((f) => `<label for="cf-${esc(f.key)}">${esc(B.lang === "bn" ? f.labelBn || f.labelEn || f.key : f.labelEn || f.key)}</label>
        <input id="cf-${esc(f.key)}" data-cf="${esc(f.key)}" data-type="${f.type === "number" ? "number" : "text"}" maxlength="100" value="${esc(v(cf[f.key]))}">`).join("");
      $("#f-cf").querySelectorAll("[data-cf]").forEach((i) => { i.oninput = () => { cf[i.dataset.cf] = i.value; }; });
    }
    function drawImgs() {
      imgBox.innerHTML = imgs.map((u, i) => `<div style="position:relative;width:96px"><img src="${esc(B.img(u, 160))}" alt="" style="width:96px;height:96px;object-fit:cover;border-radius:8px;border:${i === 0 ? "3px solid var(--bv-primary)" : "1px solid var(--bv-border)"}">
        <div class="bv-row" style="gap:4px;margin-top:2px">${i > 0 ? `<button type="button" class="bv-btn sec" data-main="${i}" style="min-height:32px;padding:2px 8px;font-size:.75rem">${esc(t("makeMain"))}</button>` : ""}
        <button type="button" class="bv-btn danger" data-rm="${i}" style="min-height:32px;padding:2px 8px;font-size:.75rem">${esc(t("remove"))}</button></div></div>`).join("");
    }
    imgBox.onclick = (e) => {
      const mn = e.target.closest("[data-main]"), rm = e.target.closest("[data-rm]");
      if (mn) { const i = Number(mn.dataset.main); imgs.unshift(imgs.splice(i, 1)[0]); drawImgs(); }
      if (rm) { imgs.splice(Number(rm.dataset.rm), 1); drawImgs(); }
    };
    let uploading = false;
    $("#f-file").onchange = async (e) => {
      const files = [...e.target.files]; e.target.value = ""; err.textContent = "";
      uploading = true; imgSt.textContent = t("uploading");
      for (const f of files) {
        if (imgs.length >= 6) { err.textContent = t("maxImgs"); break; }
        try { imgs.push(await B.uploadImage(f)); drawImgs(); } catch (x) { err.textContent = x.code ? B.errMsg(x) : x.message; }
      }
      uploading = false; imgSt.textContent = "";
    };
    function syncUse() { $("#f-usewrap").hidden = $("#f-cond").value === "brand_new"; }
    $("#f-cat").onchange = drawCf; $("#f-cond").onchange = syncUse;
    drawCf(); drawImgs(); syncUse();

    m.querySelectorAll("[data-save]").forEach((btn) => { btn.onclick = () => B.btnBusy(btn, async () => {
      err.textContent = "";
      if (uploading) { err.textContent = t("uploading"); return; }
      const str = (s) => $(s).value.trim();
      const title = str("#f-title"), price = toInt($("#f-price").value), stock = toInt($("#f-stock").value), cond = $("#f-cond").value;
      const orig = str("#f-orig") ? toInt($("#f-orig").value) : null, year = str("#f-year") ? toInt($("#f-year").value) : null;
      const desc = str("#f-desc"), defects = str("#f-def"), area = str("#f-area"), usage = str("#f-use");
      const delivery = []; if ($("#f-del").checked) delivery.push("delivery"); if ($("#f-pick").checked) delivery.push("pickup");
      const bad = (cond2, msg) => { if (cond2) { err.textContent = msg; return true; } return false; };
      if (bad(title.length < 5 || title.length > 120, t("eTitle"))) return;
      if (bad(!$("#f-cat").value, t("eCat"))) return;
      if (bad(!imgs.length, t("needImg"))) return;
      if (bad(!(price >= 1 && price <= 10000000), t("ePrice"))) return;
      if (bad(orig !== null && !(orig >= 1 && orig <= 100000000), t("eOrig"))) return;
      if (bad(!(stock >= 1 && stock <= 999), t("eStock"))) return;
      if (bad(cond !== "brand_new" && usage.length < 1, t("eUsage"))) return;
      if (bad(year !== null && !(year >= 1990 && year <= 2100), t("eYear"))) return;
      if (bad(desc.length < 20, t("eDesc"))) return;
      if (bad(defects.length < 5, t("eDefects"))) return;
      if (bad(area.length < 2, t("eArea"))) return;
      if (bad(!delivery.length, t("eDelivery"))) return;
      if (bad(!$("#f-own").checked, t("eOwn"))) return;
      if (bad(sellerName.length < 2, t("badName"))) return;

      const cfOut = {};
      m.querySelectorAll("[data-cf]").forEach((i) => {
        const val = i.value.trim().slice(0, 100); if (!val) return;
        cfOut[i.dataset.cf] = i.dataset.type === "number" && !isNaN(toInt(val)) ? toInt(val) : val;
      });
      const status = btn.dataset.save, ts = F.serverTimestamp(), DEL = F.deleteField();
      const optional = { subcategory: str("#f-sub"), offerNote: str("#f-offer"), usageDuration: cond === "brand_new" ? "" : usage, features: str("#f-feat"), accessories: str("#f-acc"),
        brand: str("#f-brand"), model: str("#f-model"), warrantyInfo: str("#f-war"), sellerNotes: str("#f-sn"), returnPolicy: str("#f-ret"),
        originalPrice: orig, purchaseYear: year, categoryFields: Object.keys(cfOut).length ? cfOut : "" };
      const data = { title, categoryId: $("#f-cat").value, price, negotiable: m.querySelector("input[name=neg]:checked").value === "1", stock, condition: cond, description: desc, defects,
        district: $("#f-dist").value, area, deliveryOptions: delivery, ownershipConfirmed: true, images: imgs.slice(0, 6),
        searchTokens: B.tokens(title, optional.brand, optional.model, optional.subcategory), status, updatedAt: ts };
      for (const [k, val] of Object.entries(optional)) {
        const empty = val === "" || val === null;
        if (p) data[k] = empty ? DEL : val; else if (!empty) data[k] = val;
      }
      try {
        if (p) await F.updateDoc(F.doc(db, "products", p.id), data);
        else { const ref = F.doc(F.collection(db, "products")); await F.setDoc(ref, { ...data, sellerId: uid, sellerName, createdAt: ts }); }
        B.toast(t(status === "draft" ? "savedDraft" : "submitted"), "ok");
        setTimeout(() => { location.href = B.url("sellerDash"); }, 700);
      } catch (x) { console.error(x); err.textContent = B.errMsg(x); }
    }); });
  });
})();
