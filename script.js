/* ═══════════════════════════════════════════════════════════
   script.js — Aarul Sharma Portfolio
   All interactivity: nav, theme, scroll-reveal, form, etc.
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─────────────────────────────────────
     1. DOM REFERENCES
     ───────────────────────────────────── */

  const hamburger     = document.getElementById("hamburger");
  const navMenu       = document.getElementById("nav-menu");
  const navLinks      = document.querySelectorAll(".nav-link");
  const themeToggle   = document.getElementById("theme-toggle");
  const backToTop     = document.getElementById("back-to-top");
  const contactForm   = document.getElementById("contact-form");
  const footerYear    = document.getElementById("footer-year");
  const html          = document.documentElement;


  /* ─────────────────────────────────────
     2. MOBILE NAVIGATION
     ───────────────────────────────────── */

  // Create overlay element for the mobile menu backdrop
  const overlay = document.createElement("div");
  overlay.classList.add("nav-overlay");
  overlay.setAttribute("aria-hidden", "true");
  document.body.appendChild(overlay);

  /**
   * Open or close the mobile navigation menu.
   * @param {boolean} open — true to open, false to close
   */
  function toggleMenu(open) {
    const isOpen = typeof open === "boolean" ? open : !navMenu.classList.contains("open");
    navMenu.classList.toggle("open", isOpen);
    overlay.classList.toggle("open", isOpen);
    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));

    // Prevent background scrolling when menu is open
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  hamburger.addEventListener("click", function () {
    toggleMenu();
  });

  // Close menu when clicking the overlay
  overlay.addEventListener("click", function () {
    toggleMenu(false);
  });

  // Close menu when pressing Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      toggleMenu(false);
      hamburger.focus();
    }
  });

  // Close menu when a link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      toggleMenu(false);
    });
  });


  /* ─────────────────────────────────────
     3. SMOOTH SCROLL (fallback for links)
     Browsers that support scroll-behavior
     handle this via CSS. This ensures the
     nav offset is applied correctly.
     ───────────────────────────────────── */

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = document.querySelector(".navbar").offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });


  /* ─────────────────────────────────────
     4. ACTIVE NAV HIGHLIGHTING
     Uses Intersection Observer to mark the
     currently visible section.
     ───────────────────────────────────── */

  // Collect all sections that correspond to nav links
  const sections = [];
  navLinks.forEach(function (link) {
    const id = link.getAttribute("href").replace("#", "");
    const section = document.getElementById(id);
    if (section) sections.push(section);
  });

  /**
   * Set the active nav link for a given section id.
   * @param {string} id — The section id
   */
  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      const href = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", href === id);
    });
  }

  // Observe each section entering the viewport
  var navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-40% 0px -55% 0px",  // trigger roughly when section is in view center
    }
  );

  sections.forEach(function (section) {
    navObserver.observe(section);
  });


  /* ─────────────────────────────────────
     5. DARK / LIGHT THEME TOGGLE
     ───────────────────────────────────── */

  /**
   * Apply a theme and save the preference.
   * @param {string} theme — "dark" or "light"
   */
  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      // localStorage may be unavailable in private browsing
    }
  }

  // Load saved theme or respect system preference
  (function initTheme() {
    var saved;
    try {
      saved = localStorage.getItem("theme");
    } catch (e) {
      saved = null;
    }

    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      applyTheme("light");
    } else {
      applyTheme("dark");
    }
  })();

  themeToggle.addEventListener("click", function () {
    var current = html.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });


  /* ─────────────────────────────────────
     6. BACK-TO-TOP BUTTON
     ───────────────────────────────────── */

  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }, { passive: true });

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  /* ─────────────────────────────────────
     7. SCROLL-REVEAL ANIMATION
     Uses Intersection Observer to add a
     'visible' class when elements enter
     the viewport.
     ───────────────────────────────────── */

  var revealElements = document.querySelectorAll(".reveal");

  // Check if user prefers reduced motion
  var prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    // If reduced motion, make everything visible immediately
    revealElements.forEach(function (el) {
      el.classList.add("visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target); // animate only once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }


  /* ─────────────────────────────────────
     8. CONTACT FORM VALIDATION
     Client-side only — opens mailto: on
     successful validation.
     ───────────────────────────────────── */

  var formFields = {
    name:    { input: document.getElementById("form-name"),    error: document.getElementById("error-name") },
    email:   { input: document.getElementById("form-email"),   error: document.getElementById("error-email") },
    subject: { input: document.getElementById("form-subject"), error: document.getElementById("error-subject") },
    message: { input: document.getElementById("form-message"), error: document.getElementById("error-message") },
  };

  /**
   * Validate a single form field.
   * @param {string} key — Field name
   * @returns {boolean} Whether the field is valid
   */
  function validateField(key) {
    var field = formFields[key];
    var value = field.input.value.trim();
    var errorMsg = "";

    if (!value) {
      errorMsg = capitalize(key) + " is required.";
    } else if (key === "email" && !isValidEmail(value)) {
      errorMsg = "Please enter a valid email address.";
    }

    field.error.textContent = errorMsg;
    field.input.classList.toggle("input-error", !!errorMsg);
    return !errorMsg;
  }

  /**
   * Simple email format check.
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    // Basic pattern — not meant to be exhaustive
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /** Capitalize the first letter of a string. */
  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Real-time validation: clear error when user starts typing
  Object.keys(formFields).forEach(function (key) {
    formFields[key].input.addEventListener("input", function () {
      validateField(key);
    });
  });

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate all fields
    var allValid = true;
    Object.keys(formFields).forEach(function (key) {
      if (!validateField(key)) allValid = false;
    });

    if (!allValid) return;

    // Build mailto link
    var name    = formFields.name.input.value.trim();
    var email   = formFields.email.input.value.trim();
    var subject = formFields.subject.input.value.trim();
    var message = formFields.message.input.value.trim();

    var body = "Name: " + name + "\nEmail: " + email + "\n\n" + message;
    var mailtoLink =
      "mailto:aarul.sharma.05@gmail.com" +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    // Open the user's email client
    window.location.href = mailtoLink;

    // Provide feedback
    alert(
      "Your default email application will open with the message details.\n" +
      "If it doesn't open automatically, please email aarul.sharma.05@gmail.com directly."
    );
  });


  /* ─────────────────────────────────────
     9. FOOTER YEAR — Auto-update
     ───────────────────────────────────── */

  footerYear.textContent = new Date().getFullYear();

})();
