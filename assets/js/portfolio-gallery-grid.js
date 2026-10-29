/**
 * Portfolio 4-Column Gallery Grid & Lightbox Controller (Divine Interiors)
 * Renders all 63 (and up to 80 with Swarovski + Tim Hortons) images in an immersive 4-column grid.
 * Provides instant filtering, active hover states, and full-screen lightbox navigation with next/prev arrows,
 * keyboard controls, and touch support.
 */

(function() {
  const ALL_PROJECT_IMAGES = [
    // --- POLO RALPH LAUREN (24 images) ---
    ...Array.from({ length: 24 }, (_, i) => ({
      id: `polo-ralph-lauren-${i + 1}`,
      projectSlug: "polo-ralph-lauren",
      title: "POLO RALPH LAUREN",
      location: "Mall of India, Noida",
      category: "RETAIL",
      src: `./assets/portfolio_new/polo-ralph-lauren_${String(i + 1).padStart(2, '0')}.jpg`,
      alt: `Polo Ralph Lauren Flagship, Mall of India Noida - Photo ${i + 1}`,
      indexInProject: i + 1,
      totalInProject: 24
    })),

    // --- DOMINO'S (12 images) ---
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `dominos-saket-${i + 1}`,
      projectSlug: "dominos-saket",
      title: "DOMINO'S",
      location: "Saket, New Delhi",
      category: "HOSPITALITY",
      src: `./assets/portfolio_new/dominos-saket_${String(i + 1).padStart(2, '0')}.jpg`,
      alt: `Domino's Saket Restaurant - Photo ${i + 1}`,
      indexInProject: i + 1,
      totalInProject: 12
    })),

    // --- MANGO (8 images) ---
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `mango-mumbai-${i + 1}`,
      projectSlug: "mango-mumbai",
      title: "MANGO",
      location: "Phoenix Mall, Mumbai",
      category: "RETAIL",
      src: `./assets/portfolio_new/mango-mumbai_${String(i + 1).padStart(2, '0')}.jpg`,
      alt: `MANGO Flagship Store, Phoenix Mall Mumbai - Photo ${i + 1}`,
      indexInProject: i + 1,
      totalInProject: 8
    })),
    // --- TAJ APARTMENT GAZIPUR (18 images) ---
    ...Array.from({ length: 18 }, (_, i) => ({
      id: `taj-apartment-gazipur-${i + 1}`,
      projectSlug: "taj-apartment-gazipur",
      title: "TAJ APARTMENT",
      location: "Gazipur",
      category: "RESIDENTIAL",
      src: `./assets/portfolio_new/taj-apartment-gazipur_${String(i + 1).padStart(2, '0')}.jpg`,
      alt: `Taj Apartment, Gazipur - Photo ${i + 1}`,
      indexInProject: i + 1,
      totalInProject: 18
    })),

    // --- M3M LUXURY RESIDENCES (8 images) ---
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `residence-m3m-${i + 1}`,
      projectSlug: "residence-m3m",
      title: "M3M LUXURY RESIDENCES",
      location: "Golf Course Ext. Road, Gurugram",
      category: "RESIDENTIAL",
      src: `./assets/portfolio_new/residence-m3m_${String(i + 1).padStart(2, '0')}.jpg`,
      alt: `M3M Luxury Residences, Gurugram - Photo ${i + 1}`,
      indexInProject: i + 1,
      totalInProject: 8
    })),

    // --- ANTONY MORATO (6 images) ---
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `antony-morato-${i + 1}`,
      projectSlug: "antony-morato",
      title: "ANTONY MORATO",
      location: "Mall of India, Noida",
      category: "RETAIL",
      src: `./assets/portfolio_new/antony-morato_${String(i + 1).padStart(2, '0')}.jpg`,
      alt: `Antony Morato Boutique - Photo ${i + 1}`,
      indexInProject: i + 1,
      totalInProject: 6
    })),

    // --- ROSLYN COFFEE (5 images) ---
    ...Array.from({ length: 5 }, (_, i) => ({
      id: `roslyn-cafe-${i + 1}`,
      projectSlug: "roslyn-cafe",
      title: "ROSLYN COFFEE",
      location: "Speciality Coffee, Delhi NCR",
      category: "HOSPITALITY",
      src: `./assets/portfolio_new/roslyn-cafe_${String(i + 1).padStart(2, '0')}.jpg`,
      alt: `Roslyn Coffee Roastery & Cafe - Photo ${i + 1}`,
      indexInProject: i + 1,
      totalInProject: 5
    })),

    // --- SWAROVSKI (8 images) ---
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `swarovski-${i + 1}`,
      projectSlug: "swarovski",
      title: "SWAROVSKI",
      location: "Luxury Crystal Boutique",
      category: "RETAIL",
      src: `./assets/portfolio_new/swarovski_${String(i + 1).padStart(2, '0')}.jpg`,
      alt: `Swarovski Luxury Boutique - Photo ${i + 1}`,
      indexInProject: i + 1,
      totalInProject: 8
    })),

    // --- TIM HORTONS (9 images) ---
    ...Array.from({ length: 9 }, (_, i) => ({
      id: `tim-hortons-sangrur-${i + 1}`,
      projectSlug: "tim-hortons-sangrur",
      title: "TIM HORTONS",
      location: "Sangrur, Punjab",
      category: "HOSPITALITY",
      src: `./assets/portfolio_new/tim-hortons-sangrur_${String(i + 1).padStart(2, '0')}.jpg`,
      alt: `Tim Hortons Cafe, Sangrur Punjab - Photo ${i + 1}`,
      indexInProject: i + 1,
      totalInProject: 9
    }))
  ];

  let currentFilteredList = [...ALL_PROJECT_IMAGES];
  let currentActiveIndex = 0;
  let activeFilterKey = "all";

  // Elements
  let gridContainer = null;
  let counterBadge = null;
  let filterButtons = [];
  let modalEl = null;
  let modalCategoryEl = null;
  let modalTitleEl = null;
  let modalLocEl = null;
  let modalCounterEl = null;
  let modalImgEl = null;
  let modalCloseBtn = null;
  let modalPrevBtn = null;
  let modalNextBtn = null;

  function init() {
    gridContainer = document.getElementById("rs-projects-grid-root");
    if (!gridContainer) return;

    counterBadge = document.getElementById("rs-projects-counter-badge");
    filterButtons = Array.from(document.querySelectorAll("[data-project-filter]"));

    buildLightboxModal();

    const existingCards = gridContainer.querySelectorAll(".rs-project-card");
    if (existingCards.length > 0) {
      bindExistingCards(existingCards);
    } else {
      renderCards(ALL_PROJECT_IMAGES);
    }

    setupFilters();
    checkInitialHash();
  }

  function bindExistingCards(cards) {
    cards.forEach((card) => {
      const cardId = card.getAttribute("data-project-id");
      const item = ALL_PROJECT_IMAGES.find(it => it.id === cardId);
      if (!item) return;

      card.addEventListener("click", () => {
        const itemIdx = currentFilteredList.indexOf(item);
        openLightbox(itemIdx !== -1 ? itemIdx : 0);
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const itemIdx = currentFilteredList.indexOf(item);
          openLightbox(itemIdx !== -1 ? itemIdx : 0);
        }
      });
    });
  }

  function renderCards(images) {
    if (!gridContainer) return;
    gridContainer.innerHTML = "";

    images.forEach((item, globalIdx) => {
      const idxStr = `${String(item.indexInProject).padStart(2, '0')}/${String(item.totalInProject).padStart(2, '0')}`;
      
      const card = document.createElement("article");
      card.className = "rs-project-card";
      card.setAttribute("data-project-id", item.id);
      card.setAttribute("data-project-slug", item.projectSlug);
      card.setAttribute("data-project-category", item.category);
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `View ${item.title} photo ${item.indexInProject} of ${item.totalInProject}`);

      card.innerHTML = `
        <div class="rs-project-card__badge-cat">${item.category}</div>
        <div class="rs-project-card__badge-idx">${idxStr}</div>
        <div class="rs-project-card__img-wrap">
          <img 
            src="${item.src}" 
            alt="${item.alt}" 
            class="rs-project-card__img" 
            loading="${globalIdx < 8 ? 'eager' : 'lazy'}" 
            decoding="async" 
          />
        </div>
        <div class="rs-project-card__overlay" aria-hidden="true"></div>
        <div class="rs-project-card__info">
          <div class="rs-project-card__hover-meta" aria-hidden="true">
            <span class="rs-project-card__hover-cat">${item.category}</span>
            <span class="rs-project-card__hover-sep">•</span>
            <span class="rs-project-card__hover-loc">${item.location}</span>
          </div>
          <h3 class="rs-project-card__title">${item.title}</h3>
          <p class="rs-project-card__location">${item.location}</p>
        </div>
        <div class="rs-project-card__expand-btn" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </div>
      `;

      card.addEventListener("click", () => {
        const itemIdx = currentFilteredList.indexOf(item);
        openLightbox(itemIdx !== -1 ? itemIdx : 0);
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const itemIdx = currentFilteredList.indexOf(item);
          openLightbox(itemIdx !== -1 ? itemIdx : 0);
        }
      });

      gridContainer.appendChild(card);
    });

    if (counterBadge) {
      counterBadge.textContent = `Showing ${images.length} Photos`;
    }
  }

  function setupFilters() {
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-project-filter");
        setActiveFilter(key);
      });
    });
  }

  function setActiveFilter(key) {
    activeFilterKey = key;

    filterButtons.forEach(b => {
      if (b.getAttribute("data-project-filter") === key) {
        b.classList.add("is-active");
      } else {
        b.classList.remove("is-active");
      }
    });

    if (key === "all") {
      currentFilteredList = [...ALL_PROJECT_IMAGES];
    } else if (key === "retail" || key === "hospitality" || key === "residential") {
      currentFilteredList = ALL_PROJECT_IMAGES.filter(it => it.category.toLowerCase() === key);
    } else {
      currentFilteredList = ALL_PROJECT_IMAGES.filter(it => it.projectSlug === key);
    }

    const existingCards = gridContainer.querySelectorAll(".rs-project-card");
    if (existingCards.length > 0) {
      existingCards.forEach(card => {
        const slug = card.getAttribute("data-project-slug");
        const cat = (card.getAttribute("data-project-category") || "").toLowerCase();
        let matches = false;
        if (key === "all") matches = true;
        else if (key === "retail" || key === "hospitality" || key === "residential") matches = (cat === key);
        else matches = (slug === key);

        card.style.display = matches ? "" : "none";
      });
      if (counterBadge) {
        counterBadge.textContent = `Showing ${currentFilteredList.length} Photos`;
      }
    } else {
      renderCards(currentFilteredList);
    }
  }

  // Build Lightbox Modal DOM
  function buildLightboxModal() {
    let existing = document.getElementById("rs-lightbox-modal");
    if (existing) {
      modalEl = existing;
    } else {
      modalEl = document.createElement("div");
      modalEl.id = "rs-lightbox-modal";
      modalEl.className = "rs-lightbox-modal";
      modalEl.setAttribute("aria-hidden", "true");
      modalEl.setAttribute("role", "dialog");
      modalEl.setAttribute("aria-modal", "true");

      modalEl.innerHTML = `
        <div class="rs-lightbox-modal__bar">
          <div class="rs-lightbox-modal__info">
            <span class="rs-lightbox-modal__cat" id="rs-lb-cat">RETAIL</span>
            <span class="rs-lightbox-modal__title" id="rs-lb-title">POLO RALPH LAUREN</span>
            <span class="rs-lightbox-modal__loc" id="rs-lb-loc">Mall of India, Noida</span>
          </div>
          <div class="rs-lightbox-modal__controls">
            <span class="rs-lightbox-modal__counter" id="rs-lb-counter">01 / ${ALL_PROJECT_IMAGES.length}</span>
            <button type="button" class="rs-lightbox-modal__close-btn" id="rs-lb-close" aria-label="Close image viewer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="rs-lightbox-modal__stage" id="rs-lb-stage">
          <button type="button" class="rs-lightbox-modal__arrow rs-lightbox-modal__arrow--prev" id="rs-lb-prev" aria-label="Previous photo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div class="rs-lightbox-modal__img-frame">
            <img src="" alt="" class="rs-lightbox-modal__main-img" id="rs-lb-img" />
          </div>

          <button type="button" class="rs-lightbox-modal__arrow rs-lightbox-modal__arrow--next" id="rs-lb-next" aria-label="Next photo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      `;

      document.body.appendChild(modalEl);
    }

    modalCategoryEl = document.getElementById("rs-lb-cat");
    modalTitleEl = document.getElementById("rs-lb-title");
    modalLocEl = document.getElementById("rs-lb-loc");
    modalCounterEl = document.getElementById("rs-lb-counter");
    modalImgEl = document.getElementById("rs-lb-img");
    modalCloseBtn = document.getElementById("rs-lb-close");
    modalPrevBtn = document.getElementById("rs-lb-prev");
    modalNextBtn = document.getElementById("rs-lb-next");

    modalCloseBtn.addEventListener("click", closeLightbox);
    modalPrevBtn.addEventListener("click", () => navigateLightbox(-1));
    modalNextBtn.addEventListener("click", () => navigateLightbox(1));

    // Click outside image to close
    document.getElementById("rs-lb-stage").addEventListener("click", (e) => {
      if (e.target === e.currentTarget || e.target.classList.contains("rs-lightbox-modal__img-frame")) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    window.addEventListener("keydown", (e) => {
      if (!modalEl.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      if (e.key === "ArrowRight") navigateLightbox(1);
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const stageEl = document.getElementById("rs-lb-stage");
    stageEl.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    stageEl.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          navigateLightbox(-1);
        } else {
          navigateLightbox(1);
        }
      }
    }
  }

  function openLightbox(index) {
    if (!currentFilteredList.length) return;
    currentActiveIndex = (index + currentFilteredList.length) % currentFilteredList.length;
    updateLightboxContent();

    modalEl.classList.add("is-open");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    modalEl.classList.remove("is-open");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function navigateLightbox(dir) {
    if (!currentFilteredList.length) return;
    currentActiveIndex = (currentActiveIndex + dir + currentFilteredList.length) % currentFilteredList.length;
    updateLightboxContent();
  }

  function updateLightboxContent() {
    const item = currentFilteredList[currentActiveIndex];
    if (!item) return;

    modalCategoryEl.textContent = item.category;
    modalTitleEl.textContent = item.title;
    modalLocEl.textContent = item.location;
    modalCounterEl.textContent = `${String(currentActiveIndex + 1).padStart(2, '0')} / ${String(currentFilteredList.length).padStart(2, '0')}`;

    modalImgEl.style.opacity = "0.3";
    modalImgEl.src = item.src;
    modalImgEl.alt = item.alt;
    modalImgEl.onload = () => {
      modalImgEl.style.opacity = "1";
    };
  }

  // Handle URL hash on load
  function checkInitialHash() {
    const hash = window.location.hash.replace("#", "").trim().toLowerCase();
    if (!hash) return;

    // Check if it's a project slug
    const matchSlug = ALL_PROJECT_IMAGES.find(it => it.projectSlug === hash);
    if (matchSlug) {
      setActiveFilter(hash);
      return;
    }

    // Check if it's a category
    if (["retail", "hospitality", "residential"].includes(hash)) {
      setActiveFilter(hash);
      return;
    }

    // Check if it's an image number or id
    const matchId = ALL_PROJECT_IMAGES.findIndex(it => it.id === hash || String(it.indexInProject) === hash);
    if (matchId !== -1) {
      openLightbox(matchId);
    }
  }

  window.addEventListener("hashchange", checkInitialHash);

  // Initialize immediately if element is already parsed, or wait for DOMContentLoaded
  if (document.getElementById("rs-projects-grid-root")) {
    init();
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Export globally if needed
  window.DivinePortfolioGallery = {
    open: openLightbox,
    close: closeLightbox,
    filter: setActiveFilter,
    images: ALL_PROJECT_IMAGES
  };
})();
