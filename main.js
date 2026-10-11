// SmartAgri Research Website - Theme & Interactive Engine

(function () {
  'use strict';

  // --- THEME MANAGEMENT (Dark / Light Mode) ---
  const STORAGE_KEY = 'smartagri-theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Update all theme toggle buttons on the page
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(toggle => {
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      toggle.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      const sunIcon = toggle.querySelector('.icon-sun');
      const moonIcon = toggle.querySelector('.icon-moon');
      const textSpan = toggle.querySelector('.theme-text');
      if (sunIcon && moonIcon) {
        if (theme === 'dark') {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
        }
      }
      if (textSpan) {
        textSpan.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
      }
    });
  }

  // Apply immediately on script execution to avoid flash of wrong theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    // Re-apply to ensure button states match DOM
    applyTheme(getPreferredTheme());

    // Theme toggle buttons listener
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    });

    // --- MOBILE NAVIGATION TOGGLE ---
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (mobileToggle && mainNav) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('nav-open');
        mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close nav when clicking a link
      mainNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          mainNav.classList.remove('nav-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // --- MILESTONES INTERACTIVE DROPDOWN FILTER (PDF Page 11 Requirement) ---
    const milestoneSelect = document.getElementById('milestone-filter');
    if (milestoneSelect) {
      const milestoneCards = document.querySelectorAll('.milestone-item');
      milestoneSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        milestoneCards.forEach(card => {
          const category = card.getAttribute('data-assessment');
          if (val === 'all' || category === val) {
            card.style.display = '';
            if (val !== 'all') {
              card.classList.add('milestone-highlight');
            } else {
              card.classList.remove('milestone-highlight');
            }
          } else {
            card.style.display = 'none';
            card.classList.remove('milestone-highlight');
          }
        });
      });
    }

    // --- INTERACTIVE EMAIL TEMPLATE GENERATOR (PDF Page 15 Requirement) ---
    const emailForm = document.getElementById('email-template-form');
    const templatePreview = document.getElementById('template-preview-text');
    const copyBtn = document.getElementById('btn-copy-template');
    const mailtoBtn = document.getElementById('btn-open-email');

    if (emailForm && templatePreview) {
      function updateTemplate() {
        const name = document.getElementById('template-sender-name')?.value || '[Your Name]';
        const affiliation = document.getElementById('template-sender-affiliation')?.value || '[Your Institution / Organization]';
        const purpose = document.getElementById('template-inquiry-type')?.value || 'Research Collaboration / Inquiry';
        const subject = document.getElementById('template-subject')?.value || 'Inquiry regarding SmartAgri Research (R26-IT-063)';
        const notes = document.getElementById('template-message')?.value || 'I am interested in learning more about your research project and component outcomes.';

        const body = `Dear SmartAgri Research Team (R26-IT-063),

My name is ${name} (${affiliation}).
I am reaching out regarding: ${purpose}.

Subject: ${subject}

Message:
${notes}

Best regards,
${name}
Contact: ${document.getElementById('template-sender-email')?.value || '[Your Email]'}`;

        templatePreview.textContent = body;

        if (mailtoBtn) {
          const mailtoUrl = `mailto:lahiruilangasinha@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          mailtoBtn.setAttribute('href', mailtoUrl);
        }
      }

      ['input', 'change'].forEach(evt => {
        emailForm.addEventListener(evt, updateTemplate);
      });

      updateTemplate();

      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(templatePreview.textContent).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span>✓ Copied to Clipboard</span>';
            setTimeout(() => {
              copyBtn.innerHTML = originalText;
            }, 2500);
          }).catch(err => {
            alert('Failed to copy. Please manually select the text below.');
          });
        });
      }
    }
  });
})();
