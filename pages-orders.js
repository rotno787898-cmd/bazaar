/* Bazaar BD – pages-orders.js (Part 5A). Paste in the SAME <script type="module"> block, BELOW pages-seller.js.
   Pages: cart, checkout, pay, orders. Also defines BV.notify (used by pages-order.js).
   Order creation = one batch per product line: order + dealRoom + shipping/details (+ cart delete). Matches firestore.rules. */
(function () {
  const B = window.BV;
  const { F, db, esc, t } = B;

  B.addI18n({
    bn: {
      cartTitle: "আমার কার্ট", cartEmpty: "কার্ট খালি।", goShop: "পণ্য দেখুন", rm: "সরান", unavail: "এই পণ্য এখন কেনা যাচ্ছে না।", onlyStock: "স্টকে আছে মাত্র {n}টি।",
      fixQty: "পরিমাণ ঠিক করুন", cartSub: "পণ্যের মোট দাম", cartNote: "ডেলিভারি ফি ও অগ্রিমের হিসাব চেকআউটে দেখবেন।", proceed: "চেকআউটে যান", unitPrice: "প্রতি পিস",
      sellerLbl: "বিক্রেতা", cartOwn: "এটি আপনার নিজের পণ্য, কেনা যাবে না।",
      coTitle: "চেকআউট", coSelect: "যে পণ্যগুলো কিনবেন", coMethod: "পাওয়ার উপায়", coHome: "হোম ডেলিভারি", coPickup: "নিজে গিয়ে নেব",
      coInfo: "ডেলিভারির তথ্য", coName: "আপনার নাম", coPhone: "মোবাইল নম্বর", coAddr: "পুরো ঠিকানা", coDist: "জেলা", coArea: "এলাকা (থানা/মহল্লা)",
      coDNote: "ডেলিভারির নির্দেশনা (ঐচ্ছিক)", coONote: "অর্ডারের নোট (ঐচ্ছিক)",
      coSummary: "হিসাব", coSubtotal: "পণ্যের দাম", coDelivery: "ডেলিভারি ফি", coAdvance: "এখন অগ্রিম দিতে হবে", coCod: "ডেলিভারির সময় দেবেন", coTotal: "সব মিলিয়ে মোট",
      coMulti: "প্রতিটি পণ্যের জন্য আলাদা অর্ডার হয়, আলাদা অগ্রিম ও আলাদা ডেলিভারি ফি লাগে। প্রতিটি অগ্রিম পাঠানোর ট্রানজ্যাকশন আইডিও আলাদা হতে হবে।",
      coAdvNote: "অগ্রিম = পণ্যের দামের {p}%। ডেলিভারি ফি আলাদা, ডেলিভারির সময় দিতে হবে।", coAgree: "আমি হিসাব দেখেছি এবং শর্তাবলি মেনে নিচ্ছি।", coPlace: "অর্ডার নিশ্চিত করুন",
      coNoItems: "চেকআউটের জন্য কোনো কেনার-যোগ্য পণ্য নেই।", coSettingsMissing: "সাইটের সেটিংস এখনো প্রস্তুত নয়। অ্যাডমিনের সাথে যোগাযোগ করুন।", coMaint: "সাইট এখন রক্ষণাবেক্ষণে আছে, নতুন অর্ডার নেওয়া যাচ্ছে না।",
      coDone: "অর্ডার হয়েছে!", coDoneMsg: "এখন প্রতিটি অর্ডারের অগ্রিম পাঠিয়ে ট্রানজ্যাকশন আইডি জমা দিন। অগ্রিম যাচাই না হওয়া পর্যন্ত অর্ডার নিশ্চিত হয় না।",
      coFailed: "এই অর্ডার হয়নি (স্টক, দাম বা বিক্রেতার অবস্থা বদলে থাকতে পারে)।", coOk: "অর্ডার হয়েছে", payNow: "অগ্রিম দিন", noneSel: "কমপক্ষে একটি পণ্য বাছুন।",
      eAddr: "পুরো ঠিকানা লিখুন (কমপক্ষে ৫ অক্ষর)।", eAgree: "হিসাব দেখে টিক দিন।", price: "দাম",
      ordTitle: "আমার অর্ডার", ordNone: "এখনো কোনো অর্ডার নেই।", ordOpen: "বিস্তারিত", ordAdv: "অগ্রিম", ordCod: "ডেলিভারিতে",
      payTitle: "অগ্রিম পেমেন্ট", payNotBuyer: "এই অর্ডার আপনার নয়।", payAmount: "আপনাকে অগ্রিম পাঠাতে হবে", payHow: "কীভাবে পাঠাবেন",
      payStep1: "নিচের যেকোনো একটি নম্বরে ঠিক এই পরিমাণ টাকা 'Send Money' করুন (বা ব্যাংকে জমা দিন)।", payStep2: "টাকা পাঠানোর পর পাওয়া ট্রানজ্যাকশন আইডি (TrxID) নিচের ফর্মে লিখুন।",
      payStep3: "অ্যাডমিন নিজে মিলিয়ে দেখে যাচাই করলে অর্ডার নিশ্চিত হবে। এতে কিছু সময় লাগতে পারে।",
      payWarn: "সতর্কতা: আপনার PIN, OTP বা পাসওয়ার্ড কাউকে দেবেন না, এই সাইটেও লিখবেন না। আমরা কখনো তা চাই না।",
      payNoMethods: "অ্যাডমিন এখনো পেমেন্টের নম্বর দেননি। কিছুক্ষণ পরে আবার দেখুন।", payTo: "পাঠাতে হবে", payType: "ধরন", copy: "কপি", copied: "কপি হয়েছে",
      payMethod: "কোন মাধ্যমে পাঠিয়েছেন", payTrx: "ট্রানজ্যাকশন আইডি (TrxID)", payTrxHint: "ইংরেজি বড় হাতের অক্ষর ও সংখ্যা, ৬ থেকে ২০টি।", paySender: "যে নম্বর থেকে পাঠিয়েছেন",
      payEvidence: "স্ক্রিনশট (ঐচ্ছিক)", payEvidenceWarn: "স্ক্রিনশট গোপন নয়, লিংক জানলে যে কেউ দেখতে পারে। তাই ট্রানজ্যাকশন আইডি লিখলেই যথেষ্ট; ছবি দিলে অন্যের নম্বর বা PIN যেন না দেখা যায়।",
      paySubmit: "পেমেন্ট জমা দিন", paySent: "জমা হয়েছে। অ্যাডমিন যাচাই করবেন।", payUnder: "আপনার পেমেন্ট যাচাই চলছে।", payVerified: "পেমেন্ট যাচাই হয়েছে।",
      payRejected: "আপনার পেমেন্ট গ্রহণ হয়নি।", payRejReason: "কারণ", payAgain: "সঠিক তথ্য দিয়ে আবার জমা দিন।", payNotNeeded: "এই অর্ডারের জন্য এখন পেমেন্ট জমার প্রয়োজন নেই।",
      eTrx: "ট্রানজ্যাকশন আইডি ঠিক নেই (৬-২০টি ইংরেজি বড় অক্ষর/সংখ্যা)।", ePhone: "মোবাইল নম্বর ঠিক নেই।", eMethod: "পেমেন্ট মাধ্যম বাছুন।",
      payDup: "জমা হয়নি। এই ট্রানজ্যাকশন আইডি আগেই ব্যবহার হয়েছে, বা অর্ডারের অবস্থা বদলেছে।", orderStatus: "অর্ডারের অবস্থা", trxLbl: "ট্রানজ্যাকশন",
    },
    en: {
      cartTitle: "My cart", cartEmpty: "Your cart is empty.", goShop: "Browse products", rm: "Remove", unavail: "This item cannot be bought right now.", onlyStock: "Only {n} in stock.",
      fixQty: "Fix quantity", cartSub: "Items total", cartNote: "Delivery fee and advance are shown at checkout.", proceed: "Go to checkout", unitPrice: "Each",
      sellerLbl: "Seller", cartOwn: "This is your own listing and cannot be bought.",
      coTitle: "Checkout", coSelect: "Items to buy", coMethod: "Receive by", coHome: "Home delivery", coPickup: "I will pick up",
      coInfo: "Delivery details", coName: "Your name", coPhone: "Mobile number", coAddr: "Full address", coDist: "District", coArea: "Area",
      coDNote: "Delivery instructions (optional)", coONote: "Order note (optional)",
      coSummary: "Summary", coSubtotal: "Items", coDelivery: "Delivery fee", coAdvance: "Advance to pay now", coCod: "Pay on delivery", coTotal: "Grand total",
      coMulti: "Each product becomes a separate order with its own advance and delivery fee. Each advance payment needs its own transaction ID.",
      coAdvNote: "Advance = {p}% of the item price. The delivery fee is separate and paid on delivery.", coAgree: "I have checked the amounts and accept the terms.", coPlace: "Confirm order",
      coNoItems: "There is nothing purchasable to check out.", coSettingsMissing: "Site settings are not ready yet. Contact the admin.", coMaint: "The site is under maintenance; new orders are paused.",
      coDone: "Order placed!", coDoneMsg: "Now send the advance for each order and submit its transaction ID. An order is not confirmed until the advance is verified.",
      coFailed: "This order failed (stock, price or seller status may have changed).", coOk: "Order placed", payNow: "Pay advance", noneSel: "Select at least one item.",
      eAddr: "Enter the full address (at least 5 characters).", eAgree: "Tick to confirm you checked the amounts.", price: "Price",
      ordTitle: "My orders", ordNone: "No orders yet.", ordOpen: "Details", ordAdv: "Advance", ordCod: "On delivery",
      payTitle: "Advance payment", payNotBuyer: "This order is not yours.", payAmount: "You must send an advance of", payHow: "How to pay",
      payStep1: "Send exactly this amount ('Send Money') to one of the numbers below, or deposit at the bank.", payStep2: "Enter the transaction ID (TrxID) you receive in the form below.",
      payStep3: "An admin checks it manually; the order is confirmed after verification. This can take some time.",
      payWarn: "Warning: never share your PIN, OTP or password with anyone, and never type them on this site. We will never ask for them.",
      payNoMethods: "The admin has not added payment numbers yet. Please check again later.", payTo: "Send to", payType: "Type", copy: "Copy", copied: "Copied",
      payMethod: "Paid through", payTrx: "Transaction ID (TrxID)", payTrxHint: "Capital letters and digits, 6 to 20 characters.", paySender: "Number you sent from",
      payEvidence: "Screenshot (optional)", payEvidenceWarn: "Screenshots are not private; anyone with the link can see them. The transaction ID is enough; if you add an image, make sure no PIN or other person's number is visible.",
      paySubmit: "Submit payment", paySent: "Submitted. An admin will verify it.", payUnder: "Your payment is under review.", payVerified: "Payment verified.",
      payRejected: "Your payment was not accepted.", payRejReason: "Reason", payAgain: "Submit again with the correct details.", payNotNeeded: "No payment needs to be submitted for this order right now.",
      eTrx: "Transaction ID is invalid (6-20 capital letters/digits).", ePhone: "Mobile number is invalid.", eMethod: "Choose a payment method.",
      payDup: "Not submitted. This transaction ID was already used, or the order status changed.", orderStatus: "Order status", trxLbl: "Transaction",
    },
  });

  const fromDocs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const toInt = (s) => { const x = String(s || "").replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d)).replace(/[^\d]/g, ""); return x ? Number(x) : NaN; };
  const validId = (s) => /^[A-Za-z0-9_-]{1,60}$/.test(s || "");

  /* Notify the OTHER party of an order (best effort; order must already exist). Link is rebuilt from orderId when rendering. */
  B.notify = async (orderId, toUid, title, body) => {
    try {
      if (!B.user || !toUid || toUid === B.user.uid) return;
      await F.addDoc(F.collection(db, "notifications"), { userId: toUid, fromUid: B.user.uid, type: "order_update", title: String(title).slice(0, 120),
        body: String(body || "").slice(0, 300), orderId, read: false, createdAt: F.serverTimestamp() });
    } catch (e) { console.warn("notify", e.code); }
  };

  const gate = (m) => B.requireVerified(m);

  /* ================= CART ================= */
  async function loadCartLines() {
    const snap = await F.getDocs(F.query(F.collection(db, "users", B.user.uid, "cart"), F.limit(50)));
    return Promise.all(snap.docs.map(async (d) => {
      let p = null;
      try { const s = await F.getDoc(F.doc(db, "products", d.id)); if (s.exists()) p = { id: s.id, ...s.data() }; } catch (e) { /* not visible */ }
      return { id: d.id, qty: Number(d.data().qty) || 1, p };
    }));
  }
  const lineState = (l) => {
    const p = l.p;
    if (!p || p.status !== "published" || p.approved !== true) return "unavail";
    if (p.sellerId === B.user.uid) return "own";
    if (!(p.stock > 0)) return "unavail";
    if (l.qty > p.stock) return "qty";
    return "ok";
  };
  B.cartLineState = lineState; B.loadCartLines = loadCartLines;

  B.registerPage("cart", async (m) => {
    B.setMeta({ title: t("cartTitle") });
    if (!gate(m)) return;
    async function draw() {
      const lines = await loadCartLines();
      if (!lines.length) { m.innerHTML = `<h1 class="bv-h1">${esc(t("cartTitle"))}</h1><div class="bv-card bv-pad">${B.ui.empty(t("cartEmpty"))}<div style="text-align:center"><a class="bv-btn" href="${B.url("shop")}">${esc(t("goShop"))}</a></div></div>`; return; }
      let sum = 0, okCount = 0;
      const rows = lines.map((l) => {
        const st = lineState(l), p = l.p;
        if (st === "ok") { sum += p.price * l.qty; okCount++; }
        const img = p ? B.img(p.images && p.images[0], 160) : "";
        return `<div class="bv-card bv-pad" style="margin-bottom:10px" data-pid="${esc(l.id)}">
          <div class="bv-row" style="align-items:flex-start;flex-wrap:nowrap">${img ? `<img src="${esc(img)}" alt="" style="width:80px;height:80px;object-fit:cover;border-radius:8px">` : ""}
            <div style="flex:1;min-width:0"><a href="${B.url("product", { id: l.id })}" style="font-weight:600">${esc(p ? p.title : l.id)}</a>
              ${p ? `<div class="bv-meta">${esc(t("sellerLbl"))}: ${esc(p.sellerName)} · ${esc(t("unitPrice"))}: ${B.taka(p.price)}</div><div>${B.taka(p.price * l.qty)}</div>` : ""}
              ${st === "unavail" ? `<div class="bv-err">${esc(t("unavail"))}</div>` : ""}
              ${st === "own" ? `<div class="bv-err">${esc(t("cartOwn"))}</div>` : ""}
              ${st === "qty" ? `<div class="bv-err">${esc(t("onlyStock", { n: B.num(p.stock) }))} <button class="bv-btn sec" data-act="fix" style="min-height:32px;padding:2px 10px">${esc(t("fixQty"))}</button></div>` : ""}</div></div>
          <div class="bv-row" style="margin-top:8px">${st === "ok" || st === "qty" ? `<button class="bv-btn sec" data-act="dec" style="min-width:44px" aria-label="-">−</button><strong>${B.num(l.qty)}</strong><button class="bv-btn sec" data-act="inc" style="min-width:44px" aria-label="+">＋</button>` : ""}
            <button class="bv-btn danger" data-act="rm">${esc(t("rm"))}</button></div></div>`;
      }).join("");
      m.innerHTML = `<h1 class="bv-h1">${esc(t("cartTitle"))}</h1>${rows}
        <div class="bv-card bv-pad"><div class="bv-row" style="justify-content:space-between"><span>${esc(t("cartSub"))}</span><strong style="font-size:1.3rem">${B.taka(sum)}</strong></div>
          <p class="bv-hint">${esc(t("cartNote"))}</p>
          ${okCount ? `<a class="bv-btn block" href="${B.url("checkout")}">${esc(t("proceed"))}</a>` : ""}</div>`;
      const cache = Object.fromEntries(lines.map((l) => [l.id, l]));
      m.onclick = async (e) => {
        const b = e.target.closest("[data-act]"); if (!b) return;
        const id = b.closest("[data-pid]").dataset.pid, l = cache[id], ref = F.doc(db, "users", B.user.uid, "cart", id);
        await B.btnBusy(b, async () => {
          try {
            const max = l.p ? Math.min(l.p.stock, 99) : 99; const a = b.dataset.act;
            if (a === "rm") await F.deleteDoc(ref);
            else if (a === "fix") await F.updateDoc(ref, { qty: Math.max(1, max), updatedAt: F.serverTimestamp() });
            else { const q = Math.max(1, Math.min(l.qty + (a === "inc" ? 1 : -1), max)); await F.updateDoc(ref, { qty: q, updatedAt: F.serverTimestamp() }); }
            B.refreshCounts(); draw();
          } catch (x) { B.toast(B.errMsg(x), "bad"); }
        });
      };
    }
    await draw();
  });

  /* ================= CHECKOUT ================= */
  const calc = (p, qty, method, S) => {
    const subtotal = p.price * qty, deliveryFee = method === "pickup" ? 0 : S.flatDeliveryFee;
    const advanceAmount = Math.ceil(subtotal * S.advancePercent / 100), totalAmount = subtotal + deliveryFee;
    return { subtotal, deliveryFee, advanceAmount, totalAmount, codAmount: totalAmount - advanceAmount };
  };

  B.registerPage("checkout", async (m) => {
    B.setMeta({ title: t("coTitle") });
    if (!gate(m)) return;
    let S;
    try { const s = await F.getDoc(F.doc(db, "siteSettings", "public")); S = s.exists() ? s.data() : null; } catch (e) { S = null; }
    if (!S || typeof S.advancePercent !== "number" || typeof S.flatDeliveryFee !== "number") { m.innerHTML = B.ui.error(t("coSettingsMissing")); return; }
    if (S.maintenanceMode === true) { m.innerHTML = B.ui.error(t("coMaint")); return; }
    if (!B.profile) { location.href = B.url("account"); return; }
    const all = await loadCartLines();
    const lines = all.filter((l) => lineState(l) === "ok").map((l) => ({ ...l, orderId: B.newOrderId(),
      methods: [...(l.p.deliveryOptions || []).includes("delivery") ? ["home"] : [], ...(l.p.deliveryOptions || []).includes("pickup") ? ["pickup"] : []] }))
      .filter((l) => l.methods.length);
    if (!lines.length) { m.innerHTML = `<div class="bv-card bv-pad">${B.ui.empty(t("coNoItems"))}<div style="text-align:center"><a class="bv-btn" href="${B.url("cart")}">${esc(t("cartTitle"))}</a></div></div>`; return; }
    lines.forEach((l) => { l.method = l.methods[0]; l.on = true; });
    const lineHtml = (l, i) => `<div class="bv-card bv-pad" style="margin-bottom:8px"><label style="font-weight:600;margin:0"><input type="checkbox" data-sel="${i}" checked style="width:auto;min-height:0"> ${esc(l.p.title)} × ${B.num(l.qty)}</label>
      <div class="bv-meta">${esc(t("sellerLbl"))}: ${esc(l.p.sellerName)} · ${B.taka(l.p.price)}</div>
      <div class="bv-row" style="margin-top:4px"><span>${esc(t("coMethod"))}:</span>${l.methods.map((x) => `<label style="font-weight:400;margin:0"><input type="radio" name="mt${i}" value="${x}" data-mt="${i}" style="width:auto;min-height:0"${x === l.method ? " checked" : ""}> ${esc(t(x === "home" ? "coHome" : "coPickup"))}</label>`).join("")}</div>
      <div class="bv-meta" data-line="${i}"></div></div>`;
    m.innerHTML = `<h1 class="bv-h1">${esc(t("coTitle"))}</h1>
      <h2 style="font-size:1.1rem">${esc(t("coSelect"))}</h2>${lines.map(lineHtml).join("")}<p class="bv-hint">${esc(t("coMulti"))}</p>
      <div class="bv-card bv-pad" style="margin:12px 0"><h2 style="margin-top:0;font-size:1.1rem">${esc(t("coInfo"))}</h2>
        <label for="c-n">${esc(t("coName"))}</label><input id="c-n" maxlength="60" value="${esc(B.profile.name)}">
        <label for="c-p">${esc(t("coPhone"))}</label><input id="c-p" type="tel" inputmode="tel" value="${esc(B.profile.phone)}">
        <label for="c-a">${esc(t("coAddr"))}</label><textarea id="c-a" maxlength="300"></textarea>
        <label for="c-d">${esc(t("coDist"))}</label><select id="c-d">${B.districtOptions("Dhaka")}</select>
        <label for="c-r">${esc(t("coArea"))}</label><input id="c-r" maxlength="60">
        <label for="c-dn">${esc(t("coDNote"))}</label><input id="c-dn" maxlength="300">
        <label for="c-on">${esc(t("coONote"))}</label><input id="c-on" maxlength="300"></div>
      <div class="bv-card bv-pad" id="co-sum"></div>
      <label style="font-weight:400;margin-top:12px"><input type="checkbox" id="c-ag" style="width:auto;min-height:0"> ${esc(t("coAgree"))}</label>
      <div class="bv-err" id="c-err" role="alert"></div>
      <button class="bv-btn block" id="c-go" style="margin-top:8px">${esc(t("coPlace"))}</button>`;
    const $ = (s) => m.querySelector(s), err = $("#c-err");
    function sum() {
      let st = 0, df = 0, ad = 0, cod = 0, tot = 0;
      lines.forEach((l, i) => {
        const c = calc(l.p, l.qty, l.method, S), el = m.querySelector(`[data-line="${i}"]`);
        el.textContent = `${t("coSubtotal")}: ${B.taka(c.subtotal)} · ${t("coDelivery")}: ${B.taka(c.deliveryFee)} · ${t("coAdvance")}: ${B.taka(c.advanceAmount)}`;
        if (l.on) { st += c.subtotal; df += c.deliveryFee; ad += c.advanceAmount; cod += c.codAmount; tot += c.totalAmount; }
      });
      $("#co-sum").innerHTML = `<h2 style="margin-top:0;font-size:1.1rem">${esc(t("coSummary"))}</h2>
        <div class="bv-row" style="justify-content:space-between"><span>${esc(t("coSubtotal"))}</span><span>${B.taka(st)}</span></div>
        <div class="bv-row" style="justify-content:space-between"><span>${esc(t("coDelivery"))}</span><span>${B.taka(df)}</span></div>
        <div class="bv-row" style="justify-content:space-between"><strong>${esc(t("coTotal"))}</strong><strong>${B.taka(tot)}</strong></div><hr>
        <div class="bv-row" style="justify-content:space-between;color:var(--bv-primary)"><strong>${esc(t("coAdvance"))}</strong><strong style="font-size:1.3rem">${B.taka(ad)}</strong></div>
        <div class="bv-row" style="justify-content:space-between"><span>${esc(t("coCod"))}</span><span>${B.taka(cod)}</span></div>
        <p class="bv-hint">${esc(t("coAdvNote", { p: B.num(S.advancePercent) }))}</p>`;
    }
    m.querySelectorAll("[data-sel]").forEach((c) => { c.onchange = () => { lines[Number(c.dataset.sel)].on = c.checked; sum(); }; });
    m.querySelectorAll("[data-mt]").forEach((r) => { r.onchange = () => { lines[Number(r.dataset.mt)].method = r.value; sum(); }; });
    sum();

    $("#c-go").onclick = (e) => B.btnBusy(e.currentTarget, async () => {
      err.textContent = "";
      const sel = lines.filter((l) => l.on), name = $("#c-n").value.trim(), phone = B.normPhone($("#c-p").value), addr = $("#c-a").value.trim(), area = $("#c-r").value.trim();
      if (!sel.length) { err.textContent = t("noneSel"); return; }
      if (name.length < 2) { err.textContent = t("badName"); return; }
      if (!phone) { err.textContent = t("badPhone"); return; }
      if (addr.length < 5) { err.textContent = t("eAddr"); return; }
      if (area.length < 2) { err.textContent = t("eAddr"); return; }
      if (!$("#c-ag").checked) { err.textContent = t("eAgree"); return; }
      const district = $("#c-d").value, uid = B.user.uid, results = [];
      for (const l of sel) {
        const p = l.p, c = calc(p, l.qty, l.method, S), id = l.orderId, ts = F.serverTimestamp();
        try {
          const batch = F.writeBatch(db);
          batch.set(F.doc(db, "orders", id), { orderId: id, buyerId: uid, sellerId: p.sellerId, sellerName: p.sellerName, productId: p.id, productTitle: p.title, productImage: p.images[0],
            productCondition: p.condition, productDefects: p.defects, categoryId: p.categoryId, qty: l.qty, unitPrice: p.price, subtotal: c.subtotal, deliveryMethod: l.method,
            deliveryFee: c.deliveryFee, advancePercent: S.advancePercent, advanceAmount: c.advanceAmount, codAmount: c.codAmount, totalAmount: c.totalAmount,
            district, status: "payment_pending", paymentStatus: "unpaid", stockDeducted: false, createdAt: ts, updatedAt: ts });
          batch.set(F.doc(db, "dealRooms", id), { orderId: id, buyerId: uid, sellerId: p.sellerId, participants: [uid, p.sellerId], productTitle: p.title, status: "open", createdAt: ts, updatedAt: ts });
          const ship = { buyerName: name, buyerPhone: phone, address: addr, district, area, createdAt: ts };
          const dn = $("#c-dn").value.trim(), on = $("#c-on").value.trim(); if (dn) ship.deliveryNote = dn; if (on) ship.orderNote = on;
          batch.set(F.doc(db, "orders", id, "shipping", "details"), ship);
          batch.delete(F.doc(db, "users", uid, "cart", p.id));
          await batch.commit();
          results.push({ id, title: p.title, ok: true });
        } catch (x) {
          let exists = false; try { exists = (await F.getDoc(F.doc(db, "orders", id))).exists(); } catch (e2) { /* ignore */ }
          results.push({ id, title: p.title, ok: exists, code: x.code });
          if (!exists) console.warn("order failed", p.id, x.code);
        }
      }
      B.refreshCounts();
      const good = results.filter((r) => r.ok);
      if (good.length === 1 && results.length === 1) { location.href = B.url("pay", { order: good[0].id }); return; }
      m.innerHTML = `<div class="bv-card bv-pad"><h1 class="bv-h1">${esc(good.length ? t("coDone") : t("coFailed"))}</h1>${good.length ? `<p>${esc(t("coDoneMsg"))}</p>` : ""}
        ${results.map((r) => `<div class="bv-card bv-pad" style="margin-bottom:8px"><div>${esc(r.title)}</div>${r.ok ? `<span class="bv-chip">${esc(t("coOk"))}</span> <a class="bv-btn" href="${B.url("pay", { order: r.id })}">${esc(t("payNow"))}</a>` : `<div class="bv-err">${esc(t("coFailed"))}</div>`}</div>`).join("")}
        <a class="bv-btn sec" href="${B.url("orders")}">${esc(t("orders"))}</a></div>`;
    });
  });

  /* ================= PAY (manual advance payment submission) ================= */
  B.registerPage("pay", async (m, qs) => {
    B.setMeta({ title: t("payTitle") });
    if (!gate(m)) return;
    const id = qs.get("order") || "";
    if (!/^BV[0-9A-Z]{10,18}$/.test(id)) { m.innerHTML = B.ui.empty(t("pfNotFound")); return; }
    let o;
    try { const s = await F.getDoc(F.doc(db, "orders", id)); if (!s.exists()) { m.innerHTML = B.ui.empty(t("pfNotFound")); return; } o = s.data(); } catch (e) { m.innerHTML = B.ui.error(t("payNotBuyer")); return; }
    if (o.buyerId !== B.user.uid) { m.innerHTML = B.ui.error(t("payNotBuyer")); return; }
    const head = `<h1 class="bv-h1">${esc(t("payTitle"))}</h1><div class="bv-card bv-pad" style="margin-bottom:12px"><div style="font-weight:600">${esc(o.productTitle)} × ${B.num(o.qty)}</div>
      <div class="bv-meta">${esc(id)}</div><div>${esc(t("orderStatus"))}: ${B.ui.statusChip("o", o.status)}</div>
      <div class="bv-row" style="justify-content:space-between;margin-top:6px"><span>${esc(t("payAmount"))}</span><strong style="font-size:1.5rem;color:var(--bv-primary)">${B.taka(o.advanceAmount)}</strong></div>
      <div class="bv-meta">${esc(t("ordCod"))}: ${B.taka(o.codAmount)}</div></div>`;
    let pay = null;
    if (o.paymentId) { try { const s = await F.getDoc(F.doc(db, "payments", o.paymentId)); if (s.exists()) pay = s.data(); } catch (e) { /* ignore */ } }
    const payInfo = pay ? `<div class="bv-card bv-pad" style="margin-bottom:12px"><strong>${esc(t("trxLbl"))}:</strong> ${esc(t("pay_" + pay.method))} · ${esc(pay.trxId)} · ${B.taka(pay.amount)}
      <div>${pay.status === "verified" ? `<span class="bv-chip">${esc(t("payVerified"))}</span>` : pay.status === "rejected" ? `<span class="bv-chip bad">${esc(t("payRejected"))}</span>${pay.rejectReason ? `<div class="bv-err">${esc(t("payRejReason"))}: ${esc(pay.rejectReason)}</div>` : ""}` : `<span class="bv-chip warn">${esc(t("payUnder"))}</span>`}</div></div>` : "";
    if (o.status !== "payment_pending") {
      m.innerHTML = head + payInfo + `<div class="bv-card bv-pad">${esc(t("payNotNeeded"))} <a href="${B.url("order", { id })}">${esc(t("ordOpen"))}</a></div>`; return;
    }
    let methods = [];
    try { const s = await F.getDoc(F.doc(db, "siteSettings", "payment")); if (s.exists() && Array.isArray(s.data().methods)) methods = s.data().methods.filter((x) => x && ["bkash", "nagad", "rocket", "bank"].includes(x.method) && x.accountNumber); } catch (e) { /* none */ }
    const mopts = methods.map((x) => x.method).filter((v, i, a) => a.indexOf(v) === i);
    m.innerHTML = head + payInfo + `
      <div class="bv-card bv-pad" style="margin-bottom:12px"><h2 style="margin-top:0;font-size:1.1rem">${esc(t("payHow"))}</h2>
        <ol><li>${esc(t("payStep1"))}</li><li>${esc(t("payStep2"))}</li><li>${esc(t("payStep3"))}</li></ol>
        <div class="bv-banner" style="text-align:left;border-radius:8px" role="note">${esc(t("payWarn"))}</div>
        ${methods.length ? methods.map((x, i) => `<div class="bv-card bv-pad" style="margin-top:8px"><strong>${esc(t("pay_" + x.method))}</strong>
          <div class="bv-row"><span style="font-size:1.2rem;font-weight:700" id="acc${i}">${esc(x.accountNumber)}</span><button class="bv-btn sec" data-copy="${i}" style="min-height:36px">${esc(t("copy"))}</button></div>
          ${x.accountType ? `<div class="bv-meta">${esc(t("payType"))}: ${esc(x.accountType)}</div>` : ""}${x.instructions ? `<div class="bv-meta">${esc(x.instructions)}</div>` : ""}</div>`).join("") : `<div class="bv-state">${esc(t("payNoMethods"))}</div>`}</div>
      ${mopts.length ? `<div class="bv-card bv-pad"><form id="pf" novalidate>
        <label for="p-m">${esc(t("payMethod"))}</label><select id="p-m">${mopts.map((x) => `<option value="${x}">${esc(t("pay_" + x))}</option>`).join("")}</select>
        <label for="p-t">${esc(t("payTrx"))}</label><input id="p-t" maxlength="20" autocapitalize="characters" autocomplete="off"><div class="bv-hint">${esc(t("payTrxHint"))}</div>
        <label for="p-s">${esc(t("paySender"))}</label><input id="p-s" type="tel" inputmode="tel" value="${esc(B.profile ? B.profile.phone : "")}">
        <label for="p-e">${esc(t("payEvidence"))}</label><input id="p-e" type="file" accept="image/jpeg,image/png,image/webp"><div class="bv-hint">${esc(t("payEvidenceWarn"))}</div>
        <div class="bv-err" id="p-err" role="alert"></div><button class="bv-btn block" style="margin-top:12px" type="submit">${esc(t("paySubmit"))}</button></form></div>` : ""}`;
    m.querySelectorAll("[data-copy]").forEach((b) => { b.onclick = async () => { try { await navigator.clipboard.writeText(methods[Number(b.dataset.copy)].accountNumber); B.toast(t("copied"), "ok"); } catch (e) { /* ignore */ } }; });
    const form = m.querySelector("#pf"); if (!form) return;
    const err = m.querySelector("#p-err");
    form.onsubmit = (e) => { e.preventDefault(); B.btnBusy(form.querySelector("button[type=submit]"), async () => {
      err.textContent = "";
      const method = m.querySelector("#p-m").value, trx = m.querySelector("#p-t").value.trim().toUpperCase().replace(/\s/g, ""), sender = B.normPhone(m.querySelector("#p-s").value);
      if (!method) { err.textContent = t("eMethod"); return; }
      if (!/^[A-Z0-9]{6,20}$/.test(trx)) { err.textContent = t("eTrx"); return; }
      if (!sender) { err.textContent = t("ePhone"); return; }
      try {
        const file = m.querySelector("#p-e").files[0]; let evidenceUrl = null; if (file) evidenceUrl = await B.uploadImage(file);
        const pid = method + "_" + trx, ts = F.serverTimestamp(), batch = F.writeBatch(db);
        const pd = { orderId: id, buyerId: B.user.uid, method, trxId: trx, senderNumber: sender, amount: o.advanceAmount, status: "submitted", createdAt: ts }; if (evidenceUrl) pd.evidenceUrl = evidenceUrl;
        batch.set(F.doc(db, "payments", pid), pd);
        batch.update(F.doc(db, "orders", id), { status: "payment_submitted", paymentStatus: "submitted", paymentId: pid, updatedAt: ts });
        await batch.commit();
        B.toast(t("paySent"), "ok"); B.pages.pay(m, qs);
      } catch (x) { console.error(x); err.textContent = x.code === "permission-denied" ? t("payDup") : x.code ? B.errMsg(x) : x.message; }
    }); };
  });

  /* ================= MY ORDERS (buyer) ================= */
  B.registerPage("orders", async (m) => {
    B.setMeta({ title: t("ordTitle") });
    if (!B.requireLogin(m)) return;
    m.innerHTML = `<div class="bv-row" style="justify-content:space-between"><h1 class="bv-h1" style="margin:0">${esc(t("ordTitle"))}</h1>
      ${B.sellerApproved ? `<a class="bv-btn sec" href="${B.url("sellerDash")}">${esc(t("sellerDash"))}</a>` : ""}</div>
      <div id="o-list" style="margin-top:12px"></div><div id="o-st"></div><div class="bv-row" style="justify-content:center;margin-top:12px"><button class="bv-btn sec" id="o-more" hidden>${esc(t("loadMore"))}</button></div>`;
    const list = m.querySelector("#o-list"), st = m.querySelector("#o-st"), more = m.querySelector("#o-more");
    let cursor = null, done = false, count = 0;
    const row = (o) => { const img = B.img(o.productImage, 160);
      return `<div class="bv-card bv-pad" style="margin-bottom:10px"><div class="bv-row" style="align-items:flex-start;flex-wrap:nowrap">
        ${img ? `<img src="${esc(img)}" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:8px">` : ""}
        <div style="flex:1;min-width:0"><div style="font-weight:600">${esc(o.productTitle)} × ${B.num(o.qty)}</div><div class="bv-meta">${esc(o.id)} · ${esc(B.fmtDate(o.createdAt))}</div>
          <div>${B.ui.statusChip("o", o.status)} <strong>${B.taka(o.totalAmount)}</strong></div>
          <div class="bv-meta">${esc(t("ordAdv"))}: ${B.taka(o.advanceAmount)} · ${esc(t("ordCod"))}: ${B.taka(o.codAmount)}</div></div></div>
        <div class="bv-row" style="margin-top:8px"><a class="bv-btn sec" href="${B.url("order", { id: o.id })}">${esc(t("ordOpen"))}</a>
          ${o.status === "payment_pending" ? `<a class="bv-btn" href="${B.url("pay", { order: o.id })}">${esc(t("payNow"))}</a>` : ""}</div></div>`; };
    async function load() {
      more.disabled = true; st.innerHTML = B.ui.loading();
      try {
        const args = [F.where("buyerId", "==", B.user.uid), F.orderBy("createdAt", "desc")]; if (cursor) args.push(F.startAfter(cursor)); args.push(F.limit(20));
        const snap = await F.getDocs(F.query(F.collection(db, "orders"), ...args));
        if (snap.size < 20) done = true; if (snap.size) cursor = snap.docs[snap.size - 1];
        count += snap.size; list.insertAdjacentHTML("beforeend", fromDocs(snap).map(row).join(""));
        st.innerHTML = count === 0 ? B.ui.empty(t("ordNone")) : ""; more.hidden = done;
      } catch (e) { console.error(e); st.innerHTML = B.ui.error(B.errMsg(e)); } finally { more.disabled = false; }
    }
    more.onclick = load; await load();
  });
})();
