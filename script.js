const body = document.body;
const header = document.getElementById("siteHeader");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const cursorGlow = document.getElementById("cursorGlow");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const navItems = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");

document.getElementById("currentYear").textContent = new Date().getFullYear();

function setTheme(theme) {
  const isDark = theme === "dark";
  body.classList.toggle("dark", isDark);
  themeIcon.textContent = isDark ? "☀" : "◐";
  localStorage.setItem("portfolio-theme", theme);
}

const savedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  setTheme(body.classList.contains("dark") ? "light" : "dark");
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("open");
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 160;
    if (window.scrollY >= sectionTop) {
      current = section.id;
    }
  });

  navItems.forEach((item) => {
    item.classList.toggle(
      "active",
      item.getAttribute("href") === `#${current}`
    );
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
  {
    threshold: 0.12,
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const shouldShow =
        filter === "all" || card.dataset.category === filter;

      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX = mouseX;
let glowY = mouseY;

window.addEventListener("mousemove", (event) => {
  if (window.innerWidth < 900) return;

  mouseX = event.clientX;
  mouseY = event.clientY;
  cursorGlow.style.opacity = "1";
});

function animateCursorGlow() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;

  cursorGlow.style.left = `${glowX}px`;
  cursorGlow.style.top = `${glowY}px`;

  requestAnimationFrame(animateCursorGlow);
}

animateCursorGlow();

window.addEventListener("mouseleave", () => {
  cursorGlow.style.opacity = "0";
});
