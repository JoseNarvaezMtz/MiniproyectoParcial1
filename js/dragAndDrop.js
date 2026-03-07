//FESTIVIDADES PARA EL DRAG & DROP
const FESTIVIDADES = {
  f1: {
    nombre: "Navidad",
    tema: "theme-Navidad",
    color: "#165B33",
    fecha: "2026-12-25",
  },
  f2: {
    nombre: "Halloween",
    tema: "theme-Halloween",
    color: "#FF6B00",
    fecha: "2026-10-31",
  },
  f3: {
    nombre: "San Valentín",
    tema: "theme-San-Valentin",
    color: "#C0392B",
    fecha: "2027-02-14",
  },
  f4: {
    nombre: "Año Nuevo",
    tema: "theme-Ano-Nuevo",
    color: "#1A1A2E",
    fecha: "2026-12-31",
  },
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

    aplicarFecha(datos.fecha);

    guardarFestividad();
  });
}

function normalizarTema(texto) {
  return texto
    .normalize("NFD") // Separa letras de sus acentos
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
    .trim()
    .replace(/\s+/g, "-");
}

function guardarFestividad() {
  let label = document.getElementById("zona-festividad");
  const festividades = Array.from(FESTIVIDADES).map((el) =>
    el.getAttribute("nombre"),
  );

  if (festividades.includes(label.value)) {
    setFestividad({ id: festividadArrastrada, ...datos });
  } else {
    setFestividad({
      id: "fn",
      nombre: label.value,
      tema: `theme-${normalizarTema(label.value)}`,
      color: "#413f3f05",
    });
  }
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

  label.value = datos.nombre;
}

function aplicarFecha(fecha) {
  const elemento = document.getElementById("input-fecha-intercambio");
  elemento.value = fecha;
}

function inicializarFecha() {
  const elemento = document.getElementById("input-fecha-intercambio");
  elemento.value = new Date().toISOString().split("T")[0];
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
  zona.value = guardada.nombre;

  form.insertAdjacentElement("beforebegin", zona);
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarCanvas();
  crearZonaDrop();
  inicializarDrag();
  inicializarLabel();
  inicializarFecha();

  // Si ya hay festividad, la restauramos pa que se vea el localStorage
  const guardada = getFestividad();
  if (guardada) {
    actualizarNavbar(guardada);

    const zona = document.getElementById("zona-festividad");
    if (zona) {
      zona.value = guardada.nombre;
    }
    aplicarTema(guardada.tema);
  }
});

function aplicarTema(tema) {
  document.body.classList.remove(
    "theme-Navidad",
    "theme-Halloween",
    "theme-San-Valentin",
    "theme-Ano-Nuevo",
  );

  document.body.classList.add(tema);
}
