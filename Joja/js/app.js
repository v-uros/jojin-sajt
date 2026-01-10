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
    items: ["Akumulatori", "Anlaser", "Alternator", "Osigurači i releji", "Kablovi/kleme", "Senzori (osnovni)"],
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
    id: "ogibljenje",
    title: "Ogibljenje i upravljanje",
    badge: "Stabilnost",
    desc: "Delovi koji utiču na stabilnost i udobnost.",
    items: ["Amortizeri", "Opruge", "Kugle i sponice", "Viljuške/rame", "Krajnice", "Stabilizator (spone/gumice)"],
  },
  {
    id: "hladjenje",
    title: "Hlađenje i termika",
    badge: "Temperatura",
    desc: "Najčešći delovi rashladnog sistema.",
    items: ["Antifriz", "Termostat", "Vodena pumpa", "Creva rashladnog sistema", "Ekspanziona posuda (po potrebi)", "Čepovi i sitni delovi"],
  },
  {
    id: "svecice-kai",
    title: "Paljenje i kaiševi",
    badge: "Start & rad",
    desc: "Za redovan servis i ispravan rad motora.",
    items: ["Svećice", "Kaiševi (pomoćni/PK)", "Zatezači/roleri (osnovno)", "Bobine (po upitu)", "Setovi za mali servis", "Sitan potrošni materijal"],
  },
  {
    id: "oprema",
    title: "Auto-oprema i nega",
    badge: "Dodatno",
    desc: "Praktična oprema i hemija za auto.",
    items: ["Sredstva za pranje i detailing", "Mirisi", "Punjači i kablovi", "Setovi prve pomoći (po propisu)", "Kablovi za startovanje", "Brisači/krpe i osnovna galanterija"],
  },
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

function requireEl(el, name) {
  if (!el) throw new Error(`Missing required element: ${name}`);
  return el;
}

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
  requireEl(modal, "#modal");
  requireEl(modalTitle, "#modalTitle");
  requireEl(modalDesc, "#modalDesc");
  requireEl(modalList, "#modalList");
  requireEl(modalClose, "#modalClose");

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
    // “Old browser” fallback: minimal behavior
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
  for (const cat of categories) {
    frag.appendChild(createCard(cat));
  }
  elGrid.appendChild(frag);

  // Event delegation (manje listener-a)
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

  // Klik na backdrop zatvara (robustnije od rect matematike)
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

    if (name.length < 2) {
      setFormError("Popuni ime (min 2 slova).");
      return;
    }
    if (msg.length < 10) {
      setFormError("Popuni poruku (min 10 karaktera).");
      return;
    }

    const phone = phoneRaw ? normalizePhone(phoneRaw) : "-";

    const subject = encodeURIComponent("Upit za auto-delove");
    const body = encodeURIComponent(`Ime: ${name}\nTelefon: ${phone}\n\nPoruka:\n${msg}\n`);

    // Koristi assign (jasnije), sve vrednosti su encodeURIComponent
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
      const id = link.getAttribute("href");
      if (!id) return null;
      const sec = document.querySelector(id);
      return sec ? { id, el: sec } : null;
    })
    .filter(Boolean);

  function setActiveLink(hash) {
    navLinks.forEach((l) => {
      l.classList.toggle("active", l.getAttribute("href") === hash);
    });
  }

  function clearActiveLinks() {
  navLinks.forEach((l) => l.classList.remove("active"));
}


  // Klik na navigaciju -> smooth scroll + highlight + active link
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
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

  // ScrollSpy: aktivan link prema sekciji u viewport-u
  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((en) => en.isIntersecting);
        if (!visible.length) return;

        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if ((window.scrollY || 0) < 10) {
        clearActiveLinks
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

  const initialHash = window.location.hash;
  const known = navLinks.some((l) => l.getAttribute("href") === initialHash);

  clearActiveLinks();
  if (known) setActiveLink(initialHash);
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
initContactForm();
initNavigation();
initAutoHideHeader();
