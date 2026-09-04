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

// -----------------------------------------------------
// MODE CARDS — detail modal
// -----------------------------------------------------

const modeModal = document.querySelector(".mode-modal");
const modeModalBg = modeModal?.querySelector(".mode-modal-bg");
const modeModalLabel = modeModal?.querySelector("#mode-modal-label");
const modeModalTitle = modeModal?.querySelector("#mode-modal-title");
const modeModalBody = modeModal?.querySelector(".mode-modal-body");
let lastModalTrigger = null;

function openModeModal(card, trigger) {
  modeModalBg.src = card.querySelector(".mode-bg").src;
  modeModalLabel.textContent = card.querySelector(".feature-label").textContent;
  modeModalTitle.textContent = card.querySelector("h4").textContent;
  modeModalBody.innerHTML = card.querySelector(".mode-more").innerHTML;

  modeModal.classList.add("open");
  modeModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lastModalTrigger = trigger;
  modeModal.querySelector(".mode-modal-close").focus();
}

function closeModeModal() {
  modeModal.classList.remove("open");
  modeModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastModalTrigger) {
    lastModalTrigger.focus();
    lastModalTrigger = null;
  }
}

document.querySelectorAll(".mode-more-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".mode-card");
    if (card) openModeModal(card, btn);
  });
});

modeModal?.querySelectorAll("[data-modal-close]").forEach(el => {
  el.addEventListener("click", closeModeModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modeModal?.classList.contains("open")) {
    closeModeModal();
  }
});
