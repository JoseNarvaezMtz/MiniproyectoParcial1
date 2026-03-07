const grid = document.querySelector(".grid");
let msnry;

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
      <h5>${r.nombre}</h5>
      <p>le regala a <strong>${r.objetivo}</strong></p>
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

document.addEventListener('DOMContentLoaded', () => {
    const parejas = getParejas();

    if (!parejas) {
        window.location.href = '/index.html';
        return;
    }

    render(parejas);
});
