/**
 * Rackd Theme JavaScript
 * WCAG 2.2 Level AAA Compliant
 */

/**
 * Theme Switcher - Initialize immediately to prevent flash
 */
(function initTheme() {
  const STORAGE_KEY = 'rackd-theme';

  // Get saved theme or default to 'system'
  const getSavedTheme = () => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'system';
    } catch {
      return 'system';
    }
  };

  // Apply theme to document
  const applyTheme = (theme) => {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  };

  // Initialize theme immediately
  const savedTheme = getSavedTheme();
  applyTheme(savedTheme);

  // Listen for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (getSavedTheme() === 'system') {
      // Force re-evaluation by removing and re-applying
      document.documentElement.removeAttribute('data-theme');
    }
  });

  // Expose theme functions globally
  window.rackdTheme = {
    get: getSavedTheme,
    set: (theme) => {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // Storage not available
      }
      applyTheme(theme);
    }
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSkipLink();
  initCodeCopy();
  initScrollablePre();
  initThemeSwitcher();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    menu.classList.toggle('active');

    // Update button label for screen readers
    toggle.setAttribute(
      'aria-label',
      isExpanded ? 'Open navigation menu' : 'Close navigation menu'
    );
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('active');
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('active');
      toggle.focus();
    }
  });
}

/**
 * Skip Link Focus Management
 */
function initSkipLink() {
  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.getElementById('main-content');

  if (!skipLink || !mainContent) return;

  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    mainContent.focus();
    mainContent.scrollIntoView({ behavior: 'smooth' });
  });
}

/**
 * Code Copy Functionality
 */
function initCodeCopy() {
  const copyIcon = `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
  const checkIcon = `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  const codeBlocks = document.querySelectorAll('pre code');

  codeBlocks.forEach((codeBlock) => {
    const pre = codeBlock.parentElement;
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';

    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const copyButton = document.createElement('button');
    copyButton.className = 'code-copy-btn';
    copyButton.type = 'button';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');
    copyButton.innerHTML = copyIcon;

    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeBlock.textContent);
        copyButton.innerHTML = checkIcon;
        copyButton.classList.add('copied');
        copyButton.setAttribute('aria-label', 'Code copied to clipboard');

        setTimeout(() => {
          copyButton.innerHTML = copyIcon;
          copyButton.classList.remove('copied');
          copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        }, 2000);
      } catch (err) {
        copyButton.setAttribute('aria-label', 'Failed to copy');
        setTimeout(() => {
          copyButton.innerHTML = copyIcon;
          copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        }, 2000);
      }
    });

    wrapper.appendChild(copyButton);
  });
}

/**
 * Make scrollable pre elements keyboard accessible
 */
function initScrollablePre() {
  const preElements = document.querySelectorAll('pre');

  preElements.forEach((pre) => {
    // Check if the element has horizontal scroll
    if (pre.scrollWidth > pre.clientWidth) {
      pre.setAttribute('tabindex', '0');
      pre.setAttribute('role', 'region');
      pre.setAttribute('aria-label', 'Code block - scrollable');
    }
  });
}

/**
 * Theme Switcher UI
 */
function initThemeSwitcher() {
  const toggle = document.querySelector('.theme-switcher-toggle');
  const menu = document.querySelector('.theme-switcher-menu');
  const options = document.querySelectorAll('.theme-option');

  if (!toggle || !menu || !options.length) return;

  // Update active state on load
  updateActiveOption();

  // Toggle menu
  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    menu.classList.toggle('active');
  });

  // Handle option selection
  options.forEach((option) => {
    option.addEventListener('click', () => {
      const theme = option.dataset.theme;
      window.rackdTheme.set(theme);
      updateActiveOption();
      menu.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      menu.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

  // Keyboard navigation within menu
  menu.addEventListener('keydown', (e) => {
    const items = Array.from(options);
    const currentIndex = items.indexOf(document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      items[nextIndex].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      items[prevIndex].focus();
    }
  });

  function updateActiveOption() {
    const currentTheme = window.rackdTheme.get();
    options.forEach((option) => {
      option.classList.toggle('active', option.dataset.theme === currentTheme);
    });
  }
}
