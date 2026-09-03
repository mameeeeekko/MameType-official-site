const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 30);
}
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.classList.toggle("active", open);
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
