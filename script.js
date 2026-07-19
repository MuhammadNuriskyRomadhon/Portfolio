/* ==========================================================================
   MUHAMMAD NURISKY ROMADHON — PORTFOLIO
   Premium Interaction Layer v2
   ========================================================================== */

(() => {
  "use strict";

  const GITHUB_USERNAME = "MuhammadNuriskyRomadhon";
  const CONTACT_EMAIL = "akunutama241101@gmail.com";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isLowPower =
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4);

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  if (isLowPower || reduceMotion) document.documentElement.classList.add("low-power");

  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initScrollDispatcher();
    initCursorGlow();
    initProgressBar();
    initHeaderScroll();
    initMobileMenu();
    initThemeToggle();
    initLanguageToggle();
    initTypingEffect();
    initScrollReveal();
    initCounters();
    initSkillProgress();
    initBackToTop();
    initSmoothAnchors();
    initPageTransition();
    initVisitorCounter();
    initLiveClock();
    initStatusBadge();
    initCopyClipboard();
    initContactForm();
    initLightbox();
    initDocumentViewer();
    initGithub();
  });

  /* ------------------------------------------------------------------ */
  /* 20. Performance — centralized scroll dispatcher (debounce/throttle) */
  /* ------------------------------------------------------------------ */
  const scrollCallbacks = [];
  function onScroll(fn) {
    scrollCallbacks.push(fn);
  }
  function initScrollDispatcher() {
    let ticking = false;
    const run = () => {
      const y = window.scrollY;
      scrollCallbacks.forEach((fn) => fn(y));
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(run);
          ticking = true;
        }
      },
      { passive: true }
    );
    run();
  }

  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  }

  /* Simple deterministic hash → stable "random" number per string */
  function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  /* ------------------------------------------------------------------ */
  /* 18. Loading screen                                                  */
  /* ------------------------------------------------------------------ */
  function initLoader() {
    const loader = $("#loader");
    if (!loader) return;
    const minTime = 700;
    const start = Date.now();
    window.addEventListener("load", () => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, minTime - elapsed);
      setTimeout(() => loader.classList.add("hidden"), wait);
    });
    setTimeout(() => loader.classList.add("hidden"), 4000);
  }

  /* ------------------------------------------------------------------ */
  /* Cursor glow (skipped entirely on low-power / touch devices)         */
  /* ------------------------------------------------------------------ */
  function initCursorGlow() {
    const glow = $("#cursor-glow");
    if (!glow || window.matchMedia("(hover: none)").matches || document.documentElement.classList.contains("low-power")) {
      glow?.remove();
      return;
    }
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let curX = x;
    let curY = y;

    window.addEventListener("mousemove", (e) => {
      x = e.clientX;
      y = e.clientY;
    });

    function loop() {
      curX += (x - curX) * 0.12;
      curY += (y - curY) * 0.12;
      glow.style.transform = `translate(${curX}px, ${curY}px)`;
      requestAnimationFrame(loop);
    }
    loop();

    document.addEventListener("mouseover", (e) => {
      const hoverable = e.target.closest("a, button, .skill-card, .project-card");
      glow.style.opacity = hoverable ? "1.6" : "1";
    });
  }

  /* ------------------------------------------------------------------ */
  /* 2. Sticky navbar effect                                             */
  /* ------------------------------------------------------------------ */
  function initProgressBar() {
    const bar = $("#progress-bar");
    if (!bar) return;
    const update = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + "%";
    };
    onScroll(update);
  }

  function initHeaderScroll() {
    const header = $("#header");
    if (!header) return;
    let lastY = window.scrollY;

    onScroll((y) => {
      header.classList.toggle("scrolled", y > 40);
      if (y > lastY && y > 200) header.classList.add("hide-nav");
      else header.classList.remove("hide-nav");
      lastY = y;
    });

    /* ------------------------------------------------------------ */
    /* 3. Active navigation link via IntersectionObserver           */
    /* ------------------------------------------------------------ */
    const sections = $$("main section[id]");
    const navLinks = $$("#header nav a");
    if (!sections.length || !navLinks.length) return;

    const map = new Map(navLinks.map((a) => [a.getAttribute("href").replace("#", ""), a]));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = map.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ------------------------------------------------------------------ */
  /* 1. Mobile hamburger menu — open/close, outside click, scroll lock  */
  /* ------------------------------------------------------------------ */
  function initMobileMenu() {
    const toggle = $("#menu-toggle");
    const nav = $("#header nav");
    const overlay = $("#page-overlay");
    const header = $("#header");
    if (!toggle || !nav) return;

    const close = () => {
      nav.classList.remove("active");
      overlay?.classList.remove("active");
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      toggle.setAttribute("aria-label", "Open Menu");
      document.body.classList.remove("nav-lock");
    };

    const open = () => {
      nav.classList.add("active");
      overlay?.classList.add("active");
      toggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      toggle.setAttribute("aria-label", "Close Menu");
      document.body.classList.add("nav-lock");
    };

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      nav.classList.contains("active") ? close() : open();
    });

    overlay?.addEventListener("click", close);
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    /* click anywhere outside the nav/header closes the menu */
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("active")) return;
      if (header && !header.contains(e.target)) close();
    });
  }

  /* ------------------------------------------------------------------ */
  /* 4. Smooth scroll navigation (offset by sticky header)              */
  /* ------------------------------------------------------------------ */
  function initSmoothAnchors() {
    const header = $("#header");
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const offset = (header?.offsetHeight || 84) + 12;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
        history.pushState(null, "", id);
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 9. Theme toggle (dark / light) — persisted via localStorage        */
  /* ------------------------------------------------------------------ */
  function initThemeToggle() {
    const btn = $("#theme-toggle");
    if (!btn) return;
    const icon = btn.querySelector("i");

    const apply = (theme) => {
      document.documentElement.setAttribute("data-theme", theme);
      if (icon) icon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    };

    let saved = "dark";
    try {
      saved = localStorage.getItem("mnr-theme") || "dark";
    } catch (e) {
      /* storage unavailable */
    }
    apply(saved);

    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      apply(next);
      try {
        localStorage.setItem("mnr-theme", next);
      } catch (e) {
        /* storage unavailable */
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Language toggle (ID / EN) — lightweight indicator + persistence    */
  /* ------------------------------------------------------------------ */
  function initLanguageToggle() {
    const btn = $("#language-toggle");
    if (!btn) return;

    let lang = "id";
    try {
      lang = localStorage.getItem("mnr-lang") || "id";
    } catch (e) {
      /* noop */
    }

    const apply = (l) => {
      btn.textContent = l === "id" ? "🇮🇩" : "🇬🇧";
      btn.setAttribute("aria-label", l === "id" ? "Bahasa Indonesia" : "English");
      document.documentElement.setAttribute("lang", l === "id" ? "id" : "en");
    };
    apply(lang);

    btn.addEventListener("click", () => {
      lang = lang === "id" ? "en" : "id";
      apply(lang);
      try {
        localStorage.setItem("mnr-lang", lang);
      } catch (e) {
        /* noop */
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 5. Typing animation                                                */
  /* ------------------------------------------------------------------ */
  function initTypingEffect() {
    const el = $("#typing-text");
    if (!el) return;
    const words = ["Hospitality", "Customer Service", "Food & Beverage", "Web Development"];

    if (reduceMotion) {
      el.textContent = words[0];
      return;
    }

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const current = words[wordIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(tick, deleting ? 40 : 90);
    };
    tick();
  }

  /* ------------------------------------------------------------------ */
  /* 6. Scroll reveal (fade up / left / right / zoom)                   */
  /* ------------------------------------------------------------------ */
  function initScrollReveal() {
    const assign = (selector, type) => {
      $$(selector).forEach((el, i) => {
        if (!el.hasAttribute("data-reveal")) {
          el.setAttribute("data-reveal", type);
          el.style.transitionDelay = `${Math.min(i * 0.06, 0.4)}s`;
        }
      });
    };

    assign(".section-header", "up");
    assign(".about-card", "left");
    assign(".about-information", "right");
    assign(".skill-card", "up");
    assign(".timeline-item", "left");
    assign(".achievement-card", "zoom");
    assign(".github-card", "up");
    assign(".status-box", "up");
    assign(".document-card", "up");
    assign(".contact-card", "up");
    assign(".contribution-card", "zoom");
    assign(".visitor-card", "zoom");

    if (reduceMotion) {
      $$("[data-reveal]").forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    $$("[data-reveal]").forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------ */
  /* 7. Counter animation (achievement stats)                            */
  /* ------------------------------------------------------------------ */
  function initCounters() {
    const counters = $$(".achievement-card h3[data-target]");
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.getAttribute("data-target"), 10) || 0;
      const duration = 1400;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => observer.observe(c));
  }

  /* ------------------------------------------------------------------ */
  /* 8. Skill progress bars — injected per skill-card                    */
  /* ------------------------------------------------------------------ */
  function initSkillProgress() {
    const cards = $$(".skill-card");
    if (!cards.length) return;

    cards.forEach((card) => {
      if (card.querySelector(".skill-bar")) return;
      const label = card.querySelector("h3")?.textContent.trim() || "Skill";
      /* Deterministic placeholder proficiency (75–96%) based on skill name.
         Edit data-percent on .skill-bar-fill directly for exact real values. */
      const percent = 75 + (hashString(label) % 22);

      const bar = document.createElement("div");
      bar.className = "skill-bar";
      bar.innerHTML = `
        <div class="skill-bar-track">
          <div class="skill-bar-fill" data-percent="${percent}" style="width:0%"></div>
        </div>
        <span class="skill-bar-value">0%</span>`;
      card.appendChild(bar);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const fill = entry.target.querySelector(".skill-bar-fill");
          const valueEl = entry.target.querySelector(".skill-bar-value");
          if (fill) {
            const target = parseInt(fill.getAttribute("data-percent"), 10) || 0;
            requestAnimationFrame(() => {
              fill.style.width = target + "%";
            });
            animateNumber(valueEl, target);
          }
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    cards.forEach((c) => observer.observe(c));

    function animateNumber(el, target) {
      if (!el) return;
      const duration = 1000;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(progress * target) + "%";
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 19. Back to top                                                     */
  /* ------------------------------------------------------------------ */
  function initBackToTop() {
    const btn = $("#backToTop");
    if (!btn) return;
    onScroll((y) => btn.classList.toggle("show", y > 500));
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  }

  /* ------------------------------------------------------------------ */
  /* Page transition flash on internal nav                              */
  /* ------------------------------------------------------------------ */
  function initPageTransition() {
    const transition = $("#page-transition");
    if (!transition || reduceMotion) return;
    $$("#header nav a").forEach((a) => {
      a.addEventListener("click", () => {
        transition.classList.add("active");
        setTimeout(() => transition.classList.remove("active"), 650);
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Visitor counter (CountAPI, with localStorage fallback)             */
  /* ------------------------------------------------------------------ */
  function initVisitorCounter() {
    const el = $("#visitor-count");
    if (!el) return;
    const namespace = "mnr-portfolio-2026";
    const key = "visits";

    fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
      .then((res) => {
        if (!res.ok) throw new Error("countapi unavailable");
        return res.json();
      })
      .then((data) => {
        el.textContent = (data.value || 0).toLocaleString("id-ID");
      })
      .catch(() => {
        try {
          const count = (parseInt(localStorage.getItem("mnr-visits") || "0", 10) || 0) + 1;
          localStorage.setItem("mnr-visits", String(count));
          el.textContent = count.toLocaleString("id-ID");
        } catch (e) {
          el.textContent = "1";
        }
      });
  }

  /* ------------------------------------------------------------------ */
  /* 17. Live date / time badge inside hero status-card                 */
  /* ------------------------------------------------------------------ */
  function initLiveClock() {
    const statusCard = $(".status-card");
    if (!statusCard || statusCard.querySelector(".live-clock")) return;

    const clockDiv = document.createElement("div");
    clockDiv.className = "live-clock";
    clockDiv.innerHTML = '<i class="fa-regular fa-clock"></i> <span></span>';
    statusCard.appendChild(clockDiv);
    const span = clockDiv.querySelector("span");

    const update = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
        hour12: false,
      }).format(now);
      span.textContent = `${formatted} WIB`;
    };
    update();
    setInterval(update, 30000);
  }

  /* ------------------------------------------------------------------ */
  /* Online status badge on profile photo                                */
  /* ------------------------------------------------------------------ */
  function initStatusBadge() {
    const wrapper = $(".photo-wrapper");
    if (!wrapper || wrapper.querySelector(".status-dot")) return;
    const dot = document.createElement("span");
    dot.className = "status-dot";
    dot.setAttribute("title", "Open to work");
    wrapper.appendChild(dot);
  }

  /* ------------------------------------------------------------------ */
  /* 15. Copy to clipboard (email addresses)                             */
  /* ------------------------------------------------------------------ */
  function initCopyClipboard() {
    const targets = [];
    $$(".contact-card").forEach((card) => {
      const p = card.querySelector("p");
      if (p && p.textContent.includes("@")) targets.push(p);
    });
    const footerEmail = $$("footer .footer-social a[href^='mailto:']");
    footerEmail.forEach((a) => targets.push(a));

    targets.forEach((el) => {
      if (el.dataset.copyReady) return;
      el.dataset.copyReady = "1";
      el.classList.add("copyable");
      el.setAttribute("title", "Click to copy");
      el.addEventListener("click", (e) => {
        const text = el.tagName === "A" ? CONTACT_EMAIL : el.textContent.trim();
        if (el.tagName === "A") e.preventDefault();
        copyText(text, el);
      });
    });
  }

  function copyText(text, anchorEl) {
    const done = () => showCopyTooltip(anchorEl);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, cb) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (e) {
      /* ignore */
    }
    document.body.removeChild(ta);
    cb();
  }

  function showCopyTooltip(anchorEl) {
    const tip = document.createElement("span");
    tip.className = "copy-tooltip";
    tip.textContent = "Copied!";
    document.body.appendChild(tip);
    const rect = anchorEl.getBoundingClientRect();
    tip.style.top = rect.top + window.scrollY - 36 + "px";
    tip.style.left = rect.left + rect.width / 2 + "px";
    requestAnimationFrame(() => tip.classList.add("show"));
    setTimeout(() => {
      tip.classList.remove("show");
      setTimeout(() => tip.remove(), 300);
    }, 1200);
  }

  /* ------------------------------------------------------------------ */
  /* 13/14. Contact form — validation + mailto fallback / EmailJS hook  */
  /* ------------------------------------------------------------------ */
  function initContactForm() {
    const contactContainer = $("#contact .container");
    if (!contactContainer || $("#contact-form-card")) return;

    const card = document.createElement("div");
    card.id = "contact-form-card";
    card.className = "contact-form-card";
    card.setAttribute("data-reveal", "up");
    card.innerHTML = `
      <h3>Send a Message</h3>
      <p class="form-sub">Fill this out and I'll get back to you as soon as possible.</p>
      <form id="contactForm" novalidate>
        <div class="form-group">
          <label for="cf-name">Name</label>
          <input type="text" id="cf-name" name="name" placeholder="Your full name" autocomplete="name">
          <span class="form-error" data-for="cf-name"></span>
        </div>
        <div class="form-group">
          <label for="cf-email">Email</label>
          <input type="email" id="cf-email" name="email" placeholder="you@email.com" autocomplete="email">
          <span class="form-error" data-for="cf-email"></span>
        </div>
        <div class="form-group">
          <label for="cf-message">Message</label>
          <textarea id="cf-message" name="message" rows="4" placeholder="Write your message..."></textarea>
          <span class="form-error" data-for="cf-message"></span>
        </div>
        <button type="submit" class="btn form-submit">
          <span class="btn-label">Send Message</span>
          <span class="btn-spinner" hidden></span>
        </button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>`;
    contactContainer.appendChild(card);

    if (!reduceMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(card);
    } else {
      card.classList.add("in-view");
    }

    const form = $("#contactForm");
    const status = form.querySelector(".form-status");
    const submitBtn = form.querySelector(".form-submit");
    const label = submitBtn.querySelector(".btn-label");
    const spinner = submitBtn.querySelector(".btn-spinner");

    const fields = {
      name: form.querySelector("#cf-name"),
      email: form.querySelector("#cf-email"),
      message: form.querySelector("#cf-message"),
    };

    Object.values(fields).forEach((field) => {
      field.addEventListener("input", () => clearError(field));
    });

    function setError(field, message) {
      field.classList.add("error");
      const err = form.querySelector(`.form-error[data-for="${field.id}"]`);
      if (err) err.textContent = message;
      field.classList.remove("shake");
      void field.offsetWidth;
      field.classList.add("shake");
    }

    function clearError(field) {
      field.classList.remove("error");
      const err = form.querySelector(`.form-error[data-for="${field.id}"]`);
      if (err) err.textContent = "";
    }

    function validate() {
      let valid = true;
      if (!fields.name.value.trim()) {
        setError(fields.name, "Name is required.");
        valid = false;
      } else clearError(fields.name);

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!fields.email.value.trim()) {
        setError(fields.email, "Email is required.");
        valid = false;
      } else if (!emailPattern.test(fields.email.value.trim())) {
        setError(fields.email, "Enter a valid email address.");
        valid = false;
      } else clearError(fields.email);

      if (!fields.message.value.trim() || fields.message.value.trim().length < 10) {
        setError(fields.message, "Message must be at least 10 characters.");
        valid = false;
      } else clearError(fields.message);

      return valid;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.textContent = "";
      status.className = "form-status";
      if (!validate()) {
        status.textContent = "Please fix the highlighted fields.";
        status.classList.add("error");
        return;
      }

      label.hidden = true;
      spinner.hidden = false;
      submitBtn.disabled = true;

      /* --------------------------------------------------------------
         Optional: real email delivery via EmailJS.
         To enable, include the EmailJS SDK script tag in index.html and
         set these three values from your EmailJS account dashboard:
      -------------------------------------------------------------- */
      const EMAILJS_SERVICE_ID = "";
      const EMAILJS_TEMPLATE_ID = "";
      const EMAILJS_PUBLIC_KEY = "";

      const payload = {
        from_name: fields.name.value.trim(),
        from_email: fields.email.value.trim(),
        message: fields.message.value.trim(),
      };

      const finishOk = () => {
        label.hidden = false;
        spinner.hidden = true;
        submitBtn.disabled = false;
        status.textContent = "Message sent — thank you!";
        status.classList.add("success");
        form.reset();
      };

      const finishFallback = () => {
        const subject = encodeURIComponent(`Portfolio inquiry from ${payload.from_name}`);
        const body = encodeURIComponent(`${payload.message}\n\n— ${payload.from_name} (${payload.from_email})`);
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        label.hidden = false;
        spinner.hidden = true;
        submitBtn.disabled = false;
        status.textContent = "Opening your email client to send this message...";
        status.classList.add("success");
        form.reset();
      };

      if (window.emailjs && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        window.emailjs
          .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload, EMAILJS_PUBLIC_KEY)
          .then(finishOk)
          .catch(finishFallback);
      } else {
        setTimeout(finishFallback, 400);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Generic modal helper                                                */
  /* ------------------------------------------------------------------ */
  function createModal(className) {
    const overlay = document.createElement("div");
    overlay.className = `modal-overlay ${className}`;
    overlay.innerHTML = `
      <div class="modal-box">
        <button class="modal-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
        <div class="modal-body"></div>
      </div>`;
    document.body.appendChild(overlay);

    const close = () => {
      overlay.classList.remove("active");
      document.body.classList.remove("nav-lock");
      setTimeout(() => (overlay.querySelector(".modal-body").innerHTML = ""), 250);
    };

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    overlay.querySelector(".modal-close").addEventListener("click", close);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("active")) close();
    });

    return {
      open(bodyHtml) {
        overlay.querySelector(".modal-body").innerHTML = bodyHtml;
        overlay.classList.add("active");
        document.body.classList.add("nav-lock");
      },
      close,
      el: overlay,
    };
  }

  /* ------------------------------------------------------------------ */
  /* 11. Project image preview (lightbox)                                */
  /* ------------------------------------------------------------------ */
  let projectModal;
  function initLightbox() {
    projectModal = createModal("lightbox-overlay");
    document.addEventListener("click", (e) => {
      const card = e.target.closest(".project-card, .featured-card");
      if (!card) return;
      if (e.target.closest("a")) return; // let GitHub/demo links behave normally
      const owner = card.dataset.owner;
      const repo = card.dataset.repo;
      const name = card.dataset.name || repo;
      const desc = card.dataset.desc || "";
      const ghUrl = card.dataset.url || "#";
      const demoUrl = card.dataset.homepage || "";
      if (!repo) return;

      const img = owner ? `https://opengraph.githubassets.com/1/${owner}/${repo}` : "";
      projectModal.open(`
        <div class="lightbox-preview">
          ${img ? `<img src="${img}" alt="${escapeHtml(name)} preview" loading="lazy">` : ""}
          <div class="lightbox-info">
            <h3>${escapeHtml(name)}</h3>
            <p>${escapeHtml(desc || "No description available.")}</p>
            <div class="project-links">
              <a class="gh-btn" href="${ghUrl}" target="_blank" rel="noopener">GitHub</a>
              ${demoUrl ? `<a class="demo-btn" href="${demoUrl}" target="_blank" rel="noopener">Live Demo</a>` : ""}
            </div>
          </div>
        </div>`);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 12. Certificate / document fullscreen viewer with zoom             */
  /* ------------------------------------------------------------------ */
  function initDocumentViewer() {
    const viewer = createModal("doc-viewer-overlay");
    $$(".document-card").forEach((card) => {
      const previewLink = card.querySelector(".document-button a:first-child");
      if (!previewLink) return;
      const href = previewLink.getAttribute("href") || "";
      if (/\.pdf($|\?)/i.test(href)) return; // keep native behaviour for PDFs

      previewLink.addEventListener("click", (e) => {
        e.preventDefault();
        const title = card.querySelector("h3")?.textContent.trim() || "Document";
        viewer.open(`
          <div class="doc-viewer-inner">
            <img src="${href}" alt="${escapeHtml(title)}" class="doc-viewer-img">
            <p class="doc-viewer-hint">Click image to zoom</p>
          </div>`);
        const img = viewer.el.querySelector(".doc-viewer-img");
        img?.addEventListener("click", () => img.classList.toggle("zoomed"));
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 16. GitHub API — stats, contribution chart, repositories            */
  /* 10. Project filtering by category                                   */
  /* ------------------------------------------------------------------ */
  function initGithub() {
    loadGithubProfileStats();
    loadGithubContribution();
    loadGithubRepos();
  }

  function loadGithubProfileStats() {
    const repoEl = $("#repo-count");
    const followersEl = $("#followers");
    const followingEl = $("#following");

    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (repoEl) repoEl.textContent = data.public_repos ?? "0";
        if (followersEl) followersEl.textContent = data.followers ?? "0";
        if (followingEl) followingEl.textContent = data.following ?? "0";
      })
      .catch(() => {
        [repoEl, followersEl, followingEl].forEach((el) => el && (el.textContent = "—"));
      });
  }

  function loadGithubContribution() {
    const img = $("#github-contribution-image");
    if (!img) return;
    img.src = `https://ghchart.rshah.org/00f5d4/${GITHUB_USERNAME}`;
    img.alt = "GitHub Contribution Graph";
    img.loading = "lazy";
  }

  function categorize(repo) {
    const lang = (repo.language || "").toLowerCase();
    const text = `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
    if (/(android|kotlin|swift|flutter|react-native|ios)/.test(lang + text)) return "Mobile";
    if (/(machine.?learning|\bai\b|tensorflow|pytorch|neural|dataset|nlp)/.test(text)) return "AI";
    if (/(figma|design|ui.?ux|prototype)/.test(text)) return "Design";
    if (/(html|css|javascript|typescript|php|vue|react|node)/.test(lang)) return "Web";
    return "Other";
  }

  function loadGithubRepos() {
    const container = $("#github-projects");
    const featured = $("#featured-project");
    const starsEl = $("#stars");
    const searchInput = $("#search-project");
    const langFilter = $("#language-filter");
    const toolbar = $(".portfolio-toolbar");
    const emptyTemplate = $("#empty-repository");
    if (!container) return;

    container.innerHTML = '<div class="loading-spinner"></div>';
    let activeCategory = "all";

    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((repos) => {
        if (!Array.isArray(repos) || repos.length === 0) {
          renderEmpty();
          return;
        }

        const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
        if (starsEl) starsEl.textContent = totalStars;

        const languages = Array.from(new Set(repos.map((r) => r.language).filter(Boolean))).sort();
        if (langFilter) {
          const existing = new Set(Array.from(langFilter.options).map((o) => o.value));
          languages.forEach((lang) => {
            if (!existing.has(lang)) {
              const opt = document.createElement("option");
              opt.value = lang;
              opt.textContent = lang;
              langFilter.appendChild(opt);
            }
          });
        }

        /* 10. Category filter pills (All / Web / Mobile / AI / Design) */
        if (toolbar && !$(".filter-pills")) {
          const categories = ["All", "Web", "Mobile", "AI", "Design"];
          const pillWrap = document.createElement("div");
          pillWrap.className = "filter-pills";
          pillWrap.innerHTML = categories
            .map(
              (cat, i) =>
                `<button type="button" class="filter-pill${i === 0 ? " active" : ""}" data-cat="${cat.toLowerCase()}">${cat}</button>`
            )
            .join("");
          toolbar.parentNode.insertBefore(pillWrap, toolbar.nextSibling);

          pillWrap.addEventListener("click", (e) => {
            const btn = e.target.closest(".filter-pill");
            if (!btn) return;
            pillWrap.querySelectorAll(".filter-pill").forEach((p) => p.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = btn.dataset.cat;
            filterAndRender();
          });
        }

        const sortedByStars = [...repos].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
        const featuredRepo = sortedByStars[0];
        if (featured && featuredRepo) renderFeatured(featured, featuredRepo);

        renderProjects(repos);

        function filterAndRender() {
          const q = (searchInput?.value || "").toLowerCase().trim();
          const lang = langFilter?.value || "all";
          const filtered = repos.filter((r) => {
            const matchesQuery = !q || r.name.toLowerCase().includes(q) || (r.description || "").toLowerCase().includes(q);
            const matchesLang = lang === "all" || r.language === lang;
            const matchesCategory = activeCategory === "all" || categorize(r).toLowerCase() === activeCategory;
            return matchesQuery && matchesLang && matchesCategory;
          });
          renderProjects(filtered);
        }

        searchInput?.addEventListener("input", debounce(filterAndRender, 250));
        langFilter?.addEventListener("change", filterAndRender);
      })
      .catch(() => renderEmpty());

    function renderFeatured(el, repo) {
      const [owner] = repo.full_name ? repo.full_name.split("/") : [GITHUB_USERNAME];
      el.innerHTML = `
        <div class="featured-card" data-reveal="zoom" data-owner="${owner}" data-repo="${repo.name}"
             data-name="${escapeHtml(repo.name)}" data-desc="${escapeHtml(repo.description || "")}"
             data-url="${repo.html_url}" data-homepage="${repo.homepage || ""}">
          <div class="featured-media"><i class="fa-brands fa-github"></i></div>
          <div class="featured-body">
            <span>Featured Repository</span>
            <h3>${escapeHtml(repo.name)}</h3>
            <p>${escapeHtml(repo.description || "No description provided for this repository.")}</p>
            <div class="project-links">
              <a class="gh-btn" href="${repo.html_url}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i>&nbsp; Repository</a>
              ${repo.homepage ? `<a class="demo-btn" href="${repo.homepage}" target="_blank" rel="noopener">Live Demo</a>` : ""}
            </div>
          </div>
        </div>`;
      requestAnimationFrame(() => el.querySelector("[data-reveal]")?.classList.add("in-view"));
    }

    function renderProjects(repos) {
      if (!repos.length) {
        renderEmpty();
        return;
      }
      const grid = document.createElement("div");
      grid.className = "project-grid";
      repos.forEach((repo, i) => {
        const [owner] = repo.full_name ? repo.full_name.split("/") : [GITHUB_USERNAME];
        const card = document.createElement("div");
        card.className = "project-card";
        card.setAttribute("data-reveal", "up");
        card.dataset.owner = owner;
        card.dataset.repo = repo.name;
        card.dataset.name = repo.name;
        card.dataset.desc = repo.description || "";
        card.dataset.url = repo.html_url;
        card.dataset.homepage = repo.homepage || "";
        card.dataset.category = categorize(repo);
        card.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
        card.innerHTML = `
          <div class="project-image"><i class="fa-solid fa-code-branch"></i></div>
          <div class="project-body">
            <h3>${escapeHtml(repo.name)}</h3>
            <p>${escapeHtml(repo.description || "No description available.")}</p>
            <div class="tech-badge-row">
              ${repo.language ? `<span class="tech-badge">${escapeHtml(repo.language)}</span>` : ""}
              <span class="tech-badge"><i class="fa-solid fa-star"></i>&nbsp;${repo.stargazers_count || 0}</span>
            </div>
            <div class="project-links">
              <a class="gh-btn" href="${repo.html_url}" target="_blank" rel="noopener">GitHub</a>
              ${repo.homepage ? `<a class="demo-btn" href="${repo.homepage}" target="_blank" rel="noopener">Live Demo</a>` : ""}
            </div>
          </div>`;
        grid.appendChild(card);
      });
      container.innerHTML = "";
      container.appendChild(grid);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      grid.querySelectorAll("[data-reveal]").forEach((el) => (reduceMotion ? el.classList.add("in-view") : observer.observe(el)));
    }

    function renderEmpty() {
      container.innerHTML = "";
      if (emptyTemplate?.content) {
        container.appendChild(emptyTemplate.content.cloneNode(true));
      } else {
        container.innerHTML =
          '<div class="empty-card"><i class="fa-brands fa-github"></i><h2>No Repository Yet</h2><p>More awesome projects are coming soon.</p></div>';
      }
    }
  }
})();
