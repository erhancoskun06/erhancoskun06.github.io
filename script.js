const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a");

if (menuToggle && header) {
  menuToggle.addEventListener("click", () => {
    const next = !header.classList.contains("nav-open");
    header.classList.toggle("nav-open", next);
    menuToggle.setAttribute("aria-expanded", String(next));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header?.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});
