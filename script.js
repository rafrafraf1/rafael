const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#site-menu");
const backTop = document.querySelector("[data-back-top]");
const emailButton = document.querySelector(".copy-email");
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const detailButtons = document.querySelectorAll(".details-button");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateChrome() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progressWidth = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  header.classList.toggle("is-scrolled", scrollTop > 20);
  backTop.classList.toggle("is-visible", scrollTop > 520);
  progress.style.width = `${Math.min(progressWidth, 100)}%`;
}

function animateCounter(counter) {
  if (counter.dataset.done === "true") return;
  counter.dataset.done = "true";

  const target = Number(counter.dataset.count);
  if (reducedMotion) {
    counter.textContent = target;
    return;
  }

  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const elapsed = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    counter.textContent = Math.round(target * eased);
    if (elapsed < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    if (entry.target.matches("[data-count]")) animateCounter(entry.target);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => observer.observe(item));
counters.forEach((counter) => observer.observe(counter));

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));

    projectCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

detailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".project-card");
    const isOpen = card.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.textContent = isOpen ? "Hide details" : "Details";
  });
});

if (emailButton) {
  emailButton.addEventListener("click", async () => {
    const email = emailButton.dataset.email;
    const originalText = "Copy email";

    try {
      await navigator.clipboard.writeText(email);
      emailButton.textContent = "Copied";
    } catch {
      window.location.href = `mailto:${email}`;
      emailButton.textContent = "Email opened";
    }

    window.setTimeout(() => {
      emailButton.textContent = originalText;
    }, 1800);
  });
}

if (backTop) {
  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });
}

window.addEventListener("scroll", updateChrome, { passive: true });
window.addEventListener("resize", updateChrome);
updateChrome();
