const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const year = document.querySelector("#year");
const form = document.querySelector("#contactForm");
const formStatus = document.querySelector(".form-status");
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

const manualMailLink = document.querySelector("#manualMailLink");

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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = String(formData.get("name") || "");
  const contact = String(formData.get("contact") || "");
  const service = String(formData.get("service") || "");
  const userMessage = String(formData.get("message") || "");
  const message = [
    "Hello Onta International Limited,",
    "",
    `Name: ${name}`,
    `Phone or email: ${contact}`,
    `Service: ${service}`,
    `Message: ${userMessage}`,
  ].join("\n");

  const email = "ontainternationalltd@gmail.com";
  const subject = encodeURIComponent(`New message from ${name || "website visitor"}`);
  const body = encodeURIComponent(message);
  const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

  formStatus.textContent = "Opening your email app with the message ready to send.";
  if (manualMailLink) {
    manualMailLink.style.display = "none";
    manualMailLink.href = "#";
  }

  try {
    window.location.href = mailtoUrl;
  } catch (e) {
    // continue to fallback behavior
  }

  window.setTimeout(() => {
    try {
      window.open(mailtoUrl, "_self");
    } catch (e) {}

    const mailtoLink = document.createElement("a");
    mailtoLink.href = mailtoUrl;
    mailtoLink.target = "_self";
    mailtoLink.rel = "noopener noreferrer";
    mailtoLink.style.display = "none";
    document.body.appendChild(mailtoLink);
    mailtoLink.click();
    document.body.removeChild(mailtoLink);
  }, 150);

  window.setTimeout(() => {
    formStatus.innerHTML = `If your phone didn't open an email app, <a href="${mailtoUrl}">tap here</a> to open email manually.`;
    if (manualMailLink) {
      manualMailLink.href = mailtoUrl;
      manualMailLink.style.display = "block";
    }
  }, 400);

  form.reset();
});
