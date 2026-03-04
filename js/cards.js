//aqui se debe de manejar la lógica de sólo mostrar una card
const cards = document.querySelectorAll("#content .card");
let current = 0;

function showCard(index) {
  cards.forEach((card, i) => {
    card.classList.toggle("active", i === index);
  });
}

function initCards() {
  current = 0;
  showCard(current);
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-siguiente")) {
    e.preventDefault();
    if (current < cards.length - 1) {
      current++;
      showCard(current);
    }
  }

  if (e.target.classList.contains("btn-anterior")) {
    e.preventDefault();
    if (current > 0) {
      current--;
      showCard(current);
    }
  }
});

//Lógica para el día feriado
document.addEventListener("DOMContentLoaded", function () {
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
