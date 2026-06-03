const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const year = document.querySelector("#year");
const themeToggle = document.querySelector(".theme-toggle");

year.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem("onta-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  localStorage.setItem("onta-theme", theme);
}

setTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
  setTheme(nextTheme);
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((item) => {
  revealObserver.observe(item);
});

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const target = entry.target;
      const finalValue = Number(target.dataset.count);
      let current = 0;
      const step = Math.max(1, Math.ceil(finalValue / 50));

      const timer = window.setInterval(() => {
        current += step;
        if (current >= finalValue) {
          current = finalValue;
          window.clearInterval(timer);
        }
        target.textContent = finalValue === 100 ? `${current}%` : current;
      }, 24);

      countObserver.unobserve(target);
    });
  },
  { threshold: 0.8 }
);

document.querySelectorAll("[data-count]").forEach((counter) => {
  countObserver.observe(counter);
});

