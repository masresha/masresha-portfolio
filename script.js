document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const preloader = document.getElementById("preloader");

  // Trigger initial page-load animation and hide preloader
  window.addEventListener("load", () => {
    document.body.classList.add("page-loaded");
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add("preloader--hide");
      }, 500);
    }
  });

  // Scroll-based reveal animations
  const revealEls = document.querySelectorAll(".reveal-on-scroll");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.25,
      }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show immediately if IntersectionObserver is not supported
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerOffset = 70;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    });
  });

  // Contact form: open mail client with prefilled body
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name")?.value || "";
      const email = document.getElementById("email")?.value || "";
      const company = document.getElementById("company")?.value || "";
      const message = document.getElementById("message")?.value || "";

      const subject = encodeURIComponent("Portfolio inquiry");
      const bodyLines = [
        name && `Name: ${name}`,
        email && `Email: ${email}`,
        company && `Company / Project: ${company}`,
        "",
        "Project details:",
        message,
      ].filter(Boolean);

      const body = encodeURIComponent(bodyLines.join("\n"));
      const mailto = `mailto:masresha.tsegaye@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailto;
    });
  }
});
