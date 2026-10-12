/**
 * Divine Interiors — Stacking Project Cards Scroll Animator
 * Creates award-winning physical depth, progressive scaling, and subtle dimming
 * as successive project cards slide up and stack over preceding cards.
 */
(function() {
  function initStackingCards() {
    const cards = Array.from(document.querySelectorAll(".project-stack-card"));
    if (!cards.length) return;

    // Assign stacking z-indices
    cards.forEach((card, index) => {
      card.style.zIndex = index + 1;
    });

    // Animate on scroll
    function updateCardStack() {
      const vh = window.innerHeight;
      const stickyThreshold = cards[0].getBoundingClientRect().top; // when sticking begins

      for (let i = 0; i < cards.length - 1; i++) {
        const currentCard = cards[i];
        const nextCard = cards[i + 1];

        const nextRect = nextCard.getBoundingClientRect();
        const currentRect = currentCard.getBoundingClientRect();

        // Calculate how much the next card has overlapped the current sticky card
        const overlapDistance = currentRect.bottom - nextRect.top;
        const totalHeight = currentRect.height || 600;

        // Progress of next card sliding over current card (0 to 1)
        let progress = 0;
        if (nextRect.top < currentRect.top + 300) {
          progress = Math.min(1, Math.max(0, (currentRect.top + 300 - nextRect.top) / 300));
        }

        // Depth calculation: how many cards have stacked above this one
        let depth = 0;
        for (let j = i + 1; j < cards.length; j++) {
          const higherRect = cards[j].getBoundingClientRect();
          if (higherRect.top <= currentRect.top + 10) {
            depth++;
          }
        }

        // Subtle scale and brightness decay for authentic 3D card deck feel
        const targetScale = Math.max(0.88, 1 - (progress * 0.04) - (depth * 0.03));
        const targetBrightness = Math.max(0.65, 1 - (progress * 0.12) - (depth * 0.1));
        const targetTranslateY = (depth * -4) + "px";

        currentCard.style.transform = `scale(${targetScale.toFixed(3)}) translateY(${targetTranslateY})`;
        currentCard.style.filter = `brightness(${targetBrightness.toFixed(2)})`;
      }

      // Last card remains full scale
      const lastCard = cards[cards.length - 1];
      if (lastCard) {
        lastCard.style.transform = "scale(1)";
        lastCard.style.filter = "brightness(1)";
      }
    }

    // Bind with requestAnimationFrame throttle
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateCardStack();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateCardStack, { passive: true });
    // Initial run
    updateCardStack();

    // If Lenis is active, also listen to Lenis scroll
    if (window.lenis && typeof window.lenis.on === "function") {
      window.lenis.on("scroll", onScroll);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStackingCards);
  } else {
    initStackingCards();
  }
})();
