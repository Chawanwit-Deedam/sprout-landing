/* =========================================================
   Sprout — Landing Page interactions (vanilla, dependency-free)
   - Navbar scrolled state
   - Reveal on scroll (IntersectionObserver)
   - Count-up stats (integers + decimals)
   - Dashboard chart bars grow when in view
   - Pricing monthly/yearly toggle
   - FAQ accordion (one open at a time)
   All DOM writes use textContent / classList — no innerHTML, no eval.
   ========================================================= */
"use strict";

(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  /* Footer year */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Navbar scrolled state */
  const nav = document.getElementById("nav");
  const onNavScroll = () => nav && nav.classList.toggle("is-scrolled", window.scrollY > 20);
  onNavScroll();
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { onNavScroll(); ticking = false; });
    },
    { passive: true }
  );

  /* Apply progress widths & chart heights via CSSOM.
     (Values live in data-* attributes so the HTML carries no inline styles,
      keeping the Content Security Policy strict — style-src without 'unsafe-inline'.) */
  document.querySelectorAll("[data-w]").forEach((el) => {
    const w = Number(el.getAttribute("data-w"));
    if (!Number.isNaN(w)) el.style.width = clamp(w, 0, 100) + "%";
  });
  document.querySelectorAll("[data-h]").forEach((el) => {
    const h = Number(el.getAttribute("data-h"));
    if (!Number.isNaN(h)) el.style.setProperty("--h", clamp(h, 0, 100) + "%");
  });

  /* Generic IntersectionObserver helper */
  const observeOnce = (elements, onEnter, options) => {
    if (!("IntersectionObserver" in window)) {
      elements.forEach(onEnter);
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onEnter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, options);
    elements.forEach((el) => io.observe(el));
  };

  /* Reveal on scroll */
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    observeOnce(revealEls, (el) => el.classList.add("is-in"), {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    });
  }

  /* Dashboard chart bars */
  const bars = document.querySelector("[data-bars]");
  if (bars) {
    if (prefersReduced) bars.classList.add("is-in");
    else observeOnce([bars], (el) => el.classList.add("is-in"), { threshold: 0.4 });
  }

  /* Count-up stats */
  const format = (value, decimals) =>
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-US");

  const runCount = (el) => {
    const target = Number(el.getAttribute("data-count")) || 0;
    const decimals = Number(el.getAttribute("data-decimals")) || 0;
    if (prefersReduced) { el.textContent = format(target, decimals); return; }
    const duration = 1500;
    const start = performance.now();
    const tick = (now) => {
      const p = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased, decimals);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  observeOnce(Array.from(document.querySelectorAll("[data-count]")), runCount, { threshold: 0.6 });

  /* Pricing monthly / yearly toggle */
  const billingBtns = Array.from(document.querySelectorAll(".toggle__btn"));
  const amounts = Array.from(document.querySelectorAll(".amount"));
  const setBilling = (mode) => {
    billingBtns.forEach((b) => {
      const active = b.getAttribute("data-billing") === mode;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    amounts.forEach((a) => {
      const val = a.getAttribute(mode === "yearly" ? "data-yearly" : "data-monthly");
      if (val !== null) a.textContent = "฿" + val;
    });
  };
  billingBtns.forEach((b) =>
    b.addEventListener("click", () => setBilling(b.getAttribute("data-billing")))
  );

  /* FAQ accordion — keep only one open at a time */
  const faq = document.querySelector("[data-faq]");
  if (faq) {
    const items = Array.from(faq.querySelectorAll("details"));
    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (item.open) items.forEach((other) => { if (other !== item) other.open = false; });
      });
    });
  }

  /* ---------- Theme toggle (light / dark) ---------- */
  const root = document.documentElement;
  const store = (key, val) => { try { localStorage.setItem(key, val); } catch (e) { /* private mode */ } };
  const themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store("sprout-theme", next);
    });
  }

  /* ---------- Language switch (TH / EN) ---------- */
  const EN = {
    doc_title: "Sprout — Save automatically, let your money grow",
    skip: "Skip to main content",
    aria_theme: "Toggle light / dark mode", aria_lang: "Switch language",
    nav_how: "How it works", nav_features: "Features", nav_pricing: "Pricing", nav_faq: "FAQ",
    nav_login: "Log in", nav_cta: "Get started free",
    hero_pill: "New · AI-powered auto-saving",
    hero_t1: "Save on autopilot,", hero_t2: "watch it ", hero_t3: "grow", hero_t4: " every day",
    hero_sub: "Sprout tucks money away automatically every time you spend. Set your goal once and let it run — save without feeling like you're missing out.",
    hero_cta1: "Get started free", hero_cta2: "See how it works",
    hero_micro: "✓ Free to start, no card required  ·  ✓ Cancel anytime",
    proof_mid: "from", proof_unit: "users",
    ui_label: "Total savings", ui_delta: "▲ 12.4% this month", ui_goal: "Goal: Japan trip",
    toast_a: "Auto-saved", toast_b: "from your coffee",
    trust_label: "Trusted and secured to industry standards",
    problem_eyebrow: "Sound familiar?",
    problem_h2: "You never manage to save — it's not you,\nit's the old way that fights you",
    pain1_h: "Meant to save, forgot again", pain1_p: "By month-end there's never enough left to move into savings, so it keeps getting pushed back.",
    pain2_h: "No idea where money goes", pain2_p: "Coffee here, delivery there — tiny amounts that quietly add up to thousands.",
    pain3_h: "Saving with no goal", pain3_p: "Without a clear picture of what you're saving for, there's no motivation to keep going.",
    turn_a: "Sprout turns saving into", turn_b: "something automatic you don't have to force", turn_c: "— set it once, see results every day",
    how_eyebrow: "Easier than you think", how_h2: "Start saving in 3 minutes",
    step1_h: "Connect your account", step1_p: "Link your bank securely with encryption — we never store your password.",
    step2_h: "Set a goal", step2_p: "How much, by when — Sprout builds your saving plan automatically.",
    step3_h: "Let Sprout work", step3_p: "Every time you spend, we round up and save the change. Just watch it grow.",
    feat_eyebrow: "Why Sprout", feat_h2: "Designed so you\nactually save — without forcing it",
    feat1_h: "Auto-save (round-ups)", feat1_p: "Pay ฿52, we round up and save ฿8 — small amounts that become a lot without noticing.",
    feat2_h: "Goals you can see", feat2_p: "Set visual goals like \"Japan trip\" and watch progress daily — motivation to keep saving.",
    feat3_h: "Bank-level security", feat3_p: "256-bit encryption and 2-factor auth. We can see the balance but never touch your money.",
    feat4_h: "Reports made simple", feat4_p: "Clear charts of your spending and saving — know instantly where your money goes.",
    showcase_eyebrow: "Everything in one place", showcase_h2: "See your whole financial picture\nin one dashboard",
    tick1: "Savings and growth in real time", tick2: "Track multiple goals at once", tick3: "Smart alerts when you go over budget",
    showcase_cta: "Try it free today",
    dash_k1: "Savings", dash_k2: "This month", dash_g1: "First home", dash_g2: "Emergency fund",
    stat1: "Users nationwide", stat2_u: "M", stat2: "Total saved by users", stat3: "Average review score", stat4_u: "min", stat4: "To set up",
    tst_eyebrow: "From real users", tst_h2: "Real savings, from month one",
    q1: "\"This year I saved for a trip for the first time in my life — without feeling like I gave anything up. The round-up saving is brilliant.\"", q1_n: "Mind", q1_r: "Office worker",
    q2: "\"I love setting visual goals. Watching the bar climb every day really makes me want to keep saving.\"", q2_n: "Jay", q2_r: "Freelancer",
    q3: "\"Security is solid — 2-factor auth and the app can't touch my money. I feel safe using it.\"", q3_n: "Ton", q3_r: "Business owner",
    pricing_eyebrow: "Straightforward pricing", pricing_h2: "Start free, upgrade when ready",
    bill_month: "Monthly", bill_year: "Yearly", bill_save: "Save 20%",
    plan_free_d: "Start building the saving habit", plan_free_cta: "Get started free",
    plan_free_f1: "Round-up auto-saving", plan_free_f2: "1 saving goal", plan_free_f3: "Basic reports",
    plan_badge: "Recommended · Best value", plan_plus_d: "For people serious about their goals", plan_trial: "14-day free trial",
    plan_plus_f1: "Unlimited saving goals", plan_plus_f2: "Smart saving that adapts to income", plan_plus_f3: "In-depth reports + budget alerts", plan_plus_f4: "Bonus interest on savings",
    plan_pro_d: "Next-level financial planning", plan_pro_f1: "Everything in Plus", plan_pro_f2: "Automated investing plan", plan_pro_f3: "Personal finance advisor", plan_pro_f4: "Year-end tax summary",
    per: "/mo",
    guarantee: "30-day money-back guarantee · cancel anytime, no strings attached",
    faq_eyebrow: "Still on the fence?", faq_h2: "Frequently asked questions",
    faq1_q: "How safe are my data and money?", faq1_a: "Sprout encrypts your data with 256-bit encryption, uses 2-factor authentication, and connects read-only. We can't transfer or withdraw your money — it always stays in your bank account.",
    faq2_q: "Are there hidden fees?", faq2_a: "No. The Free plan is free forever, and paid plans show prices clearly with no hidden fees — cancel anytime.",
    faq3_q: "Which banks are supported?", faq3_a: "All major Thai banks are supported, with more added continuously. If yours isn't supported yet, let our team know and we'll add it.",
    faq4_q: "How do I cancel?", faq4_a: "Cancel yourself in the app in 2 clicks — no strings attached. Within the first 30 days of a paid plan, we'll refund you in full.",
    cta_h2: "Start saving today\nyour future self will thank you",
    cta_p: "Set up in 3 minutes · free to start, no card · cancel anytime",
    cta_b1: "Create free account", cta_b2: "See plans",
    cta_micro: "Join 120,000+ people already saving with Sprout",
    footer_tag: "Save automatically, let your money grow",
    footer_c1: "Product", footer_c2: "Company", footer_c3: "Legal",
    footer_about: "About us", footer_career: "Careers", footer_help: "Help",
    footer_privacy: "Privacy", footer_terms: "Terms of use",
    footer_note: "This site is a demo — brand, prices and data are fictional examples.",
    footer_built: "Built by Theera",
  };

  const i18nEls = Array.from(document.querySelectorAll("[data-i18n]"));
  const ariaEls = Array.from(document.querySelectorAll("[data-i18n-aria]"));
  const langLabel = document.querySelector("[data-lang-label]");
  // Capture Thai defaults straight from the DOM so we never duplicate them in JS.
  const THAI_TEXT = new Map(i18nEls.map((el) => [el, el.textContent]));
  const THAI_ARIA = new Map(ariaEls.map((el) => [el, el.getAttribute("aria-label")]));
  const THAI_TITLE = document.title;

  const applyLang = (lang) => {
    const en = lang === "en";
    i18nEls.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = en ? EN[key] : THAI_TEXT.get(el);
      if (val != null) el.textContent = val;
    });
    ariaEls.forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      const val = en ? EN[key] : THAI_ARIA.get(el);
      if (val != null) el.setAttribute("aria-label", val);
    });
    document.title = en ? EN.doc_title : THAI_TITLE;
    root.setAttribute("lang", lang);
    if (langLabel) langLabel.textContent = en ? "ไทย" : "EN";
    store("sprout-lang", lang);
  };

  const langBtn = document.querySelector("[data-lang-toggle]");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      applyLang(root.getAttribute("lang") === "en" ? "th" : "en");
    });
  }
  // Sync UI to whatever theme-init.js already chose (localStorage / system).
  applyLang(root.getAttribute("lang") === "en" ? "en" : "th");
})();
