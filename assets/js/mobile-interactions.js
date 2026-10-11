/**
 * DIVINE INTERIORS — Mobile Interactions & UX Enhancements
 * Optimized for mobile touchscreens, responsive navigation, and smooth gestures.
 */
(function () {
  'use strict';

  function initMobile() {
    // 1. Dynamic Viewport Height Fix (for iOS Safari address bar)
    function setAppHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--app-vh', `${vh}px`);
    }
    setAppHeight();
    window.addEventListener('resize', setAppHeight, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(setAppHeight, 150), { passive: true });

    // 2. Mobile Hamburger Drawer Toggle
    const header = document.querySelector('[data-header-ronn], .header-ronn');
    const toggles = document.querySelectorAll('[data-header-ronn-toggle], .header-ronn__hamburger');
    const menu = document.querySelector('[data-header-ronn-menu], #header-ronn-menu, #header-menu-panel, .header-ronn__menu');

    if (toggles.length && menu) {
      function openMenu() {
        if (header) header.classList.add('is-menu-open');
        menu.classList.add('is-open');
        menu.setAttribute('aria-hidden', 'false');
        document.body.classList.add('is-header-menu-open');
        toggles.forEach(t => t.setAttribute('aria-expanded', 'true'));
      }

      function closeMenu() {
        if (header) header.classList.remove('is-menu-open');
        menu.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('is-header-menu-open');
        toggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
      }

      // Native theme JS (main-C1SzXFGm.js) handles hamburger click and GSAP line morph.
      // Ensure drawer links close the menu on tap for smooth single-page anchor navigation:

      // Close menu when tapping menu navigation links
      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
          // If anchor link on same page, close menu
          closeMenu();
        });
      });

      // Close menu on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) {
          closeMenu();
        }
      });
    }

    // 3. "Explore Our Services" Button Smooth Scroll Fix
    const exploreBtn = document.getElementById('hero-explore-services') ||
      document.querySelector('.block-1-1-hero__btn') ||
      document.querySelector('a[href="#expertises"]');

    if (exploreBtn) {
      exploreBtn.addEventListener('click', function (e) {
        const target = document.getElementById('expertises') || document.querySelector('.block-1-7-services');
        if (target) {
          e.preventDefault();
          e.stopPropagation();
          const headerHeight = 70;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    }

    // 4. "Discover" Buttons Navigation Fix
    // Ensure all Discover buttons reliably take users to projects.html or project anchor
    document.querySelectorAll('.block-1-8-projects__btn, a[data-project-open]').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const slug = btn.getAttribute('data-project-open');
        const href = btn.getAttribute('href');

        // If on index.html or another page, navigate to projects.html with hash
        const isProjectsPage = window.location.pathname.endsWith('projects.html') || window.location.pathname.endsWith('realisations.html');
        if (!isProjectsPage) {
          e.preventDefault();
          e.stopPropagation();
          const targetSlug = slug || (href && href.replace(/^#/, '')) || '';
          window.location.href = `./projects.html${targetSlug ? '#' + targetSlug : ''}`;
        }
      });
    });

    // 5. Swipe Gestures for Projects Gallery Modal (on mobile touchscreens)
    const galleryModal = document.getElementById('rs-project-gallery-modal');
    if (galleryModal) {
      let touchStartX = 0;
      let touchStartY = 0;

      galleryModal.addEventListener('touchstart', function (e) {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      galleryModal.addEventListener('touchend', function (e) {
        if (e.changedTouches.length === 1) {
          const touchEndX = e.changedTouches[0].clientX;
          const touchEndY = e.changedTouches[0].clientY;
          const diffX = touchEndX - touchStartX;
          const diffY = touchEndY - touchStartY;

          // Check if horizontal swipe was dominant (at least 45px)
          if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX < 0) {
              // Swiped Left -> Next Photo
              const nextBtn = document.getElementById('rs-gallery-next');
              if (nextBtn) nextBtn.click();
            } else {
              // Swiped Right -> Previous Photo
              const prevBtn = document.getElementById('rs-gallery-prev');
              if (prevBtn) prevBtn.click();
            }
          }
        }
      }, { passive: true });
    }

    // 6. Mobile Failsafe Reveal: Reveal any unrevealed elements on smaller screens
    setTimeout(function () {
      if (window.innerWidth <= 768) {
        document.querySelectorAll('.anim-hidden').forEach(el => {
          el.classList.remove('anim-hidden');
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          el.style.transform = 'none';
        });

        // Hide preloader overlay if still lingering
        const siteLoader = document.getElementById('site-loader');
        if (siteLoader) {
          siteLoader.style.display = 'none';
          siteLoader.style.opacity = '0';
          siteLoader.style.pointerEvents = 'none';
        }
      }
    }, 450);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobile);
  } else {
    initMobile();
  }
})();
