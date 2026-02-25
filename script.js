document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const preloader = document.getElementById("preloader");
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  const scrollProgressBar = document.querySelector(".scroll-progress-bar");
  const testimonialsTrack = document.querySelector(".testimonials-track");
  const testimonialCards = testimonialsTrack ? Array.from(testimonialsTrack.children) : [];
  const prevTestimonialBtn = document.querySelector(".testimonial-nav--prev");
  const nextTestimonialBtn = document.querySelector(".testimonial-nav--next");
  const testimonialDots = Array.from(document.querySelectorAll(".testimonial-dot"));

  // Trigger initial page-load animation and hide preloader
  window.addEventListener("load", () => {
    document.body.classList.add("page-loaded");
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add("preloader--hide");
      }, 500);
    }
  });

  // Mobile nav toggle
  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav-open");
      navToggle.classList.toggle("is-open", isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav-open");
        navToggle.classList.remove("is-open");
      });
    });
  }

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
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

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

      if (link.closest(".nav") && navLinks.length) {
        navLinks.forEach((navLink) => {
          navLink.classList.toggle("active", navLink === link);
        });
      }
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

  // Scroll spy for navbar active state
  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const id = visible.target.id;

        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          link.classList.toggle("active", href === `#${id}`);
        });
      },
      {
        root: null,
        threshold: 0.4,
      }
    );

    sections.forEach((section) => spyObserver.observe(section));
  }

  // Header scroll progress indicator
  if (scrollProgressBar) {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      scrollProgressBar.style.transform = `scaleX(${progress})`;
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();
  }

   // Testimonials carousel
  if (testimonialsTrack && testimonialCards.length) {
    let currentTestimonialIndex = 0;

    const updateTestimonialCarousel = (index) => {
      const clampedIndex = (index + testimonialCards.length) % testimonialCards.length;
      currentTestimonialIndex = clampedIndex;
      const offset = -clampedIndex * 100;
      testimonialsTrack.style.transform = `translateX(${offset}%)`;

      if (testimonialDots.length) {
        testimonialDots.forEach((dot, dotIndex) => {
          dot.classList.toggle("is-active", dotIndex === clampedIndex);
        });
      }
    };

    if (prevTestimonialBtn) {
      prevTestimonialBtn.addEventListener("click", () => {
        updateTestimonialCarousel(currentTestimonialIndex - 1);
      });
    }

    if (nextTestimonialBtn) {
      nextTestimonialBtn.addEventListener("click", () => {
        updateTestimonialCarousel(currentTestimonialIndex + 1);
      });
    }

    if (testimonialDots.length) {
      testimonialDots.forEach((dot) => {
        dot.addEventListener("click", () => {
          const idx = Number(dot.getAttribute("data-index"));
          if (!Number.isNaN(idx)) {
            updateTestimonialCarousel(idx);
          }
        });
      });
    }

    let autoSlideId;
    const startAutoSlide = () => {
      autoSlideId = window.setInterval(() => {
        updateTestimonialCarousel(currentTestimonialIndex + 1);
      }, 7000);
    };

    const stopAutoSlide = () => {
      if (autoSlideId) {
        window.clearInterval(autoSlideId);
        autoSlideId = undefined;
      }
    };

    const carousel = document.querySelector(".testimonials-carousel");
    if (carousel) {
      carousel.addEventListener("mouseenter", stopAutoSlide);
      carousel.addEventListener("mouseleave", startAutoSlide);
    }

    updateTestimonialCarousel(0);
    startAutoSlide();
  }
});
