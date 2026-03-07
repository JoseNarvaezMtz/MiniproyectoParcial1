//FESTIVIDADES PARA EL DRAG & DROP
const FESTIVIDADES = {
  f1: { nombre: "Navidad", tema: "theme-navidad", color: "#165B33" },
  f2: { nombre: "Halloween", tema: "theme-halloween", color: "#FF6B00" },
  f3: { nombre: "San Valentín", tema: "theme-valentin", color: "#C0392B" },
  f4: { nombre: "Año Nuevo", tema: "theme-anonuevo", color: "#1A1A2E" },
};

let festividadArrastrada = null;

//Inicializamos con los canvas
function inicializarCanvas() {
  document.querySelectorAll("canvas.festividad").forEach((canvas) => {
    const datos = FESTIVIDADES[canvas.id];
    if (!datos) return;

    const ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement.offsetWidth || 120;
    canvas.height = canvas.parentElement.offsetHeight || 120;

    // Fondo
    ctx.fillStyle = datos.color;
    ctx.roundRect(0, 0, canvas.width, canvas.height, 12);
    ctx.fill();

    // Nombre
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold ${canvas.width * 0.13}px sans-serif`;

    // Hacer draggable
    if (canvas.id == "fn") return;

    canvas.setAttribute("draggable", true);
    canvas.style.cursor = "grab";
  });
}

function crearZonaDrop() {
  // Ya existe en el HTML, solo lo buscamos
  const zona = document.getElementById("content");
  if (!zona) return;

  zona.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  zona.addEventListener("drop", (e) => {
    e.preventDefault();

    if (!festividadArrastrada) return;

    const datos = FESTIVIDADES[festividadArrastrada];

    actualizarNavbar(datos);
    actualizarLabel(datos);

    aplicarTema(datos.tema);

    setFestividad({ id: festividadArrastrada, ...datos });
  });
}

//Funcion para inicializar los canvas de drag
function inicializarDrag() {
  document.querySelectorAll("canvas.festividad").forEach((canvas) => {
    if (canvas.id == "fn") return;

    canvas.addEventListener("dragstart", (e) => {
      festividadArrastrada = canvas.id;
      e.dataTransfer.effectAllowed = "copy";
      canvas.style.opacity = "0.5";
    });

    canvas.addEventListener("dragend", () => {
      canvas.style.opacity = "1";
      festividadArrastrada = null;
    });
  });
}

function actualizarNavbar(datos) {
  let indicador = document.getElementById("navbar-festividad-activa");

  // Si no existe el indicador, lo crea una sola vez
  if (!indicador) {
    indicador = document.createElement("small");
    indicador.id = "navbar-festividad-activa";
    indicador.style.cssText = `
            font-size: 2rem;
            color: white;
            margin-left: 12px;
            align-self: center;
        `;
    // Lo inserta dentro del div de redes sociales del navbar
    const navRedes = document.querySelector(".lc-block.d-flex.ms-auto");
    if (navRedes) navRedes.insertAdjacentElement("beforebegin", indicador);
  }

  // Actualiza el texto cada vez que cambia la festividad
  indicador.textContent = `${datos.nombre}`;
}

function actualizarLabel(datos) {
  let label = document.getElementById("zona-festividad");

  label.innerHTML = `
        <strong style="color:${datos.color}; margin-left:8px; font-size:1rem">
            ${datos.nombre}
        </strong>
    `;
}

function inicializarLabel() {
  const card5 = document.getElementById("card-evento");
  const form = card5.querySelector("form");
  const guardada = getFestividad();

  const zona = document.createElement("input");
  zona.id = "zona-festividad";
  zona.classList.add("form-control");

  zona.style.cssText = `
        border: 2px dashed #ccc;
        border-radius: 10px;
        padding: 8px;
        text-align: center;
        margin-bottom: 8px;
        min-height: 60px;
    `;
  zona.innerHTML = `
        <strong style="color:${guardada.color}; margin-left:8px; font-size:1rem">
            ${guardada.nombre}
        </strong>
    `;

  form.insertAdjacentElement("beforebegin", zona);
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarCanvas();
  crearZonaDrop();
  inicializarDrag();
  inicializarLabel();

  // Si ya hay festividad, la restauramos pa que se vea el localStorage
  const guardada = getFestividad();
  if (guardada) {
    actualizarNavbar(guardada);

    const zona = document.getElementById("zona-festividad");
    if (zona) {
      zona.innerHTML = `
                <strong style="color:${guardada.color}; margin-left:8px; font-size:1rem">
                    ${guardada.nombre}
                </strong>
            `;
    }
    aplicarTema(guardada.tema);
  }
});

function aplicarTema(tema) {
  document.body.classList.remove(
    "theme-navidad",
    "theme-halloween",
    "theme-valentin",
    "theme-anonuevo",
  );

  document.body.classList.add(tema);
}
