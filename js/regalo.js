const bow = document.getElementById("bow");
const gift = document.getElementById("gift");
const content = document.getElementById("content");
const intro = document.getElementById("intro");

let startX = 0;
let dragging = false;
let opened = false;

bow.addEventListener("pointerdown", (e) => {
  dragging = true;
  startX = e.clientX;
  bow.setPointerCapture(e.pointerId);
  bow.classList.add("dragging");
});

window.addEventListener("pointermove", (e) => {
  if (!dragging || opened) return;

  const delta = e.clientX - startX;
  const stretch = Math.max(-120, Math.min(120, delta));

  bow.style.transform = `translateX(calc(-50% + ${stretch}px)) scale(1.2)`;

  if (Math.abs(stretch) > 100) openGift();
});

window.addEventListener("pointerup", () => {
  dragging = false;
  bow.classList.remove("dragging");
  bow.style.transform = "translateX(-50%)";
});

function openGift() {
  if (opened) return;
  opened = true;

  gift.style.transition = "0.6s ease";
  gift.style.transform = "scale(1.1)";

  setTimeout(() => {
    gift.style.opacity = "0";
  }, 350);

  setTimeout(() => {
    gift.remove();

    // Mostrar bienvenida
    content.classList.remove("hidden");
    content.classList.add("visible");

    // Scroll EXACTO
    window.scrollTo({
      top: content.offsetTop,
      behavior: "smooth",
    });

    // Sacar intro del flujo sin romper layout
    intro.style.position = "fixed";
    intro.style.inset = "0";
    intro.style.opacity = "0";
    intro.style.pointerEvents = "none";

    setTimeout(() => intro.remove(), 500);
  }, 800);
}
