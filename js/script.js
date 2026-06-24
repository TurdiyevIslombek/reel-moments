/* =========================================================
   PONIX CORNER – JavaScript
   1. Mobile menu      2. Sticky header
   3. Stat counters    4. Video modal
   5. Contact form     6. Footer year
   7. GSAP animations  (loaded last, fully guarded —
      if GSAP ever fails to load, the site still works
      and all content stays visible)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 1. MOBILE MENU ---------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open);
    });
    navMenu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- 2. STICKY HEADER ---------- */
  const header = document.getElementById("header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 3. STAT COUNTERS (no dependency) ---------- */
  const counters = document.querySelectorAll(".stat-num");
  if (counters.length && "IntersectionObserver" in window) {
    const run = (el) => {
      const target = +el.dataset.target || 0;
      const duration = 1600;
      const startTime = performance.now();
      const tick = (now) => {
        const p = Math.min((now - startTime) / duration, 1);
        el.textContent = Math.floor(p * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          counters.forEach(run);
          o.disconnect();
        }
      });
    }, { threshold: 0.4 });
    const strip = document.querySelector(".stats");
    if (strip) obs.observe(strip);
  }

  /* ---------- 4. VIDEO MODAL ---------- */
  const modal = document.getElementById("videoModal");
  const iframe = document.getElementById("modalIframe");
  const closeBtn = document.getElementById("modalClose");
  if (modal && iframe && closeBtn) {
    document.querySelectorAll(".gallery-item.video").forEach((item) => {
      item.addEventListener("click", () => {
        const id = item.dataset.video;
        if (!id) return;
        iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });
    const close = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      iframe.src = "";
      document.body.style.overflow = "";
    };
    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ---------- 5. CONTACT FORM ----------
     • If you haven't set up Formspree yet (action still contains
       YOUR_FORM_ID), the form opens the visitor's email app.
     • Once you paste your real Formspree ID, it submits in the
       background and shows a success message — no page reload.        */
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  if (form) {
    const endpoint = form.getAttribute("action") || "";
    const notConfigured = !endpoint || endpoint.includes("YOUR_FORM_ID");

    const setStatus = (msg, type) => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.className = "form-status show " + type;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = (document.getElementById("name").value || "").trim();
      const email = (document.getElementById("email").value || "").trim();
      const eventType = (document.getElementById("eventType").value || "").trim();
      const message = (document.getElementById("message").value || "").trim();

      // --- Fallback: open the email app (no Formspree yet) ---
      if (notConfigured) {
        const subject = `New event enquiry from ${name}`;
        const body =
          `Name: ${name}\r\nEmail: ${email}\r\nEvent type: ${eventType}\r\n\r\n${message}`;
        window.location.href =
          `mailto:info@ponixcorner.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setStatus("Opening your email app…", "info");
        return;
      }

      // --- Real submission via Formspree ---
      const btn = form.querySelector('button[type="submit"]');
      const label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending…";
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          setStatus("Thank you! Your message has been sent — we'll reply within 24 hours.", "success");
          form.reset();
        } else {
          setStatus("Sorry, something went wrong. Please WhatsApp us instead.", "error");
        }
      } catch (err) {
        setStatus("Network error. Please WhatsApp us instead.", "error");
      } finally {
        btn.disabled = false;
        btn.textContent = label;
      }
    });
  }

  /* ---------- 6. FOOTER YEAR ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 7. GSAP ANIMATIONS (guarded) ---------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.gsap && !reduceMotion) {
    const gsap = window.gsap;
    const hasScrollTrigger = !!window.ScrollTrigger;
    if (hasScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    // Header glides down on load
    gsap.from(".header", { y: -90, opacity: 0, duration: 1, ease: "power3.out" });

    // Hero entrance — staggered, cinematic
    gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } })
      .from(".hero-text .eyebrow", { y: 24, opacity: 0 }, 0.15)
      .from(".hero-title", { y: 36, opacity: 0 }, "-=0.70")
      .from(".hero-lead", { y: 22, opacity: 0 }, "-=0.70")
      .from(".hero-buttons .btn", { y: 20, opacity: 0, stagger: 0.12 }, "-=0.60")
      .from(".hero-trust", { y: 14, opacity: 0 }, "-=0.55")
      .from(".hero-media", { x: 70, opacity: 0, duration: 1.2 }, "-=1.05");

    // Scroll-reveal every element marked with data-aos (except the hero,
    // which has its own intro above). Direction comes from the attribute.
    if (hasScrollTrigger) {
      gsap.utils.toArray("[data-aos]").forEach((el) => {
        if (el.closest(".hero")) return;
        const type = el.dataset.aos || "";
        const delay = (parseFloat(el.dataset.aosDelay) || 0) / 1000;
        const vars = {
          opacity: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        };
        if (type.includes("up")) vars.y = 46;
        if (type.includes("left")) vars.x = 60;
        if (type.includes("right")) vars.x = -60;
        if (type.includes("zoom")) vars.scale = 0.92;
        gsap.from(el, vars);
      });
    }
  }
});
