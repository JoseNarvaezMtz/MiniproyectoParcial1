const bow = document.getElementById("bow");
const gift = document.getElementById("gift");
const content = document.getElementById("content");
const intro = document.getElementById("intro");

let startX = 0;
let dragging = false;
let opened = false;

//bloquear scroll
document.body.classList.add("lock-scroll");

bow.addEventListener("pointerdown", (e) => {
  if (opened) return;

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

  // Se abre solo una vez y bloquea drag inmediatamente
  if (Math.abs(stretch) > 100) {
    dragging = false;
    openGift();
  }
});

window.addEventListener("pointerup", () => {
  if (opened) return;

  dragging = false;
  bow.classList.remove("dragging");
  bow.style.transform = "translateX(-50%)";
});

function openGift() {
  if (opened) return;
  opened = true;

  // Desactivar eventos del bow
  bow.style.pointerEvents = "none";

  // Animación caja
  gift.style.transition = "0.6s ease";
  gift.style.transform = "scale(1.1)";
  gift.style.opacity = "0";

  setTimeout(() => {
    intro.classList.add("closing");

    intro.addEventListener(
      "animationend",
      () => {
        intro.remove();

        document.body.classList.remove("lock-scroll");
      },
      { once: true },
    );
  }, 500);
}