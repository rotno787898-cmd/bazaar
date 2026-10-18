/* Bazaar BD – pages-admin.js (Part 7). Paste in the SAME <script type="module"> block, BELOW pages-trust.js.
   Page: admin  (permalink /p/admin-x7k2.html, <div id="bv-app" data-page="admin">). Bangla-only UI for the site owner.
   Every write below is an audited batch/transaction: one adminAuditLogs doc + the changed docs carrying its id (see firestore.rules audited()). */
(function () {
  const B = window.BV;
  const { F, db, esc } = B;
  const PAGE = 30;
  const ts = () => F.serverTimestamp();
  const col = (n) => F.collection(db, n);
  const dref = (n, id) => F.doc(db, n, id);
  const nl = (s) => esc(s).replace(/\n/g, "<br>");
  const short = (s) => esc(String(s || "").slice(0, 8)) + "…";
  const OSTAT = { payment_pending: "পেমেন্টের অপেক্ষা", payment_submitted: "পেমেন্ট যাচাই বাকি", confirmed: "নিশ্চিত", shipped: "পাঠানো হয়েছে", delivered: "ক্রেতা পেয়েছে", completed: "সম্পন্ন", cancelled: "বাতিল", disputed: "বিবাদ" };
  const PSTAT = { draft: "খসড়া", pending_review: "যাচাই বাকি", published: "প্রকাশিত", rejected: "বাতিল", paused: "বন্ধ", sold_out: "স্টক শেষ", removed: "সরানো" };
  const RSTAT = { requested: "নতুন", under_review: "যাচাই চলছে", info_requested: "তথ্য চাওয়া হয়েছে", approved: "অনুমোদিত", rejected: "বাতিল", refund_processing: "ফেরত প্রক্রিয়ায়", completed: "সম্পন্ন" };
  const REPSTAT = { open: "খোলা", investigating: "তদন্ত চলছে", resolved: "নিষ্পত্তি", rejected: "গ্রহণ হয়নি" };
  const REASON = { fake_product: "নকল পণ্য", misleading_description: "বিভ্রান্তিকর বিবরণ", hidden_damage: "লুকানো ত্রুটি", suspected_stolen: "চোরাই সন্দেহ", fake_payment_claim: "ভুয়া পেমেন্ট দাবি", non_delivery: "পণ্য পাঠায়নি", harassment: "হয়রানি", suspected_scam: "প্রতারণা সন্দেহ", counterfeit: "জাল ব্র্যান্ড", prohibited_item: "নিষিদ্ধ পণ্য", other: "অন্য" };
  const RF_REASON = { not_as_described: "বিবরণের সাথে মেলেনি", hidden_defect: "লুকানো ত্রুটি", non_delivery: "পণ্য পায়নি", wrong_item: "ভুল পণ্য", damaged_in_transit: "পথে ক্ষতি", other: "অন্য" };
  const RF_WANT = { refund_advance: "অগ্রিম ফেরত", refund_full: "পুরো টাকা ফেরত", replacement: "পণ্য বদল", return_item: "পণ্য ফেরত" };
  // admin-allowed order transitions (mirror of adminTransitionOk in firestore.rules; payment_submitted->confirmed only through payment verification)
  const NEXT = { payment_pending: ["cancelled"], payment_submitted: [], confirmed: ["shipped", "cancelled", "disputed"], shipped: ["delivered", "cancelled", "disputed"],
    delivered: ["completed", "disputed"], disputed: ["confirmed", "shipped", "delivered", "completed", "cancelled"], completed: [], cancelled: [] };

  const TABS = [["overview", "সারসংক্ষেপ"], ["sellers", "বিক্রেতা আবেদন"], ["products", "পণ্য"], ["payments", "পেমেন্ট"], ["orders", "অর্ডার"], ["refunds", "ফেরত"],
    ["reports", "রিপোর্ট"], ["reviews", "রিভিউ"], ["users", "ব্যবহারকারী"], ["cats", "ক্যাটাগরি"], ["settings", "সেটিংস"], ["audit", "অডিট লগ"]];

  let root, body, cur = { tab: "overview", q: {} }, store = new Map();

  /* ---------- helpers ---------- */
  const ask = (msg, min = 3) => {
    const v = window.prompt(msg); if (v === null) return null;
    const s = v.trim(); if (s.length < min) { B.toast("কমপক্ষে " + B.num(min) + " অক্ষর লিখুন।", "bad"); return null; }
    return s.slice(0, 300);
  };
  const sure = (msg) => window.confirm(msg);
  const fail = (e) => { console.error(e); B.toast(e && e.code ? B.errMsg(e) : (e && e.message) || "ভুল হয়েছে", "bad"); };
  const run = (btn, fn) => B.btnBusy(btn, async () => { try { await fn(); } catch (e) { fail(e); } });
  const chip = (txt, kind) => `<span class="bv-chip ${kind || ""}">${esc(txt)}</span>`;
  const when = (x) => esc(B.fmtDate(x));
  const btn = (a, label, cls) => `<button type="button" class="bv-btn ${cls || "sec"}" data-a="${a}" style="min-height:36px;padding:4px 12px;font-size:.85rem">${esc(label)}</button>`;
  const card = (id, inner) => `<div class="bv-card bv-pad" data-id="${esc(id)}" style="margin-bottom:12px">${inner}</div>`;
  const kv = (k, v) => `<div class="bv-meta"><strong>${esc(k)}:</strong> ${v}</div>`;
  const thumbs = (arr) => (arr || []).map((u) => `<a href="${esc(B.safeUrl(u))}" target="_blank" rel="noopener noreferrer"><img src="${esc(B.img(u, 160))}" alt="" loading="lazy" style="width:72px;height:72px;object-fit:cover;border-radius:8px;margin:2px"></a>`).join("");
  const filterBar = (key, opts, val) => `<div class="bv-row" style="margin-bottom:12px"><select data-filter="${key}" aria-label="ফিল্টার" style="max-width:260px">${opts.map(([v, l]) => `<option value="${esc(v)}"${v === val ? " selected" : ""}>${esc(l)}</option>`).join("")}</select></div>`;

  function newAudit(b, action, targetType, targetId, note, related) {
    const r = F.doc(col("adminAuditLogs"));
    const d = { adminUid: B.user.uid, action, targetType, targetId, createdAt: ts() };
    if (note) d.note = String(note).slice(0, 900);
    if (related && related.length) d.relatedIds = related;
    b.set(r, d);
    return r.id;
  }
  async function notifyUser(toUid, title, bodyTxt, orderId) {
    try {
      if (!toUid) return;
      const d = { userId: toUid, fromUid: B.user.uid, type: orderId ? "order_update" : "admin_notice", title: String(title).slice(0, 120), body: String(bodyTxt || "").slice(0, 300), read: false, createdAt: ts() };
      if (orderId) d.orderId = orderId;
      await F.addDoc(col("notifications"), d);
    } catch (e) { console.warn("notify", e.code); }
  }
  const Q = (c, wheres, order) => (last) => F.query(col(c), ...wheres, F.orderBy(order || "createdAt", "desc"), ...(last ? [F.startAfter(last)] : []), F.limit(PAGE));

  async function pager(box, build, render) {
    let last = null;
    box.innerHTML = '<div data-list></div><div class="bv-row" style="justify-content:center"><button type="button" class="bv-btn sec" data-more hidden>আরও দেখুন</button></div>';
    const list = box.querySelector("[data-list]"), more = box.querySelector("[data-more]");
    async function load() {
      const s = await F.getDocs(build(last));
      if (!s.size && !last) { list.innerHTML = B.ui.empty("কিছু নেই।"); return; }
      s.docs.forEach((d) => store.set(d.id, d.data()));
      list.insertAdjacentHTML("beforeend", (await Promise.all(s.docs.map((d) => render(d.id, d.data())))).join(""));
      last = s.docs[s.docs.length - 1]; more.hidden = s.size < PAGE;
    }
    more.onclick = () => run(more, load);
    await load();
  }

  /* ---------- seller statistics (trusted counters, admin-computed) ---------- */
  async function recalcStats(sid) {
    const eq = (f, v) => F.where(f, "==", v);
    const [oc, cn, rv] = await Promise.all([
      F.getDocs(F.query(col("orders"), eq("sellerId", sid), eq("status", "completed"), F.limit(500))),
      F.getDocs(F.query(col("orders"), eq("sellerId", sid), eq("status", "cancelled"), F.limit(500))),
      F.getDocs(F.query(col("reviews"), eq("sellerId", sid), eq("status", "visible"), F.limit(500))),
    ]);
    let units = 0; oc.forEach((d) => { units += Number(d.data().qty) || 0; });
    let sum = 0; rv.forEach((d) => { sum += Number(d.data().rating) || 0; });
    const cancelled = cn.docs.filter((d) => d.data().paymentStatus === "verified").length;
    const b = F.writeBatch(db);
    const aid = newAudit(b, "recalc_seller_stats", "user", sid, "completed=" + oc.size + " reviews=" + rv.size);
    b.set(dref("sellerStats", sid), { completedSales: oc.size, completedUnits: units, cancelledCount: cancelled, ratingSum: sum, ratingCount: rv.size, updatedAt: ts(), auditId: aid });
    await b.commit();
    if (oc.size >= 500 || rv.size >= 500) B.toast("৫০০টির বেশি রেকর্ড, পরিসংখ্যান আংশিক হতে পারে।", "bad");
  }

  /* Pause every live listing of a seller (ban / seller suspension). Listings keep adminHold so the seller cannot resume them. */
  async function holdSellerProducts(sid, reason) {
    const s = await F.getDocs(F.query(col("products"), F.where("sellerId", "==", sid), F.where("status", "==", "published"), F.limit(180)));
    const docs = s.docs; let n = 0;
    for (let i = 0; i < docs.length; i += 18) {
      const chunk = docs.slice(i, i + 18), b = F.writeBatch(db);
      const aid = newAudit(b, "hold_seller_products", "user", sid, reason, chunk.map((d) => d.id));
      chunk.forEach((d) => b.update(d.ref, { status: "paused", adminHold: true, rejectionReason: reason, reviewedBy: B.user.uid, reviewedAt: ts(), auditId: aid, updatedAt: ts() }));
      await b.commit(); n += chunk.length;
    }
    return n;
  }

  /* ================= OVERVIEW ================= */
  async function tabOverview(m) {
    const C = (c, ...w) => F.getCountFromServer(F.query(col(c), ...w)).then((s) => s.data().count).catch(() => null);
    const eq = (f, v) => F.where(f, "==", v);
    const agg = (w, f) => F.getAggregateFromServer(F.query(col("orders"), w), { n: F.count(), s: F.sum(f) }).then((s) => s.data()).catch(() => null);
    const [apps, prodPend, payPend, refNew, refRev, refInfo, repOpen, disp, users, sellers, prodLive, ordAll, ordDone, ordShip, ordConf, done, adv] = await Promise.all([
      C("sellerApplications", eq("status", "pending")), C("products", eq("status", "pending_review")), C("payments", eq("status", "submitted")),
      C("refundRequests", eq("status", "requested")), C("refundRequests", eq("status", "under_review")), C("refundRequests", eq("status", "info_requested")),
      C("reports", eq("status", "open")), C("orders", eq("status", "disputed")), C("users"), C("users", eq("sellerStatus", "approved")),
      C("products", eq("status", "published")), C("orders"), C("orders", eq("status", "completed")), C("orders", eq("status", "shipped")), C("orders", eq("status", "confirmed")),
      agg(eq("status", "completed"), "totalAmount"), agg(eq("paymentStatus", "verified"), "advanceAmount"),
    ]);
    const v = (x) => (x === null || x === undefined ? "?" : B.num(x));
    const tile = (tab, n, label, warn) => `<button type="button" class="bv-card bv-pad" data-go="${tab}" style="text-align:left;cursor:pointer;border:${warn && n ? "2px solid #f59e0b" : "1px solid var(--bv-border)"}"><div style="font-size:1.8rem;font-weight:700">${v(n)}</div><div class="bv-meta">${esc(label)}</div></button>`;
    const plain = (n, label) => `<div class="bv-card bv-pad"><div style="font-size:1.4rem;font-weight:700">${n}</div><div class="bv-meta">${esc(label)}</div></div>`;
    const refPending = [refNew, refRev, refInfo].some((x) => x === null) ? null : refNew + refRev + refInfo;
    m.innerHTML = `<h2 style="font-size:1.1rem">এখন যা করতে হবে</h2>
      <div class="bv-grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">${tile("sellers", apps, "বিক্রেতা আবেদন", 1)}${tile("products", prodPend, "পণ্য যাচাই বাকি", 1)}${tile("payments", payPend, "পেমেন্ট যাচাই বাকি", 1)}
        ${tile("refunds", refPending, "ফেরত অনুরোধ (চলমান)", 1)}${tile("reports", repOpen, "খোলা রিপোর্ট", 1)}${tile("orders", disp, "বিবাদের অর্ডার", 1)}</div>
      <h2 style="font-size:1.1rem;margin-top:20px">সাইটের অবস্থা (সত্যিকারের গণনা)</h2>
      <div class="bv-grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">${plain(v(users), "মোট ব্যবহারকারী")}${plain(v(sellers), "অনুমোদিত বিক্রেতা")}${plain(v(prodLive), "প্রকাশিত পণ্য")}
        ${plain(v(ordAll), "মোট অর্ডার")}${plain(v(ordConf), "নিশ্চিত (পাঠানো বাকি)")}${plain(v(ordShip), "পথে")}${plain(v(ordDone), "সম্পন্ন অর্ডার")}
        ${plain(done ? B.taka(done.s) : "?", "সম্পন্ন অর্ডারের মোট মূল্য")}${plain(adv ? B.taka(adv.s) : "?", "যাচাই হওয়া অগ্রিমের মোট (বাতিল/ফেরত অর্ডারসহ, " + (adv ? B.num(adv.n) : "?") + "টি অর্ডার)")}</div>
      <p class="bv-hint">এই সংখ্যাগুলো সরাসরি ডেটাবেস থেকে গোনা, কোনো আন্দাজ নেই। "?" মানে গণনা আনা যায়নি (ইন্টারনেট বা অনুমতির সমস্যা)। দৈনিক/মাসিক গ্রাফ ফ্রি প্ল্যানে বানানো হয়নি, কারণ প্রতিবার সব অর্ডার পড়তে হতো।</p>`;
  }

  /* ================= SELLER APPLICATIONS ================= */
  async function tabSellers(m) {
    const st = cur.q.status || "pending";
    m.innerHTML = filterBar("status", [["pending", "যাচাই বাকি"], ["approved", "অনুমোদিত"], ["rejected", "বাতিল"]], st) + '<div id="box"></div>';
    await pager(m.querySelector("#box"), Q("sellerApplications", [F.where("status", "==", st)]), async (id, a) => {
      let u = {}; try { const s = await F.getDoc(dref("users", id)); if (s.exists()) u = s.data(); } catch (e) { /* ignore */ }
      return card(id, `<strong>${esc(a.shopName)}</strong> ${chip(a.status, a.status === "rejected" ? "bad" : a.status === "pending" ? "warn" : "")}
        ${kv("নাম", esc(u.name || "?"))}${kv("ফোন", esc(u.phone || "?"))}${kv("ইমেইল", esc(u.email || "?"))}${kv("এলাকা", esc(B.districtName(a.district)) + ", " + esc(a.area))}
        ${kv("আবেদনের তারিখ", when(a.createdAt))}<p>${nl(a.about)}</p>${a.adminNote ? kv("আপনার নোট", nl(a.adminNote)) : ""}
        ${a.status === "pending" ? `<div class="bv-row">${btn("sa-ok", "অনুমোদন", "")}${btn("sa-no", "বাতিল করুন", "danger")}</div>` : ""}`);
    });
  }
  const H_sellers = {
    "sa-ok": (b, id) => run(b, async () => {
      if (!sure("এই ব্যবহারকারীকে বিক্রেতা হিসেবে অনুমোদন দেবেন?")) return;
      const bt = F.writeBatch(db), aid = newAudit(bt, "seller_approve", "user", id);
      bt.update(dref("sellerApplications", id), { status: "approved", adminNote: "", reviewedBy: B.user.uid, reviewedAt: ts(), auditId: aid, updatedAt: ts() });
      bt.update(dref("users", id), { sellerStatus: "approved", role: "seller", moderationReason: "", auditId: aid, updatedAt: ts() });
      await bt.commit(); notifyUser(id, "বিক্রেতা আবেদন অনুমোদিত", "এখন আপনি পণ্য যোগ করতে পারবেন। প্রতিটি পণ্য প্রকাশের আগে আমরা দেখব।");
      B.toast("অনুমোদিত", "ok"); render();
    }),
    "sa-no": (b, id) => run(b, async () => {
      const note = ask("বাতিলের কারণ লিখুন (বিক্রেতা দেখতে পাবে):"); if (!note) return;
      const bt = F.writeBatch(db), aid = newAudit(bt, "seller_reject", "user", id, note);
      bt.update(dref("sellerApplications", id), { status: "rejected", adminNote: note, reviewedBy: B.user.uid, reviewedAt: ts(), auditId: aid, updatedAt: ts() });
      bt.update(dref("users", id), { sellerStatus: "rejected", moderationReason: note, auditId: aid, updatedAt: ts() });
      await bt.commit(); notifyUser(id, "বিক্রেতা আবেদন গ্রহণ হয়নি", note); B.toast("বাতিল করা হয়েছে", "ok"); render();
    }),
  };

  /* ================= PRODUCTS ================= */
  async function prodPatch(id, patch, action, note, notifyTitle) {
    const p = store.get(id) || {};
    const bt = F.writeBatch(db), aid = newAudit(bt, action, "product", id, note);
    bt.update(dref("products", id), Object.assign({ reviewedBy: B.user.uid, reviewedAt: ts(), auditId: aid, updatedAt: ts() }, patch));
    await bt.commit();
    if (notifyTitle) notifyUser(p.sellerId, notifyTitle + ": " + String(p.title || "").slice(0, 60), note || "");
    B.toast("হয়েছে", "ok"); render();
  }
  async function tabProducts(m) {
    const st = cur.q.status || "pending_review", sid = cur.q.id || "";
    m.innerHTML = `<div class="bv-row" style="margin-bottom:12px"><input id="pq" placeholder="পণ্যের আইডি দিয়ে খুঁজুন" value="${esc(sid)}" style="max-width:260px"><button type="button" class="bv-btn sec" data-a="pq">খুঁজুন</button></div>`
      + (sid ? "" : filterBar("status", Object.entries(PSTAT), st)) + '<div id="box"></div>';
    const render1 = (id, p) => card(id, `<div style="display:flex;gap:12px;flex-wrap:wrap"><div>${thumbs(p.images)}</div><div style="flex:1;min-width:220px">
        <strong>${esc(p.title)}</strong> ${chip(PSTAT[p.status] || p.status, ["rejected", "removed"].includes(p.status) ? "bad" : p.status === "pending_review" || p.status === "paused" ? "warn" : "")}${p.adminHold ? " " + chip("অ্যাডমিন হোল্ড", "bad") : ""}
        ${kv("দাম", B.taka(p.price) + (p.negotiable ? " (দরাদরি চলে)" : ""))}${kv("স্টক", B.num(p.stock))}${kv("অবস্থা", esc(B.t("cond_" + p.condition)))}${p.usageDuration ? kv("ব্যবহার", esc(p.usageDuration)) : ""}
        ${kv("বিক্রেতা", esc(p.sellerName) + " <small>(" + short(p.sellerId) + ")</small>")}${kv("ক্যাটাগরি", esc(p.categoryId))}${kv("এলাকা", esc(B.districtName(p.district)) + ", " + esc(p.area))}
        ${p.brand || p.model ? kv("ব্র্যান্ড/মডেল", esc((p.brand || "") + " " + (p.model || ""))) : ""}${p.purchaseYear ? kv("কেনার সাল", esc(p.purchaseYear)) : ""}
        ${kv("মালিকানার ঘোষণা", p.ownershipConfirmed ? "হ্যাঁ" : "না")}${kv("জানা ত্রুটি", nl(p.defects))}
        <details><summary style="cursor:pointer">পুরো বিবরণ</summary><p>${nl(p.description)}</p>${p.accessories ? kv("সাথে যা আছে", nl(p.accessories)) : ""}${p.warrantyInfo ? kv("ওয়ারেন্টি", nl(p.warrantyInfo)) : ""}</details>
        ${p.rejectionReason ? kv("কারণ", nl(p.rejectionReason)) : ""}${kv("তৈরি", when(p.createdAt))}
        <div class="bv-row" style="margin-top:8px">
          ${p.status === "pending_review" ? btn("p-ok", "প্রকাশ করুন", "") + btn("p-no", "বাতিল (কারণসহ)", "danger") : ""}
          ${["published", "sold_out"].includes(p.status) ? btn("p-pause", "বন্ধ ও হোল্ড", "sec") : ""}
          ${p.status === "paused" && p.adminHold ? btn("p-release", "হোল্ড তুলুন", "") : ""}
          ${["published", "paused", "sold_out", "pending_review", "rejected"].includes(p.status) ? btn("p-remove", "সরিয়ে ফেলুন", "danger") : ""}
          ${p.status === "removed" || p.status === "rejected" ? btn("p-reopen", "আবার যাচাইয়ে পাঠান", "sec") : ""}
          <a class="bv-btn sec" href="${B.url("seller", { id: p.sellerId })}" style="min-height:36px;padding:4px 12px;font-size:.85rem">বিক্রেতার পাতা</a></div></div></div>`);
    if (sid) { const s = await F.getDoc(dref("products", sid)); const bx = m.querySelector("#box"); if (!s.exists()) bx.innerHTML = B.ui.empty("পাওয়া যায়নি।"); else { store.set(sid, s.data()); bx.innerHTML = render1(sid, s.data()); } return; }
    await pager(m.querySelector("#box"), Q("products", [F.where("status", "==", st)]), render1);
  }
  const H_products = {
    pq: (b) => { cur.q = { id: root.querySelector("#pq").value.trim() }; render(); },
    "p-ok": (b, id) => run(b, async () => { const p = store.get(id); await prodPatch(id, { status: p.stock > 0 ? "published" : "sold_out", approved: true, adminHold: false, rejectionReason: F.deleteField() }, "product_approve", "", "পণ্য প্রকাশিত"); }),
    "p-no": (b, id) => run(b, async () => { const r = ask("বাতিলের কারণ লিখুন (বিক্রেতা দেখবে):"); if (r) await prodPatch(id, { status: "rejected", approved: false, rejectionReason: r }, "product_reject", r, "পণ্য প্রকাশ হয়নি"); }),
    "p-pause": (b, id) => run(b, async () => { const r = ask("বন্ধ করার কারণ:"); if (r) await prodPatch(id, { status: "paused", adminHold: true, rejectionReason: r }, "product_hold", r, "পণ্য বন্ধ করা হয়েছে"); }),
    "p-release": (b, id) => run(b, async () => { const p = store.get(id); await prodPatch(id, { status: p.stock > 0 ? "published" : "sold_out", approved: true, adminHold: false, rejectionReason: F.deleteField() }, "product_release", "", "পণ্য আবার চালু"); }),
    "p-remove": (b, id) => run(b, async () => { const r = ask("সরানোর কারণ:"); if (r) await prodPatch(id, { status: "removed", approved: false, adminHold: true, rejectionReason: r }, "product_remove", r, "পণ্য সরানো হয়েছে"); }),
    "p-reopen": (b, id) => run(b, async () => { await prodPatch(id, { status: "pending_review", approved: false, adminHold: false }, "product_reopen", "", ""); }),
  };

  /* ================= PAYMENTS ================= */
  class NoStock extends Error {}
  async function verifyPayment(pid) {
    const aref = F.doc(col("adminAuditLogs"));
    await F.runTransaction(db, async (tx) => {
      const pref = dref("payments", pid), ps = await tx.get(pref);
      if (!ps.exists() || ps.data().status !== "submitted") throw new Error("এই পেমেন্ট আর 'জমা' অবস্থায় নেই। পাতা রিফ্রেশ করুন।");
      const p = ps.data(), oref = dref("orders", p.orderId), os = await tx.get(oref);
      if (!os.exists()) throw new Error("অর্ডার পাওয়া যায়নি।");
      const o = os.data();
      if (o.status !== "payment_submitted" || o.paymentId !== pid) throw new Error("অর্ডারের অবস্থা বদলে গেছে। পাতা রিফ্রেশ করুন।");
      if (p.amount !== o.advanceAmount) throw new Error("পেমেন্টের অঙ্ক অগ্রিমের সমান নয়।");
      const prref = dref("products", o.productId), prs = await tx.get(prref);
      if (!prs.exists() || Number(prs.data().stock) < o.qty) throw new NoStock("stock");
      const pr = prs.data(), left = Number(pr.stock) - o.qty;
      tx.set(aref, { adminUid: B.user.uid, action: "payment_verify", targetType: "order", targetId: p.orderId, relatedIds: [pid, o.productId], note: p.method + " " + p.trxId, createdAt: ts() });
      tx.update(pref, { status: "verified", reviewedBy: B.user.uid, reviewedAt: ts(), auditId: aref.id });
      tx.update(oref, { status: "confirmed", paymentStatus: "verified", stockDeducted: true, auditId: aref.id, updatedAt: ts() });
      tx.update(prref, { stock: left, status: left === 0 && pr.status === "published" ? "sold_out" : pr.status, auditId: aref.id, updatedAt: ts() });
    });
  }
  async function cancelNoStock(pid, o) {
    const b = F.writeBatch(db), aid = newAudit(b, "payment_verify_cancel_nostock", "order", o.orderId, "stock unavailable", [pid]);
    b.update(dref("payments", pid), { status: "verified", reviewedBy: B.user.uid, reviewedAt: ts(), auditId: aid });
    b.update(dref("orders", o.orderId), { status: "cancelled", paymentStatus: "verified", cancelReason: "স্টক শেষ হয়ে গেছে, অগ্রিম ফেরত দেওয়া হবে", cancelledBy: "admin", adminNote: "অগ্রিম ফেরত বাকি", auditId: aid, updatedAt: ts() });
    await b.commit();
  }
  async function tabPayments(m) {
    const st = cur.q.status || "submitted";
    m.innerHTML = filterBar("status", [["submitted", "যাচাই বাকি"], ["verified", "যাচাই হয়েছে"], ["rejected", "বাতিল"]], st)
      + '<p class="bv-hint">নিজের বিকাশ/নগদ/রকেট/ব্যাংক অ্যাপে ট্রানজ্যাকশন আইডি, পাঠানো নম্বর ও অঙ্ক মিলিয়ে তারপর "যাচাই" চাপুন। যাচাইয়ে অর্ডার নিশ্চিত হয় এবং স্টক থেকে পণ্য কমে।</p><div id="box"></div>';
    await pager(m.querySelector("#box"), Q("payments", [F.where("status", "==", st)]), async (id, p) => {
      let o = null; try { const s = await F.getDoc(dref("orders", p.orderId)); if (s.exists()) o = s.data(); } catch (e) { /* ignore */ }
      if (o) store.set("o:" + id, o);
      return card(id, `<strong>${esc(B.t("pay_" + p.method))}</strong> · ট্রানজ্যাকশন: <code>${esc(p.trxId)}</code> ${chip(p.status, p.status === "rejected" ? "bad" : p.status === "submitted" ? "warn" : "")}
        ${kv("পাঠানো নম্বর", esc(p.senderNumber))}${kv("অঙ্ক", "<strong>" + B.taka(p.amount) + "</strong>")}${kv("জমার সময়", when(p.createdAt))}
        ${o ? kv("অর্ডার", `<a href="${B.url("order", { id: p.orderId })}">${esc(p.orderId)}</a> · ${esc(o.productTitle)} × ${B.num(o.qty)} · অগ্রিম ${B.taka(o.advanceAmount)} (${esc(OSTAT[o.status] || o.status)})`) : kv("অর্ডার", esc(p.orderId))}
        ${p.evidenceUrl ? `<div>${thumbs([p.evidenceUrl])}</div>` : ""}${p.rejectReason ? kv("বাতিলের কারণ", nl(p.rejectReason)) : ""}
        ${p.status === "submitted" ? `<div class="bv-row">${btn("pay-ok", "যাচাই হয়েছে, নিশ্চিত করুন", "")}${btn("pay-no", "টাকা পাইনি / ভুল", "danger")}</div>` : ""}`);
    });
  }
  const H_payments = {
    "pay-ok": (b, id) => run(b, async () => {
      if (!sure("টাকা আপনার অ্যাকাউন্টে এসেছে এবং ট্রানজ্যাকশন আইডি, নম্বর ও অঙ্ক মিলেছে?")) return;
      const o = store.get("o:" + id);
      try { await verifyPayment(id); }
      catch (e) {
        if (e instanceof NoStock) {
          if (!sure("এই পণ্যের স্টক এখন অর্ডারের সংখ্যার চেয়ে কম। অগ্রিম যাচাই করে অর্ডারটি বাতিল করবেন? (অগ্রিম আপনাকে নিজে ফেরত পাঠাতে হবে)")) return;
          await cancelNoStock(id, o); notifyUser(o.buyerId, "অর্ডার বাতিল: স্টক শেষ", "দুঃখিত, পণ্যটি আর নেই। আপনার অগ্রিম ফেরত দেওয়া হবে।", o.orderId);
          B.toast("অর্ডার বাতিল। অগ্রিম ফেরত পাঠান এবং অর্ডারের নোটে লিখে রাখুন।", "ok"); render(); return;
        }
        throw e;
      }
      if (o) { notifyUser(o.buyerId, "অগ্রিম যাচাই হয়েছে", "আপনার অর্ডার নিশ্চিত। বিক্রেতা শীঘ্রই পাঠাবেন।", o.orderId); notifyUser(o.sellerId, "নতুন নিশ্চিত অর্ডার", "অগ্রিম যাচাই হয়েছে। পণ্য পাঠান: " + String(o.productTitle || "").slice(0, 60), o.orderId); }
      B.toast("যাচাই হয়েছে, অর্ডার নিশ্চিত", "ok"); render();
    }),
    "pay-no": (b, id) => run(b, async () => {
      const r = ask("বাতিলের কারণ (ক্রেতা দেখবে, যেমন: ট্রানজ্যাকশন আইডি মেলেনি):"); if (!r) return;
      const o = store.get("o:" + id), p = store.get(id); if (!o) throw new Error("অর্ডার পাওয়া যায়নি।");
      const bt = F.writeBatch(db), aid = newAudit(bt, "payment_reject", "order", p.orderId, r, [id]);
      bt.update(dref("payments", id), { status: "rejected", rejectReason: r, reviewedBy: B.user.uid, reviewedAt: ts(), auditId: aid });
      bt.update(dref("orders", p.orderId), { status: "payment_pending", paymentStatus: "unpaid", adminNote: "পেমেন্ট বাতিল: " + r, auditId: aid, updatedAt: ts() });
      await bt.commit(); notifyUser(o.buyerId, "পেমেন্ট গ্রহণ হয়নি", r + " সঠিক তথ্যসহ আবার জমা দিন।", p.orderId); B.toast("বাতিল করা হয়েছে", "ok"); render();
    }),
  };

  /* ================= ORDERS ================= */
  async function changeOrder(id, next, reason) {
    const aref = F.doc(col("adminAuditLogs"));
    let o0;
    await F.runTransaction(db, async (tx) => {
      const oref = dref("orders", id), os = await tx.get(oref);
      if (!os.exists()) throw new Error("অর্ডার পাওয়া যায়নি।");
      const o = os.data(); o0 = o;
      if (!(NEXT[o.status] || []).includes(next)) throw new Error("অর্ডারের অবস্থা বদলে গেছে। পাতা রিফ্রেশ করুন।");
      const patch = { status: next, auditId: aref.id, updatedAt: ts() }, related = [];
      if (next === "shipped") patch.shippedAt = ts();
      if (next === "delivered") patch.deliveredAt = ts();
      if (next === "completed") patch.completedAt = ts();
      let prUpdate = null;
      if (next === "cancelled") {
        patch.cancelReason = reason; patch.cancelledBy = "admin";
        if (o.stockDeducted) {
          const prref = dref("products", o.productId), prs = await tx.get(prref);
          if (prs.exists()) {
            const pr = prs.data(), stock = Math.min(999, Number(pr.stock) + o.qty);
            prUpdate = [prref, { stock, status: pr.status === "sold_out" && pr.approved === true && pr.adminHold !== true ? "published" : pr.status, auditId: aref.id, updatedAt: ts() }];
            related.push(o.productId);
          }
          patch.stockDeducted = false;
        }
      }
      tx.set(aref, Object.assign({ adminUid: B.user.uid, action: "order_" + next, targetType: "order", targetId: id, note: reason || "", createdAt: ts() }, related.length ? { relatedIds: related } : {}));
      tx.update(oref, patch);
      if (prUpdate) tx.update(prUpdate[0], prUpdate[1]);
    });
    return o0;
  }
  async function tabOrders(m) {
    const st = cur.q.status || "all", sid = cur.q.id || "";
    m.innerHTML = `<div class="bv-row" style="margin-bottom:12px"><input id="oq" placeholder="অর্ডার আইডি" value="${esc(sid)}" style="max-width:240px"><button type="button" class="bv-btn sec" data-a="oq">খুঁজুন</button></div>`
      + (sid ? "" : filterBar("status", [["all", "সব"]].concat(Object.entries(OSTAT)), st)) + '<div id="box"></div>';
    const render1 = (id, o) => card(id, `<strong>${esc(o.productTitle)}</strong> × ${B.num(o.qty)} ${chip(OSTAT[o.status] || o.status, o.status === "cancelled" ? "bad" : ["payment_pending", "payment_submitted", "disputed"].includes(o.status) ? "warn" : "")}
        <div class="bv-meta"><a href="${B.url("order", { id })}">${esc(id)}</a> · ${when(o.createdAt)}</div>
        ${kv("বিক্রেতা", esc(o.sellerName) + " <small>(" + short(o.sellerId) + ")</small>")}${kv("ক্রেতা", "<small>" + esc(o.buyerId) + "</small>")}
        ${kv("মোট", B.taka(o.totalAmount) + " (অগ্রিম " + B.taka(o.advanceAmount) + " · ডেলিভারিতে " + B.taka(o.codAmount) + ")")}
        ${kv("ডেলিভারি", esc(o.deliveryMethod === "pickup" ? "নিজে নেবে" : "হোম ডেলিভারি") + " · " + esc(B.districtName(o.district)))}
        ${kv("পেমেন্ট", esc(o.paymentStatus))}${o.stockDeducted ? kv("স্টক", "কাটা হয়েছে") : ""}${o.cancelReason ? kv("বাতিলের কারণ", nl(o.cancelReason)) : ""}${o.adminNote ? kv("আপনার নোট", nl(o.adminNote)) : ""}
        <div data-ship></div>
        <div class="bv-row" style="margin-top:8px">${btn("o-addr", "ঠিকানা/ফোন দেখুন", "sec")}${btn("o-note", "নোট লিখুন", "sec")}
          ${o.status === "payment_submitted" ? `<button type="button" class="bv-btn" data-go="payments" style="min-height:36px;padding:4px 12px;font-size:.85rem">পেমেন্ট যাচাই করুন</button>` : ""}
          ${(NEXT[o.status] || []).length ? `<select data-next aria-label="নতুন অবস্থা" style="max-width:190px;min-height:36px">${(NEXT[o.status] || []).map((n) => `<option value="${n}">${esc(OSTAT[n])}</option>`).join("")}</select>${btn("o-set", "অবস্থা বদলান", "")}` : ""}
          ${btn("o-room", "চ্যাট রুমের অবস্থা", "sec")}</div>
        ${o.status === "cancelled" && o.paymentStatus === "verified" && !/ফেরত পাঠানো/.test(o.adminNote || "") ? '<p class="bv-hint">⚠ অগ্রিম নেওয়া হয়েছে কিন্তু অর্ডার বাতিল। ফেরত পাঠিয়ে "নোট লিখুন"-এ ট্রানজ্যাকশন লিখুন ("ফেরত পাঠানো: ...")।</p>' : ""}`);
    if (sid) { const s = await F.getDoc(dref("orders", sid)); const bx = m.querySelector("#box"); if (!s.exists()) bx.innerHTML = B.ui.empty("পাওয়া যায়নি।"); else { store.set(sid, s.data()); bx.innerHTML = render1(sid, s.data()); } return; }
    await pager(m.querySelector("#box"), Q("orders", st === "all" ? [] : [F.where("status", "==", st)]), render1);
  }
  const H_orders = {
    oq: () => { cur.q = { id: root.querySelector("#oq").value.trim() }; render(); },
    "o-addr": (b, id) => run(b, async () => {
      const s = await F.getDoc(F.doc(db, "orders", id, "shipping", "details")); const box = b.closest("[data-id]").querySelector("[data-ship]");
      if (!s.exists()) { box.innerHTML = '<p class="bv-hint">ঠিকানা পাওয়া যায়নি।</p>'; return; }
      const d = s.data(); box.innerHTML = `<div class="bv-banner" style="text-align:left;border-radius:8px">${esc(d.buyerName)} · ${esc(d.buyerPhone)}<br>${nl(d.address)}, ${esc(d.area)}, ${esc(B.districtName(d.district))}${d.deliveryNote ? "<br>নোট: " + nl(d.deliveryNote) : ""}${d.orderNote ? "<br>" + nl(d.orderNote) : ""}</div>`;
    }),
    "o-note": (b, id) => run(b, async () => {
      const n = ask("অর্ডারের নোট (আগেরটি বদলে যাবে):", 1); if (!n) return;
      const o = store.get(id), bt = F.writeBatch(db), aid = newAudit(bt, "order_note", "order", id, n);
      bt.update(dref("orders", id), { adminNote: n, auditId: aid, updatedAt: ts() }); await bt.commit(); B.toast("নোট সংরক্ষিত", "ok"); render();
    }),
    "o-set": (b, id) => run(b, async () => {
      const next = b.closest("[data-id]").querySelector("[data-next]").value; let reason = "";
      if (next === "cancelled") { reason = ask("বাতিলের কারণ (ক্রেতা-বিক্রেতা দেখবে):"); if (!reason) return; }
      else if (!sure("অবস্থা বদলে '" + OSTAT[next] + "' করবেন?")) return;
      const o = await changeOrder(id, next, reason);
      const msg = { shipped: "অর্ডার পাঠানো হয়েছে", delivered: "অর্ডার ডেলিভারি হয়েছে", completed: "অর্ডার সম্পন্ন", cancelled: "অর্ডার বাতিল: " + reason, disputed: "অর্ডারে সমস্যা, অ্যাডমিন দেখছে", confirmed: "অর্ডার নিশ্চিত" }[next];
      notifyUser(o.buyerId, msg, "", id); notifyUser(o.sellerId, msg, "", id);
      if (next === "completed") { try { await recalcStats(o.sellerId); } catch (e) { fail(e); } }
      if (next === "cancelled" && o.paymentStatus === "verified") B.toast("অগ্রিম ফেরত পাঠিয়ে নোটে লিখে রাখুন।", "ok"); else B.toast("হয়েছে", "ok");
      render();
    }),
    "o-room": (b, id) => run(b, async () => {
      const s = window.prompt("চ্যাট রুমের অবস্থা লিখুন: open / escalated / resolved / closed\n(closed হলে কেউ আর বার্তা পাঠাতে পারবে না)"); if (s === null) return;
      const v = s.trim(); if (!["open", "escalated", "resolved", "closed"].includes(v)) { B.toast("ভুল মান", "bad"); return; }
      const note = (window.prompt("নোট (ঐচ্ছিক):") || "").trim().slice(0, 300);
      const bt = F.writeBatch(db), aid = newAudit(bt, "room_status", "order", id, v + " " + note);
      const patch = { status: v, auditId: aid, updatedAt: ts() }; if (note) patch.adminNote = note;
      bt.update(dref("dealRooms", id), patch); await bt.commit(); B.toast("চ্যাট রুম হালনাগাদ", "ok");
    }),
  };

  /* ================= REFUNDS ================= */
  async function tabRefunds(m) {
    const st = cur.q.status || "requested";
    m.innerHTML = filterBar("status", Object.entries(RSTAT), st) + '<p class="bv-hint">টাকা ফেরত আপনি নিজে বিকাশ/নগদ ইত্যাদিতে পাঠান। "সম্পন্ন" চাপতে ফেরতের পরিমাণ, মাধ্যম ও ট্রানজ্যাকশন রেফারেন্স লাগবে।</p><div id="box"></div>';
    await pager(m.querySelector("#box"), Q("refundRequests", [F.where("status", "==", st)]), async (id, r) => {
      let o = null; try { const s = await F.getDoc(dref("orders", id)); if (s.exists()) o = s.data(); } catch (e) { /* ignore */ }
      if (o) store.set("o:" + id, o);
      const open = !["completed", "rejected"].includes(r.status);
      return card(id, `<strong>${esc(o ? o.productTitle : id)}</strong> ${chip(RSTAT[r.status] || r.status, r.status === "rejected" ? "bad" : r.status === "completed" ? "" : "warn")}
        <div class="bv-meta"><a href="${B.url("order", { id })}">${esc(id)}</a> · ${when(r.createdAt)}</div>
        ${o ? kv("অর্ডার", B.taka(o.totalAmount) + " · অগ্রিম " + B.taka(o.advanceAmount) + " · " + esc(OSTAT[o.status] || o.status)) : ""}
        ${kv("সমস্যা", esc(RF_REASON[r.reason] || r.reason))}${kv("ক্রেতা চায়", esc(RF_WANT[r.requestedResolution] || ""))}<p>${nl(r.description)}</p>
        <div>${thumbs(r.evidenceUrls)}</div>${r.infoRequested ? kv("আপনি জানতে চেয়েছেন", nl(r.infoRequested)) : ""}${r.buyerReply ? kv("ক্রেতার উত্তর", nl(r.buyerReply)) : ""}
        ${r.adminDecision ? kv("সিদ্ধান্ত", nl(r.adminDecision)) : ""}${r.status === "completed" ? kv("ফেরত", B.taka(r.refundAmount) + " · " + esc(r.refundMethod) + " · " + esc(r.refundTrxRef)) : ""}
        ${open ? `<div style="margin-top:8px"><label>নতুন অবস্থা</label><select data-rs>${["under_review", "info_requested", "approved", "rejected", "refund_processing", "completed"].map((s) => `<option value="${s}">${esc(RSTAT[s])}</option>`).join("")}</select>
          <label>সিদ্ধান্ত / ক্রেতাকে বার্তা</label><textarea data-rd maxlength="500" rows="2"></textarea>
          <div class="bv-row"><input data-ra type="number" min="1" placeholder="ফেরতের টাকা (সম্পন্নের জন্য)" style="max-width:200px"><input data-rm placeholder="মাধ্যম (bKash…)" style="max-width:150px"><input data-rt placeholder="ফেরতের ট্রানজ্যাকশন আইডি" style="max-width:220px"></div>
          ${btn("r-set", "হালনাগাদ করুন", "")}</div>` : ""}`);
    });
  }
  const H_refunds = {
    "r-set": (b, id) => run(b, async () => {
      const c = b.closest("[data-id]"), st = c.querySelector("[data-rs]").value, txt = c.querySelector("[data-rd]").value.trim().slice(0, 500);
      const patch = { status: st, reviewedBy: B.user.uid, updatedAt: ts() };
      if (st === "info_requested") { if (txt.length < 3) throw new Error("কী তথ্য চান তা লিখুন।"); patch.infoRequested = txt; }
      else if (txt) patch.adminDecision = txt;
      if (st === "rejected" && txt.length < 3) throw new Error("বাতিলের কারণ লিখুন।");
      if (st === "completed") {
        const amt = Number(c.querySelector("[data-ra]").value), m1 = c.querySelector("[data-rm]").value.trim(), tr = c.querySelector("[data-rt]").value.trim();
        if (!(amt > 0) || m1.length < 2 || tr.length < 4) throw new Error("ফেরতের টাকা, মাধ্যম ও ট্রানজ্যাকশন আইডি (কমপক্ষে ৪ অক্ষর) দিন।");
        if (!sure("সত্যিই " + B.taka(amt) + " ফেরত পাঠিয়েছেন?")) return;
        Object.assign(patch, { refundAmount: amt, refundMethod: m1.slice(0, 30), refundTrxRef: tr.slice(0, 40), completedAt: ts() });
      }
      const bt = F.writeBatch(db), aid = newAudit(bt, "refund_" + st, "order", id, txt);
      patch.auditId = aid; bt.update(dref("refundRequests", id), patch); await bt.commit();
      const o = store.get("o:" + id), r = store.get(id);
      notifyUser(r.buyerId, "ফেরতের অনুরোধ: " + RSTAT[st], txt, id); B.toast("হালনাগাদ হয়েছে", "ok"); render();
    }),
  };

  /* ================= REPORTS ================= */
  async function tabReports(m) {
    const st = cur.q.status || "open";
    m.innerHTML = filterBar("status", Object.entries(REPSTAT), st) + '<div id="box"></div>';
    await pager(m.querySelector("#box"), Q("reports", [F.where("status", "==", st)]), (id, r) => {
      const goto = r.targetType === "product" ? `<button type="button" class="bv-btn sec" data-goto="products" data-gid="${esc(r.targetId)}" style="min-height:36px;padding:4px 12px;font-size:.85rem">পণ্য খুলুন</button>`
        : r.targetType === "user" ? `<button type="button" class="bv-btn sec" data-goto="users" data-gid="${esc(r.targetId)}" style="min-height:36px;padding:4px 12px;font-size:.85rem">ব্যবহারকারী খুলুন</button>`
        : r.targetType === "order" ? `<button type="button" class="bv-btn sec" data-goto="orders" data-gid="${esc(r.targetId)}" style="min-height:36px;padding:4px 12px;font-size:.85rem">অর্ডার খুলুন</button>` : "";
      return card(id, `<strong>${esc(REASON[r.reason] || r.reason)}</strong> · ${esc(r.targetType)} <code>${esc(r.targetId)}</code> ${chip(REPSTAT[r.status] || r.status, r.status === "open" ? "warn" : "")} ${r.priority !== "normal" ? chip(r.priority, "bad") : ""}
        <div class="bv-meta">রিপোর্টকারী: ${esc(r.reporterId)} · ${when(r.createdAt)}</div><p>${nl(r.description)}</p><div>${thumbs(r.evidenceUrls)}</div>
        ${r.decision ? kv("সিদ্ধান্ত", nl(r.decision)) : ""}${r.resolutionNote ? kv("নোট", nl(r.resolutionNote)) : ""}
        <div class="bv-row" style="margin-top:8px">${goto}</div>
        <div style="margin-top:8px"><div class="bv-row"><select data-rs>${Object.entries(REPSTAT).map(([k, l]) => `<option value="${k}"${k === r.status ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>
          <select data-rp>${["low", "normal", "high", "urgent"].map((k) => `<option value="${k}"${k === r.priority ? " selected" : ""}>${k}</option>`).join("")}</select></div>
          <textarea data-rd maxlength="500" rows="2" placeholder="সিদ্ধান্ত / নোট">${esc(r.decision || "")}</textarea>${btn("rp-set", "সংরক্ষণ", "")}</div>`);
    });
  }
  const H_reports = {
    "rp-set": (b, id) => run(b, async () => {
      const c = b.closest("[data-id]"), st = c.querySelector("[data-rs]").value, pr = c.querySelector("[data-rp]").value, txt = c.querySelector("[data-rd]").value.trim().slice(0, 500);
      if (["resolved", "rejected"].includes(st) && txt.length < 3) throw new Error("সিদ্ধান্ত লিখুন।");
      const bt = F.writeBatch(db), aid = newAudit(bt, "report_" + st, "report", id, txt);
      bt.update(dref("reports", id), { status: st, priority: pr, decision: txt, reviewedBy: B.user.uid, reviewedAt: ts(), auditId: aid });
      await bt.commit(); B.toast("সংরক্ষিত", "ok"); render();
    }),
  };

  /* ================= REVIEWS ================= */
  async function tabReviews(m) {
    const st = cur.q.status || "visible";
    m.innerHTML = filterBar("status", [["visible", "দেখা যাচ্ছে"], ["hidden", "লুকানো"]], st) + '<div id="box"></div>';
    await pager(m.querySelector("#box"), Q("reviews", [F.where("status", "==", st)]), (id, r) => card(id,
      `<span style="color:#f59e0b">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span> <strong>${esc(r.productTitle)}</strong> ${chip(r.status === "visible" ? "দৃশ্যমান" : "লুকানো", r.status === "hidden" ? "bad" : "")}
       <div class="bv-meta">${esc(r.buyerName)} → বিক্রেতা ${short(r.sellerId)} · ${when(r.createdAt)} · অর্ডার ${esc(id)}</div><p>${nl(r.comment || "(মন্তব্য নেই)")}</p>
       ${r.moderationReason ? kv("কারণ", nl(r.moderationReason)) : ""}<div class="bv-row">${r.status === "visible" ? btn("rv-hide", "লুকান (কারণসহ)", "danger") : btn("rv-show", "আবার দেখান", "")}</div>`));
  }
  async function reviewSet(id, status, reason) {
    const r = store.get(id), bt = F.writeBatch(db), aid = newAudit(bt, "review_" + status, "review", id, reason);
    bt.update(dref("reviews", id), { status, moderationReason: reason, moderatedBy: B.user.uid, moderatedAt: ts(), auditId: aid });
    await bt.commit(); await recalcStats(r.sellerId); B.toast("হয়েছে, বিক্রেতার রেটিং হালনাগাদ হয়েছে", "ok"); render();
  }
  const H_reviews = {
    "rv-hide": (b, id) => run(b, async () => { const r = ask("লুকানোর কারণ (যেমন: গালি, ভুয়া):"); if (r) await reviewSet(id, "hidden", r); }),
    "rv-show": (b, id) => run(b, async () => { const r = ask("আবার দেখানোর কারণ:"); if (r) await reviewSet(id, "visible", r); }),
  };

  /* ================= USERS ================= */
  async function tabUsers(m) {
    const q = cur.q.q || "";
    m.innerHTML = `<div class="bv-row" style="margin-bottom:12px"><input id="uq" placeholder="ইমেইল বা ইউজার আইডি (খালি = সর্বশেষ ${PAGE}জন)" value="${esc(q)}" style="max-width:340px"><button type="button" class="bv-btn sec" data-a="uq">খুঁজুন</button></div><div id="box"></div>`;
    const render1 = (id, u) => card(id, `<strong>${esc(u.name)}</strong> ${chip(u.status === "active" ? "সক্রিয়" : "স্থগিত", u.status === "active" ? "" : "bad")} ${u.sellerStatus !== "none" ? chip("বিক্রেতা: " + u.sellerStatus, u.sellerStatus === "approved" ? "" : "warn") : ""}
        ${kv("ইমেইল", esc(u.email))}${kv("ফোন", esc(u.phone))}${kv("আইডি", "<small>" + esc(id) + "</small>")}${kv("যোগ দিয়েছেন", when(u.createdAt))}${u.moderationReason ? kv("কারণ", nl(u.moderationReason)) : ""}
        <div class="bv-row" style="margin-top:8px">${u.status === "active" ? btn("u-ban", "অ্যাকাউন্ট স্থগিত", "danger") : btn("u-unban", "স্থগিত তুলুন", "")}
          ${u.sellerStatus === "approved" ? btn("u-sus", "বিক্রেতা স্থগিত", "danger") : ""}${u.sellerStatus === "suspended" ? btn("u-reinst", "বিক্রেতা চালু", "") : ""}
          ${u.sellerStatus === "approved" ? btn("u-stats", "পরিসংখ্যান হালনাগাদ", "sec") : ""}</div>`);
    const box = m.querySelector("#box");
    if (q.includes("@")) { const s = await F.getDocs(F.query(col("users"), F.where("email", "==", q.toLowerCase()), F.limit(5))); box.innerHTML = s.empty ? B.ui.empty("পাওয়া যায়নি।") : s.docs.map((d) => { store.set(d.id, d.data()); return render1(d.id, d.data()); }).join(""); return; }
    if (q) { const s = await F.getDoc(dref("users", q)); if (!s.exists()) box.innerHTML = B.ui.empty("পাওয়া যায়নি।"); else { store.set(q, s.data()); box.innerHTML = render1(q, s.data()); } return; }
    await pager(box, Q("users", []), render1);
  }
  async function userPatch(id, patch, action, note, title) {
    const bt = F.writeBatch(db), aid = newAudit(bt, action, "user", id, note);
    bt.update(dref("users", id), Object.assign({ moderationReason: note || "", auditId: aid, updatedAt: ts() }, patch)); await bt.commit();
    try { const s = await F.getDoc(dref("publicProfiles", id)); if (s.exists() && patch.status) { const b2 = F.writeBatch(db), a2 = newAudit(b2, action + "_profile", "user", id, note); b2.update(s.ref, { status: patch.status, auditId: a2, updatedAt: ts() }); await b2.commit(); } } catch (e) { console.warn("profile", e.code); }
    if (title) notifyUser(id, title, note);
  }
  const H_users = {
    uq: () => { cur.q = { q: root.querySelector("#uq").value.trim() }; render(); },
    "u-ban": (b, id) => run(b, async () => {
      if (id === B.user.uid) throw new Error("নিজের অ্যাকাউন্ট স্থগিত করা যায় না।");
      const r = ask("স্থগিতের কারণ (ব্যবহারকারী দেখবে):"); if (!r) return;
      await userPatch(id, { status: "suspended" }, "user_suspend", r, "");
      const n = await holdSellerProducts(id, "বিক্রেতার অ্যাকাউন্ট স্থগিত"); B.toast("স্থগিত করা হয়েছে" + (n ? "; " + B.num(n) + "টি পণ্য বন্ধ" : ""), "ok"); render();
    }),
    "u-unban": (b, id) => run(b, async () => { const r = ask("তোলার কারণ:", 2); if (!r) return; await userPatch(id, { status: "active" }, "user_unsuspend", r, "অ্যাকাউন্ট আবার চালু"); B.toast("চালু হয়েছে (বন্ধ করা পণ্য আলাদাভাবে পণ্য ট্যাবে 'হোল্ড তুলুন' করুন)", "ok"); render(); }),
    "u-sus": (b, id) => run(b, async () => {
      const r = ask("বিক্রেতা স্থগিতের কারণ:"); if (!r) return;
      await userPatch(id, { sellerStatus: "suspended" }, "seller_suspend", r, "বিক্রেতা অ্যাকাউন্ট স্থগিত");
      const n = await holdSellerProducts(id, "বিক্রেতা স্থগিত"); B.toast("স্থগিত। " + B.num(n) + "টি পণ্য বন্ধ।", "ok"); render();
    }),
    "u-reinst": (b, id) => run(b, async () => { const r = ask("চালুর কারণ:", 2); if (!r) return; await userPatch(id, { sellerStatus: "approved" }, "seller_reinstate", r, "বিক্রেতা অ্যাকাউন্ট চালু"); B.toast("চালু হয়েছে", "ok"); render(); }),
    "u-stats": (b, id) => run(b, async () => { await recalcStats(id); B.toast("পরিসংখ্যান হালনাগাদ হয়েছে", "ok"); }),
  };

  /* ================= CATEGORIES ================= */
  const fieldsToText = (f) => (Array.isArray(f) ? f : []).map((x) => [x.key, x.labelEn || "", x.labelBn || "", x.type === "number" ? "number" : "text"].join("|")).join("\n");
  function textToFields(t) {
    const out = [];
    for (const line of t.split("\n").map((s) => s.trim()).filter(Boolean)) {
      const [key, en, bn, type] = line.split("|").map((s) => (s || "").trim());
      if (!/^[A-Za-z0-9_]{1,30}$/.test(key)) throw new Error("ফিল্ডের key শুধু ইংরেজি অক্ষর/সংখ্যা/_ (সর্বোচ্চ ৩০): " + key);
      out.push({ key, labelEn: (en || key).slice(0, 40), labelBn: (bn || en || key).slice(0, 40), type: type === "number" ? "number" : "text" });
    }
    if (out.length > 12) throw new Error("সর্বোচ্চ ১২টি অতিরিক্ত ফিল্ড।");
    return out;
  }
  const catForm = (id, c) => `<div data-id="${esc(id)}" class="bv-card bv-pad" style="margin-bottom:12px">
      <strong>${id ? esc(id) : "নতুন ক্যাটাগরি"}</strong> ${id ? chip(c.active ? "চালু" : "বন্ধ", c.active ? "" : "bad") : ""}
      <div class="bv-row"><div style="flex:1;min-width:140px"><label>English নাম</label><input data-ce maxlength="60" value="${esc(c.nameEn || "")}"></div>
        <div style="flex:1;min-width:140px"><label>বাংলা নাম</label><input data-cb maxlength="60" value="${esc(c.nameBn || "")}"></div>
        <div style="width:90px"><label>ক্রম</label><input data-co type="number" value="${esc(c.sortOrder ?? 100)}"></div></div>
      <label>অতিরিক্ত ফিল্ড (প্রতি লাইনে: key|English|বাংলা|text অথবা number)</label><textarea data-cf rows="3" placeholder="storage|Storage|স্টোরেজ|text">${esc(fieldsToText(c.fields))}</textarea>
      <div class="bv-row">${btn("c-save", id ? "সংরক্ষণ" : "যোগ করুন", "")}${id ? btn("c-toggle", c.active ? "বন্ধ করুন" : "চালু করুন", c.active ? "danger" : "sec") : ""}</div></div>`;
  async function tabCats(m) {
    const s = await F.getDocs(F.query(col("categories"), F.orderBy("sortOrder")));
    s.docs.forEach((d) => store.set(d.id, d.data()));
    m.innerHTML = `<p class="bv-hint">ক্যাটাগরি মোছা যায় না, শুধু বন্ধ করা যায় (পুরনো পণ্য ও অর্ডার ঠিক থাকে)। বন্ধ ক্যাটাগরিতে নতুন পণ্য দেওয়া যায় না।</p>${catForm("", { active: true, sortOrder: (s.size + 1) * 10 })}${s.docs.map((d) => catForm(d.id, d.data())).join("")}`;
  }
  const H_cats = {
    "c-save": (b, id) => run(b, async () => {
      const c = b.closest("[data-id]"), en = c.querySelector("[data-ce]").value.trim(), bn = c.querySelector("[data-cb]").value.trim(), so = parseInt(c.querySelector("[data-co]").value, 10);
      if (en.length < 2) throw new Error("English নাম লিখুন।"); if (!Number.isInteger(so)) throw new Error("ক্রম একটি পূর্ণ সংখ্যা হতে হবে।");
      const fields = textToFields(c.querySelector("[data-cf]").value);
      let cid = id;
      if (!cid) {
        cid = en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
        if (!cid) throw new Error("English নামে অন্তত একটি ইংরেজি অক্ষর দিন।");
        if ((await F.getDoc(dref("categories", cid))).exists()) throw new Error("এই নামে ক্যাটাগরি আছে: " + cid);
      }
      const bt = F.writeBatch(db), aid = newAudit(bt, id ? "category_update" : "category_create", "category", cid);
      const d = { nameEn: en.slice(0, 60), nameBn: bn.slice(0, 60), sortOrder: so, fields, auditId: aid, updatedAt: ts() };
      if (!id) { d.active = true; d.createdAt = ts(); }
      bt.set(dref("categories", cid), d, { merge: true }); await bt.commit(); B.toast("সংরক্ষিত", "ok"); render();
    }),
    "c-toggle": (b, id) => run(b, async () => {
      const c = store.get(id), bt = F.writeBatch(db), aid = newAudit(bt, c.active ? "category_disable" : "category_enable", "category", id);
      bt.update(dref("categories", id), { active: !c.active, auditId: aid, updatedAt: ts() }); await bt.commit(); B.toast("হয়েছে", "ok"); render();
    }),
  };

  /* ================= SETTINGS ================= */
  async function tabSettings(m) {
    let S = {}, P = { methods: [] };
    try { const s = await F.getDoc(dref("siteSettings", "public")); if (s.exists()) S = s.data(); } catch (e) { /* ignore */ }
    try { const s = await F.getDoc(dref("siteSettings", "payment")); if (s.exists()) P = s.data(); } catch (e) { /* ignore */ }
    const c = S.contact || {}, bn = S.banner || {}, mm = (k) => (P.methods || []).find((x) => x && x.method === k) || {};
    const field = (id, label, val, extra) => `<label for="${id}">${esc(label)}</label><input id="${id}" value="${esc(val ?? "")}" ${extra || ""}>`;
    const area = (id, label, val, max) => `<label for="${id}">${esc(label)}</label><textarea id="${id}" rows="3" maxlength="${max}">${esc(val || "")}</textarea>`;
    m.innerHTML = `<form id="sf" class="bv-card bv-pad" novalidate><h2 style="font-size:1.1rem">সাইটের সাধারণ সেটিংস</h2>
      ${field("s-name", "সাইটের নাম", S.siteName, 'maxlength="40"')}
      <label for="s-logo">লোগো (ছবি আপলোড করুন)</label><div class="bv-row"><input id="s-logo" value="${esc(S.logoUrl || "")}" placeholder="https://res.cloudinary.com/…" style="flex:1"><input type="file" id="s-logof" accept="image/*" style="max-width:220px"></div>
      ${field("s-color", "থিমের রং (যেমন #0f766e)", S.themeColor, 'maxlength="7"')}
      <div class="bv-row"><div style="flex:1;min-width:150px">${field("s-adv", "অগ্রিমের শতাংশ (১–৫০)", S.advancePercent ?? 10, 'type="number" min="1" max="50"')}</div>
        <div style="flex:1;min-width:150px">${field("s-fee", "ডেলিভারি ফি (৳, ফ্ল্যাট)", S.flatDeliveryFee ?? 120, 'type="number" min="0" max="5000"')}</div></div>
      <p class="bv-hint">শতাংশ বা ফি বদলালে শুধু নতুন অর্ডারে খাটবে, আগের অর্ডারের হিসাব বদলায় না।</p>
      <h3 style="font-size:1rem">যোগাযোগ</h3>${field("s-phone", "ফোন", c.phone, 'maxlength="30"')}${field("s-email", "ইমেইল", c.email, 'maxlength="80"')}${field("s-addr", "ঠিকানা", c.address, 'maxlength="160"')}
      <h3 style="font-size:1rem">ব্যানার ও নোটিশ</h3>${field("s-ban", "ব্যানারের লেখা", bn.text, 'maxlength="160"')}<label><input type="checkbox" id="s-banon" style="width:auto;min-height:0"${bn.active ? " checked" : ""}> ব্যানার দেখান</label>
      <label><input type="checkbox" id="s-maint" style="width:auto;min-height:0"${S.maintenanceMode ? " checked" : ""}> রক্ষণাবেক্ষণ মোড (নতুন অর্ডার বন্ধ)</label>${field("s-maintn", "রক্ষণাবেক্ষণের বার্তা", S.maintenanceNotice, 'maxlength="200"')}
      <h3 style="font-size:1rem">নীতিমালা (খালি রাখলে ডিফল্ট দেখায়)</h3>
      ${area("s-rules", "মার্কেটপ্লেসের বিশেষ নিয়ম (শর্তাবলিতে যোগ হবে)", S.marketplaceRules, 3000)}${area("s-prohib", "অতিরিক্ত নিষিদ্ধ পণ্য", S.prohibitedItems, 2000)}${area("s-refund", "ফেরতের নীতি (ডিফল্টের বদলে)", S.refundPolicy, 3000)}
      <div class="bv-err" id="s-err" role="alert"></div><button class="bv-btn" type="submit">সেটিংস সংরক্ষণ</button></form>
      <form id="pf" class="bv-card bv-pad" novalidate style="margin-top:16px"><h2 style="font-size:1.1rem">অগ্রিম নেওয়ার নম্বর/অ্যাকাউন্ট</h2>
      <p class="bv-hint">শুধু লগইন করা ও ইমেইল ভেরিফাইড ক্রেতারা এগুলো দেখে। যে মাধ্যম চালু রাখতে চান শুধু তার নম্বর লিখুন, খালি রাখলে সেটি দেখাবে না।</p>
      ${["bkash", "nagad", "rocket", "bank"].map((k) => `<fieldset style="border:1px solid var(--bv-border);border-radius:8px;margin-bottom:10px"><legend>${esc(B.t("pay_" + k))}</legend>
        <label>নম্বর / অ্যাকাউন্টের তথ্য</label><input data-pn="${k}" value="${esc(mm(k).accountNumber || "")}" maxlength="80">
        <label>ধরন (Personal / Agent / Merchant / ব্যাংকের নাম)</label><input data-pt="${k}" value="${esc(mm(k).accountType || "")}" maxlength="40">
        <label>নির্দেশনা (যেমন: Send Money করুন, রেফারেন্সে অর্ডার আইডি লিখুন)</label><input data-pi="${k}" value="${esc(mm(k).instructions || "")}" maxlength="200"></fieldset>`).join("")}
      <div class="bv-err" id="p-err" role="alert"></div><button class="bv-btn" type="submit">পেমেন্ট তথ্য সংরক্ষণ</button></form>`;
    const $ = (s) => m.querySelector(s);
    $("#s-logof").onchange = async (e) => { const f = e.target.files[0]; if (!f) return; try { B.toast("আপলোড হচ্ছে…"); $("#s-logo").value = await B.uploadImage(f); B.toast("আপলোড হয়েছে, এবার সংরক্ষণ চাপুন", "ok"); } catch (x) { fail(x); } };
    $("#sf").onsubmit = (e) => { e.preventDefault(); run($("#sf button"), async () => {
      const err = $("#s-err"); err.textContent = "";
      const adv = Number($("#s-adv").value), fee = Number($("#s-fee").value), col1 = $("#s-color").value.trim(), logo = $("#s-logo").value.trim();
      if (!(adv >= 1 && adv <= 50)) { err.textContent = "অগ্রিমের শতাংশ ১ থেকে ৫০-এর মধ্যে হতে হবে।"; return; }
      if (!(fee >= 0 && fee <= 5000)) { err.textContent = "ডেলিভারি ফি ০ থেকে ৫০০০-এর মধ্যে হতে হবে।"; return; }
      if (col1 && !/^#[0-9a-fA-F]{6}$/.test(col1)) { err.textContent = "রং #aabbcc ফরম্যাটে দিন।"; return; }
      if (logo && !/^https:\/\/res\.cloudinary\.com\//.test(logo)) { err.textContent = "লোগো আপলোড বাটন দিয়ে দিন।"; return; }
      if ($("#s-name").value.trim().length < 2) { err.textContent = "সাইটের নাম লিখুন।"; return; }
      const bt = F.writeBatch(db), aid = newAudit(bt, "settings_update", "settings", "settings", "public");
      bt.set(dref("siteSettings", "public"), { siteName: $("#s-name").value.trim(), logoUrl: logo, themeColor: col1, advancePercent: adv, flatDeliveryFee: fee,
        contact: { phone: $("#s-phone").value.trim(), email: $("#s-email").value.trim(), address: $("#s-addr").value.trim() },
        banner: { text: $("#s-ban").value.trim(), active: $("#s-banon").checked }, maintenanceMode: $("#s-maint").checked, maintenanceNotice: $("#s-maintn").value.trim(),
        marketplaceRules: $("#s-rules").value.trim(), prohibitedItems: $("#s-prohib").value.trim(), refundPolicy: $("#s-refund").value.trim(), auditId: aid, updatedAt: ts() }, { merge: true });
      await bt.commit(); B.toast("সংরক্ষিত। নতুন সেটিং পরের পাতা লোডে দেখা যাবে।", "ok");
    }); };
    $("#pf").onsubmit = (e) => { e.preventDefault(); run($("#pf button"), async () => {
      const methods = [];
      ["bkash", "nagad", "rocket", "bank"].forEach((k) => { const n = m.querySelector(`[data-pn="${k}"]`).value.trim(); if (n) methods.push({ method: k, accountNumber: n, accountType: m.querySelector(`[data-pt="${k}"]`).value.trim(), instructions: m.querySelector(`[data-pi="${k}"]`).value.trim() }); });
      if (!methods.length) { $("#p-err").textContent = "অন্তত একটি মাধ্যমের নম্বর দিন, নইলে ক্রেতা অগ্রিম পাঠাতে পারবে না।"; return; }
      const bt = F.writeBatch(db), aid = newAudit(bt, "settings_update", "settings", "settings", "payment");
      bt.set(dref("siteSettings", "payment"), { methods, auditId: aid, updatedAt: ts() }, { merge: true }); await bt.commit(); B.toast("পেমেন্ট তথ্য সংরক্ষিত", "ok");
    }); };
  }

  /* ================= AUDIT LOG ================= */
  async function tabAudit(m) {
    m.innerHTML = '<p class="bv-hint">অ্যাডমিনের প্রতিটি কাজ এখানে জমা থাকে। এগুলো বদলানো বা মোছা যায় না।</p><div id="box"></div>';
    await pager(m.querySelector("#box"), Q("adminAuditLogs", []), (id, a) => `<div class="bv-card bv-pad" style="margin-bottom:8px;padding:10px"><strong>${esc(a.action)}</strong> · ${esc(a.targetType)} <code>${esc(a.targetId)}</code>
      <div class="bv-meta">${when(a.createdAt)} · অ্যাডমিন ${short(a.adminUid)}${a.note ? " · " + esc(a.note) : ""}</div></div>`);
  }

  /* ================= router ================= */
  const TABFN = { overview: tabOverview, sellers: tabSellers, products: tabProducts, payments: tabPayments, orders: tabOrders, refunds: tabRefunds, reports: tabReports, reviews: tabReviews, users: tabUsers, cats: tabCats, settings: tabSettings, audit: tabAudit };
  const HANDLERS = Object.assign({}, H_sellers, H_products, H_payments, H_orders, H_refunds, H_reports, H_reviews, H_users, H_cats);

  async function render() {
    store = new Map();
    root.querySelectorAll("[data-tab]").forEach((b) => b.setAttribute("aria-current", b.dataset.tab === cur.tab ? "page" : "false"));
    root.querySelectorAll("[data-tab]").forEach((b) => { b.className = "bv-btn " + (b.dataset.tab === cur.tab ? "" : "sec"); });
    body.innerHTML = B.ui.loading();
    try { await TABFN[cur.tab](body); } catch (e) { console.error(e); body.innerHTML = B.ui.error(e && e.code ? B.errMsg(e) : "লোড করা যায়নি।"); }
  }
  function go(tab, q) { cur = { tab, q: q || {} }; try { history.replaceState(null, "", "#" + tab); } catch (e) { /* ignore */ } render(); window.scrollTo(0, 0); }

  B.registerPage("admin", async (m) => {
    B.setMeta({ title: "অ্যাডমিন" });
    if (!B.requireAdmin(m)) return;
    m.innerHTML = `<h1 class="bv-h1">অ্যাডমিন প্যানেল</h1><div class="bv-row" style="overflow-x:auto;flex-wrap:nowrap;padding-bottom:8px;margin-bottom:12px">${TABS.map(([k, l]) => `<button type="button" class="bv-btn sec" data-tab="${k}" style="white-space:nowrap;min-height:38px;padding:4px 12px;font-size:.9rem">${esc(l)}</button>`).join("")}</div><div id="ad-body"></div>`;
    root = m; body = m.querySelector("#ad-body");
    m.onclick = (e) => {
      const t = e.target.closest("[data-tab]"); if (t) { go(t.dataset.tab); return; }
      const g = e.target.closest("[data-go]"); if (g) { go(g.dataset.go); return; }
      const gt = e.target.closest("[data-goto]"); if (gt) { go(gt.dataset.goto, gt.dataset.goto === "users" ? { q: gt.dataset.gid } : { id: gt.dataset.gid }); return; }
      const a = e.target.closest("[data-a]"); if (!a) return;
      const h = HANDLERS[a.dataset.a]; const c = a.closest("[data-id]");
      if (h) h(a, c ? c.dataset.id : null);
    };
    m.onchange = (e) => { const f = e.target.closest("[data-filter]"); if (f) { cur.q = { [f.dataset.filter]: f.value }; render(); } };
    const h = (location.hash || "").replace("#", ""); cur = { tab: TABFN[h] ? h : "overview", q: {} };
    await render();
  });
})();
