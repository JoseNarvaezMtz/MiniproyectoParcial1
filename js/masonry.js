const grid = document.querySelector(".grid");
let msnry;

const personas = [
  "Ana",
  "Luis",
  "Carlos",
  "María",
  "Pedro",
  "Sofía",
  "Laura",
  "Miguel",
  "Diego",
  "Camila",
  "Elena",
  "Raúl",
  "Fernando",
  "Valeria",
  "Paola",
];

// Aqui es donde vamos a cambiar esta madre que me dio chat por el resultado del sorteo
function generarRegalos(lista) {
  let mezclado = [...lista].sort(() => Math.random() - 0.5);

  return lista.map((p, i) => ({
    de: p,
    para: mezclado[i],
  }));
}

const regalos = generarRegalos(personas);

function randomHeight() {
  return Math.floor(Math.random() * 200) + 120;
}

function rainbowColor(i, total) {
  const hue = i * (360 / total);
  return `hsl(${hue},70%,60%)`;
}

function render(data) {
  data.forEach((r, i) => {
    const div = document.createElement("div");
    div.className = "grid-item";

    const card = document.createElement("div");
    card.className = "card";

    card.style.background = rainbowColor(i, data.length);
    card.style.height = randomHeight() + "px";

    card.innerHTML = `
      <h5>${r.de}</h5>
      <p>le regala a <strong>${r.para}</strong></p>
    `;

    div.appendChild(card);
    grid.appendChild(div);
  });

  msnry = new Masonry(grid, {
    itemSelector: ".grid-item",
    columnWidth: 220,
    gutter: 15,
    fitWidth: true,
  });
}

render(regalos);
