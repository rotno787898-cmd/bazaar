/* Bazaar BD – pages-order.js (Part 5B). Paste in the SAME <script type="module"> block, BELOW pages-orders.js.
   Pages: order (details + 3-party deal chat), notifications. Uses BV.notify from pages-orders.js. */
(function () {
  const B = window.BV;
  const { F, db, esc, t } = B;

  B.addI18n({
    bn: {
      odTitle: "অর্ডারের বিস্তারিত", odNoAccess: "এই অর্ডার দেখার অনুমতি আপনার নেই বা অর্ডারটি নেই।", odProduct: "পণ্য", odSeller: "বিক্রেতা", odBuyer: "ক্রেতা",
      odDefects: "কেনার সময় জানানো ত্রুটি", odBreak: "দামের হিসাব", odItems: "পণ্যের দাম", odDelivery: "ডেলিভারি ফি", odTotal: "সব মিলিয়ে", odAdvance: "অগ্রিম", odCod: "ডেলিভারির সময় দেবেন",
      odMethodHome: "হোম ডেলিভারি", odMethodPickup: "নিজে গিয়ে নেওয়া", odShip: "ডেলিভারির তথ্য", odShipLater: "ক্রেতার ঠিকানা ও ফোন অগ্রিম যাচাই হওয়ার পর এখানে দেখা যাবে।", odNote: "নোট",
      odPayment: "অগ্রিম পেমেন্ট", odPaid: "যাচাই হয়েছে", odShippedNote: "পাঠানোর নোট", odCancelReason: "বাতিলের কারণ",
      gBuyerPending: "অগ্রিম পাঠিয়ে ট্রানজ্যাকশন আইডি জমা দিন।", gBuyerSubmitted: "অ্যাডমিন আপনার পেমেন্ট যাচাই করছেন।", gBuyerConfirmed: "পেমেন্ট যাচাই হয়েছে। বিক্রেতা শিগগির পণ্য পাঠাবেন।",
      gBuyerShipped: "পণ্য পাঠানো হয়েছে। হাতে পেয়ে সব ঠিক থাকলে নিচের বাটনে 'পেয়েছি' চাপুন। টাকা দেবেন ডেলিভারির সময়।", gBuyerDelivered: "অ্যাডমিন চূড়ান্তভাবে অর্ডার সম্পন্ন করবেন।",
      gBuyerCompleted: "অর্ডার সম্পন্ন। আপনি রিভিউ দিতে পারেন।", gBuyerDisputed: "সমস্যাটি অ্যাডমিন দেখছেন। চ্যাটে সব জানান।", gBuyerCancelled: "অর্ডারটি বাতিল হয়েছে।",
      gSellerPending: "ক্রেতার অগ্রিমের অপেক্ষা চলছে। পণ্য এখন পাঠাবেন না।", gSellerSubmitted: "অ্যাডমিন অগ্রিম যাচাই করছেন। যাচাই না হওয়া পর্যন্ত পণ্য পাঠাবেন না।",
      gSellerConfirmed: "অগ্রিম যাচাই হয়েছে। এখন পণ্য পাঠান এবং 'পাঠিয়েছি' চাপুন।", gSellerShipped: "পণ্য পাঠানো হয়েছে। ক্রেতার নিশ্চিতকরণের অপেক্ষা।", gSellerDelivered: "ক্রেতা পণ্য পেয়েছেন।",
      gSellerCompleted: "অর্ডার সম্পন্ন।", gSellerDisputed: "সমস্যাটি অ্যাডমিন দেখছেন। চ্যাটে সহযোগিতা করুন।", gSellerCancelled: "অর্ডারটি বাতিল হয়েছে।",
      aCancel: "অর্ডার বাতিল করুন", aReceived: "পণ্য হাতে পেয়েছি", aShipped: "পাঠিয়েছি", aRefund: "ফেরত/সমস্যার অনুরোধ", aReview: "রিভিউ দিন", aReport: "রিপোর্ট করুন", aPay: "অগ্রিম দিন",
      cancelPrompt: "বাতিলের কারণ লিখুন (ঐচ্ছিক):", cancelDefault: "ক্রেতা বাতিল করেছেন", confirmReceive: "আপনি কি সত্যিই পণ্য হাতে পেয়েছেন?", shipPrompt: "কুরিয়ার/ট্র্যাকিং নম্বর (ঐচ্ছিক):",
      doneCancel: "অর্ডার বাতিল হয়েছে।", doneRecv: "ধন্যবাদ, জানানো হয়েছে।", doneShip: "'পাঠানো হয়েছে' করা হয়েছে।",
      // chat
      chatTitle: "ক্রেতা–বিক্রেতা–অ্যাডমিন আলোচনা", chatNone: "এই অর্ডারের চ্যাট রুম পাওয়া যায়নি।", chatEmpty: "এখনো কোনো বার্তা নেই। শুরু করুন।", chatPh: "বার্তা লিখুন (সর্বোচ্চ ১০০০ অক্ষর)", chatSend: "পাঠান",
      chatClosed: "এই আলোচনা বন্ধ। নতুন বার্তা পাঠানো যাবে না।", chatNew: "নতুন", chatUnread: "{n}টি নতুন বার্তা", chatSending: "পাঠানো হচ্ছে…", chatErr: "বার্তা পাঠানো যায়নি।",
      chatNote: "সব বার্তা অ্যাডমিন দেখতে পারেন এবং বিবাদের প্রমাণ হিসেবে রাখা হয়। বার্তা বদলানো বা মোছা যায় না। এটি এন্ড-টু-এন্ড এনক্রিপ্টেড নয়। পিন/OTP/পাসওয়ার্ড কখনো লিখবেন না।",
      chatHelp: "অ্যাডমিনের সাহায্য দরকার?", chatHelpLink: "অর্ডার নিয়ে অভিযোগ জানান", rBuyer: "ক্রেতা", rSeller: "বিক্রেতা", rAdmin: "অ্যাডমিন",
      rs_open: "চলছে", rs_escalated: "অ্যাডমিনের কাছে গেছে", rs_resolved: "সমাধান হয়েছে", rs_closed: "বন্ধ", adminNoteLbl: "অ্যাডমিনের নোট",
      // notifications
      ntTitle: "নোটিফিকেশন", ntNone: "কোনো নোটিফিকেশন নেই।", ntAllRead: "সব পড়া হয়েছে", ntMark: "পড়া হয়েছে", ntDel: "মুছুন", ntOpen: "খুলুন", ntDone: "হালনাগাদ হয়েছে।",
    },
    en: {
      odTitle: "Order details", odNoAccess: "You cannot view this order, or it does not exist.", odProduct: "Product", odSeller: "Seller", odBuyer: "Buyer",
      odDefects: "Defects disclosed at purchase", odBreak: "Price breakdown", odItems: "Items", odDelivery: "Delivery fee", odTotal: "Grand total", odAdvance: "Advance", odCod: "Pay on delivery",
      odMethodHome: "Home delivery", odMethodPickup: "Pickup", odShip: "Delivery details", odShipLater: "Buyer address and phone appear here after the advance is verified.", odNote: "Note",
      odPayment: "Advance payment", odPaid: "Verified", odShippedNote: "Shipping note", odCancelReason: "Cancellation reason",
      gBuyerPending: "Send the advance and submit the transaction ID.", gBuyerSubmitted: "An admin is verifying your payment.", gBuyerConfirmed: "Payment verified. The seller will dispatch soon.",
      gBuyerShipped: "Your item was shipped. When you receive it and all is fine, press 'Received' below. Pay the balance on delivery.", gBuyerDelivered: "An admin will complete the order.",
      gBuyerCompleted: "Order completed. You can leave a review.", gBuyerDisputed: "An admin is looking into the problem. Explain everything in the chat.", gBuyerCancelled: "This order was cancelled.",
      gSellerPending: "Waiting for the buyer's advance. Do not ship yet.", gSellerSubmitted: "An admin is verifying the advance. Do not ship until it is verified.",
      gSellerConfirmed: "Advance verified. Ship the item now and press 'Mark shipped'.", gSellerShipped: "Shipped. Waiting for the buyer to confirm.", gSellerDelivered: "The buyer has received the item.",
      gSellerCompleted: "Order completed.", gSellerDisputed: "An admin is looking into the problem. Please help in the chat.", gSellerCancelled: "This order was cancelled.",
      aCancel: "Cancel order", aReceived: "I received the item", aShipped: "Mark shipped", aRefund: "Refund / problem request", aReview: "Leave a review", aReport: "Report", aPay: "Pay advance",
      cancelPrompt: "Reason for cancelling (optional):", cancelDefault: "Cancelled by buyer", confirmReceive: "Have you really received the item?", shipPrompt: "Courier / tracking number (optional):",
      doneCancel: "Order cancelled.", doneRecv: "Thank you, noted.", doneShip: "Marked as shipped.",
      chatTitle: "Buyer – seller – admin chat", chatNone: "No chat room was found for this order.", chatEmpty: "No messages yet. Start the conversation.", chatPh: "Write a message (max 1000 characters)", chatSend: "Send",
      chatClosed: "This conversation is closed. New messages cannot be sent.", chatNew: "New", chatUnread: "{n} new messages", chatSending: "Sending…", chatErr: "Message could not be sent.",
      chatNote: "Admins can read all messages and they are kept as evidence for disputes. Messages cannot be edited or deleted. This chat is not end-to-end encrypted. Never write a PIN, OTP or password.",
      chatHelp: "Need the admin's help?", chatHelpLink: "Report a problem with this order", rBuyer: "Buyer", rSeller: "Seller", rAdmin: "Admin",
      rs_open: "Open", rs_escalated: "Escalated to admin", rs_resolved: "Resolved", rs_closed: "Closed", adminNoteLbl: "Admin note",
      ntTitle: "Notifications", ntNone: "No notifications.", ntAllRead: "Mark all read", ntMark: "Mark read", ntDel: "Delete", ntOpen: "Open", ntDone: "Updated.",
    },
  });

  const nl2br = (s) => esc(s).replace(/\n/g, "<br>");
  const fromDocs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const ORDER_ID = /^BV[0-9A-Z]{10,18}$/;
  let unsub = null;
  const stopChat = () => { if (unsub) { try { unsub(); } catch (e) { /* ignore */ } unsub = null; } };
  addEventListener("pagehide", stopChat);

  /* ================= ORDER DETAILS ================= */
  B.registerPage("order", async (m, qs) => {
    stopChat();
    B.setMeta({ title: t("odTitle") });
    if (!B.requireVerified(m)) return;
    const id = qs.get("id") || "";
    if (!ORDER_ID.test(id)) { m.innerHTML = B.ui.error(t("odNoAccess")); return; }
    let o;
    try { const s = await F.getDoc(F.doc(db, "orders", id)); if (!s.exists()) { m.innerHTML = B.ui.error(t("odNoAccess")); return; } o = { id, ...s.data() }; }
    catch (e) { m.innerHTML = B.ui.error(t("odNoAccess")); return; }
    const uid = B.user.uid, isBuyer = o.buyerId === uid, isSeller = o.sellerId === uid, role = isBuyer ? "buyer" : isSeller ? "seller" : "admin";

    let ship = null, shipDenied = false;
    try { const s = await F.getDoc(F.doc(db, "orders", id, "shipping", "details")); if (s.exists()) ship = s.data(); } catch (e) { shipDenied = true; }
    let pay = null;
    if ((isBuyer || B.isAdmin) && o.paymentId) { try { const s = await F.getDoc(F.doc(db, "payments", o.paymentId)); if (s.exists()) pay = s.data(); } catch (e) { /* none */ } }

    const gk = (role === "seller" ? "gSeller" : "gBuyer") + ({ payment_pending: "Pending", payment_submitted: "Submitted", confirmed: "Confirmed", shipped: "Shipped", delivered: "Delivered", completed: "Completed", cancelled: "Cancelled", disputed: "Disputed" }[o.status] || "Pending");
    const img = B.img(o.productImage, 200);
    const row = (a, b, strong) => `<div class="bv-row" style="justify-content:space-between">${strong ? "<strong>" : "<span>"}${a}${strong ? "</strong>" : "</span>"}${strong ? "<strong>" : "<span>"}${b}${strong ? "</strong>" : "</span>"}</div>`;
    const can = {
      pay: isBuyer && o.status === "payment_pending",
      cancel: isBuyer && o.status === "payment_pending",
      received: isBuyer && o.status === "shipped",
      ship: isSeller && o.status === "confirmed",
      refund: isBuyer && o.paymentStatus === "verified" && ["confirmed", "shipped", "delivered", "completed", "disputed"].includes(o.status),
      review: isBuyer && o.status === "completed",
    };
    m.innerHTML = `
      <div class="bv-row" style="justify-content:space-between"><h1 class="bv-h1" style="margin:0">${esc(t("odTitle"))}</h1>${B.ui.statusChip("o", o.status)}</div>
      <div class="bv-meta">${esc(o.id)} · ${esc(B.fmtDate(o.createdAt))}</div>
      <div class="bv-banner" style="margin:10px 0;border-radius:8px;text-align:left" role="status">${esc(t(gk))}</div>
      ${o.status === "cancelled" && o.cancelReason ? `<div class="bv-err">${esc(t("odCancelReason"))}: ${esc(o.cancelReason)}</div>` : ""}
      <div class="bv-card bv-pad" style="margin-bottom:12px"><div class="bv-row" style="align-items:flex-start;flex-wrap:nowrap">${img ? `<img src="${esc(img)}" alt="" style="width:88px;height:88px;object-fit:cover;border-radius:8px">` : ""}
        <div style="flex:1;min-width:0"><a href="${B.url("product", { id: o.productId })}" style="font-weight:600">${esc(o.productTitle)}</a> × ${B.num(o.qty)}
          <div class="bv-meta">${esc(t("cond_" + o.productCondition))} · ${esc(t("odSeller"))}: <a href="${B.url("seller", { id: o.sellerId })}">${esc(o.sellerName)}</a></div></div></div>
        <div class="bv-card bv-pad" style="background:#fff8e6;border-color:#f3d28a;margin-top:8px"><strong>⚠ ${esc(t("odDefects"))}</strong><div>${nl2br(o.productDefects)}</div></div></div>
      <div class="bv-card bv-pad" style="margin-bottom:12px"><h2 style="margin-top:0;font-size:1.05rem">${esc(t("odBreak"))}</h2>
        ${row(esc(t("odItems")) + " (" + B.taka(o.unitPrice) + " × " + B.num(o.qty) + ")", B.taka(o.subtotal))}
        ${row(esc(t("odDelivery")) + " (" + esc(t(o.deliveryMethod === "pickup" ? "odMethodPickup" : "odMethodHome")) + ")", B.taka(o.deliveryFee))}
        ${row(esc(t("odTotal")), B.taka(o.totalAmount), true)}<hr>
        ${row(esc(t("odAdvance")) + " (" + B.num(o.advancePercent) + "%)" + (o.paymentStatus === "verified" ? " ✓ " + esc(t("odPaid")) : ""), B.taka(o.advanceAmount))}
        ${row(esc(t("odCod")), B.taka(o.codAmount), true)}</div>
      ${pay ? `<div class="bv-card bv-pad" style="margin-bottom:12px"><strong>${esc(t("odPayment"))}:</strong> ${esc(t("pay_" + pay.method))} · ${esc(pay.trxId)} · ${B.taka(pay.amount)}
        ${pay.status === "rejected" && pay.rejectReason ? `<div class="bv-err">${esc(pay.rejectReason)}</div>` : ""}</div>` : ""}
      <div class="bv-card bv-pad" style="margin-bottom:12px"><h2 style="margin-top:0;font-size:1.05rem">${esc(t("odShip"))}</h2>
        ${ship ? `<div>${esc(ship.buyerName)} · ${esc(ship.buyerPhone)}</div><div>${nl2br(ship.address)}</div><div class="bv-meta">${esc(B.districtName(ship.district))}, ${esc(ship.area)}</div>
          ${ship.deliveryNote ? `<div class="bv-meta">${esc(t("odNote"))}: ${esc(ship.deliveryNote)}</div>` : ""}${ship.orderNote ? `<div class="bv-meta">${esc(t("odNote"))}: ${esc(ship.orderNote)}</div>` : ""}`
          : `<div class="bv-hint">${esc(shipDenied || isSeller ? t("odShipLater") : t("empty"))}</div>`}
        ${o.shippingNote ? `<div class="bv-meta" style="margin-top:6px">${esc(t("odShippedNote"))}: ${esc(o.shippingNote)}</div>` : ""}</div>
      <div class="bv-row" style="margin-bottom:12px" id="od-act">
        ${can.pay ? `<a class="bv-btn" href="${B.url("pay", { order: id })}">${esc(t("aPay"))}</a>` : ""}
        ${can.ship ? `<button class="bv-btn" data-a="ship">${esc(t("aShipped"))}</button>` : ""}
        ${can.received ? `<button class="bv-btn" data-a="recv">${esc(t("aReceived"))}</button>` : ""}
        ${can.review ? `<a class="bv-btn sec" href="${B.url("review", { order: id })}">${esc(t("aReview"))}</a>` : ""}
        ${can.refund ? `<a class="bv-btn sec" href="${B.url("refund", { order: id })}">${esc(t("aRefund"))}</a>` : ""}
        ${can.cancel ? `<button class="bv-btn danger" data-a="cancel">${esc(t("aCancel"))}</button>` : ""}
        ${isBuyer || isSeller ? `<a class="bv-btn sec" href="${B.url("report", { type: "order", id })}">⚑ ${esc(t("aReport"))}</a>` : ""}</div>
      <div id="od-chat"></div>`;

    const act = m.querySelector("#od-act");
    act.onclick = async (e) => {
      const b = e.target.closest("[data-a]"); if (!b) return;
      await B.btnBusy(b, async () => {
        const ts = F.serverTimestamp(), ref = F.doc(db, "orders", id);
        try {
          if (b.dataset.a === "cancel") {
            const r = prompt(t("cancelPrompt")); if (r === null) return;
            await F.updateDoc(ref, { status: "cancelled", cancelReason: (r.trim() || t("cancelDefault")).slice(0, 300), cancelledBy: "buyer", updatedAt: ts });
            B.notify(id, o.sellerId, t("doneCancel"), o.productTitle); B.toast(t("doneCancel"), "ok");
          } else if (b.dataset.a === "recv") {
            if (!confirm(t("confirmReceive"))) return;
            await F.updateDoc(ref, { status: "delivered", deliveredAt: ts, updatedAt: ts });
            B.notify(id, o.sellerId, t("gSellerDelivered"), o.productTitle); B.toast(t("doneRecv"), "ok");
          } else if (b.dataset.a === "ship") {
            const n = prompt(t("shipPrompt")); if (n === null) return;
            const d = { status: "shipped", shippedAt: ts, updatedAt: ts }; if (n.trim()) d.shippingNote = n.trim().slice(0, 300);
            await F.updateDoc(ref, d);
            B.notify(id, o.buyerId, t("gBuyerShipped"), o.productTitle); B.toast(t("doneShip"), "ok");
          }
          B.pages.order(m, qs);
        } catch (x) { B.toast(B.errMsg(x), "bad"); }
      });
    };
    initChat(m.querySelector("#od-chat"), o, id);
  });

  /* ================= DEAL CHAT ================= */
  async function initChat(box, o, id) {
    const roomRef = F.doc(db, "dealRooms", id), uid = B.user.uid;
    let room = null;
    try { const s = await F.getDoc(roomRef); if (s.exists()) room = s.data(); } catch (e) { /* none */ }
    if (!room) { box.innerHTML = `<div class="bv-card bv-pad">${B.ui.empty(t("chatNone"))}</div>`; return; }
    const role = uid === room.buyerId ? "buyer" : uid === room.sellerId ? "seller" : B.isAdmin ? "admin" : null;
    if (!role) { box.innerHTML = ""; return; }
    const memRef = F.doc(db, "dealRooms", id, "members", uid);
    let baseRead = 0;
    try { const s = await F.getDoc(memRef); if (s.exists() && s.data().lastReadAt) baseRead = s.data().lastReadAt.toMillis(); } catch (e) { /* first visit */ }
    const closed = room.status === "closed";
    box.innerHTML = `<div class="bv-card bv-pad"><div class="bv-row" style="justify-content:space-between"><h2 style="margin:0;font-size:1.05rem">${esc(t("chatTitle"))}</h2><span class="bv-chip ${room.status === "escalated" ? "warn" : "gray"}">${esc(t("rs_" + room.status))}</span></div>
      ${room.adminNote && (room.status === "resolved" || room.status === "closed" || room.status === "escalated") ? `<div class="bv-banner" style="margin-top:8px;border-radius:8px;text-align:left"><strong>${esc(t("adminNoteLbl"))}:</strong> ${nl2br(room.adminNote)}</div>` : ""}
      <div id="ch-unread" class="bv-hint" style="color:var(--bv-danger);font-weight:600"></div>
      <div id="ch-box" role="log" aria-live="polite" style="height:340px;overflow-y:auto;background:#f1f4f6;border-radius:10px;padding:10px;margin:8px 0"></div>
      ${closed ? `<div class="bv-hint">${esc(t("chatClosed"))}</div>` : `<form id="ch-form"><label class="bv-sr" for="ch-t">${esc(t("chatPh"))}</label><textarea id="ch-t" maxlength="1000" placeholder="${esc(t("chatPh"))}" style="min-height:70px"></textarea>
        <div class="bv-row" style="margin-top:6px;justify-content:space-between"><span class="bv-err" id="ch-err" role="alert"></span><button class="bv-btn" type="submit">${esc(t("chatSend"))}</button></div></form>`}
      <p class="bv-hint">${esc(t("chatNote"))}</p>
      ${role !== "admin" ? `<p class="bv-hint">${esc(t("chatHelp"))} <a href="${B.url("report", { type: "order", id })}">${esc(t("chatHelpLink"))}</a></p>` : ""}</div>`;
    const list = box.querySelector("#ch-box"), unreadEl = box.querySelector("#ch-unread");
    const label = { buyer: t("rBuyer"), seller: t("rSeller"), admin: t("rAdmin") };
    let markTimer = null, firstRender = true;
    const markRead = () => { clearTimeout(markTimer); markTimer = setTimeout(() => { if (document.hidden) return; F.setDoc(memRef, { lastReadAt: F.serverTimestamp() }).then(() => B.refreshCounts && 0).catch(() => {}); }, 1500); };
    const q = F.query(F.collection(db, "dealRooms", id, "messages"), F.orderBy("createdAt", "desc"), F.limit(100));
    unsub = F.onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() })).reverse();
      let fresh = 0;
      list.innerHTML = msgs.length ? msgs.map((x) => {
        const mine = x.senderId === uid, ms = x.createdAt ? x.createdAt.toMillis() : null;
        const isNew = !mine && ms !== null && ms > baseRead; if (isNew) fresh++;
        const bg = mine ? "#d9f2e3" : x.senderRole === "admin" ? "#fff1d6" : "#fff";
        return `<div style="display:flex;justify-content:${mine ? "flex-end" : "flex-start"};margin-bottom:8px"><div style="max-width:85%;background:${bg};border:1px solid var(--bv-border);border-radius:10px;padding:6px 10px">
          <div class="bv-meta"><strong>${esc(x.senderName || "")}</strong> · ${esc(label[x.senderRole] || "")} ${isNew ? `<span class="bv-chip bad">${esc(t("chatNew"))}</span>` : ""}</div>
          <div style="word-break:break-word">${nl2br(x.text)}</div><div class="bv-meta">${ms === null ? esc(t("chatSending")) : esc(B.fmtDate(x.createdAt))}</div></div></div>`;
      }).join("") : `<div class="bv-state">${esc(t("chatEmpty"))}</div>`;
      if (firstRender) { unreadEl.textContent = fresh ? t("chatUnread", { n: B.num(fresh) }) : ""; firstRender = false; }
      list.scrollTop = list.scrollHeight; markRead();
    }, (e) => { console.warn("chat", e.code); list.innerHTML = B.ui.error(B.errMsg(e)); });

    const form = box.querySelector("#ch-form"); if (!form) return;
    const err = box.querySelector("#ch-err");
    form.onsubmit = (e) => { e.preventDefault(); B.btnBusy(form.querySelector("button"), async () => {
      err.textContent = "";
      const ta = box.querySelector("#ch-t"), text = ta.value.trim(); if (!text) return;
      try {
        await F.addDoc(F.collection(db, "dealRooms", id, "messages"), { senderId: uid, senderRole: role, senderName: String((B.profile && B.profile.name) || t("rAdmin")).slice(0, 60), text: text.slice(0, 1000), createdAt: F.serverTimestamp() });
        ta.value = "";
        // notify the other party at most once per 5 minutes per order (saves free-tier writes)
        const key = "bv_nt_" + id; let last = 0; try { last = Number(localStorage.getItem(key)) || 0; } catch (x) { /* ignore */ }
        if (Date.now() - last > 300000) {
          try { localStorage.setItem(key, String(Date.now())); } catch (x) { /* ignore */ }
          const targets = role === "buyer" ? [room.sellerId] : role === "seller" ? [room.buyerId] : [room.buyerId, room.sellerId];
          for (const to of targets) {
            F.addDoc(F.collection(db, "notifications"), { userId: to, fromUid: uid, type: "order_message", title: t("chatNew") + ": " + String(o.productTitle).slice(0, 80),
              body: text.slice(0, 120), orderId: id, read: false, createdAt: F.serverTimestamp() }).catch(() => {});
          }
        }
      } catch (x) { console.error(x); err.textContent = x.code === "permission-denied" ? B.errMsg(x) : t("chatErr"); }
    }); };
  }

  /* ================= NOTIFICATIONS ================= */
  B.registerPage("notifications", async (m) => {
    B.setMeta({ title: t("ntTitle") });
    if (!B.requireLogin(m)) return;
    const uid = B.user.uid;
    m.innerHTML = `<div class="bv-row" style="justify-content:space-between"><h1 class="bv-h1" style="margin:0">${esc(t("ntTitle"))}</h1><button class="bv-btn sec" id="nt-all">${esc(t("ntAllRead"))}</button></div>
      <div id="nt-list" style="margin-top:12px"></div><div id="nt-st"></div><div class="bv-row" style="justify-content:center;margin-top:12px"><button class="bv-btn sec" id="nt-more" hidden>${esc(t("loadMore"))}</button></div>`;
    const list = m.querySelector("#nt-list"), st = m.querySelector("#nt-st"), more = m.querySelector("#nt-more");
    let cursor = null, done = false, count = 0;
    const icon = (ty) => (ty === "order_message" ? "💬" : ty === "order_update" ? "📦" : "🔔");
    const row = (n) => {
      const href = n.orderId && ORDER_ID.test(n.orderId) ? B.url("order", { id: n.orderId }) : "";
      return `<div class="bv-card bv-pad" style="margin-bottom:8px;${n.read ? "" : "border-left:4px solid var(--bv-primary)"}" data-nid="${esc(n.id)}" data-href="${esc(href)}">
        <div style="${n.read ? "" : "font-weight:700"}">${icon(n.type)} ${esc(n.title)}</div>${n.body ? `<div>${esc(n.body)}</div>` : ""}<div class="bv-meta">${esc(B.fmtDate(n.createdAt))}</div>
        <div class="bv-row" style="margin-top:6px">${href ? `<button class="bv-btn" data-a="open">${esc(t("ntOpen"))}</button>` : ""}${n.read ? "" : `<button class="bv-btn sec" data-a="read">${esc(t("ntMark"))}</button>`}<button class="bv-btn danger" data-a="del">${esc(t("ntDel"))}</button></div></div>`;
    };
    async function load(reset) {
      if (reset) { list.innerHTML = ""; cursor = null; done = false; count = 0; }
      more.disabled = true; st.innerHTML = B.ui.loading();
      try {
        const args = [F.where("userId", "==", uid), F.orderBy("createdAt", "desc")]; if (cursor) args.push(F.startAfter(cursor)); args.push(F.limit(20));
        const snap = await F.getDocs(F.query(F.collection(db, "notifications"), ...args));
        if (snap.size < 20) done = true; if (snap.size) cursor = snap.docs[snap.size - 1];
        count += snap.size; list.insertAdjacentHTML("beforeend", fromDocs(snap).map(row).join(""));
        st.innerHTML = count === 0 ? B.ui.empty(t("ntNone")) : ""; more.hidden = done;
      } catch (e) { console.error(e); st.innerHTML = B.ui.error(B.errMsg(e)); } finally { more.disabled = false; }
    }
    more.onclick = () => load(false);
    list.onclick = async (e) => {
      const b = e.target.closest("[data-a]"); if (!b) return;
      const card = b.closest("[data-nid]"), nid = card.dataset.nid, ref = F.doc(db, "notifications", nid);
      await B.btnBusy(b, async () => {
        try {
          if (b.dataset.a === "del") { await F.deleteDoc(ref); card.remove(); }
          else { await F.updateDoc(ref, { read: true }); if (b.dataset.a === "open") { location.href = card.dataset.href; return; } card.style.borderLeft = ""; b.remove(); }
          B.refreshCounts();
        } catch (x) { B.toast(B.errMsg(x), "bad"); }
      });
    };
    m.querySelector("#nt-all").onclick = (e) => B.btnBusy(e.currentTarget, async () => {
      try {
        const s = await F.getDocs(F.query(F.collection(db, "notifications"), F.where("userId", "==", uid), F.where("read", "==", false), F.limit(50)));
        if (s.size) { const batch = F.writeBatch(db); s.forEach((d) => batch.update(d.ref, { read: true })); await batch.commit(); }
        B.toast(t("ntDone"), "ok"); B.refreshCounts(); load(true);
      } catch (x) { B.toast(B.errMsg(x), "bad"); }
    });
    load(true);
  });
})();
