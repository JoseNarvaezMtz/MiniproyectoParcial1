// ================================
// CONTROL DE CARDS
// ================================

const cards = document.querySelectorAll("#content .card");
let current = 0;

function showCard(index) {
  cards.forEach((card, i) => {
    card.classList.remove("active", "fly-out");

    if (i === index) {
      card.style.display = "block";

      // pequeña espera para que la animación se aplique
      setTimeout(() => {
        card.classList.add("active");
      }, 10);
    } else {
      card.style.display = "none";
    }
  });
}

function nextCard() {
  if (current >= cards.length - 1) return;

  const cardActual = cards[current];

  cardActual.classList.add("fly-out");

  setTimeout(() => {
    current++;
    showCard(current);
  }, 500);
}

function prevCard() {
  if (current <= 0) return;

  current--;
  showCard(current);
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-siguiente")) {
    e.preventDefault();
    nextCard();
  }

  if (e.target.classList.contains("btn-anterior")) {
    e.preventDefault();
    prevCard();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  showCard(current);

  const offcanvasElement = document.getElementById("navbarNavHamburger");
  const offcanvas = new bootstrap.Offcanvas(offcanvasElement);

  const btnCelebridad = document.getElementById("btnCelebridad");

  btnCelebridad.addEventListener("click", function () {
    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const dia = hoy.getDate();

    if (mes === 12 && dia === 25) {
      console.log("Es día feriado 🎄");
    }

    offcanvas.show();
  });
});
