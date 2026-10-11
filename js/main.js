/* =========================================================
   SmartAgri Website — Main JavaScript Engine
   Includes Theme Toggle, Navbar Scroll, Mobile Menu, and Animations
   ========================================================= */

(function () {
  'use strict';

  // ---- THEME ENGINE (Dark / Light Mode) ----
  const STORAGE_KEY = 'smartagri-theme';

  function getSavedTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Update toggle icons
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      const sunSvg = btn.querySelector('.theme-icon-sun');
      const moonSvg = btn.querySelector('.theme-icon-moon');
      if (sunSvg && moonSvg) {
        if (theme === 'dark') {
          sunSvg.style.display = 'block';
          moonSvg.style.display = 'none';
        } else {
          sunSvg.style.display = 'none';
          moonSvg.style.display = 'block';
        }
      }
    });
  }

  // Apply saved theme immediately
  applyTheme(getSavedTheme());

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getSavedTheme());

    // Theme toggle button clicks
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    });

    // ---- Header & Navbar Scroll Behavior ----
    const siteHeader = document.getElementById('siteHeader');
    const navbar = document.getElementById('navbar');

    function updateHeaderScroll() {
      const isScrolled = window.scrollY > 30;
      if (siteHeader) siteHeader.classList.toggle('scrolled', isScrolled);
      if (navbar) navbar.classList.toggle('scrolled', isScrolled);
    }

    window.addEventListener('scroll', updateHeaderScroll, { passive: true });
    updateHeaderScroll();

    // ---- Mobile Nav Toggle ----
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('open');
      });

      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          navToggle.classList.remove('open');
        });
      });

      // Close mobile menu when clicked outside
      document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('open') && !siteHeader.contains(e.target)) {
          navLinks.classList.remove('open');
          navToggle.classList.remove('open');
        }
      });
    }

    // ---- Intersection Observer: Animate on Scroll ----
    const animatedSelectors = [
      '.feature-card',
      '.milestone-card',
      '.doc-card',
      '.pres-card',
      '.team-card',
      '.gap-card',
      '.method-card',
      '.objective-item',
      '.contact-item'
    ].join(', ');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll(animatedSelectors).forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });

      const styleEl = document.createElement('style');
      styleEl.textContent = `
        ${animatedSelectors.split(', ').map(s => `${s}.visible`).join(',\n')} {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `;
      document.head.appendChild(styleEl);
    }

    // Staggered delay for grid items
    document.querySelectorAll('.features-grid, .gap-cards, .team-grid, .pres-grid, .docs-grid').forEach(grid => {
      Array.from(grid.children).forEach((child, i) => {
        child.style.transitionDelay = `${i * 80}ms`;
      });
    });

    // File download buttons listener
    document.querySelectorAll('.file-download-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = btn.getAttribute('data-file-name') || 'Document';
        const url = btn.getAttribute('data-download-url');
        if (url) {
          window.open(url, '_blank');
          showSitePopup('success', 'Download Started', `Downloading "${name}". Please check your browser downloads folder.`);
        }
      });
    });
  });
})();

// Modern Site Popup Modal
function showSitePopup(type, title, message) {
  let overlay = document.getElementById('sitePopupOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sitePopupOverlay';
    overlay.className = 'contact-toast-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="contact-toast-box" id="sitePopupBox" role="dialog" aria-modal="true">
        <div class="contact-toast-icon" id="sitePopupIcon">✓</div>
        <h3 id="sitePopupTitle"></h3>
        <p id="sitePopupMessage"></p>
        <button type="button" class="contact-toast-btn" id="sitePopupBtn">OK</button>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const box = document.getElementById('sitePopupBox');
  const icon = document.getElementById('sitePopupIcon');
  const titleEl = document.getElementById('sitePopupTitle');
  const messageEl = document.getElementById('sitePopupMessage');
  const button = document.getElementById('sitePopupBtn');

  box.className = `contact-toast-box ${type}`;
  icon.textContent = type === 'success' ? '✓' : '!';
  titleEl.textContent = title;
  messageEl.textContent = message;

  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');

  button.onclick = () => {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
  };

  overlay.onclick = (event) => {
    if (event.target === overlay) {
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'true');
    }
  };
}
