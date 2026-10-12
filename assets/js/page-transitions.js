/**
 * Divine Interiors - Smooth Curved Page Transitions Orchestrator
 * Restores signature Osmo curved wipe transition between pages
 * with bulletproof fail-safes ensuring zero lockups or frozen screens.
 */
(function() {
  // Early check: if arriving from an internal transition, mark html immediately to prevent white flash
  try {
    if (sessionStorage.getItem("rsPageTransitioning") === "1") {
      document.documentElement.classList.add("rs-page-transitioning");
    }
  } catch(e) {}

  function initPageTransitions() {
    var wrap = document.querySelector("[data-transition-wrap]");
    var panel = wrap ? wrap.querySelector("[data-transition-panel]") : null;
    var topCurve = wrap ? wrap.querySelector("[data-transition-panel-top]") : null;
    var bottomCurve = wrap ? wrap.querySelector("[data-transition-panel-bottom]") : null;
    var logo = wrap ? wrap.querySelector("[data-transition-logo]") : null;

    var isTransitioning = false;
    try {
      isTransitioning = sessionStorage.getItem("rsPageTransitioning") === "1";
    } catch(e) {}

    function cleanup() {
      if (wrap) {
        wrap.style.pointerEvents = "none";
        wrap.removeAttribute("data-transition-active");
      }
      document.documentElement.classList.remove("rs-page-transitioning");
      try {
        sessionStorage.removeItem("rsPageTransitioning");
      } catch(e) {}
    }

    // 1. ENTER REVEAL ANIMATION (when arriving from another page)
    if (isTransitioning && wrap && panel && window.gsap) {
      wrap.style.pointerEvents = "none";
      var tl = window.gsap.timeline({
        onComplete: function() {
          if (panel) window.gsap.set(panel, { autoAlpha: 0 });
          cleanup();
        }
      });

      tl.set(panel, { autoAlpha: 1, yPercent: -100 }, 0)
        .set(bottomCurve, { scaleY: 1, height: "20vw" }, 0)
        .set(logo, { opacity: 1 }, 0)
        .to(logo, { opacity: 0, duration: 0.25, ease: "power2.in" }, 0.05)
        .fromTo(panel, { yPercent: -100 }, { yPercent: -200, duration: 0.65, ease: "power3.inOut" }, 0.1)
        .to(bottomCurve, { scaleY: 0, duration: 0.65, ease: "power3.inOut" }, 0.1);
    } else {
      cleanup();
    }

    // Fail-safe: transition can NEVER block user clicks longer than 850ms
    setTimeout(cleanup, 850);

    // 2. LEAVE TRANSITION HANDLER (attaches to internal links)
    function attachLinkListeners() {
      var links = document.querySelectorAll("a[href]");
      links.forEach(function(link) {
        if (link.dataset.hasTransitionHandler) return;
        link.dataset.hasTransitionHandler = "true";

        link.addEventListener("click", function(e) {
          var href = link.getAttribute("href");
          if (!href || href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("javascript:")) return;
          if (link.target === "_blank" || link.hasAttribute("download")) return;
          if (e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented) return;

          try {
            var targetUrl = new URL(href, window.location.href);
            // Only transition internal same-origin links
            if (targetUrl.origin === window.location.origin) {
              var curClean = window.location.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "");
              var tgtClean = targetUrl.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "");

              // If same page with anchor, let default smooth scroll happen
              if (curClean === tgtClean) return;

              if (wrap && panel && window.gsap) {
                e.preventDefault();
                try {
                  sessionStorage.setItem("rsPageTransitioning", "1");
                } catch(err) {}

                wrap.style.pointerEvents = "all";
                wrap.setAttribute("data-transition-active", "true");

                var leaveTl = window.gsap.timeline({
                  onComplete: function() {
                    window.location.href = targetUrl.href;
                  }
                });

                leaveTl.set(panel, { autoAlpha: 1, yPercent: 0 }, 0)
                       .set(topCurve, { scaleY: 0, height: "15vw" }, 0)
                       .set(bottomCurve, { scaleY: 1, height: "20vw" }, 0)
                       .set(logo, { opacity: 0 }, 0)
                       .to(panel, { yPercent: -100, duration: 0.6, ease: "power3.inOut" }, 0)
                       .to(topCurve, { scaleY: 1, duration: 0.6, ease: "power3.inOut" }, 0)
                       .to(logo, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.2);

                // Absolute fallback navigation in case animation hangs
                setTimeout(function() {
                  window.location.href = targetUrl.href;
                }, 750);
              }
            }
          } catch(err) {}
        });
      });
    }

    attachLinkListeners();
    // Re-check after 1s for any dynamically rendered navigation elements
    setTimeout(attachLinkListeners, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPageTransitions);
  } else {
    initPageTransitions();
  }
})();
