/**
 * QuoteFlow — Privacy Policy Script
 * Features:
 *  - Dynamic footer year
 *  - Active TOC link highlighting on scroll
 *  - Smooth scroll-triggered section reveal
 */

(function () {
  'use strict';

  /* ─── Footer Year ─── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ─── Active TOC Highlighting ─── */
  const tocLinks = document.querySelectorAll('.toc-list a');
  const sections = document.querySelectorAll('.policy-section[id]');

  if (tocLinks.length && sections.length) {
    function getActiveSectionId() {
      const scrollY = window.scrollY;
      const offset  = 120; // pixels from top to consider "active"
      let activeId = null;

      sections.forEach(function (section) {
        const top = section.offsetTop - offset;
        if (scrollY >= top) {
          activeId = section.getAttribute('id');
        }
      });
      return activeId;
    }

    function updateTOC() {
      const activeId = getActiveSectionId();
      tocLinks.forEach(function (link) {
        const href = link.getAttribute('href').replace('#', '');
        if (href === activeId) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'true');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });
    }

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateTOC();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    updateTOC();
  }

  /* ─── Section Fade-In on Scroll ─── */
  if ('IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.policy-section, .permission-entry, .highlight-box, .contact-card'
    );

    revealTargets.forEach(function (el) {
      el.style.opacity  = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity  = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ─── Smooth Scroll for TOC links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });

        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

})();
