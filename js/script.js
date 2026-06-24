/* =========================================================
   REEL MOMENTS – JavaScript
   1. AOS scroll animations   2. Mobile menu
   3. Sticky-header shadow     4. Animated counters
   5. Video modal              6. Contact form (mailto)
   7. Footer year
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. INITIALISE AOS (Animate On Scroll) ---------- */
  AOS.init({
    duration: 800,
    once: true,        // animate only the first time an element is seen
    offset: 120,
    easing: "ease-out-cubic",
    // turn animations off for users who prefer reduced motion
    disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  });

  /* ---------- 2. MOBILE MENU TOGGLE ---------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu   = document.getElementById("navMenu");

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  // close the menu when any link inside it is clicked
  navMenu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- 3. STICKY HEADER SHADOW ON SCROLL ---------- */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll);

  /* ---------- 4. ANIMATED STAT COUNTERS ---------- */
  const counters = document.querySelectorAll(".stat-num");

  const runCounter = (el) => {
    const target = +el.dataset.target;
    const duration = 1600;            // ms
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;   // make sure it lands exactly
    };
    requestAnimationFrame(tick);
  };

  // start counting only when the stats strip scrolls into view
  const statsObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        counters.forEach(runCounter);
        obs.disconnect();             // run once
      }
    });
  }, { threshold: 0.4 });

  const statsStrip = document.querySelector(".stats");
  if (statsStrip) statsObserver.observe(statsStrip);

  /* ---------- 5. VIDEO MODAL ---------- */
  const modal   = document.getElementById("videoModal");
  const iframe  = document.getElementById("modalIframe");
  const close   = document.getElementById("modalClose");

  document.querySelectorAll(".gallery-item.video").forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.dataset.video;  // YouTube video ID
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    iframe.src = "";                  // stop the video
    document.body.style.overflow = "";
  };

  close.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* ---------- 6. CONTACT FORM → opens email app (no server needed) ----------
     For a "real" form that emails you without opening the mail app,
     create a free form at https://formspree.io and replace this handler
     with: <form action="https://formspree.io/f/XXXX" method="POST">          */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name    = encodeURIComponent(form.name.value);
      const email   = encodeURIComponent(form.email.value);
      const type    = encodeURIComponent(form.eventType.value);
      const message = encodeURIComponent(form.message.value);

      const subject = `New event enquiry from ${form.name.value}`;
      const body =
        `Name: ${name}%0D%0A` +
        `Email: ${email}%0D%0A` +
        `Event type: ${type}%0D%0A%0D%0A` +
        `${message}`;

      // 👉 change this to your real inbox
      window.location.href = `mailto:info@ponixcorner.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
  }

  /* ---------- 7. CURRENT YEAR IN FOOTER ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});
