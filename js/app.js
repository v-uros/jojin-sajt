const categories = [
  {
    id: "kocnice",
    title: "Kočioni sistem",
    badge: "Bezbednost",
    desc: "Najtraženiji kočioni delovi i potrošni materijal.",
    items: [
      "Kočione pločice/pakne",
      "Kočioni diskovi",
      "Kočione čeljusti (klješta)",
      "Senzori habanja",
      "Kočiona tečnost",
      "Creva i setovi za servis",
    ],
  },
  {
    id: "ulja-filteri",
    title: "Ulja i filteri",
    badge: "Servis",
    desc: "Sve za redovan servis i održavanje.",
    items: [
      "Motorna ulja",
      "Uljni filter",
      "Filter vazduha",
      "Filter kabine",
      "Filter goriva",
      "Aditivi i potrošni materijal",
    ],
  },
  {
    id: "elektrika",
    title: "Akumulatori i elektrika",
    badge: "Start & punjenje",
    desc: "Osnovne električne komponente i potrošni delovi.",
    items: [
      "Akumulatori",
      "Anlaser",
      "Alternator",
      "Osigurači i releji",
      "Kablovi/kleme",
      "Senzori (osnovni)",
    ],
  },
  {
    id: "rasveta",
    title: "Rasveta i vidljivost",
    badge: "Vidljivost",
    desc: "Sijalice, brisači i tečnosti za stakla.",
    items: [
      "Sijalice (halogene/LED gde je kompatibilno)",
      "Poziciona/stop svetla",
      "Brisači",
      "Pumpa tečnosti za pranje",
      "Tečnost za stakla",
      "Metlice i adapteri",
    ],
  },
  {
    id: "vešanje",
    title: "Vešanje i upravljanje",
    badge: "Stabilnost",
    desc: "Delovi koji utiču na stabilnost i udobnost.",
    items: [
      "Amortizeri",
      "Opruge",
      "Kugle i sponice",
      "Viljuške/rame",
      "Krajnice",
      "Stabilizator (spone/gumice)",
    ],
  },
  {
    id: "hladjenje",
    title: "Hlađenje i termika",
    badge: "Temperatura",
    desc: "Najčešći delovi rashladnog sistema.",
    items: [
      "Antifriz",
      "Termostat",
      "Vodena pumpa",
      "Creva rashladnog sistema",
      "Ekspanziona posuda (po potrebi)",
      "Čepovi i sitni delovi",
    ],
  },
  // {
  //   id: "svecice-kai",
  //   title: "Paljenje i kaiševi",
  //   badge: "Start & rad",
  //   desc: "Za redovan servis i ispravan rad motora.",
  //   items: [
  //     "Svećice",
  //     "Kaiševi (pomoćni/PK)",
  //     "Zatezači/roleri (osnovno)",
  //     "Bobine (po upitu)",
  //     "Setovi za mali servis",
  //     "Sitan potrošni materijal",
  //   ],
  // },
  // {
  //   id: "oprema",
  //   title: "Auto-oprema i nega",
  //   badge: "Dodatno",
  //   desc: "Praktična oprema i hemija za auto.",
  //   items: [
  //     "Sredstva za pranje i detailing",
  //     "Mirisi",
  //     "Punjači i kablovi",
  //     "Setovi prve pomoći (po propisu)",
  //     "Kablovi za startovanje",
  //     "Brisači/krpe i osnovna galanterija",
  //   ],
  // },
];

function getPrefersReducedMotion() {
  if (!("matchMedia" in window)) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const prefersReducedMotion = getPrefersReducedMotion();

const elGrid = document.getElementById("kategorije");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalList = document.getElementById("modalList");
const modalClose = document.getElementById("modalClose");
const modalOk = document.getElementById("modalOk");

const form = document.getElementById("upitForm");
const formError = document.getElementById("formError");

const headerEl = document.querySelector(".site-header");

const categoriesById = new Map(categories.map((c) => [c.id, c]));
let lastActiveElement = null;

function setFormError(message) {
  if (!formError) return;
  if (!message) {
    formError.textContent = "";
    formError.hidden = true;
    return;
  }
  formError.textContent = message;
  formError.hidden = false;
}

function clearList(el) {
  if (!el) return;
  while (el.firstChild) el.removeChild(el.firstChild);
}

function createCard(cat) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.setAttribute("aria-haspopup", "dialog");
  card.dataset.id = cat.id;

  const top = document.createElement("div");
  top.className = "card-top";

  const h = document.createElement("h3");
  h.className = "card-title";
  h.textContent = cat.title;

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = cat.badge;

  const meta = document.createElement("p");
  meta.className = "card-meta";
  meta.textContent = cat.desc;

  top.appendChild(h);
  top.appendChild(badge);
  card.appendChild(top);
  card.appendChild(meta);

  return card;
}

function openModal(cat) {
  if (!modal || !modalTitle || !modalDesc || !modalList || !modalClose) return;

  lastActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  modalTitle.textContent = cat.title;
  modalDesc.textContent = cat.desc;

  clearList(modalList);

  for (const item of cat.items) {
    const chip = document.createElement("div");
    chip.className = "modal-chip";
    chip.setAttribute("role", "listitem");
    chip.textContent = item;
    modalList.appendChild(chip);
  }

  if (typeof modal.showModal === "function") {
    modal.showModal();
    modalClose.focus();
  } else {
    window.alert(`${cat.title}\n\n- ${cat.items.join("\n- ")}`);
  }
}

function closeModal() {
  if (!modal) return;
  if (modal.open) modal.close();

  if (lastActiveElement && typeof lastActiveElement.focus === "function") {
    lastActiveElement.focus();
  }
}

function initCategories() {
  if (!elGrid) return;

  const frag = document.createDocumentFragment();
  for (const cat of categories) frag.appendChild(createCard(cat));
  elGrid.appendChild(frag);

  // Event delegation
  elGrid.addEventListener("click", (e) => {
    const btn = e.target instanceof Element ? e.target.closest(".card") : null;
    if (!btn) return;

    const id = btn.getAttribute("data-id");
    if (!id) return;

    const cat = categoriesById.get(id);
    if (!cat) return;

    openModal(cat);
  });

  // Stagger animacija kartica
  if (!prefersReducedMotion) {
    const cards = Array.from(elGrid.querySelectorAll(".card"));
    cards.forEach((c, i) => {
      c.classList.add("card-animate");
      c.style.animationDelay = `${70 * i}ms`;
    });
  }
}

function initModal() {
  if (!modal || !modalClose || !modalOk) return;

  modalClose.addEventListener("click", closeModal);
  modalOk.addEventListener("click", closeModal);

  // Klik na backdrop
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC (cancel) -> vrati fokus
  modal.addEventListener("cancel", () => {
    window.setTimeout(() => {
      if (lastActiveElement && typeof lastActiveElement.focus === "function") lastActiveElement.focus();
    }, 0);
  });
}

function initYear() {
  const yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = String(new Date().getFullYear());
}

function initRevealContacts() {
  const nodes = Array.from(document.querySelectorAll("[data-reveal][data-value]"));
  if (!nodes.length) return;

  function decode(v) {
    return String(v).split("").reverse().join("");
  }

  function formatPhone(raw) {
    const v = String(raw).replace(/\s+/g, "");
    // Minimalno formatiranje za +381601234567 -> +381 60 123 4567
    if (v.startsWith("+381") && v.length === 12) {
      return `+381 ${v.slice(4, 6)} ${v.slice(6, 9)} ${v.slice(9)}`;
    }
    if (v.startsWith("381") && v.length === 11) {
      return `+381 ${v.slice(3, 5)} ${v.slice(5, 8)} ${v.slice(8)}`;
    }
    return raw;
  }

  function replaceWithLink(el, href, text, className) {
    const a = document.createElement("a");
    a.className = className || "link";
    a.href = href;
    a.textContent = text;
    a.rel = "nofollow";
    el.replaceWith(a);
    return a;
  }

  nodes.forEach((el) => {
    el.addEventListener("click", (e) => {
      const type = el.getAttribute("data-reveal");
      const encoded = el.getAttribute("data-value");
      const action = el.getAttribute("data-action") || "show";

      if (!type || !encoded) return;

      e.preventDefault();

      const value = decode(encoded);

      if (type === "phone") {
        const tel = value.startsWith("+") ? value : `+${value}`;
        const text = formatPhone(tel);
        const link = replaceWithLink(el, `tel:${tel}`, text, el.className);

        if (action === "call") {
          window.location.assign(link.href);
        }
        return;
      }

      if (type === "email") {
        const subject = el.getAttribute("data-subject") || "";
        const href = subject
          ? `mailto:${value}?subject=${encodeURIComponent(subject)}`
          : `mailto:${value}`;

        const link = replaceWithLink(el, href, value, el.className);

        if (action === "email") {
          window.location.assign(link.href);
        }
      }
    }, { once: true });
  });
}


function initOpenStatus() {
  const statusWrap = document.getElementById("hoursStatus");
  const statusText = document.getElementById("hoursStatusText");
  if (!statusWrap || !statusText) return;

  const schedule = {
    1: { start: 8 * 60, end: 18 * 60, closeText: "18:00" }, // pon
    2: { start: 8 * 60, end: 18 * 60, closeText: "18:00" }, // uto
    3: { start: 8 * 60, end: 18 * 60, closeText: "18:00" }, // sre
    4: { start: 8 * 60, end: 18 * 60, closeText: "18:00" }, // čet
    5: { start: 8 * 60, end: 18 * 60, closeText: "18:00" }, // pet
    6: { start: 8 * 60, end: 14 * 60, closeText: "14:00" }, // sub
    // 0 (ned) nema
  };

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function fmtHM(totalMin) {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${pad2(h)}:${pad2(m)}`;
  }

  function getNextOpenInfo(now) {
    for (let add = 0; add < 7; add++) {
      const d = new Date(now);
      d.setDate(now.getDate() + add);
      const day = d.getDay();
      const sch = schedule[day];
      if (!sch) continue;

      if (add === 0) return { when: "danas", time: fmtHM(sch.start) };
      if (add === 1) return { when: "sutra", time: fmtHM(sch.start) };
      return { when: "uskoro", time: fmtHM(sch.start) };
    }
    return null;
  }

  function update() {
    const now = new Date();
    const day = now.getDay();
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    const sch = schedule[day];

    let isOpen = false;
    let text = "Zatvoreno";

    if (sch) {
      isOpen = minutesNow >= sch.start && minutesNow < sch.end;
      if (isOpen) {
        text = `Otvoreno • zatvara u ${sch.closeText}`;
      } else {
        const next = getNextOpenInfo(now);
        text = next ? `Zatvoreno • otvara ${next.when} u ${next.time}` : "Zatvoreno";
      }
    } else {
      const next = getNextOpenInfo(now);
      text = next ? `Zatvoreno • otvara ${next.when} u ${next.time}` : "Zatvoreno";
    }

    statusWrap.dataset.open = isOpen ? "true" : "false";
    statusText.textContent = text;
  }

  update();
  window.setInterval(update, 60 * 1000);
}



function normalizePhone(phone) {
  return phone.replace(/[^\d+()\-\s]/g, "").trim();
}

function initContactForm() {
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setFormError("");

    const fd = new FormData(form);

    const name = String(fd.get("name") || "").trim().slice(0, 80);
    const phoneRaw = String(fd.get("phone") || "").trim().slice(0, 40);
    const msg = String(fd.get("message") || "").trim().slice(0, 800);


    // if (name.length < 2) {
    //   setFormError("Popuni ime");
    //   return;
    // }

    if (msg.length < 10) {
      setFormError("Popuni poruku (najmanje 10 karaktera).");
      return;
    }

    const phone = phoneRaw ? normalizePhone(phoneRaw) : "-";
    const subject = encodeURIComponent("Upit za auto-delove");
    const body = encodeURIComponent(`Ime: ${name}\nTelefon: ${phone}\n\nPoruka:\n${msg}\n`);

    window.location.assign(`mailto:prodaja@autodelovinova.rs?subject=${subject}&body=${body}`);
  });
}

/* =========================
   Navigacija + active state
========================= */
function initNavigation() {
  const navLinks = Array.from(document.querySelectorAll(".nav a[href^='#']"));
  if (!navLinks.length) return;

  const sections = navLinks
    .map((link) => {
      const hash = link.getAttribute("href");
      if (!hash) return null;
      const sec = document.querySelector(hash);
      return sec ? { hash, el: sec } : null;
    })
    .filter(Boolean);

  function setActiveLink(hash) {
    navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === hash));
  }

  function clearActiveLinks() {
    navLinks.forEach((l) => l.classList.remove("active"));
  }

  // Klik na nav link -> smooth scroll + highlight + active link
  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const hash = a.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });

      if (!prefersReducedMotion) {
        target.classList.remove("section-focus");
        void target.offsetWidth; // restart animacije
        target.classList.add("section-focus");
        window.setTimeout(() => target.classList.remove("section-focus"), 800);
      }

      setActiveLink(hash);
      history.pushState(null, "", hash);
    });
  });

  // ScrollSpy
  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((en) => en.isIntersecting);
        if (!visible.length) return;

        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if ((window.scrollY || 0) < 10) {
          clearActiveLinks();
          return;
        }

        const top = visible[0];
        setActiveLink(`#${top.target.id}`);
      },
      {
        root: null,
        rootMargin: "-35% 0px -60% 0px",
        threshold: [0.2, 0.35, 0.5, 0.65],
      },
    );

    sections.forEach(({ el }) => observer.observe(el));
  }

  // Init active iz hash-a
  const initialHash = window.location.hash;
  const known = navLinks.some((l) => l.getAttribute("href") === initialHash);
  clearActiveLinks();
  if (known) setActiveLink(initialHash);
}

/* =========================
   Hamburger menu
========================= */
function initHamburgerMenu() {
  const nav = document.getElementById("primaryNav");
  const toggle = document.getElementById("navToggle");
  const overlay = document.getElementById("navOverlay");
  if (!nav || !toggle || !overlay || !headerEl) return;

  const mq = window.matchMedia("(min-width: 760px)");

  const callCta = document.getElementById("callCta");
const ctaHost = document.querySelector(".header-cta");
let navDivider = null;

function moveCtaToNav() {
  if (!callCta) return;

  if (!navDivider) {
    navDivider = document.createElement("div");
    navDivider.className = "nav-divider";
    navDivider.setAttribute("aria-hidden", "true");
  }

  if (!nav.contains(navDivider)) nav.appendChild(navDivider);
  if (!nav.contains(callCta)) nav.appendChild(callCta);

  callCta.classList.add("nav-call");
}

function moveCtaToHeader() {
  if (!callCta || !ctaHost) return;

  callCta.classList.remove("nav-call");
  if (!ctaHost.contains(callCta)) ctaHost.appendChild(callCta);

  if (navDivider && navDivider.parentElement) {
    navDivider.parentElement.removeChild(navDivider);
  }
}


  function setOpen(open) {
    if (mq.matches) open = false;

    headerEl.classList.toggle("nav-open", open);
    document.body.classList.toggle("nav-open", open);

    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Zatvori meni" : "Otvori meni");

    if (open) headerEl.classList.remove("is-hidden");

    if (mq.matches) {
        moveCtaToHeader();
      } else if (open) {
        moveCtaToNav();
      } else {
        moveCtaToHeader();
      }
  }

  toggle.addEventListener("click", () => {
    setOpen(!headerEl.classList.contains("nav-open"));
  });

  overlay.addEventListener("click", () => setOpen(false));

  // Klik na bilo koji link u meniju zatvara (uključujući "Pozovi")
  nav.addEventListener("click", (e) => {
    const a = e.target instanceof Element ? e.target.closest("a") : null;
    if (a) setOpen(false);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  const onChange = () => setOpen(false);
  if (typeof mq.addEventListener === "function") mq.addEventListener("change", onChange);
  else if (typeof mq.addListener === "function") mq.addListener(onChange);
}


/* =========================
   Auto-hide header
========================= */
function initAutoHideHeader() {
  if (!headerEl) return;

  const MIN_Y_TO_HIDE = 100;
  const DELTA = 6;

  let lastY = window.scrollY || 0;
  let ticking = false;

  function update(y) {
    const dy = y - lastY;

    if (y <= MIN_Y_TO_HIDE) {
      headerEl.classList.remove("is-hidden");
      lastY = y;
      return;
    }

    // Ako je meni otvoren, ne krij header
    if (headerEl.classList.contains("nav-open")) {
      headerEl.classList.remove("is-hidden");
      lastY = y;
      return;
    }

    if (dy > DELTA) headerEl.classList.add("is-hidden");
    if (dy < -DELTA) headerEl.classList.remove("is-hidden");

    lastY = y;
  }

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY || 0;
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        update(y);
        ticking = false;
      });
    },
    { passive: true },
  );
}

/* =========================
   Init
========================= */
initCategories();
initModal();
initYear();
initOpenStatus();
initContactForm();
initNavigation();
initHamburgerMenu();
initAutoHideHeader();
initRevealContacts();

