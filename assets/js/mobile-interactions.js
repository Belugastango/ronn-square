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

    // 6. Mobile Animation Support: Refresh ScrollTrigger so mobile scroll animations trigger identically to desktop
    window.addEventListener('load', function () {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.config({ ignoreMobileResize: true });
        window.ScrollTrigger.refresh();
      }
    });

    window.addEventListener('resize', function () {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    });

    setTimeout(function () {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }, 1200);

    // 7. Universal Contact Page Form & Interactive Handlers (for both direct load & Barba transitions)
    initContactPage();
    if (window.MutationObserver) {
      const observer = new MutationObserver(function () {
        initContactPage();
      });
      const mainEl = document.getElementById('main-content') || document.body;
      if (mainEl) {
        observer.observe(mainEl, { childList: true, subtree: true });
      }
    }
    window.addEventListener('popstate', initContactPage);
  }

  function initContactPage() {
    const contactSection = document.querySelector('.block-5-1-hero-contact');
    if (!contactSection) return;

    // Guaranteed visibility failsafe
    contactSection.querySelectorAll('.anim-hidden').forEach(el => {
      el.classList.remove('anim-hidden');
      el.style.opacity = '1';
      el.style.visibility = 'visible';
      el.style.transform = 'none';
    });

    // Copy buttons
    contactSection.querySelectorAll('[data-copy]').forEach(btn => {
      if (btn.dataset.copyBound) return;
      btn.dataset.copyBound = '1';
      btn.addEventListener('click', function () {
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            btn.classList.add('is-copied');
            setTimeout(() => btn.classList.remove('is-copied'), 2000);
          }).catch(() => fallbackCopy(textToCopy, btn));
        } else {
          fallbackCopy(textToCopy, btn);
        }
      });
    });

    function fallbackCopy(text, btn) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.classList.add('is-copied');
      setTimeout(() => btn.classList.remove('is-copied'), 2000);
    }

    const form = document.getElementById('di-contact-page-form');
    if (form && !form.dataset.formBound) {
      form.dataset.formBound = '1';
      const formTitle = document.getElementById('di-form-title');
      const statusBox = document.getElementById('contact-form-status');
      const submitBtn = form.querySelector('button[type="submit"]');
      const successCard = document.getElementById('di-contact-success-card');
      const successCardText = document.getElementById('di-success-card-text');
      const successCardWa = document.getElementById('di-success-card-wa');
      const sendAnotherBtn = document.getElementById('di-send-another-btn');

      if (sendAnotherBtn && !sendAnotherBtn.dataset.bound) {
        sendAnotherBtn.dataset.bound = '1';
        sendAnotherBtn.addEventListener('click', function () {
          if (successCard) successCard.style.display = 'none';
          if (formTitle) formTitle.style.display = 'block';
          if (form) {
            form.reset();
            form.style.display = 'block';
          }
          if (statusBox) {
            statusBox.style.display = 'none';
            statusBox.innerHTML = '';
          }
        });
      }

      form.addEventListener('submit', function (e) {
        const lastNameEl = document.getElementById('di-last-name');
        const firstNameEl = document.getElementById('di-first-name');
        const emailEl = document.getElementById('di-email');
        const phoneEl = document.getElementById('di-phone');
        const companyEl = document.getElementById('di-company');
        const surfaceEl = document.getElementById('di-surface');
        const locationEl = document.getElementById('di-location');
        const projectEl = document.getElementById('di-project-desc');

        const lastName = (lastNameEl ? lastNameEl.value : '').trim();
        const firstName = (firstNameEl ? firstNameEl.value : '').trim();
        const email = (emailEl ? emailEl.value : '').trim();
        const phone = (phoneEl ? phoneEl.value : '').trim();
        const company = (companyEl ? companyEl.value : '').trim();
        const surface = (surfaceEl ? surfaceEl.value : '').trim();
        const location = (locationEl ? locationEl.value : '').trim();
        const project = (projectEl ? projectEl.value : '').trim();

        if (!lastName || !firstName || !email || !company || !location || !project) {
          e.preventDefault();
          if (statusBox) {
            statusBox.className = 'contact-form-status';
            statusBox.style.display = 'block';
            statusBox.style.background = 'rgba(183, 28, 28, 0.15)';
            statusBox.style.color = '#c62828';
            statusBox.textContent = 'Please fill in all required fields marked with *.';
          }
          const firstEmpty = [lastNameEl, firstNameEl, emailEl, companyEl, locationEl, projectEl].find(el => el && !el.value.trim());
          if (firstEmpty) firstEmpty.focus();
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.style.pointerEvents = 'none';
          submitBtn.style.opacity = '0.7';
          const label = submitBtn.querySelector('.block-5-1-hero-contact__submit-label, .btn__label');
          if (label) label.textContent = 'SENDING...';
        }

        const clientName = firstName + ' ' + lastName;
        const waMessage = encodeURIComponent(
          'Hello Divine Interiors, I submitted a project consultation request:\nName: ' + clientName +
          '\nCompany: ' + company +
          '\nEmail: ' + email +
          '\nPhone: ' + (phone || 'N/A') +
          '\nLocation: ' + location +
          '\nArea: ' + (surface || 'N/A') +
          '\nScope: ' + project
        );
        const waUrl = 'https://wa.me/919717740876?text=' + waMessage;

        const googleFormAction = 'https://docs.google.com/forms/d/e/1FAIpQLSec5nQeOcXg5yF-Sur542br7NZTGn1Vbj-SUTbZ46pXGI6wbw/formResponse';
        try {
          const formPayload = new URLSearchParams();
          formPayload.append('entry.947323197', lastName);
          formPayload.append('entry.508886399', firstName);
          formPayload.append('entry.1995696701', email);
          formPayload.append('entry.1132374789', phone || '');
          formPayload.append('entry.1185401711', company);
          formPayload.append('entry.295256446', surface || '');
          formPayload.append('entry.1760498963', location);
          formPayload.append('entry.76371284', project);

          fetch(googleFormAction, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formPayload.toString()
          }).catch(() => {});
        } catch (err) {}

        setTimeout(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.pointerEvents = 'auto';
            submitBtn.style.opacity = '1';
            const label = submitBtn.querySelector('.block-5-1-hero-contact__submit-label, .btn__label');
            if (label) label.textContent = 'SEND MY REQUEST';
          }

          if (form) form.style.display = 'none';
          if (formTitle) formTitle.style.display = 'none';

          if (successCardText) {
            successCardText.innerHTML = `Thank you, <strong>${clientName}</strong>. Your architectural inquiry for <strong>${company}</strong> has been received with high priority. Our senior design consultation team will review your project details and get in touch within 24 hours.`;
          }
          if (successCardWa) {
            successCardWa.href = waUrl;
          }
          if (successCard) {
            successCard.style.display = 'block';
            successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 700);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobile);
  } else {
    initMobile();
  }
})();
