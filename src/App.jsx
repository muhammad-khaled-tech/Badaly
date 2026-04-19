import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES  (injected via <style> tag)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&family=Syne:wght@700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Cairo', sans-serif; background: #fff; overflow-x: hidden; }

  :root {
    --green: #10B981;
    --green-dark: #059669;
    --green-deeper: #047857;
    --green-light: #ECFDF5;
    --green-mid: #A7F3D0;
    --dark: #0F172A;
    --slate: #1E293B;
    --muted: #64748B;
    --border: #E2E8F0;
    --surface: #F8FAFC;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-14px); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1);   opacity: .6; }
    100% { transform: scale(2.2); opacity: 0;  }
  }
  @keyframes spin-slow {
    to { transform: rotate(360deg); }
  }
  @keyframes blink {
    0%,100% { opacity: 1; } 50% { opacity: .3; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes numberCount {
    from { opacity: 0; transform: scale(.5); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .reveal { opacity: 0; transform: translateY(40px); transition: opacity .7s ease, transform .7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  .float-anim { animation: float 4s ease-in-out infinite; }

  .pulse-dot {
    position: relative;
    display: inline-block;
    width: 12px; height: 12px;
    background: var(--green);
    border-radius: 50%;
  }
  .pulse-dot::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--green);
    animation: pulseRing 1.8s ease-out infinite;
  }

  .gradient-text {
    background: linear-gradient(135deg, var(--green) 0%, #34D399 50%, var(--green-dark) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass {
    background: rgba(255,255,255,.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,.6);
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--green), var(--green-dark));
    color: #fff;
    border: none;
    border-radius: 16px;
    padding: 14px 32px;
    font-family: 'Cairo', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(16,185,129,.35);
    transition: all .3s ease;
    position: relative;
    overflow: hidden;
  }
  .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--green-dark), var(--green-deeper));
    opacity: 0;
    transition: opacity .3s;
  }
  .btn-primary:hover::before { opacity: 1; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(16,185,129,.45); }

  .btn-outline {
    background: transparent;
    color: var(--green);
    border: 2px solid var(--green);
    border-radius: 12px;
    padding: 10px 22px;
    font-family: 'Cairo', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all .3s ease;
  }
  .btn-outline:hover { background: var(--green); color: #fff; }

  .step-line {
    position: absolute;
    top: 50%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, var(--green), transparent);
  }

  .bento-card {
    background: #fff;
    border-radius: 28px;
    border: 1.5px solid var(--border);
    padding: 28px;
    transition: all .35s cubic-bezier(.22,.68,0,1.2);
    position: relative;
    overflow: hidden;
  }
  .bento-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--green-light), transparent 60%);
    opacity: 0;
    transition: opacity .35s;
  }
  .bento-card::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--green), var(--green-dark));
    opacity: 0;
    transition: opacity .35s;
    border-radius: 0 0 28px 28px;
  }
  .bento-card:hover { transform: translateY(-8px) scale(1.01); box-shadow: 0 24px 56px rgba(16,185,129,.18), 0 4px 12px rgba(16,185,129,.08); border-color: var(--green-mid); }
  .bento-card:hover::before { opacity: 1; }
  .bento-card:hover::after { opacity: 1; }

  .store-badge {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--dark);
    color: #fff;
    border-radius: 14px;
    padding: 10px 20px;
    text-decoration: none;
    transition: all .3s;
    cursor: pointer;
    border: 1.5px solid #334155;
  }
  .store-badge:hover { background: #1E293B; transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,.3); }

  .noise-bg {
    position: relative;
  }
  .noise-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.04'/%3E%3C/svg%3E");
    pointer-events: none;
    border-radius: inherit;
  }

  .ticker {
    display: inline-flex;
    gap: 40px;
    animation: ticker 20s linear infinite;
    white-space: nowrap;
  }
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  @media (max-width: 768px) {
    .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
    .hero-phone { justify-content: center !important; order: -1; }
    .pain-grid { grid-template-columns: 1fr !important; }
    .steps-grid { grid-template-columns: 1fr !important; }
    .bento-grid { grid-template-columns: 1fr !important; }
    .store-badges { flex-direction: column; align-items: center; }
    .hero-headline { font-size: 2.2rem !important; }
    .section-title { font-size: 1.8rem !important; }
    
    .desktop-only { display: none !important; }
    .nav-container { padding: 12px 16px !important; }
    .logo-text { font-size: 18px !important; }
    .logo-icon { width: 32px !important; height: 32px !important; font-size: 16px !important; }
    .nav-action-btn { padding: 6px 12px !important; font-size: 12px !important; }
  }
`;

/* ─────────────────────────────────────────────
   BILINGUAL CONTENT
───────────────────────────────────────────── */
const CONTENT = {
  ar: {
    dir: "rtl",
    nav: { logo: "بدالي", download: "حمّل الآن", langToggle: "English", links: ["المميزات", "كيف يعمل", "الخصوصية"] },
    hero: {
      badge: "🤖 مساعدك الذكي في المكالمات",
      headline: "وقّف الانتظار",
      headlineLine2: "عيش حياتك",
      sub: "سيبه على الـ Hold وخلص مصلحتك",
      desc: "بدالي بيستنى عنك على الخط، بيتعامل مع قوائم الـ IVR، وبيصحيّك بس لما حد بشري يرد.",
      cta: "جرب دلوقتي",
      ctaSub: "متاح على iOS, Android & Huawei",
      appHome: "الرئيسية",
      appSearch: "ابحث عن خدمة...",
      appWaiting: "جاري الانتظار على",
      appService: "فودافون - خدمة العملاء",
      appStatus: "بدالي بيستنى عنك...",
      appQuick: "اتصال سريع",
      appSchedule: "جدولة",
      appFrequent: "الخدمات الأكثر استخداماً",
    },
    pain: {
      badge: "المشكلة",
      title: "مشكلة الـ 40 دقيقة",
      titleAccent: "في مصر كل يوم",
      sub: "ملايين المصريين بيضيعوا وقتهم في الانتظار على الخط",
      items: [
        { icon: "📱", title: "شبكات المحمول", desc: "ساعات انتظار على خدمة العملاء لمجرد استفسار بسيط", stat: "+45 دقيقة" },
        { icon: "🏦", title: "البنوك والتمويل", desc: "طوابير صوتية لا تنتهي وتحويلات بين الأقسام", stat: "+30 دقيقة" },
        { icon: "⚡", title: "المرافق والخدمات", desc: "كهرباء، مياه، وغاز - كلها بتودي في الانتظار", stat: "+60 دقيقة" },
      ],
    },
    how: {
      badge: "كيف يعمل",
      title: "3 خطوات",
      titleAccent: "وروحك",
      sub: "بدالي اختار لك الحل الأبسط والأذكى",
      steps: [
        { num: "01", icon: "📞", title: "اتصّل عبر بدالي", desc: "اختار الجهة اللي عايز تكلمها وسيب الباقي علينا. بدالي هيتعامل مع كل التفاصيل." },
        { num: "02", icon: "🤖", title: "الذكاء الاصطناعي بيستنى", desc: "بدالي بيتعامل مع قوائم الـ IVR ويستنى عنك وانت شايل بالك في حياتك." },
        { num: "03", icon: "🔔", title: "تنبيه فوري", desc: "بمجرد ما حد بشري يرد على الخط، هنصحيّك فوراً وتكمل إنت." },
      ],
    },
    features: {
      badge: "المميزات",
      title: "ليه بدالي؟",
      items: [
        { icon: "📡", emoji: "📡", title: "مراقبة ذكية للخط في الخلفية", desc: "بدالي بيشتغل في الخلفية بدون ما يأكل بياناتك أو يصرف البطارية. راقب الخط لحد ما حد بشري يرد.", tag: "توفير بيانات وبطارية", big: true },
        { icon: "🧠", emoji: "⚡", title: "IVR ذكي", desc: "بيتعرف على قوائم الاختيارات تلقائياً ويختار عنك الخيار الصح.", big: false },
        { icon: "📅", emoji: "🗓️", title: "جدولة مكالمات", desc: "احجز مكالمتك في الوقت اللي يناسبك وهنتصل لك.", big: false },
        { icon: "🔒", emoji: "🛡️", title: "صفر تخزين", desc: "مكالماتك مش محفوظة ومش متسجلة عندنا. خصوصيتك خط أحمر.", tag: "Privacy First", big: true },
      ],
    },
    trust: {
      badge: "الخصوصية",
      title: "خصوصيتك",
      titleAccent: "خط أحمر",
      sub: "سياسة الصفر تخزين — مش بس كلام",
      desc: "مكالماتك مش محفوظة، مش متسجلة، ومش بنشاركها مع أي حد. بدالي مصمم من الأساس إنه يحمي بياناتك.",
      items: ["مفيش تسجيل للمكالمات", "تشفير من طرف لطرف", "مفيش بيانات شخصية متخزنة", "مراجعة أمنية دورية"],
    },
    download: {
      badge: "حمّل دلوقتي",
      title: "انضم لآلاف المصريين",
      titleAccent: "اللي بطلوا ينتظروا",
      sub: "حمّل بدالي مجاناً وابدأ توفر وقتك من أول يوم",
      stores: [
        { icon: "🍎", label: "App Store", sub: "Download on the" },
        { icon: "🤖", label: "Google Play", sub: "Get it on" },
        { icon: "📱", label: "AppGallery", sub: "Explore it on" },
      ],
    },
    footer: {
      tagline: "بدالي — وقتك أهم من أي حاجة",
      links: ["عن بدالي", "خصوصية", "شروط الاستخدام", "تواصل معنا"],
    },
  },
  en: {
    dir: "ltr",
    nav: { logo: "Badaly", download: "Download Now", langToggle: "عربي", links: ["Features", "How It Works", "Privacy"] },
    hero: {
      badge: "🤖 Your AI Call Assistant",
      headline: "Stop Waiting,",
      headlineLine2: "Start Living",
      sub: "Let Badaly hold the line so you don't have to",
      desc: "Badaly navigates IVR menus, waits on hold, and alerts you the instant a human answers.",
      cta: "Preview Demo",
      ctaSub: "Available on iOS, Android & Huawei",
      appHome: "Home",
      appSearch: "Search for a service...",
      appWaiting: "Currently waiting on",
      appService: "Vodafone — Customer Service",
      appStatus: "Badaly is waiting for you...",
      appQuick: "Quick Call",
      appSchedule: "Schedule",
      appFrequent: "Most Used Services",
    },
    pain: {
      badge: "The Problem",
      title: "Egypt's 40-Minute",
      titleAccent: "Hold Problem",
      sub: "Millions of Egyptians waste hours every day stuck on hold",
      items: [
        { icon: "📱", title: "Mobile Networks", desc: "Hours waiting for customer service for a simple question", stat: "+45 min" },
        { icon: "🏦", title: "Banks & Finance", desc: "Endless automated trees and transfers between departments", stat: "+30 min" },
        { icon: "⚡", title: "Utilities & Services", desc: "Electricity, water, and gas — all keep you waiting", stat: "+60 min" },
      ],
    },
    how: {
      badge: "How It Works",
      title: "3 Simple",
      titleAccent: "Steps",
      sub: "Badaly chose the simplest and smartest solution for you",
      steps: [
        { num: "01", icon: "📞", title: "Call via Badaly", desc: "Select who you need to call and let us handle the rest. Badaly manages every detail." },
        { num: "02", icon: "🤖", title: "AI Waits for You", desc: "Badaly navigates IVR menus and stays on hold while you go live your life." },
        { num: "03", icon: "🔔", title: "Instant Alert", desc: "The moment a human agent picks up, you'll be notified immediately to take over." },
      ],
    },
    features: {
      badge: "Features",
      title: "Why Badaly?",
      items: [
        { icon: "📡", emoji: "📡", title: "Smart Background Monitoring", desc: "Badaly runs silently in the background with minimal data and battery usage — monitoring the line until a real human picks up.", tag: "Low-Data & Battery Efficient", big: true },
        { icon: "🧠", emoji: "⚡", title: "Smart IVR Navigation", desc: "Automatically detects menu options and selects the right one for you.", big: false },
        { icon: "📅", emoji: "🗓️", title: "Call Scheduling", desc: "Book your call for the perfect time and we'll notify you when it's ready.", big: false },
        { icon: "🔒", emoji: "🛡️", title: "Zero Storage", desc: "Your calls are never stored or recorded. Ever. Your privacy comes first.", tag: "Privacy First", big: true },
      ],
    },
    trust: {
      badge: "Privacy",
      title: "Your Privacy",
      titleAccent: "Is Sacred",
      sub: "Zero Storage Policy — not just words",
      desc: "Your calls are never recorded, stored, or shared with anyone. Badaly was built from the ground up with privacy at its core.",
      items: ["No call recordings", "End-to-end encryption", "Zero personal data stored", "Regular security audits"],
    },
    download: {
      badge: "Download Now",
      title: "Join Thousands of Egyptians",
      titleAccent: "Who Stopped Waiting",
      sub: "Download Badaly for free and start saving time from day one",
      stores: [
        { icon: "🍎", label: "App Store", sub: "Download on the" },
        { icon: "🤖", label: "Google Play", sub: "Get it on" },
        { icon: "📱", label: "AppGallery", sub: "Explore it on" },
      ],
    },
    footer: {
      tagline: "Badaly — Because Your Time Matters",
      links: ["About", "Privacy", "Terms", "Contact"],
    },
  },
};

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────
   PHONE MOCKUP
───────────────────────────────────────────── */
function PhoneMockup({ t, lang }) {
  return (
    <div
      className="float-anim"
      style={{
        width: 270,
        flexShrink: 0,
        filter: "drop-shadow(0 40px 70px rgba(16,185,129,0.28)) drop-shadow(0 15px 30px rgba(0,0,0,0.25))",
      }}
    >
      {/* Phone frame */}
      <div style={{
        background: "#0F172A",
        borderRadius: 48,
        padding: 9,
        position: "relative",
      }}>
        {/* Notch */}
        <div style={{
          position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
          width: 88, height: 26, background: "#0F172A", borderRadius: 13, zIndex: 10,
        }} />
        {/* Side buttons */}
        <div style={{ position: "absolute", right: -3, top: 80, width: 3, height: 32, background: "#334155", borderRadius: 2 }} />
        <div style={{ position: "absolute", left: -3, top: 70, width: 3, height: 24, background: "#334155", borderRadius: 2 }} />
        <div style={{ position: "absolute", left: -3, top: 102, width: 3, height: 24, background: "#334155", borderRadius: 2 }} />

        {/* Screen */}
        <div style={{
          background: "#F8FAFC", borderRadius: 41,
          overflow: "hidden", minHeight: 520,
          direction: t.dir,
        }}>
          {/* Status bar */}
          <div style={{ background: "#fff", padding: "14px 18px 6px", display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, color: "#0F172A" }}>
            <span>9:41</span>
            <span style={{ fontSize: 9 }}>●●●  WiFi  🔋</span>
          </div>

          <div style={{ padding: "6px 14px 16px" }}>
            {/* App header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, background: "var(--green-light)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔔</div>
              <span style={{ fontWeight: 800, fontSize: 13, color: "#0F172A" }}>{lang === "ar" ? "بدالي" : "Badaly"}</span>
              <div style={{ width: 28, height: 28, background: "#F1F5F9", borderRadius: 8 }} />
            </div>

            {/* Search */}
            <div style={{ background: "#F1F5F9", borderRadius: 10, padding: "7px 10px", marginBottom: 10, fontSize: 9, color: "#94A3B8", display: "flex", alignItems: "center", gap: 5 }}>
              <span>🔍</span> <span>{t.hero.appSearch}</span>
            </div>

            {/* Quick actions */}
            <div style={{ display: "flex", gap: 7, marginBottom: 12 }}>
              <div style={{ flex: 1, background: "linear-gradient(135deg,#10B981,#059669)", borderRadius: 12, padding: "9px 6px", textAlign: "center", color: "#fff", fontSize: 9, fontWeight: 700 }}>
                📞 {t.hero.appQuick}
              </div>
              <div style={{ flex: 1, background: "#0F172A", borderRadius: 12, padding: "9px 6px", textAlign: "center", color: "#fff", fontSize: 9, fontWeight: 700 }}>
                📅 {t.hero.appSchedule}
              </div>
            </div>

            {/* Active call card */}
            <div style={{
              background: "linear-gradient(135deg,#10B981 0%,#059669 100%)",
              borderRadius: 16, padding: "12px 14px", marginBottom: 12, color: "#fff",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, background: "rgba(255,255,255,.08)", borderRadius: "50%" }} />
              <div style={{ fontSize: 8, opacity: .8, marginBottom: 2 }}>{t.hero.appWaiting}</div>
              <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 8 }}>{t.hero.appService}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="pulse-dot" style={{ width: 7, height: 7 }} />
                <span style={{ fontSize: 8, opacity: .9 }}>{t.hero.appStatus}</span>
              </div>
            </div>

            {/* Services label */}
            <div style={{ fontSize: 9, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>{t.hero.appFrequent}</div>

            {/* Services grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
              {["📱", "🏦", "⚡", "🏥", "🚌", "💧", "📺", "🌐"].map((ic, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 10, padding: "8px 4px",
                  textAlign: "center", fontSize: 16,
                  boxShadow: "0 1px 6px rgba(0,0,0,.07)",
                }}>
                  {ic}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom nav */}
          <div style={{
            display: "flex", justifyContent: "space-around", padding: "10px 10px 14px",
            borderTop: "1px solid #E2E8F0", background: "#fff", marginTop: 4,
          }}>
            {["🏠","📋","📞"].map((ic, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: i === 2 ? 18 : 14, opacity: i === 0 ? 1 : .4 }}>
                {ic}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function BadalyLanding() {
  const [lang, setLang] = useState("ar");
  const t = CONTENT[lang];
  useReveal();

  // Re-run reveal when lang changes
  useEffect(() => {
    setTimeout(() => {
      const els = document.querySelectorAll(".reveal");
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
        { threshold: 0.12 }
      );
      els.forEach((el) => { el.classList.remove("visible"); obs.observe(el); });
      return () => obs.disconnect();
    }, 100);
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === "ar" ? "en" : "ar"));

  return (
    <div dir={t.dir} style={{ fontFamily: "'Cairo', sans-serif", color: "var(--dark)", overflowX: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── NAVBAR ─────────────────────────── */}
      <nav className="glass nav-container" style={{
        position: "sticky", top: 0, zIndex: 100,
        padding: "14px 5vw", display: "flex",
        justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid rgba(16,185,129,.15)",
        boxShadow: "0 4px 24px rgba(0,0,0,.06)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="logo-icon" style={{
            width: 40, height: 40, background: "linear-gradient(135deg,#10B981,#059669)",
            borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, color: "#fff", fontWeight: 900,
            boxShadow: "0 4px 12px rgba(16,185,129,.4)",
          }}>
            📞
          </div>
          <span className="logo-text" style={{ fontWeight: 900, fontSize: 22, color: "var(--dark)", letterSpacing: lang === "en" ? "-.5px" : 0 }}>
            {t.nav.logo}
          </span>
        </div>

        {/* Nav links (Hidden on mobile via desktop-only class) */}
        <div className="nav-links desktop-only" style={{ display: "flex", gap: 32, fontSize: 14, fontWeight: 600, color: "var(--slate)" }}>
          {t.nav.links?.map((l) => (
            <span key={l} style={{ cursor: "pointer", transition: "color .2s" }}
              onMouseEnter={(e) => (e.target.style.color = "var(--green)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--slate)")}>
              {l}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn-outline nav-action-btn" onClick={toggleLang} style={{ padding: "8px 16px", fontSize: 13 }}>
            🌐 {t.nav.langToggle}
          </button>
          <button className="btn-primary nav-action-btn" style={{ padding: "10px 22px", fontSize: 14 }}>
            <span style={{ position: "relative", zIndex: 1 }}>{t.nav.download}</span>
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────── */}
      <section style={{
        minHeight: "92vh", display: "flex", alignItems: "center",
        padding: "80px 5vw 60px",
        background: "linear-gradient(150deg, #fff 0%, var(--green-light) 40%, #fff 80%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background orbs */}
        <div style={{
          position: "absolute", top: -100, right: lang === "ar" ? "auto" : -100, left: lang === "ar" ? -100 : "auto",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(16,185,129,.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -80, right: lang === "ar" ? -80 : "auto", left: lang === "ar" ? "auto" : -80,
          width: 380, height: 380,
          background: "radial-gradient(circle, rgba(52,211,153,.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="hero-grid" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 60, alignItems: "center", width: "100%", maxWidth: 1200, margin: "0 auto",
        }}>
          {/* Text side */}
          <div style={{ animation: "fadeUp .8s ease forwards" }}>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--green-light)", color: "var(--green-dark)",
              border: "1.5px solid var(--green-mid)", borderRadius: 100,
              padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 28,
            }}>
              {t.hero.badge}
            </div>

            {/* Headline */}
            <h1 className="hero-headline" style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: 16, color: "var(--dark)" }}>
              <span className="gradient-text">{t.hero.headline}</span>
              <br />
              {t.hero.headlineLine2}
            </h1>

            {/* Sub-headline (Egyptian dialect) */}
            <p style={{
              fontSize: "clamp(1rem, 2.5vw, 1.4rem)", fontWeight: 700,
              color: "var(--green-dark)", marginBottom: 20,
              padding: "10px 18px", background: "rgba(16,185,129,.08)",
              borderRadius: 12, display: "inline-block",
              borderRight: lang === "ar" ? "4px solid var(--green)" : "none",
              borderLeft: lang === "en" ? "4px solid var(--green)" : "none",
            }}>
              {t.hero.sub}
            </p>

            <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.8, marginBottom: 36, maxWidth: 480 }}>
              {t.hero.desc}
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <button 
                className="btn-primary" 
                style={{ fontSize: 16, padding: "16px 36px", borderRadius: 18 }} 
                aria-label={t.hero.cta}
                onClick={() => {
                  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
                  if (isMobile) {
                    window.location.href = 'new for pwa/badaly.html';
                  } else {
                    window.location.href = 'badaly-demo (2).html';
                  }
                }}
              >
                <span style={{ position: "relative", zIndex: 1 }}>🚀 {t.hero.cta}</span>
              </button>
              <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
                📲 {t.hero.ctaSub}
              </div>
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 36 }}>
              <div style={{ display: "flex" }}>
                {["#10B981","#059669","#34D399","#6EE7B7"].map((c, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: "50%", background: c,
                    border: "2px solid #fff", marginLeft: i > 0 ? -10 : 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 12, fontWeight: 700,
                  }}>
                    {["م","ا","ح","ك"][i]}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>
                <strong style={{ color: "var(--dark)" }}>+10,000</strong>{" "}
                {lang === "ar" ? "مستخدم بيثق في بدالي" : "users trust Badaly"}
              </div>
            </div>
          </div>

          {/* Phone mockup side */}
          <div className="hero-phone" style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            animation: "fadeUp 1s ease .2s both",
          }}>
            <div style={{ position: "relative" }}>
              {/* Floating tag */}
              <div style={{
                position: "absolute", top: -20, right: lang === "ar" ? -30 : "auto", left: lang === "en" ? -30 : "auto",
                background: "#fff", borderRadius: 14, padding: "8px 14px",
                boxShadow: "0 8px 24px rgba(0,0,0,.12)", fontSize: 12, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 6, zIndex: 10,
                animation: "fadeUp 1s ease .6s both",
              }}>
                <span className="pulse-dot" /> {lang === "ar" ? "جاري الانتظار عنك" : "Waiting for you"}
              </div>
              {/* Alert tag */}
              <div style={{
                position: "absolute", bottom: 60, left: lang === "ar" ? -40 : "auto", right: lang === "en" ? -40 : "auto",
                background: "var(--dark)", color: "#fff", borderRadius: 14, padding: "8px 14px",
                boxShadow: "0 8px 24px rgba(0,0,0,.3)", fontSize: 12, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 6, zIndex: 10,
                animation: "fadeUp 1s ease .8s both",
              }}>
                🔔 {lang === "ar" ? "رد عليك! جاهز تكمل؟" : "Human answered! Ready?"}
              </div>
              <PhoneMockup t={t} lang={lang} />
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ─────────────────────────── */}
      <div style={{ background: "var(--green)", padding: "14px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 0 }}>
          <div className="ticker" style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
            {Array(6).fill(null).map((_, i) => (
              <span key={i} style={{ display: "flex", gap: 40 }}>
                <span>⏱️ {lang === "ar" ? "وفّر وقتك" : "Save Your Time"}</span>
                <span>•</span>
                <span>🤖 {lang === "ar" ? "ذكاء اصطناعي" : "AI Powered"}</span>
                <span>•</span>
                <span>🔒 {lang === "ar" ? "صفر تخزين" : "Zero Storage"}</span>
                <span>•</span>
                <span>📡 {lang === "ar" ? "مراقبة ذكية في الخلفية" : "Smart Background Monitoring"}</span>
                <span>•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── PAIN POINT ─────────────────────── */}
      <section style={{ padding: "100px 5vw", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Header */}
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{
              display: "inline-block", background: "#FEF2F2", color: "#DC2626",
              border: "1.5px solid #FECACA", borderRadius: 100, padding: "5px 16px",
              fontSize: 13, fontWeight: 700, marginBottom: 16,
            }}>
              😤 {t.pain.badge}
            </div>
            <h2 className="section-title" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.2, marginBottom: 16 }}>
              {t.pain.title}{" "}
              <span className="gradient-text">{t.pain.titleAccent}</span>
            </h2>
            <p style={{ fontSize: 17, color: "var(--muted)", maxWidth: 540, margin: "0 auto" }}>
              {t.pain.sub}
            </p>
          </div>

          {/* Pain cards */}
          <div className="pain-grid reveal" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {t.pain.items.map((item, i) => (
              <div key={i} style={{
                background: "var(--surface)", borderRadius: 24, padding: "36px 32px",
                border: "1.5px solid var(--border)", textAlign: "center",
                transition: "all .3s ease",
                animationDelay: `${i * .15}s`,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.borderColor = "#FECACA"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>{item.icon}</div>
                <div style={{
                  display: "inline-block", background: "#FEF2F2", color: "#DC2626",
                  borderRadius: 100, padding: "3px 12px", fontSize: 12, fontWeight: 800, marginBottom: 12,
                }}>
                  {item.stat}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: "var(--dark)" }}>{item.title}</h3>
                <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 14 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────── */}
      <section style={{ padding: "100px 5vw", background: "var(--green-light)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{
              display: "inline-block", background: "var(--green)", color: "#fff",
              borderRadius: 100, padding: "5px 16px", fontSize: 13, fontWeight: 700, marginBottom: 16,
            }}>
              ✨ {t.how.badge}
            </div>
            <h2 className="section-title" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.2, marginBottom: 12 }}>
              <span className="gradient-text">{t.how.title}</span>{" "}{t.how.titleAccent}
            </h2>
            <p style={{ fontSize: 17, color: "var(--muted)" }}>{t.how.sub}</p>
          </div>

          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
            {t.how.steps.map((step, i) => (
              <div key={i} className="reveal" style={{
                background: "#fff", borderRadius: 28, padding: "36px 28px",
                border: "1.5px solid rgba(16,185,129,.2)",
                position: "relative", overflow: "hidden",
                animationDelay: `${i * .2}s`,
                boxShadow: "0 4px 20px rgba(16,185,129,.1)",
              }}>
                {/* Step number watermark */}
                <div style={{
                  position: "absolute", top: -10, right: lang === "ar" ? -10 : "auto", left: lang === "en" ? -10 : "auto",
                  fontSize: 80, fontWeight: 900, color: "rgba(16,185,129,.07)",
                  fontFamily: "'Syne', sans-serif", lineHeight: 1,
                  pointerEvents: "none",
                }}>
                  {step.num}
                </div>

                {/* Icon circle */}
                <div style={{
                  width: 64, height: 64,
                  background: "linear-gradient(135deg,#10B981,#059669)",
                  borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, marginBottom: 20,
                  boxShadow: "0 8px 20px rgba(16,185,129,.35)",
                }}>
                  {step.icon}
                </div>

                {/* Step number badge */}
                <div style={{
                  display: "inline-block", background: "var(--green-light)", color: "var(--green-dark)",
                  borderRadius: 8, padding: "2px 10px", fontSize: 11, fontWeight: 800, marginBottom: 12,
                }}>
                  {lang === "ar" ? "الخطوة" : "Step"} {step.num}
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: "var(--dark)" }}>{step.title}</h3>
                <p style={{ color: "var(--muted)", lineHeight: 1.75, fontSize: 14 }}>{step.desc}</p>

                {/* Connector arrow (not on last) */}
                {i < 2 && (
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    right: lang === "ar" ? "auto" : -20,
                    left: lang === "ar" ? -20 : "auto",
                    transform: "translateY(-50%)",
                    fontSize: 22, color: "var(--green)",
                    zIndex: 10,
                    display: window.innerWidth > 768 ? "block" : "none",
                  }}>
                    {lang === "ar" ? "←" : "→"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ─────────────────── */}
      <section style={{ padding: "100px 5vw", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{
              display: "inline-block", background: "var(--green-light)", color: "var(--green-dark)",
              border: "1.5px solid var(--green-mid)", borderRadius: 100, padding: "5px 16px",
              fontSize: 13, fontWeight: 700, marginBottom: 16,
            }}>
              ⚡ {t.features.badge}
            </div>
            <h2 className="section-title" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900 }}>
              {t.features.title}
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="bento-grid reveal" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "auto auto", gap: 20 }}>
            {/* Big card 1 - Offline */}
            <div className="bento-card noise-bg" style={{
              gridColumn: "span 2", gridRow: "span 1",
              background: "linear-gradient(135deg, var(--dark) 0%, #1E293B 100%)",
              color: "#fff",
            }}>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={{ fontSize: 48 }}>{t.features.items[0].emoji}</div>
                  <div style={{
                    background: "var(--green)", color: "#fff",
                    borderRadius: 100, padding: "4px 14px", fontSize: 11, fontWeight: 800,
                  }}>
                    {t.features.items[0].tag}
                  </div>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, color: "#fff" }}>
                  {t.features.items[0].title}
                </h3>
                <p style={{ color: "rgba(255,255,255,.65)", lineHeight: 1.75, fontSize: 15 }}>
                  {t.features.items[0].desc}
                </p>
                {/* Signal bars decoration */}
                <div style={{ display: "flex", gap: 4, alignItems: "flex-end", marginTop: 20 }}>
                  {[16, 24, 32, 40].map((h, i) => (
                    <div key={i} style={{
                      width: 8, height: h, borderRadius: 4,
                      background: i < 2 ? "rgba(255,255,255,.2)" : "var(--green)",
                    }} />
                  ))}
                  <span style={{ fontSize: 11, color: "var(--green)", marginLeft: 10, fontWeight: 700 }}>
                    {lang === "ar" ? "شبكة بدالي الخاصة" : "Badaly's own network"}
                  </span>
                </div>
              </div>
            </div>

            {/* Normal card 1 - IVR */}
            <div className="bento-card">
              <div style={{ fontSize: 40, marginBottom: 16 }}>{t.features.items[1].emoji}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{t.features.items[1].title}</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 14 }}>{t.features.items[1].desc}</p>
              {/* IVR mini diagram */}
              <div style={{ marginTop: 16, display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: "var(--green)", fontWeight: 700 }}>
                <span style={{ background: "var(--green-light)", padding: "3px 8px", borderRadius: 6 }}>1</span>
                <span>→</span>
                <span style={{ background: "var(--green-light)", padding: "3px 8px", borderRadius: 6 }}>3</span>
                <span>→</span>
                <span style={{ background: "var(--green)", color: "#fff", padding: "3px 8px", borderRadius: 6 }}>✓</span>
              </div>
            </div>

            {/* Normal card 2 - Schedule */}
            <div className="bento-card">
              <div style={{ fontSize: 40, marginBottom: 16 }}>{t.features.items[2].emoji}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{t.features.items[2].title}</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 14 }}>{t.features.items[2].desc}</p>
              {/* Mini calendar */}
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4 }}>
                {[9,10,11,12,13].map((d, i) => (
                  <div key={i} style={{
                    background: i === 2 ? "var(--green)" : "var(--green-light)",
                    color: i === 2 ? "#fff" : "var(--green-dark)",
                    borderRadius: 8, padding: "4px 0", textAlign: "center",
                    fontSize: 11, fontWeight: 700,
                  }}>{d}</div>
                ))}
              </div>
            </div>

            {/* Big card 2 - Privacy */}
            <div className="bento-card" style={{
              gridColumn: "span 2",
              background: "linear-gradient(135deg, var(--green-light) 0%, rgba(167,243,208,.3) 100%)",
              border: "1.5px solid var(--green-mid)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ fontSize: 48 }}>{t.features.items[3].emoji}</div>
                <div style={{
                  background: "var(--dark)", color: "#fff",
                  borderRadius: 100, padding: "4px 14px", fontSize: 11, fontWeight: 800,
                }}>
                  {t.features.items[3].tag}
                </div>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, color: "var(--dark)" }}>
                {t.features.items[3].title}
              </h3>
              <p style={{ color: "var(--slate)", lineHeight: 1.75, fontSize: 15 }}>
                {t.features.items[3].desc}
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
                {["🔐", "🛡️", "🚫"].map((ic, i) => (
                  <div key={i} style={{
                    background: "#fff", borderRadius: 10, padding: "6px 12px",
                    fontSize: 13, fontWeight: 700, color: "var(--dark)",
                    boxShadow: "0 2px 8px rgba(0,0,0,.08)",
                  }}>
                    {ic} {["E2E Encrypted", "No Storage", "No Recording"][i]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST & SECURITY ───────────────── */}
      <section style={{
        padding: "100px 5vw",
        background: "linear-gradient(135deg, var(--dark) 0%, #1E293B 100%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: -100, right: lang === "ar" ? "auto" : -100, left: lang === "ar" ? -100 : "auto",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(16,185,129,.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -80, right: lang === "ar" ? -80 : "auto", left: lang === "ar" ? "auto" : -80,
          width: 300, height: 300,
          background: "radial-gradient(circle, rgba(52,211,153,.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="reveal">
            <div style={{
              display: "inline-block", background: "rgba(16,185,129,.2)", color: "var(--green-mid)",
              border: "1.5px solid rgba(16,185,129,.3)", borderRadius: 100, padding: "5px 16px",
              fontSize: 13, fontWeight: 700, marginBottom: 24,
            }}>
              🔐 {t.trust.badge}
            </div>

            {/* Big shield icon */}
            <div style={{
              width: 100, height: 100,
              background: "linear-gradient(135deg, var(--green), var(--green-dark))",
              borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 50, margin: "0 auto 28px",
              boxShadow: "0 12px 40px rgba(16,185,129,.4)",
            }}>
              🛡️
            </div>

            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 8, lineHeight: 1.2 }}>
              {t.trust.title}{" "}
              <span style={{ color: "var(--green)" }}>{t.trust.titleAccent}</span>
            </h2>
            <p style={{ fontSize: 18, color: "var(--green)", fontWeight: 700, marginBottom: 20 }}>
              {t.trust.sub}
            </p>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.65)", lineHeight: 1.8, maxWidth: 600, margin: "0 auto 40px" }}>
              {t.trust.desc}
            </p>

            {/* Trust items */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
              {t.trust.items.map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.25)",
                  borderRadius: 12, padding: "10px 18px",
                  color: "var(--green-mid)", fontSize: 14, fontWeight: 600,
                }}>
                  <span style={{ color: "var(--green)", fontSize: 16 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD ───────────────────────── */}
      <section style={{ padding: "100px 5vw", background: "var(--green-light)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div className="reveal">
            <div style={{
              display: "inline-block", background: "var(--green)", color: "#fff",
              borderRadius: 100, padding: "5px 16px", fontSize: 13, fontWeight: 700, marginBottom: 24,
            }}>
              📲 {t.download.badge}
            </div>

            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.2, marginBottom: 8 }}>
              {t.download.title}
              <br />
              <span className="gradient-text">{t.download.titleAccent}</span>
            </h2>
            <p style={{ fontSize: 17, color: "var(--muted)", marginBottom: 48 }}>{t.download.sub}</p>

            {/* Store badges */}
            <div className="store-badges" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a className="store-badge" aria-label="Download on App Store">
                <span style={{ fontSize: 28 }}>🍎</span>
                <div>
                  <div style={{ fontSize: 10, opacity: .6 }}>Download on the</div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>App Store</div>
                </div>
              </a>
              <a className="store-badge" aria-label="Get it on Google Play">
                <span style={{ fontSize: 28 }}>🤖</span>
                <div>
                  <div style={{ fontSize: 10, opacity: .6 }}>Get it on</div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>Google Play</div>
                </div>
              </a>
              <a className="store-badge" aria-label="Explore it on AppGallery">
                <span style={{ fontSize: 28 }}>📱</span>
                <div>
                  <div style={{ fontSize: 10, opacity: .6 }}>Explore it on</div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>AppGallery</div>
                </div>
              </a>
            </div>

            {/* QR hint */}
            <p style={{ marginTop: 28, fontSize: 13, color: "var(--muted)" }}>
              {lang === "ar" ? "أو امسح QR Code لتحميل التطبيق مباشرة" : "Or scan the QR code to download directly"}
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────── */}
      <footer style={{
        background: "var(--dark)", color: "rgba(255,255,255,.6)",
        padding: "48px 5vw 32px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24, marginBottom: 40 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, background: "linear-gradient(135deg,#10B981,#059669)",
                borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>📞</div>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>{t.nav.logo}</span>
            </div>
            {/* Links */}
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {t.footer.links.map((link) => (
                <a key={link} style={{ color: "rgba(255,255,255,.5)", fontSize: 14, cursor: "pointer", textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--green)")}
                  onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,.5)")}>
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 28, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 13 }}>
            <p style={{ color: "rgba(255,255,255,.4)" }}>
              © 2025 Badaly. {lang === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </p>
            <p style={{ color: "var(--green)", fontWeight: 700 }}>{t.footer.tagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
