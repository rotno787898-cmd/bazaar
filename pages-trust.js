/* Bazaar BD – pages-trust.js (Part 6). Paste in the SAME <script type="module"> block, BELOW pages-order.js.
   Pages: review, report, refund, terms, privacy, safety, contact.
   NOTE: the policy texts are TEMPLATES, not legal advice. Have them checked before going live. */
(function () {
  const B = window.BV;
  const { F, db, esc, t } = B;

  B.addI18n({
    bn: {
      evAdd: "ছবি যোগ করুন", evWarn: "ছবি গোপন নয়, লিংক জানলে যে কেউ দেখতে পারে। অন্যের ব্যক্তিগত তথ্য বা পিন/ওটিপি যেন না দেখা যায়।", evUp: "ছবি আপলোড হচ্ছে…", evRm: "সরান",
      rvTitle: "রিভিউ দিন", rvNotYours: "এই অর্ডার আপনার নয়।", rvNotDone: "অর্ডার সম্পন্ন হওয়ার পরই রিভিউ দেওয়া যায়।", rvDone: "আপনি এই অর্ডারে রিভিউ দিয়েছেন।", rvRating: "রেটিং",
      rvComment: "আপনার অভিজ্ঞতা (ঐচ্ছিক)", rvSubmit: "রিভিউ জমা দিন", rvThanks: "ধন্যবাদ! রিভিউ জমা হয়েছে।", rvHidden: "অ্যাডমিন এই রিভিউ লুকিয়েছেন।", rvPickStar: "তারা বেছে নিন।",
      rvNote: "একটি অর্ডারে একটিই রিভিউ, পরে বদলানো যায় না। বিক্রেতার গড় রেটিং অ্যাডমিন হিসাব হালনাগাদ করলে বদলায়।",
      rpTitle: "রিপোর্ট করুন", rpTarget: "কার বিরুদ্ধে", rpOwn: "নিজেকে রিপোর্ট করা যায় না।", rpDone: "রিপোর্ট জমা হয়েছে। অ্যাডমিন দেখবেন।", rpExists: "আপনি আগেই এটি রিপোর্ট করেছেন।", rpStatus: "অবস্থা",
      rpReason: "কারণ", rpDesc: "বিস্তারিত লিখুন (কমপক্ষে ১০ অক্ষর)", rpEvidence: "প্রমাণের ছবি (ঐচ্ছিক, সর্বোচ্চ ৩টি)", rpSubmit: "রিপোর্ট জমা দিন", rpBad: "রিপোর্টের ধরন ঠিক নেই।",
      rpDecision: "অ্যাডমিনের সিদ্ধান্ত", rpNote: "বিস্তারিত", rpFalse: "মিথ্যা রিপোর্ট করলে আপনার অ্যাকাউন্টও স্থগিত হতে পারে।", eRDesc: "বিস্তারিত কমপক্ষে ১০ অক্ষর লিখুন।", eRReason: "কারণ বাছুন।",
      rp_product: "পণ্য", rp_user: "ব্যবহারকারী", rp_review: "রিভিউ", rp_order: "অর্ডার",
      rr_fake_product: "নকল পণ্য", rr_misleading_description: "বিভ্রান্তিকর বিবরণ", rr_hidden_damage: "লুকানো ত্রুটি/ক্ষতি", rr_suspected_stolen: "চোরাই পণ্যের সন্দেহ", rr_fake_payment_claim: "ভুয়া পেমেন্টের দাবি",
      rr_non_delivery: "পণ্য পাঠায়নি", rr_harassment: "হয়রানি", rr_suspected_scam: "প্রতারণার সন্দেহ", rr_counterfeit: "জাল/নকল ব্র্যান্ড", rr_prohibited_item: "নিষিদ্ধ পণ্য", rr_other: "অন্য কিছু",
      rs_open_: "খোলা", rs_investigating: "তদন্ত চলছে", rs_resolved_: "নিষ্পত্তি হয়েছে", rs_rejected: "গ্রহণ হয়নি",
      rfTitle: "ফেরত / সমস্যার অনুরোধ", rfNotYours: "এই অর্ডার আপনার নয়।", rfNotElig: "এই অর্ডারে এখন ফেরতের অনুরোধ করা যায় না (অগ্রিম যাচাই হতে হবে এবং অর্ডার নিশ্চিত বা তার পরের ধাপে থাকতে হবে)।",
      rfPolicy: "ফেরতের নিয়ম", rfReason: "সমস্যা কী", rfDesc: "বিস্তারিত লিখুন (কমপক্ষে ২০ অক্ষর)", rfRes: "আপনি কী চান", rfEvidence: "প্রমাণের ছবি (সর্বোচ্চ ৫টি)", rfSubmit: "অনুরোধ জমা দিন",
      rfDone: "অনুরোধ জমা হয়েছে। অ্যাডমিন তদন্ত করবেন।", rfStatusLbl: "অনুরোধের অবস্থা", rfDecision: "অ্যাডমিনের সিদ্ধান্ত", rfAdminNote: "অ্যাডমিনের নোট", rfInfoReq: "অ্যাডমিন আরও তথ্য চেয়েছেন",
      rfReply: "আপনার উত্তর", rfSendReply: "উত্তর পাঠান", rfReplied: "উত্তর পাঠানো হয়েছে।", rfAmount: "ফেরতের পরিমাণ", rfMethod: "ফেরতের মাধ্যম", rfTrx: "ফেরতের ট্রানজ্যাকশন রেফারেন্স",
      rfNoteMoney: "অ্যাডমিন নিজে টাকা পাঠান এবং রেফারেন্স লিখে রাখেন। রেফারেন্স না বসা পর্যন্ত 'সম্পন্ন' হয় না।", eFDesc: "বিস্তারিত কমপক্ষে ২০ অক্ষর লিখুন।",
      rf_not_as_described: "বিবরণের সাথে মেলেনি", rf_hidden_defect: "লুকানো ত্রুটি", rf_non_delivery: "পণ্য পাইনি", rf_wrong_item: "ভুল পণ্য", rf_damaged_in_transit: "পথে ক্ষতি হয়েছে", rf_other: "অন্য কিছু",
      rq_refund_advance: "অগ্রিম ফেরত", rq_refund_full: "পুরো টাকা ফেরত", rq_replacement: "পণ্য বদল", rq_return_item: "পণ্য ফেরত দিতে চাই",
      rfs_requested: "অনুরোধ জমা", rfs_under_review: "যাচাই চলছে", rfs_info_requested: "আরও তথ্য চাওয়া হয়েছে", rfs_approved: "অনুমোদিত", rfs_rejected: "গ্রহণ হয়নি", rfs_refund_processing: "ফেরত প্রক্রিয়ায়", rfs_completed: "ফেরত সম্পন্ন",
      ctTitle: "যোগাযোগ", ctIntro: "অর্ডার-সংক্রান্ত সমস্যায় প্রথমে অর্ডারের চ্যাটে লিখুন, সেখানে অ্যাডমিন যুক্ত হতে পারেন। অভিযোগ থাকলে 'রিপোর্ট' ব্যবহার করুন।", ctNone: "অ্যাডমিন এখনো যোগাযোগের তথ্য দেননি।",
      ctPhone: "ফোন", ctEmail: "ইমেইল", ctAddr: "ঠিকানা", ctNote: "এই সাইটে আলাদা যোগাযোগ ফর্ম নেই; ইমেইল বা ফোনে যোগাযোগ করুন।", docNote: "এটি একটি টেমপ্লেট। চালুর আগে আইনজীবীর মাধ্যমে যাচাই করুন। (সাইটের মালিকের জন্য নোট, অ্যাডমিন সেটিংস থেকে এটি বদলানো বা সরানো যায়।)",
      extraRules: "মার্কেটপ্লেসের বিশেষ নিয়ম", extraProhibited: "অতিরিক্ত নিষিদ্ধ পণ্য",
    },
    en: {
      evAdd: "Add photos", evWarn: "Photos are not private; anyone with the link can see them. Make sure no personal data, PIN or OTP is visible.", evUp: "Uploading photo…", evRm: "Remove",
      rvTitle: "Leave a review", rvNotYours: "This order is not yours.", rvNotDone: "You can review only after the order is completed.", rvDone: "You have already reviewed this order.", rvRating: "Rating",
      rvComment: "Your experience (optional)", rvSubmit: "Submit review", rvThanks: "Thank you! Review submitted.", rvHidden: "An admin has hidden this review.", rvPickStar: "Choose a star rating.",
      rvNote: "One review per order, and it cannot be changed later. The seller's average rating updates when the admin recalculates.",
      rpTitle: "Report", rpTarget: "Reporting", rpOwn: "You cannot report yourself.", rpDone: "Report submitted. An admin will review it.", rpExists: "You have already reported this.", rpStatus: "Status",
      rpReason: "Reason", rpDesc: "Describe the problem (at least 10 characters)", rpEvidence: "Evidence photos (optional, max 3)", rpSubmit: "Submit report", rpBad: "Invalid report type.",
      rpDecision: "Admin decision", rpNote: "Details", rpFalse: "Knowingly false reports can get your own account suspended.", eRDesc: "Write at least 10 characters.", eRReason: "Choose a reason.",
      rp_product: "Product", rp_user: "User", rp_review: "Review", rp_order: "Order",
      rr_fake_product: "Fake product", rr_misleading_description: "Misleading description", rr_hidden_damage: "Hidden damage", rr_suspected_stolen: "Suspected stolen property", rr_fake_payment_claim: "Fake payment claim",
      rr_non_delivery: "Non-delivery", rr_harassment: "Harassment", rr_suspected_scam: "Suspected scam", rr_counterfeit: "Counterfeit goods", rr_prohibited_item: "Prohibited item", rr_other: "Other",
      rs_open_: "Open", rs_investigating: "Investigating", rs_resolved_: "Resolved", rs_rejected: "Rejected",
      rfTitle: "Refund / problem request", rfNotYours: "This order is not yours.", rfNotElig: "A refund request is not possible for this order now (the advance must be verified and the order must be confirmed or later).",
      rfPolicy: "Refund policy", rfReason: "What is the problem", rfDesc: "Describe it (at least 20 characters)", rfRes: "What do you want", rfEvidence: "Evidence photos (max 5)", rfSubmit: "Submit request",
      rfDone: "Request submitted. An admin will investigate.", rfStatusLbl: "Request status", rfDecision: "Admin decision", rfAdminNote: "Admin note", rfInfoReq: "The admin asked for more information",
      rfReply: "Your reply", rfSendReply: "Send reply", rfReplied: "Reply sent.", rfAmount: "Refund amount", rfMethod: "Refund method", rfTrx: "Refund transaction reference",
      rfNoteMoney: "The admin sends the money manually and records the reference. A request is not 'completed' until a reference is recorded.", eFDesc: "Write at least 20 characters.",
      rf_not_as_described: "Not as described", rf_hidden_defect: "Hidden defect", rf_non_delivery: "Not received", rf_wrong_item: "Wrong item", rf_damaged_in_transit: "Damaged in transit", rf_other: "Other",
      rq_refund_advance: "Refund the advance", rq_refund_full: "Full refund", rq_replacement: "Replacement", rq_return_item: "Return the item",
      rfs_requested: "Requested", rfs_under_review: "Under review", rfs_info_requested: "More information requested", rfs_approved: "Approved", rfs_rejected: "Rejected", rfs_refund_processing: "Refund in process", rfs_completed: "Refund completed",
      ctTitle: "Contact", ctIntro: "For order problems, write in the order chat first; an admin can join there. For complaints use 'Report'.", ctNone: "The admin has not added contact details yet.",
      ctPhone: "Phone", ctEmail: "Email", ctAddr: "Address", ctNote: "There is no contact form on this site; please use email or phone.", docNote: "This is a template. Have it reviewed by a lawyer before launch. (Note for the site owner; the admin can replace or remove it in settings.)",
      extraRules: "Marketplace-specific rules", extraProhibited: "Additional prohibited items",
    },
  });

  const nl2br = (s) => esc(s).replace(/\n/g, "<br>");
  const ORDER_ID = /^BV[0-9A-Z]{10,18}$/;
  const idOk = (s) => /^[A-Za-z0-9_-]{1,60}$/.test(s || "");
  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  /* Evidence photo widget: uploads to Cloudinary, keeps list of URLs */
  function evidence(el, max) {
    const urls = []; let busy = false;
    el.innerHTML = `<input type="file" accept="image/jpeg,image/png,image/webp" multiple><div class="bv-hint">${esc(t("evWarn"))}</div><div class="bv-row" data-th style="margin-top:6px"></div><div class="bv-hint" data-st></div>`;
    const th = el.querySelector("[data-th]"), st = el.querySelector("[data-st]");
    const draw = () => { th.innerHTML = urls.map((u, i) => `<div><img src="${esc(B.img(u, 120))}" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:8px"><br><button type="button" class="bv-btn danger" data-rm="${i}" style="min-height:28px;padding:2px 8px;font-size:.75rem">${esc(t("evRm"))}</button></div>`).join(""); };
    th.onclick = (e) => { const b = e.target.closest("[data-rm]"); if (b) { urls.splice(Number(b.dataset.rm), 1); draw(); } };
    el.querySelector("input").onchange = async (e) => {
      const files = [...e.target.files]; e.target.value = ""; busy = true; st.textContent = t("evUp");
      for (const f of files) { if (urls.length >= max) break; try { urls.push(await B.uploadImage(f)); draw(); } catch (x) { st.textContent = x.code ? B.errMsg(x) : x.message; } }
      busy = false; if (st.textContent === t("evUp")) st.textContent = "";
    };
    return { urls: () => urls.slice(), busy: () => busy };
  }

  /* ================= REVIEW ================= */
  B.registerPage("review", async (m, qs) => {
    B.setMeta({ title: t("rvTitle") });
    if (!B.requireVerified(m)) return;
    const id = qs.get("order") || "";
    if (!ORDER_ID.test(id)) { m.innerHTML = B.ui.empty(); return; }
    let o; try { const s = await F.getDoc(F.doc(db, "orders", id)); if (!s.exists()) { m.innerHTML = B.ui.empty(); return; } o = s.data(); } catch (e) { m.innerHTML = B.ui.error(t("rvNotYours")); return; }
    if (o.buyerId !== B.user.uid) { m.innerHTML = B.ui.error(t("rvNotYours")); return; }
    let ex = null; try { const s = await F.getDoc(F.doc(db, "reviews", id)); if (s.exists()) ex = s.data(); } catch (e) { /* none */ }
    const head = `<h1 class="bv-h1">${esc(t("rvTitle"))}</h1><div class="bv-card bv-pad" style="margin-bottom:12px"><strong>${esc(o.productTitle)}</strong><div class="bv-meta">${esc(t("odSeller"))}: ${esc(o.sellerName)} · ${esc(id)}</div></div>`;
    if (ex) { m.innerHTML = head + `<div class="bv-card bv-pad"><p>${esc(t("rvDone"))}</p><div style="color:#f59e0b;font-size:1.4rem">${stars(ex.rating)}</div><div>${nl2br(ex.comment || "")}</div>${ex.status === "hidden" ? `<div class="bv-err">${esc(t("rvHidden"))}</div>` : ""}<a class="bv-btn sec" href="${B.url("order", { id })}">${esc(t("ordOpen"))}</a></div>`; return; }
    if (o.status !== "completed") { m.innerHTML = head + `<div class="bv-card bv-pad">${esc(t("rvNotDone"))}</div>`; return; }
    m.innerHTML = head + `<div class="bv-card bv-pad"><form id="rf" novalidate><fieldset style="border:0;padding:0"><legend style="font-weight:600">${esc(t("rvRating"))}</legend>
      ${[5, 4, 3, 2, 1].map((n) => `<label style="font-weight:400;display:inline-block;margin-right:12px"><input type="radio" name="rt" value="${n}" style="width:auto;min-height:0"> <span style="color:#f59e0b">${stars(n)}</span></label>`).join("")}</fieldset>
      <label for="rv-c">${esc(t("rvComment"))}</label><textarea id="rv-c" maxlength="1000"></textarea><p class="bv-hint">${esc(t("rvNote"))}</p>
      <div class="bv-err" id="rv-err" role="alert"></div><button class="bv-btn" type="submit">${esc(t("rvSubmit"))}</button></form></div>`;
    const form = m.querySelector("#rf"), err = m.querySelector("#rv-err");
    form.onsubmit = (e) => { e.preventDefault(); B.btnBusy(form.querySelector("button"), async () => {
      err.textContent = ""; const sel = m.querySelector("input[name=rt]:checked"); if (!sel) { err.textContent = t("rvPickStar"); return; }
      const d = { orderId: id, buyerId: B.user.uid, buyerName: String(B.profile ? B.profile.name : "").slice(0, 60), sellerId: o.sellerId, productId: o.productId, productTitle: o.productTitle,
        rating: Number(sel.value), status: "visible", createdAt: F.serverTimestamp() };
      const c = m.querySelector("#rv-c").value.trim(); if (c) d.comment = c.slice(0, 1000);
      try { await F.setDoc(F.doc(db, "reviews", id), d); B.toast(t("rvThanks"), "ok"); B.pages.review(m, qs); } catch (x) { err.textContent = B.errMsg(x); }
    }); };
  });

  /* ================= REPORT ================= */
  const REASONS = ["fake_product", "misleading_description", "hidden_damage", "suspected_stolen", "fake_payment_claim", "non_delivery", "harassment", "suspected_scam", "counterfeit", "prohibited_item", "other"];
  B.registerPage("report", async (m, qs) => {
    B.setMeta({ title: t("rpTitle") });
    if (!B.requireVerified(m)) return;
    const type = qs.get("type") || "", id = qs.get("id") || "", uid = B.user.uid;
    if (!["product", "user", "review", "order"].includes(type) || !idOk(id)) { m.innerHTML = B.ui.error(t("rpBad")); return; }
    if (type === "user" && id === uid) { m.innerHTML = B.ui.error(t("rpOwn")); return; }
    let label = id;
    try {
      if (type === "product") { const s = await F.getDoc(F.doc(db, "products", id)); if (s.exists()) label = s.data().title; }
      else if (type === "user") { const s = await F.getDoc(F.doc(db, "publicProfiles", id)); if (s.exists()) label = s.data().displayName; }
      else if (type === "order") { const s = await F.getDoc(F.doc(db, "orders", id)); if (s.exists()) label = s.data().productTitle + " (" + id + ")"; }
    } catch (e) { /* keep id */ }
    const rid = uid + "_" + type + "_" + id;
    let ex = null; try { const s = await F.getDoc(F.doc(db, "reports", rid)); if (s.exists()) ex = s.data(); } catch (e) { /* none */ }
    const head = `<h1 class="bv-h1">${esc(t("rpTitle"))}</h1><div class="bv-card bv-pad" style="margin-bottom:12px"><strong>${esc(t("rp_" + type))}:</strong> ${esc(label)}</div>`;
    if (ex) {
      m.innerHTML = head + `<div class="bv-card bv-pad"><p>${esc(t("rpExists"))}</p><div>${esc(t("rpStatus"))}: <span class="bv-chip ${ex.status === "rejected" ? "bad" : ex.status === "resolved" ? "" : "warn"}">${esc(t({ open: "rs_open_", investigating: "rs_investigating", resolved: "rs_resolved_", rejected: "rs_rejected" }[ex.status] || "rs_open_"))}</span></div>
        <div class="bv-meta">${esc(t("rr_" + ex.reason))} · ${esc(B.fmtDate(ex.createdAt))}</div>
        ${ex.decision ? `<p><strong>${esc(t("rpDecision"))}:</strong> ${nl2br(ex.decision)}</p>` : ""}${ex.resolutionNote ? `<p><strong>${esc(t("rpNote"))}:</strong> ${nl2br(ex.resolutionNote)}</p>` : ""}</div>`; return;
    }
    m.innerHTML = head + `<div class="bv-card bv-pad"><form id="rf" novalidate><label for="r-r">${esc(t("rpReason"))}</label>
      <select id="r-r"><option value="">–</option>${REASONS.map((r) => `<option value="${r}">${esc(t("rr_" + r))}</option>`).join("")}</select>
      <label for="r-d">${esc(t("rpDesc"))}</label><textarea id="r-d" maxlength="2000"></textarea>
      <label>${esc(t("rpEvidence"))}</label><div id="r-ev"></div><p class="bv-hint">${esc(t("rpFalse"))}</p>
      <div class="bv-err" id="r-err" role="alert"></div><button class="bv-btn" type="submit">${esc(t("rpSubmit"))}</button></form></div>`;
    const ev = evidence(m.querySelector("#r-ev"), 3), form = m.querySelector("#rf"), err = m.querySelector("#r-err");
    form.onsubmit = (e) => { e.preventDefault(); B.btnBusy(form.querySelector("button"), async () => {
      err.textContent = ""; const reason = m.querySelector("#r-r").value, desc = m.querySelector("#r-d").value.trim();
      if (!reason) { err.textContent = t("eRReason"); return; } if (desc.length < 10) { err.textContent = t("eRDesc"); return; } if (ev.busy()) { err.textContent = t("evUp"); return; }
      const d = { reporterId: uid, targetType: type, targetId: id, reason, description: desc.slice(0, 2000), status: "open", priority: "normal", createdAt: F.serverTimestamp() };
      if (ev.urls().length) d.evidenceUrls = ev.urls();
      try { await F.setDoc(F.doc(db, "reports", rid), d); B.toast(t("rpDone"), "ok"); B.pages.report(m, qs); } catch (x) { err.textContent = B.errMsg(x); }
    }); };
  });

  /* ================= REFUND ================= */
  const DEFAULT_REFUND = {
    bn: ["যোগ্যতা: অগ্রিম যাচাই হয়েছে এমন অর্ডারে পণ্য বিবরণের সাথে না মিললে, লুকানো ত্রুটি থাকলে, ভুল পণ্য এলে, পথে ক্ষতি হলে বা পণ্য না পেলে অনুরোধ করা যায়।",
      "সময়সীমা: পণ্য হাতে পাওয়ার ৩ দিনের মধ্যে অনুরোধ করুন। পণ্য না পেলে পাঠানোর প্রত্যাশিত তারিখের পর অনুরোধ করুন।",
      "বাদ: বিক্রেতা বিবরণে স্পষ্ট জানানো ত্রুটির জন্য, ক্রেতার ব্যবহারে নষ্ট হলে, বা ক্রেতা মত বদলালে ফেরত নেই।",
      "প্রমাণ: স্পষ্ট ছবি, সম্ভব হলে আনবক্সিং ছবি, এবং চ্যাটের তথ্য দিন। প্রমাণ কম হলে অ্যাডমিন আরও তথ্য চাইতে পারেন।",
      "ফেরত পাঠানোর খরচ: পণ্য বিবরণের সাথে না মিললে বা লুকানো ত্রুটি থাকলে বিক্রেতা; অন্য ক্ষেত্রে অ্যাডমিনের সিদ্ধান্ত অনুযায়ী।",
      "টাকা ফেরত: অ্যাডমিন নিজে ম্যানুয়ালি পাঠান; পাঠানোর পর রেফারেন্স রেকর্ড হলে তবেই 'সম্পন্ন' দেখায়। স্বয়ংক্রিয় ফেরতের প্রতিশ্রুতি নেই।"],
    en: ["Eligibility: for orders whose advance was verified, you may request if the item does not match the listing, has a hidden defect, is the wrong item, was damaged in transit, or never arrived.",
      "Deadline: request within 3 days of receiving the item. If it never arrives, request after the expected dispatch date.",
      "Exclusions: no refund for defects clearly disclosed in the listing, damage caused by the buyer, or a change of mind.",
      "Evidence: provide clear photos, unboxing photos if possible, and chat details. The admin may ask for more information.",
      "Return shipping: paid by the seller if the item is not as described or has a hidden defect; otherwise as decided by the admin.",
      "Money back: the admin sends it manually and it shows 'completed' only after the reference is recorded. Refunds are not automatic."],
  };

  B.registerPage("refund", async (m, qs) => {
    B.setMeta({ title: t("rfTitle") });
    if (!B.requireVerified(m)) return;
    const id = qs.get("order") || "";
    if (!ORDER_ID.test(id)) { m.innerHTML = B.ui.empty(); return; }
    let o; try { const s = await F.getDoc(F.doc(db, "orders", id)); if (!s.exists()) { m.innerHTML = B.ui.empty(); return; } o = s.data(); } catch (e) { m.innerHTML = B.ui.error(t("rfNotYours")); return; }
    if (o.buyerId !== B.user.uid) { m.innerHTML = B.ui.error(t("rfNotYours")); return; }
    let ex = null; try { const s = await F.getDoc(F.doc(db, "refundRequests", id)); if (s.exists()) ex = s.data(); } catch (e) { /* none */ }
    const policy = B.settings.refundPolicy ? `<p>${nl2br(B.settings.refundPolicy)}</p>` : `<ul>${DEFAULT_REFUND[B.lang].map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
    const head = `<h1 class="bv-h1">${esc(t("rfTitle"))}</h1><div class="bv-card bv-pad" style="margin-bottom:12px"><strong>${esc(o.productTitle)}</strong> × ${B.num(o.qty)}<div class="bv-meta">${esc(id)} · ${B.ui.statusChip("o", o.status)}</div>
      <div>${esc(t("odAdvance"))}: ${B.taka(o.advanceAmount)}</div></div>
      <details class="bv-card bv-pad" style="margin-bottom:12px"><summary style="cursor:pointer;font-weight:600">${esc(t("rfPolicy"))}</summary>${policy}</details>`;
    if (ex) {
      const sc = ex.status === "rejected" ? "bad" : ex.status === "completed" || ex.status === "approved" ? "" : "warn";
      m.innerHTML = head + `<div class="bv-card bv-pad"><div>${esc(t("rfStatusLbl"))}: <span class="bv-chip ${sc}">${esc(t("rfs_" + ex.status))}</span></div>
        <div class="bv-meta">${esc(t("rf_" + ex.reason))} · ${esc(t("rq_" + ex.requestedResolution))} · ${esc(B.fmtDate(ex.createdAt))}</div><p>${nl2br(ex.description)}</p>
        ${ex.adminDecision ? `<p><strong>${esc(t("rfDecision"))}:</strong> ${nl2br(ex.adminDecision)}</p>` : ""}${ex.adminNote ? `<p><strong>${esc(t("rfAdminNote"))}:</strong> ${nl2br(ex.adminNote)}</p>` : ""}
        ${ex.infoRequested ? `<div class="bv-banner" style="text-align:left;border-radius:8px"><strong>${esc(t("rfInfoReq"))}:</strong> ${nl2br(ex.infoRequested)}</div>` : ""}
        ${ex.buyerReply ? `<p><strong>${esc(t("rfReply"))}:</strong> ${nl2br(ex.buyerReply)}</p>` : ""}
        ${ex.status === "completed" ? `<p><strong>${esc(t("rfAmount"))}:</strong> ${B.taka(ex.refundAmount)} · ${esc(t("rfMethod"))}: ${esc(ex.refundMethod)} · ${esc(t("rfTrx"))}: ${esc(ex.refundTrxRef)}</p>` : `<p class="bv-hint">${esc(t("rfNoteMoney"))}</p>`}
        ${ex.status === "info_requested" ? `<form id="rr" novalidate><label for="rr-t">${esc(t("rfReply"))}</label><textarea id="rr-t" maxlength="2000"></textarea><div id="rr-ev"></div>
          <div class="bv-err" id="rr-err" role="alert"></div><button class="bv-btn" type="submit" style="margin-top:8px">${esc(t("rfSendReply"))}</button></form>` : ""}</div>`;
      const f = m.querySelector("#rr"); if (!f) return;
      const ev = evidence(m.querySelector("#rr-ev"), 5), err = m.querySelector("#rr-err");
      f.onsubmit = (e) => { e.preventDefault(); B.btnBusy(f.querySelector("button"), async () => {
        err.textContent = ""; const txt = m.querySelector("#rr-t").value.trim(); if (!txt) { err.textContent = t("eFDesc"); return; } if (ev.busy()) { err.textContent = t("evUp"); return; }
        const d = { buyerReply: txt.slice(0, 2000), status: "under_review", updatedAt: F.serverTimestamp() };
        const all = [...(ex.evidenceUrls || []), ...ev.urls()].slice(0, 5); if (ev.urls().length) d.evidenceUrls = all;
        try { await F.updateDoc(F.doc(db, "refundRequests", id), d); B.toast(t("rfReplied"), "ok"); B.pages.refund(m, qs); } catch (x) { err.textContent = B.errMsg(x); }
      }); };
      return;
    }
    if (o.paymentStatus !== "verified" || !["confirmed", "shipped", "delivered", "completed", "disputed"].includes(o.status)) { m.innerHTML = head + `<div class="bv-card bv-pad">${esc(t("rfNotElig"))}</div>`; return; }
    m.innerHTML = head + `<div class="bv-card bv-pad"><form id="rf" novalidate>
      <label for="f-r">${esc(t("rfReason"))}</label><select id="f-r">${["not_as_described", "hidden_defect", "non_delivery", "wrong_item", "damaged_in_transit", "other"].map((r) => `<option value="${r}">${esc(t("rf_" + r))}</option>`).join("")}</select>
      <label for="f-d">${esc(t("rfDesc"))}</label><textarea id="f-d" maxlength="2000"></textarea>
      <label for="f-q">${esc(t("rfRes"))}</label><select id="f-q">${["refund_advance", "refund_full", "replacement", "return_item"].map((r) => `<option value="${r}">${esc(t("rq_" + r))}</option>`).join("")}</select>
      <label>${esc(t("rfEvidence"))}</label><div id="f-ev"></div><p class="bv-hint">${esc(t("rfNoteMoney"))}</p>
      <div class="bv-err" id="f-err" role="alert"></div><button class="bv-btn" type="submit">${esc(t("rfSubmit"))}</button></form></div>`;
    const ev = evidence(m.querySelector("#f-ev"), 5), form = m.querySelector("#rf"), err = m.querySelector("#f-err");
    form.onsubmit = (e) => { e.preventDefault(); B.btnBusy(form.querySelector("button"), async () => {
      err.textContent = ""; const desc = m.querySelector("#f-d").value.trim(); if (desc.length < 20) { err.textContent = t("eFDesc"); return; } if (ev.busy()) { err.textContent = t("evUp"); return; }
      const ts = F.serverTimestamp();
      const d = { orderId: id, buyerId: B.user.uid, sellerId: o.sellerId, reason: m.querySelector("#f-r").value, description: desc.slice(0, 2000), requestedResolution: m.querySelector("#f-q").value, status: "requested", createdAt: ts, updatedAt: ts };
      if (ev.urls().length) d.evidenceUrls = ev.urls();
      try { await F.setDoc(F.doc(db, "refundRequests", id), d); B.toast(t("rfDone"), "ok"); B.pages.refund(m, qs); } catch (x) { err.textContent = B.errMsg(x); }
    }); };
  });

  /* ================= STATIC POLICY PAGES (templates) ================= */
  const DOCS = {
    terms: {
      bn: { title: "শর্তাবলি", s: [
        ["এই সাইট কী", ["এটি ব্যবহৃত পণ্য কেনাবেচার মার্কেটপ্লেস। পণ্যের মালিক বিক্রেতা; আমরা শুধু প্ল্যাটফর্ম, যাচাই ও মধ্যস্থতার সুবিধা দিই। প্রতিটি পণ্য প্রকাশের আগে অ্যাডমিন দেখেন, তবে এটি পণ্যের মান বা সত্যতার গ্যারান্টি নয়।"]],
        ["অ্যাকাউন্ট", ["সঠিক নাম, ইমেইল ও মোবাইল নম্বর দিতে হবে। ইমেইল ভেরিফাই না করলে অর্ডার, পেমেন্ট, রিভিউ ও রিপোর্টের মতো কাজ করা যায় না।", "আপনার অ্যাকাউন্টের নিরাপত্তা আপনার দায়িত্ব। নিয়ম ভাঙলে অ্যাডমিন অ্যাকাউন্ট স্থগিত করতে পারেন।"]],
        ["বিক্রেতার নিয়ম", ["বিক্রেতা অ্যাডমিনের অনুমোদন পেলে তবেই পণ্য দিতে পারেন।", "পণ্যের অবস্থা, ত্রুটি, ব্যবহারের সময়, ছবি ও দাম সত্য হতে হবে। জানা ত্রুটি লুকানো নিষিদ্ধ।", "বিক্রেতা নিশ্চিত করবেন পণ্যের মালিক তিনি বা বিক্রির অনুমতি আছে।", "অগ্রিম যাচাই হওয়ার আগে পণ্য পাঠানো যাবে না।"]],
        ["অর্ডার ও অগ্রিম", ["ক্রেতা পণ্যের দামের নির্ধারিত শতাংশ (অ্যাডমিন ঠিক করেন, সাধারণত ১০%) অগ্রিম পাঠান; বাকিটা ও ডেলিভারি ফি ডেলিভারির সময় নগদে।", "পেমেন্ট স্বয়ংক্রিয় যাচাই হয় না। অ্যাডমিন নিজে মিলিয়ে দেখে যাচাই করলে অর্ডার নিশ্চিত হয়।", "শেষ পণ্য একাধিক ক্রেতা অর্ডার করলে যার অগ্রিম আগে যাচাই হয় সে পাবে; অন্যদের অর্ডার বাতিল করে অগ্রিম ফেরত দেওয়া হবে।"]],
        ["বাতিল ও ফেরত", ["অগ্রিম জমার আগে ক্রেতা অর্ডার বাতিল করতে পারেন। পরে বাতিল বা সমস্যা হলে অ্যাডমিনের মাধ্যমে সমাধান হবে।", "ফেরতের নিয়ম ফেরতের অনুরোধ পাতায় আছে।"]],
        ["নিষিদ্ধ পণ্য", ["চোরাই বা উৎস অজানা পণ্য, নকল/জাল পণ্য, অস্ত্র, মাদক ও নিষিদ্ধ ওষুধ, বিপজ্জনক বা বিস্ফোরক পণ্য, অশ্লীল পণ্য, পরিচয়পত্র বা সরকারি নথি, আইএমইআই ব্লক করা বা লক করা ফোন এবং আইনে বিক্রি নিষিদ্ধ যেকোনো কিছু।"]],
        ["রিভিউ ও রিপোর্ট", ["শুধু সম্পন্ন অর্ডারের ক্রেতা রিভিউ দিতে পারেন। মিথ্যা বা অপমানজনক রিভিউ অ্যাডমিন লুকাতে পারেন।", "রিপোর্ট ইচ্ছাকৃত মিথ্যা হলে রিপোর্টকারীর অ্যাকাউন্টও স্থগিত হতে পারে।"]],
        ["দায়ের সীমা", ["আমরা ক্রেতা-বিক্রেতার মধ্যকার লেনদেনের পক্ষ নই। আইনে অনুমোদিত সীমায় প্ল্যাটফর্ম বিক্রেতার পণ্য, ডেলিভারি বা প্রতারণার দায় নেয় না; তবে অভিযোগ পেলে তদন্ত ও ব্যবস্থা নেওয়ার চেষ্টা করে।"]],
        ["পরিবর্তন", ["এই শর্ত বদলাতে পারে। সাইট ব্যবহার চালিয়ে গেলে নতুন শর্ত মেনে নেওয়া ধরা হবে।"]],
      ] },
      en: { title: "Terms and conditions", s: [
        ["What this site is", ["A marketplace for used goods. The seller owns the item; we only provide the platform, verification and mediation. An admin reviews each listing before it goes live, but this is not a guarantee of quality or authenticity."]],
        ["Accounts", ["You must give your real name, email and mobile number. Without a verified email you cannot order, pay, review or report.", "You are responsible for your account's security. Admins may suspend accounts that break the rules."]],
        ["Seller rules", ["Only sellers approved by an admin may list items.", "Condition, defects, usage time, photos and price must be truthful. Hiding known defects is prohibited.", "The seller confirms they own the item or are authorised to sell it.", "Do not ship before the advance is verified."]],
        ["Orders and advance", ["The buyer pays a set percentage of the item price as an advance (set by the admin, normally 10%); the rest and the delivery fee are paid in cash on delivery.", "Payments are not verified automatically. An admin checks manually, and the order is confirmed after verification.", "If several buyers order the last unit, the one whose advance is verified first gets it; the others are cancelled and refunded the advance."]],
        ["Cancellation and refunds", ["A buyer may cancel before submitting the advance. Later cancellations or problems are resolved through the admin.", "Refund rules are on the refund request page."]],
        ["Prohibited items", ["Stolen or untraceable goods, counterfeit goods, weapons, drugs and illegal medicines, dangerous or explosive items, adult material, ID or government documents, IMEI-blocked or locked phones, and anything illegal to sell."]],
        ["Reviews and reports", ["Only buyers of completed orders can review. Admins may hide false or abusive reviews.", "Knowingly false reports can lead to suspension of the reporter."]],
        ["Limits of liability", ["We are not a party to the transaction between buyer and seller. To the extent allowed by law, the platform is not liable for sellers' goods, delivery or fraud, but it will try to investigate complaints and act."]],
        ["Changes", ["These terms may change. Continued use means you accept the new terms."]],
      ] },
    },
    privacy: {
      bn: { title: "গোপনীয়তা নীতি", s: [
        ["কোন তথ্য রাখি", ["নাম, ইমেইল, মোবাইল নম্বর, ডেলিভারির ঠিকানা, অর্ডার ও পেমেন্টের তথ্য (ট্রানজ্যাকশন আইডি), চ্যাটের বার্তা, রিভিউ, রিপোর্ট ও আপনার দেওয়া ছবি। পাসওয়ার্ড আমরা দেখি না বা রাখি না; তা Firebase Authentication সামলায়।", "আমরা কখনো পিন, ওটিপি, কার্ড নম্বর বা পাসওয়ার্ড চাই না।"]],
        ["কে কী দেখতে পারে", ["আপনার ফোন ও ইমেইল পাবলিক নয়। বিক্রেতা ক্রেতার ঠিকানা ও ফোন দেখেন শুধু অগ্রিম যাচাই হওয়ার পর, ডেলিভারির জন্য।", "অ্যাডমিন অর্ডার, পেমেন্ট, চ্যাট, রিপোর্ট ও রিফান্ডের তথ্য দেখতে পারেন।", "পাবলিক প্রোফাইলে নাম, এলাকা, পরিচিতি, রেটিং ও প্রকাশিত পণ্য দেখা যায়।"]],
        ["চ্যাট", ["চ্যাট এন্ড-টু-এন্ড এনক্রিপ্টেড নয়। অ্যাডমিন সব বার্তা পড়তে পারেন এবং বিবাদের প্রমাণ হিসেবে রাখা হয়। বার্তা বদলানো বা মোছা যায় না।"]],
        ["ছবি", ["পণ্য ও প্রমাণের ছবি Cloudinary-তে রাখা হয়। ছবির লিংক জানলে যে কেউ দেখতে পারে, তাই স্ক্রিনশটে সংবেদনশীল তথ্য রাখবেন না।"]],
        ["তৃতীয় পক্ষ", ["Google Firebase (লগইন ও ডেটাবেস), Cloudinary (ছবি) এবং Blogger (হোস্টিং) ব্যবহার হয়। এগুলোর নিজস্ব গোপনীয়তা নীতি আছে।"]],
        ["কতদিন রাখি", ["অর্ডার, পেমেন্ট, চ্যাট ও রিপোর্ট বিবাদ নিষ্পত্তি ও হিসাবের জন্য রাখা হয়। অ্যাকাউন্ট বা তথ্য সংশোধন/মোছার অনুরোধ যোগাযোগ পাতার মাধ্যমে জানান; চলমান বিবাদ বা আইনি প্রয়োজনে কিছু তথ্য রাখতে হতে পারে।"]],
      ] },
      en: { title: "Privacy policy", s: [
        ["What we keep", ["Name, email, mobile number, delivery address, order and payment details (transaction IDs), chat messages, reviews, reports and photos you upload. We never see or store your password; Firebase Authentication handles it.", "We never ask for PINs, OTPs, card numbers or passwords."]],
        ["Who can see what", ["Your phone and email are not public. A seller sees the buyer's address and phone only after the advance is verified, for delivery.", "Admins can see orders, payments, chats, reports and refund details.", "A public profile shows name, area, bio, ratings and live listings."]],
        ["Chat", ["Chat is not end-to-end encrypted. Admins can read all messages and they are kept as dispute evidence. Messages cannot be edited or deleted."]],
        ["Photos", ["Product and evidence photos are stored on Cloudinary. Anyone with a photo link can view it, so keep sensitive information out of screenshots."]],
        ["Third parties", ["Google Firebase (login and database), Cloudinary (images) and Blogger (hosting) are used. They have their own privacy policies."]],
        ["Retention", ["Orders, payments, chats and reports are kept for dispute resolution and records. Ask for correction or deletion through the contact page; some data may have to be kept for ongoing disputes or legal reasons."]],
      ] },
    },
    safety: {
      bn: { title: "ক্রেতা ও বিক্রেতার নিরাপত্তা নির্দেশিকা", s: [
        ["ক্রেতার জন্য", ["সব লেনদেন সাইটের ভেতরে করুন। সাইটের বাইরে টাকা পাঠাতে বললে সাবধান হোন, রিপোর্ট করুন।", "অগ্রিম শুধু পেমেন্ট পাতায় দেখানো অ্যাডমিনের নম্বরে পাঠান। বিক্রেতার ব্যক্তিগত নম্বরে অগ্রিম পাঠাবেন না।", "ত্রুটির ঘর মন দিয়ে পড়ুন। অস্পষ্ট হলে চ্যাটে প্রশ্ন করুন, বাড়তি ছবি চান।", "পণ্য হাতে পেয়ে খুলে দেখে 'পেয়েছি' চাপুন। সমস্যা থাকলে আগে চ্যাটে ও রিফান্ডের অনুরোধে জানান।", "পিন, ওটিপি বা পাসওয়ার্ড কাউকে দেবেন না।"]],
        ["বিক্রেতার জন্য", ["সত্য ছবি দিন, ত্রুটি লুকাবেন না। জানা সব সমস্যা লিখুন।", "অগ্রিম যাচাই হওয়ার আগে পণ্য পাঠাবেন না।", "পণ্য যত্ন করে মুড়িয়ে পাঠান, কুরিয়ারের রসিদ বা ট্র্যাকিং নম্বর রাখুন।", "ক্রেতাকে সাইটের বাইরে লেনদেনে চাপ দেবেন না।"]],
        ["চোরাই বা সন্দেহজনক পণ্য", ["ফোন বা ল্যাপটপে ক্রয়ের রসিদ, বক্স ও আইএমইআই/সিরিয়াল নম্বর চান ও মিলিয়ে দেখুন।", "দাম অস্বাভাবিক কম, বিক্রেতা তাড়াহুড়া করাচ্ছে, বা কাগজ দিতে চাইছে না, এমন হলে সতর্ক হোন।", "সন্দেহ হলে কিনবেন না এবং পণ্য বা ব্যবহারকারীকে রিপোর্ট করুন (কারণ: চোরাই পণ্যের সন্দেহ)।", "অ্যাডমিন সন্দেহজনক পণ্য সরিয়ে ফেলতে ও অ্যাকাউন্ট স্থগিত করতে পারেন। কেউ চোরাই পণ্য বিক্রি করছে মনে হলে আইনশৃঙ্খলা বাহিনীকেও জানাতে পারেন।"]],
        ["সরাসরি দেখা করে নিলে", ["জনসমাগমের জায়গায় দিনের বেলায় দেখা করুন, সম্ভব হলে সাথে কাউকে নিন।", "পণ্য চালিয়ে বা পরীক্ষা করে নিন।"]],
        ["সীমাবদ্ধতা", ["এই ব্যবস্থা ঝুঁকি কমায়, কিন্তু প্রতারণা পুরোপুরি বন্ধ করতে পারে না। সতর্ক থাকুন।"]],
      ] },
      en: { title: "Buyer and seller safety guidelines", s: [
        ["For buyers", ["Keep all dealings inside the site. Be careful if anyone asks you to pay outside it, and report them.", "Send the advance only to the admin numbers shown on the payment page, never to a seller's personal number.", "Read the defects box carefully. If it is vague, ask in the chat and request more photos.", "Open and check the item before pressing 'Received'. If there is a problem, tell us in the chat and the refund request first.", "Never share your PIN, OTP or password."]],
        ["For sellers", ["Use real photos and never hide defects. List every problem you know of.", "Do not ship before the advance is verified.", "Pack carefully and keep the courier receipt or tracking number.", "Do not pressure buyers into dealing outside the site."]],
        ["Stolen or suspicious goods", ["For phones and laptops ask for the purchase receipt, box and IMEI/serial number, and check them.", "Be wary if the price is unusually low, the seller rushes you, or refuses to show papers.", "If in doubt, do not buy, and report the listing or user (reason: suspected stolen property).", "Admins may remove suspicious listings and suspend accounts. If you think someone is selling stolen goods you can also inform law enforcement."]],
        ["If meeting in person", ["Meet in a busy public place in daylight, bring someone if possible.", "Test or inspect the item before you pay."]],
        ["Limits", ["These measures reduce risk but cannot eliminate fraud completely. Stay alert."]],
      ] },
    },
  };

  function renderDoc(name) {
    return async (m) => {
      const d = DOCS[name][B.lang];
      B.setMeta({ title: d.title, desc: d.s[0][1][0] });
      let extra = "";
      if (name === "terms") {
        if (B.settings.marketplaceRules) extra += `<h2>${esc(t("extraRules"))}</h2><p>${nl2br(B.settings.marketplaceRules)}</p>`;
        if (B.settings.prohibitedItems) extra += `<h2>${esc(t("extraProhibited"))}</h2><p>${nl2br(B.settings.prohibitedItems)}</p>`;
      }
      m.innerHTML = `<div class="bv-card bv-pad" style="max-width:820px;margin:0 auto"><h1 class="bv-h1">${esc(d.title)}</h1>
        ${d.s.map(([h, ps]) => `<h2 style="font-size:1.15rem">${esc(h)}</h2>${ps.length > 1 ? `<ul>${ps.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : `<p>${esc(ps[0])}</p>`}`).join("")}${extra}
        <p class="bv-hint" style="margin-top:20px">${esc(t("docNote"))}</p></div>`;
    };
  }
  B.registerPage("terms", renderDoc("terms"));
  B.registerPage("privacy", renderDoc("privacy"));
  B.registerPage("safety", renderDoc("safety"));

  B.registerPage("contact", async (m) => {
    B.setMeta({ title: t("ctTitle") });
    const c = B.settings.contact || {};
    const has = c.phone || c.email || c.address;
    m.innerHTML = `<div class="bv-card bv-pad" style="max-width:640px;margin:0 auto"><h1 class="bv-h1">${esc(t("ctTitle"))}</h1><p>${esc(t("ctIntro"))}</p>
      ${has ? `<ul style="list-style:none;padding:0;font-size:1.05rem">${c.phone ? `<li>📞 ${esc(t("ctPhone"))}: <a href="tel:${esc(String(c.phone).replace(/[^\d+]/g, ""))}">${esc(c.phone)}</a></li>` : ""}
        ${c.email ? `<li>✉ ${esc(t("ctEmail"))}: ${esc(c.email)}</li>` : ""}${c.address ? `<li>📍 ${esc(t("ctAddr"))}: ${esc(c.address)}</li>` : ""}</ul><p class="bv-hint">${esc(t("ctNote"))}</p>` : B.ui.empty(t("ctNone"))}
      <div class="bv-row"><a class="bv-btn sec" href="${B.url("safety")}">${esc(t("safety"))}</a><a class="bv-btn sec" href="${B.url("terms")}">${esc(t("terms"))}</a><a class="bv-btn sec" href="${B.url("privacy")}">${esc(t("privacy"))}</a></div></div>`;
  });
})();
