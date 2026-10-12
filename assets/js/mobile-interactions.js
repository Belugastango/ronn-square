/**
 * DIVINE INTERIORS — Mobile Interactions & UX Enhancements
 * Optimized for mobile touchscreens, responsive navigation, and smooth gestures.
 */
(function () {
  'use strict';

  function initMobile() {
    // 0. Instant Failsafe: Ensure loader never blocks, transition is unlocked, content is visible
    const loader = document.getElementById('site-loader');
    if (loader && loader.parentNode) loader.parentNode.removeChild(loader);

    const transWrap = document.querySelector('[data-transition-wrap]');
    if (transWrap) transWrap.style.pointerEvents = 'none';

    document.querySelectorAll('.anim-hidden').forEach(el => {
      el.classList.remove('anim-hidden');
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });

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
            statusBox.style.color = '#ff6b6b';
            statusBox.textContent = 'Please fill in all required fields marked with *.';
          }
          const firstEmpty = [lastNameEl, firstNameEl, emailEl, companyEl, locationEl, projectEl].find(el => el && !el.value.trim());
          if (firstEmpty) firstEmpty.focus();
          return;
        }

        // Freeze form inputs
        form.querySelectorAll('input, textarea').forEach(el => el.disabled = true);

        // Immediate feedback on button
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.style.pointerEvents = 'none';
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
          // Button explicitly shows REQUEST SENT
          if (submitBtn) {
            submitBtn.classList.add('is-sent');
            submitBtn.setAttribute('data-state', 'sent');
            submitBtn.disabled = true;
            submitBtn.style.pointerEvents = 'none';
            const label = submitBtn.querySelector('.block-5-1-hero-contact__submit-label, .btn__label');
            if (label) {
              label.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-3px;margin-right:8px;" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>REQUEST SENT';
            }
          }

          if (statusBox) {
            statusBox.className = 'contact-form-status is-success';
            statusBox.style.display = 'block';
            statusBox.innerHTML = `
              <div style="background: rgba(34, 197, 94, 0.14); border: 1px solid rgba(34, 197, 94, 0.4); border-radius: 14px; padding: 1.5rem 1.25rem; text-align: center; margin-top: 1.25rem; box-sizing: border-box;">
                <div style="width: 44px; height: 44px; margin: 0 auto 0.75rem; border-radius: 50%; background: rgba(34, 197, 94, 0.2); border: 2px solid #22c55e; display: flex; align-items: center; justify-content: center; color: #4ade80;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 style="color: #FFEAD4; font-size: 1.25rem; font-weight: 700; margin: 0 0 0.5rem;">Request Confirmed!</h3>
                <p style="color: rgba(255, 234, 212, 0.9); font-size: 0.95rem; line-height: 1.55; margin: 0 0 1.15rem;">
                  Thank you, <strong>${clientName}</strong>. Your project inquiry for <strong>${company}</strong> has been received. Our senior design consultation team will review and get in touch within 24 hours.
                </p>
                <div style="display: flex; flex-direction: column; gap: 0.65rem; max-width: 320px; margin: 0 auto;">
                  <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: #25D366; color: #052e16 !important; font-weight: 700; font-size: 0.92rem; padding: 0.75rem 1.25rem; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.35);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
                  <button type="button" class="di-reset-inquiry-btn" style="background: transparent; border: 1px solid rgba(255, 234, 212, 0.25); color: #FFEAD4; font-weight: 600; font-size: 0.88rem; padding: 0.65rem 1rem; border-radius: 10px; cursor: pointer;">
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            `;
            const resetBtn = statusBox.querySelector('.di-reset-inquiry-btn');
            if (resetBtn) {
              resetBtn.addEventListener('click', function () {
                form.reset();
                form.querySelectorAll('input, textarea').forEach(el => el.disabled = false);
                statusBox.style.display = 'none';
                statusBox.innerHTML = '';
                if (submitBtn) {
                  submitBtn.classList.remove('is-sent');
                  submitBtn.removeAttribute('data-state');
                  submitBtn.disabled = false;
                  submitBtn.style.pointerEvents = 'auto';
                  const label = submitBtn.querySelector('.block-5-1-hero-contact__submit-label, .btn__label');
                  if (label) {
                    label.textContent = 'SEND MY REQUEST';
                  }
                }
              });
            }
            statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 500);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobile);
  } else {
    initMobile();
  }
})();
