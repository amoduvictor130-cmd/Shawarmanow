import { useState, useEffect } from "react";

const C = {
  red: "#C8401A", redDark: "#9E2F11", redLight: "#FDF0EC",
  gold: "#D4960A", goldLight: "#FDF6E3",
  dark: "#0F0A07", text: "#1E120A", muted: "#7A5C48",
  bg: "#FAFAF8", surface: "#FFFFFF", border: "#E8D8CF",
  success: "#166534", successBg: "#DCFCE7",
  info: "#1D4ED8", infoBg: "#EFF6FF",
  warning: "#92400E", warningBg: "#FEF3C7",
};

const SANS = "'DM Sans', sans-serif";
const SERIF = "'Playfair Display', Georgia, serif";

const CITIES = [
  { id: "lagos", name: "Lagos", zones: ["Lekki", "VI", "Yaba", "Ikeja", "Surulere", "Ajah"], active: true, vendors: 47, orders: 3842 },
  { id: "ph", name: "Port Harcourt", zones: ["GRA", "Rumuola", "Trans-Amadi", "D-Line"], active: false, vendors: 0, orders: 0, launch: "Month 7" },
  { id: "benin", name: "Benin City", zones: ["Ugbowo", "Sapele Rd", "GRA Benin"], active: false, vendors: 0, orders: 0, launch: "Month 13" },
  { id: "abuja", name: "Abuja", zones: ["Wuse 2", "Maitama", "Garki", "Gwarinpa"], active: false, vendors: 0, orders: 0, launch: "Month 19" },
];

const TIERS = [
  { id: "free", name: "Free", price: 0, color: C.muted, features: ["Basic listing", "Up to 10 menu items", "Standard placement", "Basic order tracking"] },
  { id: "growth", name: "Growth", price: 15000, color: C.info, features: ["Everything in Free", "Analytics dashboard", "Customer grouping", "Priority search placement", "WhatsApp integration", "Bulk SMS to regulars"] },
  { id: "pro", name: "Pro", price: 35000, color: C.gold, features: ["Everything in Growth", "Featured homepage placement", "Sponsored banner ads", "Dedicated account manager", "Weekly performance report", "Early city expansion access"] },
];

const COMMISSION = 0.10;
const LISTING_FEE = 0; // Free during launch phase

const SELLERS = [
  { id: 1, name: "Mama Titi's Shawarma Palace", owner: "Titi Adeyemi", city: "lagos", zone: "Lekki", tier: "pro", rating: 4.9, reviews: 312, open: "10:00", close: "23:00", avatar: "MT", monthlyOrders: 840, avgOrder: 4200, featured: true,
    menu: [
      { id: 1, name: "Classic Chicken Shawarma", price: 3500, desc: "Juicy chicken, garlic sauce, soft wrap" },
      { id: 2, name: "Beef Shawarma Deluxe", price: 4200, desc: "Spiced beef, caramelized onions, tahini" },
      { id: 3, name: "Mixed Grill Shawarma", price: 5000, desc: "Chicken & beef combo, extra toppings" },
      { id: 4, name: "Veggie Shawarma", price: 2800, desc: "Grilled peppers, mushrooms, hummus" },
    ]},
  { id: 2, name: "Sultan Shawarma Spot", owner: "Ibrahim Musa", city: "lagos", zone: "VI", tier: "growth", rating: 4.7, reviews: 198, open: "11:00", close: "22:00", avatar: "SS", monthlyOrders: 520, avgOrder: 4800, featured: false,
    menu: [
      { id: 5, name: "Turkish Lamb Shawarma", price: 5500, desc: "Slow-roasted lamb, sumac onions, parsley" },
      { id: 6, name: "Sultan Special Chicken", price: 4000, desc: "Double-wrapped, extra garlic mayo" },
      { id: 7, name: "Party Pack (5 wraps)", price: 18000, desc: "Mixed selection for groups" },
    ]},
  { id: 3, name: "Alhaji's Original Shawarma", owner: "Alhaji Bello", city: "lagos", zone: "Yaba", tier: "free", rating: 4.6, reviews: 445, open: "09:00", close: "21:00", avatar: "AO", monthlyOrders: 310, avgOrder: 2800, featured: false,
    menu: [
      { id: 8, name: "Suya Shawarma", price: 3000, desc: "Lagos-style suya spice, roasted chicken" },
      { id: 9, name: "Street Shawarma", price: 2000, desc: "Quick & delicious everyday classic" },
      { id: 10, name: "Shawarma + Fries Combo", price: 3800, desc: "Classic shawarma with crispy fries" },
    ]},
];

const CUSTOMERS = [
  { id: 1, name: "Amara Okonkwo", orders: 24, spent: 168000, type: "regular", last: "Today", city: "lagos" },
  { id: 2, name: "Dele Fashola", orders: 18, spent: 75600, type: "regular", last: "Today", city: "lagos" },
  { id: 3, name: "Ngozi Eze", orders: 3, spent: 15000, type: "non-regular", last: "Today", city: "lagos" },
  { id: 4, name: "Chidi Obi", orders: 1, spent: 2800, type: "non-regular", last: "Yesterday", city: "lagos" },
  { id: 5, name: "Fatima Suleiman", orders: 31, spent: 217000, type: "regular", last: "2 days ago", city: "lagos" },
];

const ORDERS = [
  { id: "#SN001", customer: "Amara Okonkwo", item: "Classic Chicken Shawarma ×2", amount: 7000, status: "delivered", time: "Today 2:30pm" },
  { id: "#SN002", customer: "Dele Fashola", item: "Beef Shawarma Deluxe ×1", amount: 4200, status: "preparing", time: "Today 4:15pm" },
  { id: "#SN003", customer: "Ngozi Eze", item: "Mixed Grill Shawarma ×3", amount: 15000, status: "pending", time: "Today 4:45pm" },
  { id: "#SN004", customer: "Chidi Obi", item: "Veggie Shawarma ×1", amount: 2800, status: "delivered", time: "Yesterday" },
];

function useFont() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
}

function Badge({ children, type = "default", style = {} }) {
  const map = {
    default: { bg: C.redLight, color: C.redDark },
    success: { bg: C.successBg, color: C.success },
    warning: { bg: C.warningBg, color: C.warning },
    info: { bg: C.infoBg, color: C.info },
    regular: { bg: "#DBEAFE", color: "#1E40AF" },
    "non-regular": { bg: "#FEF9C3", color: "#713F12" },
    pending: { bg: C.warningBg, color: C.warning },
    preparing: { bg: C.infoBg, color: C.info },
    delivered: { bg: C.successBg, color: C.success },
    free: { bg: "#F1F5F9", color: "#475569" },
    growth: { bg: C.infoBg, color: C.info },
    pro: { bg: C.goldLight, color: "#92400E" },
  };
  const s = map[type] || map.default;
  return <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontFamily: SANS, fontWeight: 600, whiteSpace: "nowrap", ...style }}>{children}</span>;
}

function Btn({ children, onClick, variant = "primary", full, style = {} }) {
  const v = {
    primary: { background: C.red, color: "#fff", border: "none" },
    secondary: { background: C.redLight, color: C.red, border: `1.5px solid ${C.border}` },
    gold: { background: C.gold, color: "#fff", border: "none" },
    ghost: { background: "transparent", color: C.muted, border: `1px solid ${C.border}` },
    dark: { background: C.dark, color: "#fff", border: "none" },
  };
  return (
    <button onClick={onClick} style={{
      ...v[variant], padding: "10px 22px", borderRadius: 8, cursor: "pointer",
      fontFamily: SANS, fontWeight: 600, fontSize: 14,
      width: full ? "100%" : undefined, ...style
    }}>{children}</button>
  );
}

function Nav({ page, setPage, role, setRole, city, setCity }) {
  const navLinks = [
    { key: "home", label: "Home" },
    { key: "browse", label: "Find Shawarma" },
    ...(role === "seller" ? [{ key: "dash", label: "Dashboard" }, { key: "customers", label: "Customers" }, { key: "earnings", label: "Earnings" }] : []),
    ...(role === "buyer" ? [{ key: "orders", label: "My Orders" }] : []),
    ...(role === "admin" ? [{ key: "admin", label: "Admin" }] : []),
  ];

  return (
    <div style={{ background: C.dark, padding: "0 28px", display: "flex", alignItems: "center", gap: 16, height: 60, position: "sticky", top: 0, zIndex: 100 }}>
      <div onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginRight: 8 }}>
        <span style={{ fontSize: 22 }}>🥙</span>
        <div>
          <div style={{ fontFamily: SERIF, fontSize: 17, color: C.gold, lineHeight: 1 }}>ShawarmaNow</div>
          <div style={{ fontFamily: SANS, fontSize: 9, color: "#666", letterSpacing: 2 }}>NIGERIA</div>
        </div>
      </div>

      <select value={city} onChange={e => setCity(e.target.value)} style={{ background: "rgba(255,255,255,0.08)", color: "#ccc", border: "1px solid #333", borderRadius: 6, padding: "5px 10px", fontFamily: SANS, fontSize: 12, cursor: "pointer" }}>
        {CITIES.map(c => <option key={c.id} value={c.id} style={{ background: C.dark }}>{c.active ? c.name : `${c.name} (${c.launch})`}</option>)}
      </select>

      <div style={{ display: "flex", gap: 2, flex: 1 }}>
        {navLinks.map(({ key, label }) => (
          <button key={key} onClick={() => setPage(key)} style={{
            background: page === key ? C.red : "transparent", color: page === key ? "#fff" : "#aaa",
            border: "none", padding: "7px 13px", borderRadius: 6, fontFamily: SANS, fontSize: 12, fontWeight: 500, cursor: "pointer"
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {["buyer", "seller", "admin"].map(r => (
          <button key={r} onClick={() => { setRole(r); setPage(r === "seller" ? "dash" : r === "admin" ? "admin" : "home"); }} style={{
            background: role === r ? C.gold : "transparent", color: role === r ? C.dark : "#888",
            border: `1px solid ${role === r ? C.gold : "#444"}`, padding: "5px 12px", borderRadius: 20,
            fontSize: 11, fontFamily: SANS, fontWeight: 600, cursor: "pointer", textTransform: "capitalize"
          }}>{r}</button>
        ))}
      </div>
    </div>
  );
}

function HomePage({ setPage, city }) {
  const cityData = CITIES.find(c => c.id === city);
  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <div style={{ background: C.dark, padding: "72px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(200,64,26,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(212,150,10,0.1) 0%, transparent 50%)" }} />
        <div style={{ position: "relative" }}>
          {!cityData.active && (
            <div style={{ background: C.warningBg, color: C.warning, borderRadius: 20, padding: "6px 18px", display: "inline-block", fontFamily: SANS, fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
              🚧 {cityData.name} launches {cityData.launch} — Lagos is live now
            </div>
          )}
          <p style={{ fontFamily: SANS, color: C.gold, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>Nigeria's #1 Shawarma Network</p>
          <h1 style={{ fontFamily: SERIF, fontSize: 50, color: "#fff", margin: "0 0 16px", lineHeight: 1.15 }}>
            Order Shawarma.<br /><span style={{ color: C.gold }}>Right Now.</span>
          </h1>
          <p style={{ fontFamily: SANS, color: "#aaa", fontSize: 16, maxWidth: 480, margin: "0 auto 36px" }}>
            Find verified shawarma vendors across Lagos, Port Harcourt, Benin City and Abuja. Order, pay, and track — all in one place.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => setPage("browse")} variant="gold" style={{ padding: "13px 30px", fontSize: 15 }}>Find Shawarma Near Me →</Btn>
            <Btn onClick={() => setPage("register")} style={{ padding: "13px 30px", fontSize: 15, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }}>
              List Your Spot — FREE During Launch
            </Btn>
          </div>
          <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
            {[["47+", "Verified Vendors"], ["3,842+", "Orders Completed"], ["4 Cities", "Lagos · PH · Benin · Abuja"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: SERIF, fontSize: 32, color: C.gold, fontWeight: 700 }}>{v}</div>
                <div style={{ fontFamily: SANS, color: "#666", fontSize: 12 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "52px 28px", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <h2 style={{ fontFamily: SERIF, fontSize: 28, color: C.dark, margin: 0 }}>Featured Vendors</h2>
            <p style={{ fontFamily: SANS, color: C.muted, fontSize: 13, marginTop: 4 }}>Handpicked, verified, and highly rated</p>
          </div>
          <Btn onClick={() => setPage("browse")} variant="ghost" style={{ padding: "8px 18px", fontSize: 13 }}>View All →</Btn>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {SELLERS.map(s => (
            <div key={s.id} style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 32px rgba(200,64,26,0.10)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
              <div style={{ background: s.tier === "pro" ? C.gold : s.tier === "growth" ? C.info : C.dark, padding: "20px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: "#fff" }}>{s.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: SERIF, fontSize: 15, color: "#fff", fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>📍 {s.zone} · {s.city === "lagos" ? "Lagos" : s.city}</div>
                </div>
                <Badge type={s.tier}>{s.tier === "pro" ? "⭐ Pro" : s.tier === "growth" ? "Growth" : "Free"}</Badge>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ color: C.gold, fontSize: 13 }}>{"★".repeat(Math.floor(s.rating))}</span>
                  <span style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>{s.rating} · {s.reviews} reviews</span>
                </div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, marginBottom: 14 }}>
                  🕐 {s.open}–{s.close} &nbsp;·&nbsp; From ₦{Math.min(...s.menu.map(m => m.price)).toLocaleString()}
                </div>
                <Btn onClick={() => setPage("vendor_" + s.id)} full style={{ textAlign: "center" }}>Order Now →</Btn>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.redLight, padding: "52px 28px", textAlign: "center", borderTop: `1px solid ${C.border}` }}>
        <h2 style={{ fontFamily: SERIF, fontSize: 32, color: C.dark, marginBottom: 10 }}>Sell on ShawarmaNow</h2>
        <p style={{ fontFamily: SANS, color: C.muted, maxWidth: 480, margin: "0 auto 12px" }}>
          Reach thousands of hungry customers across Nigeria. Free to join during our launch phase. 10% commission only when you earn.
        </p>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", margin: "24px 0", flexWrap: "wrap" }}>
          {TIERS.map(t => (
            <div key={t.id} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: SERIF, fontSize: 22, color: C.red, fontWeight: 700 }}>{t.price === 0 ? "Free" : `₦${t.price.toLocaleString()}/mo`}</div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>{t.name} Plan</div>
            </div>
          ))}
        </div>
        <Btn onClick={() => setPage("register")} style={{ padding: "13px 32px", fontSize: 15 }}>Get Listed →</Btn>
      </div>
    </div>
  );
}

function BrowsePage({ setPage, city }) {
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const cityData = CITIES.find(c => c.id === city);
  const sellers = SELLERS.filter(s =>
    s.city === city &&
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (zone === "" || s.zone === zone) &&
    (tierFilter === "" || s.tier === tierFilter)
  );

  if (!cityData.active) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 440, padding: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🚧</div>
          <h2 style={{ fontFamily: SERIF, fontSize: 28, color: C.dark, marginBottom: 8 }}>{cityData.name} Coming Soon</h2>
          <p style={{ fontFamily: SANS, color: C.muted, marginBottom: 6 }}>We're launching in {cityData.name} in <strong>{cityData.launch}</strong>.</p>
          <p style={{ fontFamily: SANS, color: C.muted, fontSize: 14, marginBottom: 28 }}>Are you a shawarma vendor in {cityData.name}? Get on the waitlist and be among the first listed.</p>
          <Btn onClick={() => setPage("register")} full style={{ textAlign: "center", padding: 12 }}>Join Vendor Waitlist →</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: 28 }}>
      <h1 style={{ fontFamily: SERIF, fontSize: 30, color: C.dark, marginBottom: 4 }}>Shawarma in {cityData.name}</h1>
      <p style={{ fontFamily: SANS, color: C.muted, marginBottom: 22, fontSize: 14 }}>{sellers.length} verified vendors available</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..."
          style={{ flex: 2, minWidth: 180, padding: "9px 14px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontFamily: SANS, fontSize: 13, background: C.surface }} />
        <select value={zone} onChange={e => setZone(e.target.value)}
          style={{ flex: 1, minWidth: 140, padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontFamily: SANS, fontSize: 13, background: C.surface }}>
          <option value="">All Areas</option>
          {cityData.zones.map(z => <option key={z}>{z}</option>)}
        </select>
        <select value={tierFilter} onChange={e => setTierFilter(e.target.value)}
          style={{ flex: 1, minWidth: 130, padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontFamily: SANS, fontSize: 13, background: C.surface }}>
          <option value="">All Tiers</option>
          <option value="pro">⭐ Pro</option>
          <option value="growth">Growth</option>
          <option value="free">Free</option>
        </select>
      </div>

      {SELLERS.filter(s => s.tier === "pro" && s.city === city).length > 0 && (
        <div style={{ background: C.goldLight, border: `1px solid #F5D87A`, borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
          <span style={{ fontFamily: SANS, fontSize: 12, color: C.warning, fontWeight: 600 }}>⭐ FEATURED — </span>
          <span style={{ fontFamily: SANS, fontSize: 12, color: C.text }}>{SELLERS.filter(s => s.tier === "pro" && s.city === city).map(s => s.name).join(" · ")}</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
        {sellers.map(s => {
          const now = new Date(); const h = now.getHours() * 60 + now.getMinutes();
          const [oh, om] = s.open.split(":").map(Number); const [ch, cm] = s.close.split(":").map(Number);
          const isOpen = h >= oh * 60 + om && h <= ch * 60 + cm;
          return (
            <div key={s.id} style={{ background: C.surface, borderRadius: 12, border: `1.5px solid ${s.tier === "pro" ? C.gold : C.border}`, padding: 18 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: s.tier === "pro" ? C.gold : C.red, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: SERIF, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{s.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.dark }}>{s.name}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted }}>📍 {s.zone}</div>
                </div>
                <Badge type={isOpen ? "success" : "warning"}>{isOpen ? "Open" : "Closed"}</Badge>
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                <Badge type={s.tier}>{s.tier}</Badge>
                <span style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>★ {s.rating} ({s.reviews})</span>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, marginBottom: 12 }}>
                🕐 {s.open}–{s.close} &nbsp;·&nbsp; From ₦{Math.min(...s.menu.map(m => m.price)).toLocaleString()}
              </div>
              <Btn onClick={() => setPage("vendor_" + s.id)} full style={{ textAlign: "center", padding: "9px" }}>View Menu & Order →</Btn>
            </div>
          );
        })}
      </div>
      {sellers.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: C.muted, fontFamily: SANS }}>No vendors found. Try a different filter.</div>}
    </div>
  );
}

function VendorPage({ sellerId, setPage }) {
  const seller = SELLERS.find(s => s.id === sellerId) || SELLERS[0];
  const [cart, setCart] = useState({});
  const [done, setDone] = useState(false);
  const [pay, setPay] = useState("card");

  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = seller.menu.find(m => m.id === parseInt(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const commission = Math.round(subtotal * COMMISSION);
  const delivery = 500;

  if (done) return (
    <div style={{ minHeight: "80vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: C.surface, borderRadius: 20, padding: 48, maxWidth: 400, textAlign: "center", border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontFamily: SERIF, fontSize: 26, color: C.dark, marginBottom: 8 }}>Order Placed!</h2>
        <p style={{ fontFamily: SANS, color: C.muted, fontSize: 14, marginBottom: 20 }}>Your order from <strong>{seller.name}</strong> is confirmed.</p>
        <div style={{ background: C.bg, borderRadius: 10, padding: 16, marginBottom: 20, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 13, marginBottom: 6 }}><span style={{ color: C.muted }}>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 13, marginBottom: 6 }}><span style={{ color: C.muted }}>Delivery</span><span>₦{delivery}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SERIF, fontSize: 16, color: C.red, fontWeight: 700 }}><span>Total Paid</span><span>₦{(subtotal + delivery).toLocaleString()}</span></div>
        </div>
        <Badge type="success">Awaiting Preparation</Badge>
        <div style={{ marginTop: 24 }}><Btn onClick={() => { setDone(false); setCart({}); setPage("browse"); }} variant="ghost" full style={{ textAlign: "center" }}>Back to Browse</Btn></div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <div style={{ background: C.dark, padding: "24px 28px" }}>
        <button onClick={() => setPage("browse")} style={{ background: "rgba(255,255,255,0.1)", color: "#ccc", border: "none", padding: "7px 14px", borderRadius: 6, fontFamily: SANS, cursor: "pointer", fontSize: 13, marginBottom: 14 }}>← Back</button>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: seller.tier === "pro" ? C.gold : C.red, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: "#fff" }}>{seller.avatar}</div>
          <div>
            <h1 style={{ fontFamily: SERIF, fontSize: 22, color: "#fff", margin: 0 }}>{seller.name}</h1>
            <div style={{ fontFamily: SANS, fontSize: 12, color: "#aaa" }}>📍 {seller.zone} · 🕐 {seller.open}–{seller.close}</div>
            <div style={{ marginTop: 4 }}><Badge type={seller.tier}>{seller.tier}</Badge></div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, padding: "20px 28px", maxWidth: 1060, margin: "0 auto" }}>
        <div>
          <h2 style={{ fontFamily: SERIF, fontSize: 22, color: C.dark, marginBottom: 14 }}>Menu</h2>
          {seller.menu.map(item => (
            <div key={item.id} style={{ background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, padding: "14px 18px", marginBottom: 10, display: "flex", gap: 14, alignItems: "center" }}>
              <span style={{ fontSize: 28 }}>🥙</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: SANS, fontSize: 15, color: C.dark, fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>{item.desc}</div>
                <div style={{ fontFamily: SERIF, fontSize: 16, color: C.red, fontWeight: 700, marginTop: 3 }}>₦{item.price.toLocaleString()}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => setCart(c => ({ ...c, [item.id]: Math.max(0, (c[item.id] || 0) - 1) }))} style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", fontSize: 16 }}>−</button>
                <span style={{ fontFamily: SANS, fontWeight: 700, minWidth: 18, textAlign: "center" }}>{cart[item.id] || 0}</span>
                <button onClick={() => setCart(c => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }))} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: C.red, color: "#fff", cursor: "pointer", fontSize: 16 }}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: 22, position: "sticky", top: 72 }}>
            <h3 style={{ fontFamily: SERIF, fontSize: 18, color: C.dark, marginBottom: 14 }}>Your Order</h3>
            {Object.entries(cart).filter(([, q]) => q > 0).length === 0
              ? <p style={{ fontFamily: SANS, color: C.muted, fontSize: 13 }}>Add items from the menu.</p>
              : Object.entries(cart).filter(([, q]) => q > 0).map(([id, qty]) => {
                const item = seller.menu.find(m => m.id === parseInt(id));
                return item ? <div key={id} style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 13, marginBottom: 7 }}>
                  <span style={{ color: C.text }}>{item.name} ×{qty}</span>
                  <span style={{ fontWeight: 600 }}>₦{(item.price * qty).toLocaleString()}</span>
                </div> : null;
              })}
            {subtotal > 0 && <>
              <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 12, color: C.muted, marginBottom: 4 }}><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 12, color: C.muted, marginBottom: 4 }}><span>Delivery</span><span>₦{delivery}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SERIF, fontSize: 17, color: C.dark, fontWeight: 700, marginBottom: 16 }}><span>Total</span><span style={{ color: C.red }}>₦{(subtotal + delivery).toLocaleString()}</span></div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted, marginBottom: 6 }}>Pay with</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["card", "transfer", "ussd"].map(m => (
                    <button key={m} onClick={() => setPay(m)} style={{ flex: 1, padding: "8px 0", borderRadius: 7, border: `1.5px solid ${pay === m ? C.red : C.border}`, background: pay === m ? C.redLight : C.surface, color: pay === m ? C.red : C.muted, fontFamily: SANS, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                      {m === "card" ? "💳 Card" : m === "transfer" ? "🏦 Bank" : "📱 USSD"}
                    </button>
                  ))}
                </div>
              </div>
              <Btn onClick={() => setDone(true)} full style={{ textAlign: "center", padding: 12, fontSize: 15 }}>Pay ₦{(subtotal + delivery).toLocaleString()} →</Btn>
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontFamily: SANS, fontSize: 12, color: C.muted, marginBottom: 5 }}>
        {label}{required && <span style={{ color: C.red }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder, ...rest }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: "100%", padding: "10px 13px", borderRadius: 7, border: `1.5px solid ${C.border}`, fontFamily: SANS, fontSize: 13, boxSizing: "border-box", background: C.surface, color: C.dark, outline: "none" }}
      {...rest} />
  );
}

function Select({ value, onChange, children }) {
  return (
    <select value={value} onChange={onChange}
      style={{ width: "100%", padding: "10px 13px", borderRadius: 7, border: `1.5px solid ${C.border}`, fontFamily: SANS, fontSize: 13, background: C.surface, color: C.dark, boxSizing: "border-box" }}>
      {children}
    </select>
  );
}

function RegisterPage({ setPage }) {
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState("transfer");
  const [tier, setTier] = useState("growth");
  const [errors, setErrors] = useState({});

  const [profile, setProfile] = useState({
    businessName: "", ownerName: "", phone: "", email: "", whatsapp: "",
    city: "lagos", zone: "", address: "", open: "09:00", close: "22:00",
    description: "", instagram: "", facebook: "",
  });

  const [menu, setMenu] = useState([
    { id: 1, name: "", price: "", desc: "", category: "Chicken" },
  ]);

  const [bank, setBank] = useState({
    bankName: "", accountNumber: "", accountName: "", bvn: "",
  });

  const STEPS = ["Listing Fee", "Choose Plan", "Business Info", "Menu Setup", "Payout Details", "Preview & Submit"];

  const setP = (k, v) => setProfile(p => ({ ...p, [k]: v }));
  const setB = (k, v) => setBank(b => ({ ...b, [k]: v }));

  const addMenuItem = () => setMenu(m => [...m, { id: Date.now(), name: "", price: "", desc: "", category: "Chicken" }]);
  const removeMenuItem = (id) => setMenu(m => m.filter(i => i.id !== id));
  const updateMenuItem = (id, key, val) => setMenu(m => m.map(i => i.id === id ? { ...i, [key]: val } : i));

  const validateStep = () => {
    if (step === 3) {
      const e = {};
      if (!profile.businessName) e.businessName = "Required";
      if (!profile.ownerName) e.ownerName = "Required";
      if (!profile.phone || profile.phone.length < 10) e.phone = "Enter a valid phone number";
      if (!profile.email || !profile.email.includes("@")) e.email = "Enter a valid email";
      if (!profile.zone) e.zone = "Select your area";
      if (!profile.address) e.address = "Required";
      setErrors(e);
      return Object.keys(e).length === 0;
    }
    if (step === 4) {
      const e = {};
      const valid = menu.filter(i => i.name && i.price);
      if (valid.length === 0) e.menu = "Add at least one menu item";
      setErrors(e);
      return Object.keys(e).length === 0;
    }
    if (step === 5) {
      const e = {};
      if (!bank.bankName) e.bankName = "Required";
      if (!bank.accountNumber || bank.accountNumber.length !== 10) e.accountNumber = "Enter 10-digit account number";
      if (!bank.accountName) e.accountName = "Required";
      setErrors(e);
      return Object.keys(e).length === 0;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setErrors({});
    setStep(s => s + 1);
  };

  const cityData = CITIES.find(c => c.id === profile.city);
  const selectedTier = TIERS.find(t => t.id === tier);
  const validMenu = menu.filter(i => i.name && i.price);
  const initials = profile.businessName ? profile.businessName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "SN";

  const StepBar = () => (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
      {STEPS.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : undefined }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i + 1 ? C.success : step === i + 1 ? C.red : C.border, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 10, color: step === i + 1 ? C.red : C.muted, whiteSpace: "nowrap" }}>{label}</div>
          </div>
          {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? C.success : C.border, margin: "0 4px", marginBottom: 14 }} />}
        </div>
      ))}
    </div>
  );

  const Card = ({ title, subtitle, children }) => (
    <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: 28 }}>
      <h2 style={{ fontFamily: SERIF, fontSize: 22, color: C.dark, marginBottom: 4 }}>{title}</h2>
      {subtitle && <p style={{ fontFamily: SANS, color: C.muted, fontSize: 13, marginBottom: 20 }}>{subtitle}</p>}
      {children}
    </div>
  );

  const ErrMsg = ({ field }) => errors[field] ? <div style={{ fontFamily: SANS, fontSize: 11, color: C.red, marginTop: 3 }}>{errors[field]}</div> : null;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "32px 20px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: SERIF, fontSize: 28, color: C.dark, margin: 0 }}>Become a Vendor on ShawarmaNow</h1>
          <p style={{ fontFamily: SANS, color: C.muted, fontSize: 13, marginTop: 4 }}>Reach thousands of hungry customers across Nigeria</p>
        </div>

        <StepBar />

        {step === 1 && (
          <Card title="Welcome — It's Completely Free to Join" subtitle="We're in our launch phase. The first 100 vendors get listed at zero cost.">
            <div style={{ background: C.successBg, borderRadius: 10, padding: "18px 20px", marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid #BBF7D0` }}>
              <div>
                <div style={{ fontFamily: SERIF, fontSize: 36, color: C.success, fontWeight: 700 }}>FREE</div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>No listing fee during launch</div>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 13, color: C.muted, textAlign: "right", lineHeight: 1.8 }}>
                Only 10% commission<br />on orders you <em>actually receive</em>.<br />You don't earn, you don't pay.
              </div>
            </div>

            <div style={{ background: C.warningBg, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontFamily: SANS, fontSize: 13, color: C.warning }}>
              ⚡ <strong>Launch Offer:</strong> First 100 vendors join free. After that, the listing fee becomes ₦20,000. Don't miss your spot.
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              {[
                "✅ Verified vendor badge",
                "✅ Appear in customer search",
                "✅ Receive & manage orders",
                "✅ Customer analytics",
                "✅ Regular/Non-regular grouping",
                "✅ Weekly earnings payout",
                "✅ WhatsApp order alerts",
                "✅ Free for first 100 vendors",
              ].map(f => (
                <div key={f} style={{ fontFamily: SANS, fontSize: 12, color: C.text }}>{f}</div>
              ))}
            </div>

            <Btn onClick={() => setStep(2)} full style={{ textAlign: "center", padding: 14, fontSize: 15 }}>
              Claim My Free Spot →
            </Btn>
            <div style={{ textAlign: "center", marginTop: 10, fontFamily: SANS, fontSize: 11, color: C.muted }}>
              By continuing you agree to ShawarmaNow's vendor terms and 10% commission on completed orders only.
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card title="Choose Your Plan" subtitle="Start free and upgrade anytime. No listing fee during our launch phase.">
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
              {TIERS.map(t => (
                <div key={t.id} onClick={() => setTier(t.id)} style={{ border: `2px solid ${tier === t.id ? C.red : C.border}`, borderRadius: 12, padding: "16px 20px", cursor: "pointer", background: tier === t.id ? C.redLight : C.surface, transition: "all 0.15s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: C.dark }}>{t.name} Plan {t.id === "growth" ? "— Most Popular" : ""}</div>
                      <div style={{ fontFamily: SERIF, fontSize: 18, color: C.red, fontWeight: 700 }}>{t.price === 0 ? "Free" : `₦${t.price.toLocaleString()}/month`}</div>
                    </div>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${tier === t.id ? C.red : C.border}`, background: tier === t.id ? C.red : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {tier === t.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                    {t.features.map(f => <div key={f} style={{ fontFamily: SANS, fontSize: 11, color: C.muted }}>✓ {f}</div>)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => setStep(1)} variant="ghost" style={{ flex: 1, textAlign: "center" }}>← Back</Btn>
              <Btn onClick={nextStep} style={{ flex: 2, textAlign: "center", padding: 12 }}>Continue with {selectedTier?.name} →</Btn>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card title="Business Information" subtitle="This is what customers will see on your vendor profile.">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Business Name" required>
                  <Input value={profile.businessName} onChange={e => setP("businessName", e.target.value)} placeholder="e.g. Mama Titi's Shawarma Palace" />
                  <ErrMsg field="businessName" />
                </Field>
              </div>
              <Field label="Owner / Manager Name" required>
                <Input value={profile.ownerName} onChange={e => setP("ownerName", e.target.value)} placeholder="Your full name" />
                <ErrMsg field="ownerName" />
              </Field>
              <Field label="Phone Number" required>
                <Input value={profile.phone} onChange={e => setP("phone", e.target.value)} type="tel" placeholder="+234 800 000 0000" />
                <ErrMsg field="phone" />
              </Field>
              <Field label="Email Address" required>
                <Input value={profile.email} onChange={e => setP("email", e.target.value)} type="email" placeholder="you@example.com" />
                <ErrMsg field="email" />
              </Field>
              <Field label="WhatsApp Number">
                <Input value={profile.whatsapp} onChange={e => setP("whatsapp", e.target.value)} type="tel" placeholder="+234 800 000 0000" />
              </Field>
              <Field label="City" required>
                <Select value={profile.city} onChange={e => { setP("city", e.target.value); setP("zone", ""); }}>
                  {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}{!c.active ? " (Waitlist)" : ""}</option>)}
                </Select>
              </Field>
              <Field label="Area / Zone" required>
                <Select value={profile.zone} onChange={e => setP("zone", e.target.value)}>
                  <option value="">Select your area</option>
                  {(cityData?.zones || []).map(z => <option key={z}>{z}</option>)}
                </Select>
                <ErrMsg field="zone" />
              </Field>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Street Address" required>
                  <Input value={profile.address} onChange={e => setP("address", e.target.value)} placeholder="e.g. 14 Awolowo Road, beside Access Bank" />
                  <ErrMsg field="address" />
                </Field>
              </div>
              <Field label="Opening Hour" required>
                <Input value={profile.open} onChange={e => setP("open", e.target.value)} type="time" />
              </Field>
              <Field label="Closing Hour" required>
                <Input value={profile.close} onChange={e => setP("close", e.target.value)} type="time" />
              </Field>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Business Description">
                  <textarea value={profile.description} onChange={e => setP("description", e.target.value)} placeholder="Tell customers what makes your shawarma special..." rows={3}
                    style={{ width: "100%", padding: "10px 13px", borderRadius: 7, border: `1.5px solid ${C.border}`, fontFamily: SANS, fontSize: 13, boxSizing: "border-box", resize: "vertical", color: C.dark }} />
                </Field>
              </div>
              <Field label="Instagram Handle">
                <Input value={profile.instagram} onChange={e => setP("instagram", e.target.value)} placeholder="@yourbusiness" />
              </Field>
              <Field label="Facebook Page">
                <Input value={profile.facebook} onChange={e => setP("facebook", e.target.value)} placeholder="facebook.com/yourbusiness" />
              </Field>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn onClick={() => setStep(2)} variant="ghost" style={{ flex: 1, textAlign: "center" }}>← Back</Btn>
              <Btn onClick={nextStep} style={{ flex: 2, textAlign: "center", padding: 12 }}>Save & Continue →</Btn>
            </div>
          </Card>
        )}

        {step === 4 && (
          <Card title="Build Your Menu" subtitle="Add the shawarma items customers can order. You can edit this anytime after going live.">
            {errors.menu && <div style={{ background: C.warningBg, borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontFamily: SANS, fontSize: 13, color: C.warning }}>{errors.menu}</div>}
            {menu.map((item, idx) => (
              <div key={item.id} style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.dark }}>Item {idx + 1}</div>
                  {menu.length > 1 && <button onClick={() => removeMenuItem(item.id)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontFamily: SANS, fontSize: 12 }}>Remove</button>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <Field label="Item Name" required>
                    <Input value={item.name} onChange={e => updateMenuItem(item.id, "name", e.target.value)} placeholder="e.g. Chicken Shawarma" />
                  </Field>
                  <Field label="Price (₦)" required>
                    <Input value={item.price} onChange={e => updateMenuItem(item.id, "price", e.target.value)} type="number" placeholder="3500" />
                  </Field>
                  <Field label="Category">
                    <Select value={item.category} onChange={e => updateMenuItem(item.id, "category", e.target.value)}>
                      {["Chicken", "Beef", "Lamb", "Mixed", "Veggie", "Combo", "Drinks", "Sides"].map(c => <option key={c}>{c}</option>)}
                    </Select>
                  </Field>
                </div>
                <Field label="Description">
                  <Input value={item.desc} onChange={e => updateMenuItem(item.id, "desc", e.target.value)} placeholder="Brief description of this item..." />
                </Field>
              </div>
            ))}
            <button onClick={addMenuItem} style={{ width: "100%", padding: "12px", borderRadius: 8, border: `1.5px dashed ${C.border}`, background: "transparent", fontFamily: SANS, fontSize: 13, color: C.muted, cursor: "pointer", marginBottom: 18 }}>
              + Add Another Menu Item
            </button>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => setStep(3)} variant="ghost" style={{ flex: 1, textAlign: "center" }}>← Back</Btn>
              <Btn onClick={nextStep} style={{ flex: 2, textAlign: "center", padding: 12 }}>Save Menu & Continue →</Btn>
            </div>
          </Card>
        )}

        {step === 5 && (
          <Card title="Payout Details" subtitle="Where should we send your earnings? Payouts happen every Monday for the previous week.">
            <div style={{ background: C.infoBg, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontFamily: SANS, fontSize: 13, color: C.info }}>
              ℹ️ Your earnings after 10% commission are paid directly into this account every week.
            </div>
            <Field label="Bank Name" required>
              <Select value={bank.bankName} onChange={e => setB("bankName", e.target.value)}>
                <option value="">Select your bank</option>
                {["Access Bank", "GTBank", "Zenith Bank", "First Bank", "UBA", "Opay", "Palmpay", "Kuda Bank", "Stanbic IBTC", "Wema Bank", "Sterling Bank", "Polaris Bank", "Union Bank", "Fidelity Bank"].map(b => <option key={b}>{b}</option>)}
              </Select>
              <ErrMsg field="bankName" />
            </Field>
            <Field label="Account Number" required>
              <Input value={bank.accountNumber} onChange={e => setB("accountNumber", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit account number" />
              <ErrMsg field="accountNumber" />
            </Field>
            <Field label="Account Name" required>
              <Input value={bank.accountName} onChange={e => setB("accountName", e.target.value)} placeholder="Name on the account" />
              <ErrMsg field="accountName" />
            </Field>
            <Field label="BVN (optional but recommended)">
              <Input value={bank.bvn} onChange={e => setB("bvn", e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="For faster verification" />
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted, marginTop: 4 }}>Your BVN is encrypted and used only for identity verification.</div>
            </Field>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn onClick={() => setStep(4)} variant="ghost" style={{ flex: 1, textAlign: "center" }}>← Back</Btn>
              <Btn onClick={nextStep} style={{ flex: 2, textAlign: "center", padding: 12 }}>Save & Preview →</Btn>
            </div>
          </Card>
        )}

        {step === 6 && (
          <div>
            <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24, marginBottom: 16 }}>
              <h2 style={{ fontFamily: SERIF, fontSize: 20, color: C.dark, marginBottom: 16 }}>Profile Preview</h2>
              <div style={{ background: C.dark, borderRadius: 12, padding: "20px", display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: tier === "pro" ? C.gold : C.red, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: "#fff" }}>{initials}</div>
                <div>
                  <div style={{ fontFamily: SERIF, fontSize: 18, color: "#fff" }}>{profile.businessName || "Your Business Name"}</div>
                  <div style={{ fontFamily: SANS, fontSize: 12, color: "#aaa" }}>📍 {profile.zone || "Your Area"}, {cityData?.name} &nbsp;·&nbsp; 🕐 {profile.open}–{profile.close}</div>
                  <div style={{ marginTop: 5 }}><Badge type={tier}>{tier} plan</Badge></div>
                </div>
              </div>
              {profile.description && <div style={{ fontFamily: SANS, fontSize: 13, color: C.muted, marginBottom: 14, padding: "10px 14px", background: C.bg, borderRadius: 8 }}>{profile.description}</div>}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14, fontSize: 12, fontFamily: SANS }}>
                {[["Owner", profile.ownerName], ["Phone", profile.phone], ["Email", profile.email], ["Address", profile.address], ["Bank", bank.bankName], ["Account", bank.accountNumber]].map(([label, val]) => (
                  val ? <div key={label}><span style={{ color: C.muted }}>{label}: </span><span style={{ color: C.dark, fontWeight: 500 }}>{val}</span></div> : null
                ))}
              </div>

              {validMenu.length > 0 && (
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>MENU ({validMenu.length} items)</div>
                  {validMenu.map(item => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 13, padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ color: C.dark }}>{item.name} <span style={{ color: C.muted, fontSize: 11 }}>{item.desc}</span></span>
                      <span style={{ color: C.red, fontWeight: 600 }}>₦{parseInt(item.price || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: C.goldLight, borderRadius: 12, border: `1px solid #F5D87A`, padding: 16, marginBottom: 16, fontFamily: SANS, fontSize: 13 }}>
              <div style={{ fontWeight: 600, color: C.warning, marginBottom: 4 }}>Summary</div>
              <div style={{ color: C.text }}>Plan: <strong>{selectedTier?.name}</strong> {selectedTier?.price > 0 ? `(₦${selectedTier.price.toLocaleString()}/month)` : "(Free)"} &nbsp;·&nbsp; Commission: <strong>10%</strong> per order &nbsp;·&nbsp; Listing fee: <strong>FREE</strong> (launch offer)</div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => setStep(5)} variant="ghost" style={{ flex: 1, textAlign: "center" }}>← Edit</Btn>
              <Btn onClick={() => setStep(7)} style={{ flex: 2, textAlign: "center", padding: 13, fontSize: 15 }}>Submit & Go Live 🚀</Btn>
            </div>
          </div>
        )}

        {step === 7 && (
          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: 44, textAlign: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎊</div>
            <h2 style={{ fontFamily: SERIF, fontSize: 28, color: C.dark, marginBottom: 8 }}>You're Live on ShawarmaNow!</h2>
            <p style={{ fontFamily: SANS, color: C.muted, fontSize: 14, marginBottom: 6 }}>
              <strong>{profile.businessName || "Your Business"}</strong> is now listed in <strong>{cityData?.name}</strong>.
            </p>
            <p style={{ fontFamily: SANS, color: C.muted, fontSize: 13, marginBottom: 24 }}>
              Hours: {profile.open} – {profile.close} &nbsp;·&nbsp; {validMenu.length} menu items &nbsp;·&nbsp; {selectedTier?.name} Plan
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
              <Badge type="success">✅ Verified Vendor</Badge>
              <Badge type={tier}>{selectedTier?.name} Plan</Badge>
              <Badge type="info">Payouts: Every Monday</Badge>
            </div>
            <div style={{ background: C.bg, borderRadius: 10, padding: 16, marginBottom: 24, fontFamily: SANS, fontSize: 13, textAlign: "left" }}>
              <div style={{ fontWeight: 600, color: C.dark, marginBottom: 8 }}>What happens next:</div>
              <div style={{ color: C.muted, lineHeight: 1.8 }}>
                1. Our team will verify your payment within 24 hours<br />
                2. Your profile goes live and customers can find you<br />
                3. Orders come in — you prepare and deliver<br />
                4. Every Monday, your earnings (minus 10%) hit your account
              </div>
            </div>
            <Btn onClick={() => setPage("dash")} full style={{ textAlign: "center", padding: 13, fontSize: 15 }}>Go to My Dashboard →</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

function SellerDash({ setPage }) {
  const s = SELLERS[0];
  const monthlyRevenue = s.monthlyOrders * s.avgOrder;
  const commission = Math.round(monthlyRevenue * COMMISSION);
  const netPayout = monthlyRevenue - commission;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: 24 }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <h1 style={{ fontFamily: SERIF, fontSize: 26, color: C.dark, margin: 0 }}>{s.name}</h1>
            <div style={{ fontFamily: SANS, fontSize: 13, color: C.muted, marginTop: 3 }}>📍 {s.zone} · Lagos &nbsp;·&nbsp; 🕐 {s.open}–{s.close}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge type={s.tier}>{s.tier === "pro" ? "⭐ Pro Plan" : s.tier}</Badge>
            <Badge type="success">🟢 Open Now</Badge>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
          {[
            { label: "This Month Revenue", val: `₦${monthlyRevenue.toLocaleString()}`, sub: `${s.monthlyOrders} orders` },
            { label: "Platform Commission (10%)", val: `₦${commission.toLocaleString()}`, sub: "Deducted per order" },
            { label: "Your Net Payout", val: `₦${netPayout.toLocaleString()}`, sub: "Transferred monthly" },
            { label: "Total Customers", val: CUSTOMERS.length, sub: `${CUSTOMERS.filter(c => c.type === "regular").length} regulars` },
          ].map(({ label, val, sub }) => (
            <div key={label} style={{ background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, padding: 18 }}>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted, marginBottom: 5 }}>{label}</div>
              <div style={{ fontFamily: SERIF, fontSize: 22, color: C.red, fontWeight: 700 }}>{val}</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted }}>{sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
          <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontFamily: SERIF, fontSize: 18, color: C.dark, margin: 0 }}>Live Orders</h3>
            </div>
            {ORDERS.map((o, i) => (
              <div key={o.id} style={{ padding: "10px 0", borderBottom: i < ORDERS.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.dark }}>{o.customer}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted }}>{o.item}</div>
                  <div style={{ fontFamily: SANS, fontSize: 10, color: C.muted }}>{o.time}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 3 }}>₦{o.amount.toLocaleString()}</div>
                  <Badge type={o.status}>{o.status}</Badge>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontFamily: SERIF, fontSize: 18, color: C.dark, margin: 0 }}>Top Customers</h3>
              <Btn onClick={() => setPage("customers")} variant="ghost" style={{ padding: "5px 12px", fontSize: 12 }}>All →</Btn>
            </div>
            {CUSTOMERS.slice(0, 4).map((c, i) => (
              <div key={c.id} style={{ padding: "9px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.type === "regular" ? "#DBEAFE" : "#FEF9C3", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 12, fontWeight: 700, color: c.type === "regular" ? "#1E40AF" : "#713F12" }}>
                    {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.dark }}>{c.name}</div>
                    <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted }}>{c.orders} orders · {c.last}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Badge type={c.type}>{c.type}</Badge>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted, marginTop: 2 }}>₦{c.spent.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: C.goldLight, borderRadius: 12, border: `1px solid #F5D87A`, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.warning }}>⭐ You're on the Pro Plan</div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>Featured on homepage · Priority search · Dedicated account manager</div>
          </div>
          <Badge type="pro">₦35,000/month</Badge>
        </div>
      </div>
    </div>
  );
}

function CustomersPage() {
  const [filter, setFilter] = useState("all");
  const list = filter === "all" ? CUSTOMERS : CUSTOMERS.filter(c => c.type === filter);
  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: 24 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontFamily: SERIF, fontSize: 26, color: C.dark, marginBottom: 4 }}>Customer Management</h1>
        <p style={{ fontFamily: SANS, color: C.muted, fontSize: 13, marginBottom: 20 }}>Customers with 10+ orders are automatically marked as regulars</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["all", "regular", "non-regular"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 18px", borderRadius: 20, border: `1.5px solid ${filter === f ? C.red : C.border}`, background: filter === f ? C.redLight : C.surface, color: filter === f ? C.red : C.muted, fontFamily: SANS, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              {f === "all" ? `All (${CUSTOMERS.length})` : f === "regular" ? `⭐ Regular (${CUSTOMERS.filter(c => c.type === "regular").length})` : `👤 Non-Regular (${CUSTOMERS.filter(c => c.type === "non-regular").length})`}
            </button>
          ))}
        </div>
        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "10px 18px", background: C.redLight, fontFamily: SANS, fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: 0.5 }}>
            <span>CUSTOMER</span><span>TYPE</span><span>ORDERS</span><span>TOTAL SPENT</span><span>LAST ORDER</span>
          </div>
          {list.map((c, i) => (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "13px 18px", borderBottom: i < list.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.type === "regular" ? "#DBEAFE" : "#FEF9C3", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 12, fontWeight: 700, color: c.type === "regular" ? "#1E40AF" : "#713F12" }}>
                  {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.dark }}>{c.name}</span>
              </div>
              <span><Badge type={c.type}>{c.type}</Badge></span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.dark }}>{c.orders}</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.red, fontWeight: 600 }}>₦{c.spent.toLocaleString()}</span>
              <span style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>{c.last}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EarningsPage() {
  const s = SELLERS[0];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const revenues = [1200000, 1450000, 1380000, 1620000, 1800000, 1950000];
  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: 24 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontFamily: SERIF, fontSize: 26, color: C.dark, marginBottom: 4 }}>Earnings & Commission</h1>
        <p style={{ fontFamily: SANS, color: C.muted, fontSize: 13, marginBottom: 22 }}>10% platform commission deducted from every order</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 22 }}>
          {[
            { label: "This Month Gross", val: "₦3,528,000", note: "Total orders value" },
            { label: "Commission (10%)", val: "₦352,800", note: "Paid to ShawarmaNow" },
            { label: "Your Net Payout", val: "₦3,175,200", note: "Transferred to your account" },
          ].map(({ label, val, note }) => (
            <div key={label} style={{ background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, padding: 18 }}>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted, marginBottom: 6 }}>{label}</div>
              <div style={{ fontFamily: SERIF, fontSize: 22, color: C.red, fontWeight: 700 }}>{val}</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted }}>{note}</div>
            </div>
          ))}
        </div>

        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 22, marginBottom: 18 }}>
          <h3 style={{ fontFamily: SERIF, fontSize: 18, color: C.dark, marginBottom: 16 }}>Monthly Revenue Trend</h3>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 140 }}>
            {revenues.map((r, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{ fontFamily: SANS, fontSize: 10, color: C.muted }}>₦{(r / 1000000).toFixed(1)}M</div>
                <div style={{ width: "100%", background: i === revenues.length - 1 ? C.red : C.border, borderRadius: "4px 4px 0 0", height: `${Math.round((r / Math.max(...revenues)) * 110)}px` }} />
                <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted }}>{months[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 22 }}>
          <h3 style={{ fontFamily: SERIF, fontSize: 18, color: C.dark, marginBottom: 14 }}>Recent Payouts</h3>
          {[["May 2025", "₦1,620,000", "₦162,000", "₦1,458,000", "Paid"], ["Apr 2025", "₦1,380,000", "₦138,000", "₦1,242,000", "Paid"], ["Mar 2025", "₦1,450,000", "₦145,000", "₦1,305,000", "Paid"]].map(([month, gross, comm, net, status]) => (
            <div key={month} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 80px", padding: "10px 0", borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.dark, fontWeight: 600 }}>{month}</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>{gross}</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.red }}>−{comm}</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.success, fontWeight: 600 }}>{net}</span>
              <Badge type="success">{status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BuyerOrders() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: 24 }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ fontFamily: SERIF, fontSize: 26, color: C.dark, marginBottom: 4 }}>My Orders</h1>
        <p style={{ fontFamily: SANS, color: C.muted, fontSize: 13, marginBottom: 22 }}>Track all your ShawarmaNow orders</p>
        {ORDERS.map(o => (
          <div key={o.id} style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: "16px 20px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontFamily: SANS, fontSize: 11, color: C.muted }}>{o.id}</span>
                <Badge type={o.status}>{o.status}</Badge>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.dark }}>{o.item}</div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>{o.time}</div>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 20, color: C.red, fontWeight: 700 }}>₦{o.amount.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPage() {
  const totalVendors = 47;
  const listingRevenue = totalVendors * LISTING_FEE;
  const monthlyCommission = 2840000;
  const subRevenue = 12 * 35000 + 22 * 15000;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: 24 }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ background: C.dark, borderRadius: 14, padding: "26px 28px", marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontFamily: SERIF, fontSize: 24, color: "#fff", margin: 0 }}>ShawarmaNow Admin</h1>
            <p style={{ fontFamily: SANS, color: "#888", fontSize: 13, marginTop: 3 }}>Your revenue dashboard across all cities</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: SERIF, fontSize: 28, color: C.gold }}>₦{(listingRevenue + monthlyCommission + subRevenue).toLocaleString()}</div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: "#888" }}>Total platform revenue</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
          {[
            { label: "Listing Fees", val: "₦0 (Launch Phase)", sub: `${totalVendors} vendors — free during launch` },
            { label: "Monthly Commissions", val: `₦${monthlyCommission.toLocaleString()}`, sub: "10% on all orders" },
            { label: "Subscriptions", val: `₦${subRevenue.toLocaleString()}/mo`, sub: "Growth + Pro plans" },
            { label: "Total Orders (All Cities)", val: "3,842", sub: "Lagos only (PH/Benin/Abuja pending)" },
          ].map(({ label, val, sub }) => (
            <div key={label} style={{ background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, padding: 16 }}>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted, marginBottom: 5 }}>{label}</div>
              <div style={{ fontFamily: SERIF, fontSize: 20, color: C.red, fontWeight: 700 }}>{val}</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted }}>{sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
          <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 22 }}>
            <h3 style={{ fontFamily: SERIF, fontSize: 18, color: C.dark, marginBottom: 14 }}>City Expansion Status</h3>
            {CITIES.map((c, i) => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < CITIES.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.dark }}>{c.name}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted }}>{c.active ? `${c.vendors} vendors · ${c.orders.toLocaleString()} orders` : `Target: ${c.launch}`}</div>
                </div>
                <Badge type={c.active ? "success" : "warning"}>{c.active ? "🟢 Live" : `⏳ ${c.launch}`}</Badge>
              </div>
            ))}
          </div>

          <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 22 }}>
            <h3 style={{ fontFamily: SERIF, fontSize: 18, color: C.dark, marginBottom: 14 }}>Vendor Plan Breakdown</h3>
            {[["Free", 13, 0], ["Growth", 22, 15000], ["Pro", 12, 35000]].map(([name, count, price]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Badge type={name.toLowerCase()}>{name}</Badge>
                  <span style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>{count} vendors</span>
                </div>
                <span style={{ fontFamily: SANS, fontSize: 13, color: C.red, fontWeight: 600 }}>{price === 0 ? "—" : `₦${(count * price).toLocaleString()}/mo`}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontFamily: SANS, fontSize: 13, fontWeight: 600 }}>
              <span style={{ color: C.dark }}>Total subscription revenue</span>
              <span style={{ color: C.red }}>₦{subRevenue.toLocaleString()}/mo</span>
            </div>
          </div>
        </div>

        <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 22 }}>
          <h3 style={{ fontFamily: SERIF, fontSize: 18, color: C.dark, marginBottom: 14 }}>Registered Vendors</h3>
          {SELLERS.map((s, i) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < SELLERS.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: SERIF, fontSize: 13, fontWeight: 700 }}>{s.avatar}</div>
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.dark }}>{s.name}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: C.muted }}>{s.zone} · {s.owner}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Badge type={s.tier}>{s.tier}</Badge>
                <span style={{ fontFamily: SANS, fontSize: 12, color: C.success }}>Fee Paid ✓</span>
                <span style={{ fontFamily: SANS, fontSize: 12, color: C.red, fontWeight: 600 }}>₦{Math.round(s.monthlyOrders * s.avgOrder * COMMISSION).toLocaleString()}/mo commission</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  useFont();
  const [page, setPage] = useState("home");
  const [role, setRole] = useState("buyer");
  const [city, setCity] = useState("lagos");

  const vendorMatch = page.match(/^vendor_(\d+)$/);
  const sellerId = vendorMatch ? parseInt(vendorMatch[1]) : null;

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <Nav page={page} setPage={setPage} role={role} setRole={setRole} city={city} setCity={setCity} />
      {page === "home" && <HomePage setPage={setPage} city={city} />}
      {page === "browse" && <BrowsePage setPage={setPage} city={city} />}
      {sellerId && <VendorPage sellerId={sellerId} setPage={setPage} />}
      {page === "register" && <RegisterPage setPage={setPage} />}
      {page === "dash" && <SellerDash setPage={setPage} />}
      {page === "customers" && <CustomersPage />}
      {page === "earnings" && <EarningsPage />}
      {page === "orders" && <BuyerOrders />}
      {page === "admin" && <AdminPage />}
    </div>
  );
}
