/* Bazaar BD – core.js (Part 2). ES module. Paste inside <script type="module"> in the Blogger theme
   (wrapped in //<![CDATA[ ... //]]>, see INSTALL.md). Later parts register pages with BV.registerPage(). */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import * as A from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import * as F from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

/* ============ 1. CONFIG – fill these in (public identifiers, not secrets) ============ */
const BV_CONFIG = {
  firebase: { apiKey: "AIzaSyCndHxzyMb6i3nMLYXsNU7vw06S8E773gY", authDomain: "bazaar-bd.firebaseapp.com", projectId: "bazaar-bd", appId: "1:881825521624:web:93cda4f22dddcd7e411cad" },
  cloudinary: { cloudName: "wwhmeblz", preset: "bazaar_unsigned" },
};

/* ============ 2. Firebase ============ */
const app = initializeApp(BV_CONFIG.firebase);
const auth = A.getAuth(app);
const db = F.getFirestore(app);

const BV = (window.BV = {
  config: BV_CONFIG, auth, db, A, F,
  user: null, profile: null, isAdmin: false, sellerApproved: false,
  settings: { siteName: "Bazaar BD", advancePercent: 10, flatDeliveryFee: 120 },
  counts: { cart: 0, unread: 0 },
  pages: {}, lang: localStorage.getItem("bv_lang") || "bn",
  qs: new URLSearchParams(location.search),
});

/* ============ 3. Translations (Bangla first). Later parts add keys with BV.addI18n ============ */
const DICT = {
  bn: {
    home: "হোম", shop: "সব পণ্য", sell: "বিক্রি করুন", cart: "কার্ট", orders: "আমার অর্ডার", account: "আমার অ্যাকাউন্ট",
    login: "লগইন", logout: "লগআউট", register: "রেজিস্টার", admin: "অ্যাডমিন", notifications: "নোটিফিকেশন", sellerDash: "সেলার ড্যাশবোর্ড",
    searchPh: "কী খুঁজছেন? (যেমন: মোবাইল, ফ্যান)", search: "খুঁজুন", language: "English",
    loading: "লোড হচ্ছে…", empty: "কিছু পাওয়া যায়নি।", error: "কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।", offline: "ইন্টারনেট নেই। সংযোগ দেখুন।",
    loadMore: "আরও দেখুন", save: "সংরক্ষণ", cancel: "বাতিল", back: "পিছনে", submit: "জমা দিন", yes: "হ্যাঁ", no: "না",
    needLogin: "এই কাজের জন্য আগে লগইন করুন।", needVerify: "আপনার ইমেইল ভেরিফাই করুন। ইনবক্স বা স্প্যাম ফোল্ডার দেখুন।",
    resendVerify: "ভেরিফিকেশন ইমেইল আবার পাঠান", iVerified: "আমি ভেরিফাই করেছি", verifySent: "ইমেইল পাঠানো হয়েছে।",
    noAccess: "এই পেজ দেখার অনুমতি আপনার নেই।", suspended: "আপনার অ্যাকাউন্ট সাময়িকভাবে বন্ধ। সাপোর্টে যোগাযোগ করুন।",
    terms: "শর্তাবলি", privacy: "গোপনীয়তা নীতি", safety: "নিরাপত্তা নির্দেশিকা", contact: "যোগাযোগ",
    cond_brand_new: "একদম নতুন", cond_like_new: "নতুনের মতো", cond_good: "ভালো", cond_fair: "মোটামুটি", cond_for_parts: "মেরামত/যন্ত্রাংশের জন্য",
    st_payment_pending: "পেমেন্টের অপেক্ষায়", st_payment_submitted: "পেমেন্ট যাচাই চলছে", st_confirmed: "নিশ্চিত",
    st_shipped: "পাঠানো হয়েছে", st_delivered: "হাতে পেয়েছেন", st_completed: "সম্পন্ন", st_cancelled: "বাতিল", st_disputed: "সমস্যা নিষ্পত্তি চলছে",
    pst_draft: "খসড়া", pst_pending_review: "যাচাইয়ের অপেক্ষায়", pst_published: "প্রকাশিত", pst_rejected: "বাতিল",
    pst_paused: "বন্ধ রাখা", pst_sold_out: "স্টক শেষ", pst_removed: "সরানো হয়েছে",
    pay_bkash: "বিকাশ", pay_nagad: "নগদ", pay_rocket: "রকেট", pay_bank: "ব্যাংক",
    taka: "টাকা", phoneHint: "যেমন 01712345678", footNote: "এটি ব্যবহৃত পণ্যের মার্কেটপ্লেস। প্রতিটি পণ্য অ্যাডমিন যাচাই করে প্রকাশ করেন।",
  },
  en: {
    home: "Home", shop: "All products", sell: "Sell", cart: "Cart", orders: "My orders", account: "My account",
    login: "Log in", logout: "Log out", register: "Sign up", admin: "Admin", notifications: "Notifications", sellerDash: "Seller dashboard",
    searchPh: "What are you looking for?", search: "Search", language: "বাংলা",
    loading: "Loading…", empty: "Nothing found.", error: "Something went wrong. Please try again.", offline: "You are offline.",
    loadMore: "Load more", save: "Save", cancel: "Cancel", back: "Back", submit: "Submit", yes: "Yes", no: "No",
    needLogin: "Please log in first.", needVerify: "Please verify your email. Check inbox and spam.",
    resendVerify: "Resend verification email", iVerified: "I have verified", verifySent: "Email sent.",
    noAccess: "You do not have access to this page.", suspended: "Your account is suspended. Contact support.",
    terms: "Terms", privacy: "Privacy policy", safety: "Safety guidelines", contact: "Contact",
    cond_brand_new: "Brand new", cond_like_new: "Like new", cond_good: "Good", cond_fair: "Fair", cond_for_parts: "For parts / repair",
    st_payment_pending: "Awaiting payment", st_payment_submitted: "Payment under review", st_confirmed: "Confirmed",
    st_shipped: "Shipped", st_delivered: "Received", st_completed: "Completed", st_cancelled: "Cancelled", st_disputed: "Dispute in progress",
    pst_draft: "Draft", pst_pending_review: "Pending review", pst_published: "Published", pst_rejected: "Rejected",
    pst_paused: "Paused", pst_sold_out: "Sold out", pst_removed: "Removed",
    pay_bkash: "bKash", pay_nagad: "Nagad", pay_rocket: "Rocket", pay_bank: "Bank",
    taka: "Taka", phoneHint: "e.g. 01712345678", footNote: "A marketplace for used goods. Every listing is reviewed by an admin before it goes live.",
  },
};
BV.addI18n = (o) => { for (const l of ["bn", "en"]) Object.assign(DICT[l], o[l] || {}); };
BV.t = (k, vars) => {
  let s = DICT[BV.lang]?.[k] ?? DICT.en[k] ?? k;
  if (vars) for (const [a, b] of Object.entries(vars)) s = s.replaceAll(`{${a}}`, b);
  return s;
};
BV.setLang = (l) => { localStorage.setItem("bv_lang", l); location.reload(); }; // UI preference only
document.documentElement.lang = BV.lang;

/* ============ 4. Safe helpers ============ */
BV.esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
BV.safeUrl = (u) => (typeof u === "string" && /^https:\/\/res\.cloudinary\.com\//.test(u) ? u : "");
BV.img = (u, w = 500) => { const s = BV.safeUrl(u); return s ? s.replace("/upload/", `/upload/f_auto,q_auto,w_${w}/`) : ""; };
const nf = () => new Intl.NumberFormat(BV.lang === "bn" ? "bn-BD" : "en-BD");
BV.num = (n) => nf().format(Number(n) || 0);
BV.taka = (n) => "৳" + BV.num(n);
BV.fmtDate = (ts, withTime = true) => {
  const d = ts?.toDate ? ts.toDate() : ts instanceof Date ? ts : null;
  if (!d) return "";
  const o = { timeZone: "Asia/Dhaka", year: "numeric", month: "short", day: "numeric" };
  if (withTime) Object.assign(o, { hour: "2-digit", minute: "2-digit" });
  return new Intl.DateTimeFormat(BV.lang === "bn" ? "bn-BD" : "en-BD", o).format(d);
};
// Accepts 01712345678, +8801712345678, 8801712345678, with spaces/dashes, Bangla digits. Returns normalised or "".
BV.normPhone = (s) => {
  let x = String(s || "").replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d)).replace(/[\s\-()]/g, "");
  if (x.startsWith("+88")) x = x.slice(3); else if (x.startsWith("88") && x.length === 13) x = x.slice(2);
  return /^01[3-9][0-9]{8}$/.test(x) ? x : "";
};
BV.newOrderId = () => {
  const r = new Uint32Array(2); crypto.getRandomValues(r);
  return ("BV" + Date.now().toString(36) + r[0].toString(36) + r[1].toString(36)).toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, 18);
};
BV.tokens = (...texts) => {
  const set = new Set();
  for (const w of texts.join(" ").toLowerCase().split(/[^\p{L}\p{M}\p{N}]+/u)) if (w.length >= 2) set.add(w);
  return [...set].slice(0, 40);
};
BV.districts = [["Dhaka","ঢাকা"],["Gazipur","গাজীপুর"],["Narayanganj","নারায়ণগঞ্জ"],["Narsingdi","নরসিংদী"],["Manikganj","মানিকগঞ্জ"],["Munshiganj","মুন্সীগঞ্জ"],["Tangail","টাঙ্গাইল"],["Kishoreganj","কিশোরগঞ্জ"],["Faridpur","ফরিদপুর"],["Gopalganj","গোপালগঞ্জ"],["Madaripur","মাদারীপুর"],["Rajbari","রাজবাড়ী"],["Shariatpur","শরীয়তপুর"],["Chattogram","চট্টগ্রাম"],["Cox's Bazar","কক্সবাজার"],["Cumilla","কুমিল্লা"],["Feni","ফেনী"],["Brahmanbaria","ব্রাহ্মণবাড়িয়া"],["Chandpur","চাঁদপুর"],["Lakshmipur","লক্ষ্মীপুর"],["Noakhali","নোয়াখালী"],["Khagrachhari","খাগড়াছড়ি"],["Rangamati","রাঙ্গামাটি"],["Bandarban","বান্দরবান"],["Sylhet","সিলেট"],["Moulvibazar","মৌলভীবাজার"],["Habiganj","হবিগঞ্জ"],["Sunamganj","সুনামগঞ্জ"],["Rajshahi","রাজশাহী"],["Natore","নাটোর"],["Naogaon","নওগাঁ"],["Chapainawabganj","চাঁপাইনবাবগঞ্জ"],["Pabna","পাবনা"],["Sirajganj","সিরাজগঞ্জ"],["Bogura","বগুড়া"],["Joypurhat","জয়পুরহাট"],["Khulna","খুলনা"],["Bagerhat","বাগেরহাট"],["Satkhira","সাতক্ষীরা"],["Jashore","যশোর"],["Narail","নড়াইল"],["Magura","মাগুরা"],["Jhenaidah","ঝিনাইদহ"],["Kushtia","কুষ্টিয়া"],["Chuadanga","চুয়াডাঙ্গা"],["Meherpur","মেহেরপুর"],["Barishal","বরিশাল"],["Bhola","ভোলা"],["Patuakhali","পটুয়াখালী"],["Pirojpur","পিরোজপুর"],["Jhalokati","ঝালকাঠি"],["Barguna","বরগুনা"],["Rangpur","রংপুর"],["Dinajpur","দিনাজপুর"],["Gaibandha","গাইবান্ধা"],["Kurigram","কুড়িগ্রাম"],["Lalmonirhat","লালমনিরহাট"],["Nilphamari","নীলফামারী"],["Panchagarh","পঞ্চগড়"],["Thakurgaon","ঠাকুরগাঁও"],["Mymensingh","ময়মনসিংহ"],["Jamalpur","জামালপুর"],["Netrokona","নেত্রকোনা"],["Sherpur","শেরপুর"]];
BV.districtName = (en) => { const d = BV.districts.find((x) => x[0] === en); return d ? (BV.lang === "bn" ? d[1] : d[0]) : en; };
BV.districtOptions = (sel = "") => BV.districts.map((d) => `<option value="${BV.esc(d[0])}"${d[0] === sel ? " selected" : ""}>${BV.esc(BV.lang === "bn" ? d[1] + " (" + d[0] + ")" : d[0])}</option>`).join("");

/* Page URLs (Blogger pages) – matches ARCHITECTURE.md section 2.2 */
const PAGES = { home: "/", shop: "/p/shop.html", product: "/p/product.html", category: "/p/category.html", search: "/p/search.html", seller: "/p/seller.html",
  account: "/p/account.html", sellerDash: "/p/seller-dashboard.html", login: "/p/login.html", becomeSeller: "/p/become-seller.html", sellForm: "/p/sell.html",
  cart: "/p/cart.html", checkout: "/p/checkout.html", orders: "/p/orders.html", order: "/p/order.html", notifications: "/p/notifications.html",
  review: "/p/review.html", report: "/p/report.html", pay: "/p/pay.html", refund: "/p/refund.html", terms: "/p/terms.html", privacy: "/p/privacy.html",
  safety: "/p/safety.html", contact: "/p/contact.html", admin: "/p/admin-x7k2.html" };
BV.url = (name, params) => (PAGES[name] || "/") + (params ? "?" + new URLSearchParams(params).toString() : "");

/* ============ 5. UI helpers ============ */
BV.ui = {
  loading: () => `<div class="bv-state"><div class="bv-spin"></div>${BV.esc(BV.t("loading"))}</div>`,
  empty: (m) => `<div class="bv-state">${BV.esc(m || BV.t("empty"))}</div>`,
  error: (m) => `<div class="bv-state" role="alert">${BV.esc(m || BV.t("error"))}</div>`,
  statusChip: (kind, st) => `<span class="bv-chip ${["cancelled","rejected","removed"].includes(st) ? "bad" : ["payment_pending","payment_submitted","pending_review","paused","disputed"].includes(st) ? "warn" : ""}">${BV.esc(BV.t((kind === "p" ? "pst_" : "st_") + st))}</span>`,
};
BV.toast = (msg, type = "") => {
  let box = document.getElementById("bv-toasts");
  if (!box) { box = document.createElement("div"); box.id = "bv-toasts"; box.setAttribute("aria-live", "polite"); document.body.appendChild(box); }
  const el = document.createElement("div"); el.className = "bv-toast " + type; el.textContent = msg; box.appendChild(el);
  setTimeout(() => el.remove(), 4500);
};
// Friendly message for common Firebase errors (never shows raw internals)
BV.errMsg = (e) => {
  const c = e?.code || "";
  const bn = BV.lang === "bn";
  const m = {
    "auth/email-already-in-use": bn ? "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে।" : "This email already has an account.",
    "auth/invalid-credential": bn ? "ইমেইল বা পাসওয়ার্ড ভুল।" : "Wrong email or password.",
    "auth/wrong-password": bn ? "ইমেইল বা পাসওয়ার্ড ভুল।" : "Wrong email or password.",
    "auth/user-not-found": bn ? "ইমেইল বা পাসওয়ার্ড ভুল।" : "Wrong email or password.",
    "auth/weak-password": bn ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের দিন।" : "Use at least 6 characters.",
    "auth/invalid-email": bn ? "ইমেইল ঠিকমতো লিখুন।" : "Enter a valid email.",
    "auth/too-many-requests": bn ? "অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পরে চেষ্টা করুন।" : "Too many attempts. Try later.",
    "auth/network-request-failed": bn ? "ইন্টারনেট সংযোগ দেখুন।" : "Check your connection.",
    "permission-denied": bn ? "এই কাজের অনুমতি নেই (ইমেইল ভেরিফাই বা অ্যাকাউন্ট স্ট্যাটাস দেখুন)।" : "Not allowed (check email verification or account status).",
    "unavailable": bn ? "সার্ভারে সংযোগ হচ্ছে না। একটু পরে চেষ্টা করুন।" : "Service unavailable. Try again shortly.",
    "resource-exhausted": bn ? "আজকের সীমা শেষ। কাল আবার চেষ্টা করুন।" : "Daily limit reached. Try tomorrow.",
  };
  return m[c] || BV.t("error");
};
BV.btnBusy = async (btn, fn) => {
  if (btn.disabled) return; btn.disabled = true; const old = btn.textContent;
  try { return await fn(); } finally { btn.disabled = false; btn.textContent = old; }
};

/* Image upload: resize in the browser (max 1280px, WebP/JPEG) then Cloudinary unsigned upload */
BV.uploadImage = async (file) => {
  if (!file || !/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error(BV.lang === "bn" ? "শুধু JPG, PNG বা WebP ছবি দিন।" : "Only JPG, PNG or WebP images.");
  if (file.size > 15 * 1024 * 1024) throw new Error(BV.lang === "bn" ? "ছবি খুব বড় (সর্বোচ্চ ১৫MB)।" : "Image too large (max 15MB).");
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, 1280 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  let blob = await new Promise((r) => c.toBlob(r, "image/webp", 0.8));
  if (!blob || blob.type !== "image/webp") blob = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.8));
  if (blob.size > 950 * 1024) blob = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.6));
  if (blob.size > 1000 * 1024) throw new Error(BV.lang === "bn" ? "ছবি এখনো বড়। ছোট ছবি দিন।" : "Image still too large.");
  const fd = new FormData(); fd.append("file", blob); fd.append("upload_preset", BV.config.cloudinary.preset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${BV.config.cloudinary.cloudName}/image/upload`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(BV.lang === "bn" ? "ছবি আপলোড হয়নি। আবার চেষ্টা করুন।" : "Upload failed. Try again.");
  const j = await res.json();
  if (!BV.safeUrl(j.secure_url)) throw new Error("Bad upload response");
  return j.secure_url;
};

/* ============ 6. Auth helpers (used by the auth page in Part 3) ============ */
BV.signUp = async ({ name, email, password, phone, type }) => {
  const ph = BV.normPhone(phone);
  if (!ph) throw Object.assign(new Error("phone"), { code: "bv/phone" });
  const cred = await A.createUserWithEmailAndPassword(auth, email.trim(), password);
  const ts = F.serverTimestamp();
  await F.setDoc(F.doc(db, "users", cred.user.uid), {
    uid: cred.user.uid, name: name.trim(), email: cred.user.email, phone: ph,
    requestedType: type === "seller" ? "seller" : "buyer", role: "buyer", sellerStatus: "none", status: "active", createdAt: ts, updatedAt: ts,
  });
  await A.sendEmailVerification(cred.user);
  return cred.user;
};
BV.signIn = (email, password) => A.signInWithEmailAndPassword(auth, email.trim(), password);
BV.signOut = async () => { await A.signOut(auth); location.href = BV.url("home"); };
BV.resetPassword = (email) => A.sendPasswordResetEmail(auth, email.trim());
BV.resendVerification = () => A.sendEmailVerification(auth.currentUser);
// After clicking the email link: refresh user + ID token so rules see email_verified = true
BV.refreshVerified = async () => { await auth.currentUser.reload(); await auth.currentUser.getIdToken(true); await loadAccount(auth.currentUser); renderShell(); return auth.currentUser.emailVerified; };

/* Gate helpers: render a friendly message and return false when blocked */
BV.requireLogin = (mount) => {
  if (BV.user) return true;
  mount.innerHTML = `<div class="bv-card bv-pad"><p>${BV.esc(BV.t("needLogin"))}</p><a class="bv-btn" href="${BV.url("login")}?next=${encodeURIComponent(location.pathname + location.search)}">${BV.esc(BV.t("login"))}</a></div>`;
  return false;
};
BV.requireVerified = (mount) => {
  if (!BV.requireLogin(mount)) return false;
  if (BV.profile?.status === "suspended") { mount.innerHTML = BV.ui.error(BV.t("suspended")); return false; }
  if (BV.user.emailVerified) return true;
  mount.innerHTML = `<div class="bv-card bv-pad"><p>${BV.esc(BV.t("needVerify"))}</p>
    <div class="bv-row"><button class="bv-btn sec" id="bv-resend">${BV.esc(BV.t("resendVerify"))}</button><button class="bv-btn" id="bv-iver">${BV.esc(BV.t("iVerified"))}</button></div></div>`;
  mount.querySelector("#bv-resend").onclick = async () => { try { await BV.resendVerification(); BV.toast(BV.t("verifySent"), "ok"); } catch (e) { BV.toast(BV.errMsg(e), "bad"); } };
  mount.querySelector("#bv-iver").onclick = async () => { try { if (await BV.refreshVerified()) location.reload(); else BV.toast(BV.t("needVerify"), "bad"); } catch (e) { BV.toast(BV.errMsg(e), "bad"); } };
  return false;
};
BV.requireAdmin = (mount) => {
  if (!BV.requireLogin(mount)) return false;
  if (BV.isAdmin) return true;
  mount.innerHTML = BV.ui.error(BV.t("noAccess")); return false;
};

/* ============ 7. Account state ============ */
async function loadAccount(user) {
  BV.user = user; BV.profile = null; BV.isAdmin = false; BV.sellerApproved = false; BV.counts = { cart: 0, unread: 0 };
  if (!user) return;
  try {
    const u = await F.getDoc(F.doc(db, "users", user.uid));
    BV.profile = u.exists() ? u.data() : null;
    BV.sellerApproved = !!BV.profile && BV.profile.sellerStatus === "approved" && BV.profile.status === "active";
  } catch (e) { console.warn("profile", e.code); }
  try { const a = await F.getDoc(F.doc(db, "admins", user.uid)); BV.isAdmin = a.exists() && user.emailVerified; } catch (e) { /* not admin */ }
  try {
    const c = await F.getCountFromServer(F.collection(db, "users", user.uid, "cart")); BV.counts.cart = c.data().count;
    const n = await F.getCountFromServer(F.query(F.collection(db, "notifications"), F.where("userId", "==", user.uid), F.where("read", "==", false)));
    BV.counts.unread = n.data().count;
  } catch (e) { /* counts are cosmetic */ }
}
BV.refreshCounts = async () => { await loadAccount(auth.currentUser); renderShell(); };

async function loadSettings() {
  try { const s = await F.getDoc(F.doc(db, "siteSettings", "public")); if (s.exists()) Object.assign(BV.settings, s.data()); } catch (e) { console.warn("settings", e.code); }
}

/* ============ 8. Shell: header, menu, search, banner, footer ============ */
function renderShell() {
  const S = BV.settings, t = BV.t, u = BV.url;
  if (S.themeColor && /^#[0-9a-fA-F]{6}$/.test(S.themeColor)) document.documentElement.style.setProperty("--bv-primary", S.themeColor);
  const logo = BV.safeUrl(S.logoUrl);
  const links = [[u("home"), t("home")], [u("shop"), t("shop")]];
  if (BV.sellerApproved) links.push([u("sellerDash"), t("sellerDash")]); else links.push([BV.user ? u("becomeSeller") : u("login"), t("sell")]);
  if (BV.user) {
    links.push([u("cart"), t("cart") + (BV.counts.cart ? `<span class="bv-badge">${BV.num(BV.counts.cart)}</span>` : "")]);
    links.push([u("orders"), t("orders")]);
    links.push([u("notifications"), t("notifications") + (BV.counts.unread ? `<span class="bv-badge">${BV.num(BV.counts.unread)}</span>` : "")]);
    links.push([u("account"), t("account")]);
    if (BV.isAdmin) links.push([u("admin"), t("admin")]);
  } else { links.push([u("login"), t("login") + " / " + t("register")]); }
  const aHtml = links.map((l) => `<a href="${l[0]}">${l[1]}</a>`).join("");
  const tail = `<button class="bv-link" data-act="lang">${BV.esc(t("language"))}</button>` + (BV.user ? `<button class="bv-link" data-act="logout">${BV.esc(t("logout"))}</button>` : "");
  const root = document.getElementById("bv-root");
  if (!root) return;
  const q = BV.qs.get("q") || "";
  root.innerHTML = `
    ${S.maintenanceMode ? `<div class="bv-maint" role="alert">${BV.esc(S.maintenanceNotice || "")}</div>` : ""}
    ${S.banner?.active && S.banner?.text ? `<div class="bv-banner">${BV.esc(S.banner.text)}</div>` : ""}
    <header class="bv-top"><div class="bv-wrap">
      <a class="bv-logo" href="${u("home")}">${logo ? `<img src="${BV.esc(logo)}" alt="">` : ""}<span>${BV.esc(S.siteName)}</span></a>
      <span class="bv-spacer"></span>
      <nav class="bv-nav" aria-label="Main">${aHtml}${tail}</nav>
      <button class="bv-burger" aria-label="Menu" aria-expanded="false" data-act="menu">☰</button>
    </div>
    <div class="bv-menu" id="bv-menu">${aHtml}${tail}</div></header>
    <div class="bv-searchbar"><div class="bv-wrap"><form action="${u("search")}" method="get" role="search">
      <label class="bv-sr" for="bv-q">${BV.esc(t("search"))}</label>
      <input id="bv-q" name="q" type="search" maxlength="60" value="${BV.esc(q)}" placeholder="${BV.esc(t("searchPh"))}">
      <button class="bv-btn" type="submit">${BV.esc(t("search"))}</button></form></div></div>`;
  root.onclick = (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const a = b.dataset.act;
    if (a === "menu") { const m = document.getElementById("bv-menu"); const o = m.classList.toggle("open"); b.setAttribute("aria-expanded", o); }
    if (a === "lang") BV.setLang(BV.lang === "bn" ? "en" : "bn");
    if (a === "logout") BV.signOut();
  };
  let foot = document.getElementById("bv-foot");
  if (!foot) {
    foot = document.createElement("footer"); foot.id = "bv-foot"; foot.className = "bv-foot";
    const appEl = document.getElementById("bv-app");
    if (appEl) appEl.after(foot); else document.body.appendChild(foot);
  }
  const c = S.contact || {};
  foot.innerHTML = `<div class="bv-wrap"><div class="cols">
    <div><strong>${BV.esc(S.siteName)}</strong><br>${BV.esc(t("footNote"))}</div>
    <div><a href="${u("terms")}">${BV.esc(t("terms"))}</a><br><a href="${u("privacy")}">${BV.esc(t("privacy"))}</a><br><a href="${u("safety")}">${BV.esc(t("safety"))}</a><br><a href="${u("contact")}">${BV.esc(t("contact"))}</a></div>
    <div>${c.phone ? "📞 " + BV.esc(c.phone) + "<br>" : ""}${c.email ? "✉ " + BV.esc(c.email) + "<br>" : ""}${c.address ? BV.esc(c.address) : ""}</div></div></div>`;
}

/* ============ 9. Router ============ */
BV.registerPage = (name, fn) => { BV.pages[name] = fn; };
async function runPage() {
  const mount = document.getElementById("bv-app");
  const name = mount?.dataset.page;
  if (!mount || !name) return;
  if (!BV.pages[name]) { mount.innerHTML = BV.ui.error("Page module not installed: " + BV.esc(name)); return; }
  mount.innerHTML = BV.ui.loading();
  try { await BV.pages[name](mount, BV.qs); }
  catch (e) { console.error(e); mount.innerHTML = BV.ui.error(BV.errMsg(e)); }
}

/* ============ 10. Boot ============ */
function setupOffline() {
  const bar = document.createElement("div"); bar.className = "bv-offline"; bar.hidden = true; bar.textContent = BV.t("offline"); document.body.appendChild(bar);
  const upd = () => { bar.hidden = navigator.onLine; };
  addEventListener("online", upd); addEventListener("offline", upd); upd();
}
function boot() {
  if (!document.getElementById("bv-root")) { const r = document.createElement("div"); r.id = "bv-root"; document.body.prepend(r); }
  document.body.classList.add("bv-hide-blogger");
  // Blogger home page cannot be a static Page: create the home mount automatically (no theme editing needed)
  if (!document.getElementById("bv-app") && (location.pathname === "/" || location.pathname === "")) {
    const h = document.createElement("div"); h.id = "bv-app"; h.dataset.page = "home"; document.body.appendChild(h);
  }
  const app = document.getElementById("bv-app");
  if (app) app.classList.add("bv-wrap");
  if (app && app.dataset.page === "home") document.body.classList.add("bv-home");
  setupOffline();
  renderShell(); // immediate (defaults) so the page never looks empty
  let first = true;
  A.onAuthStateChanged(auth, async (user) => {
    await Promise.all([loadAccount(user), first ? loadSettings() : Promise.resolve()]);
    renderShell();
    if (first) { first = false; runPage(); }
    else if (app?.dataset.reloadOnAuth !== "no") runPage();
  });
}
// Pages from later parts register synchronously in the same theme script before this fires.
if (document.readyState === "complete") setTimeout(boot, 0); else addEventListener("load", boot);
