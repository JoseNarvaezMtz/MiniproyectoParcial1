
//FESTIVIDADES PARA EL DRAG & DROP
const FESTIVIDADES = {
    f1: { nombre: "Navidad",      color: "#165B33" },
    f2: { nombre: "Halloween",    color: "#FF6B00" },
    f3: { nombre: "Cumpleaños",   color: "#9B59B6" },
    f4: { nombre: "San Valentín", color: "#C0392B" },
    f5: { nombre: "Año Nuevo",    color: "#1A1A2E" },
    fn: { nombre: "Personalizado",color: "#2C3E50" },
};

let festividadArrastrada = null;

//Inicializamos con los canvas
function inicializarCanvas() {
    document.querySelectorAll('canvas.festividad').forEach(canvas => {
        const datos = FESTIVIDADES[canvas.id];
        if (!datos) return;

        const ctx = canvas.getContext('2d');
        canvas.width  = canvas.parentElement.offsetWidth  || 120;
        canvas.height = canvas.parentElement.offsetHeight || 120;

        // Fondo
        ctx.fillStyle = datos.color;
        ctx.roundRect(0, 0, canvas.width, canvas.height, 12);
        ctx.fill();

        // Nombre
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${canvas.width * 0.13}px sans-serif`;
        ctx.fillText(datos.nombre, canvas.width / 2, canvas.height * 0.82);

        // Hacer draggable
        canvas.setAttribute('draggable', true);
        canvas.style.cursor = 'grab';
    });
}

function crearZonaDrop() {
    const card5 = document.getElementById('card-evento');
    if (!card5 || document.getElementById('drop-zona-festividad')) return;

    // Div de la zona del drop
    const zona = document.createElement('div');
    zona.id = 'drop-zona-festividad';
    zona.style.cssText = `
        border: 2px dashed #ccc;
        border-radius: 10px;
        padding: 16px;
        text-align: center;
        margin-bottom: 12px;
        transition: background 0.2s;
        min-height: 60px;
    `;
    zona.innerHTML = '<span class="text-muted">Arrastrar festividad AQUI</span>';

    // Agregamos la zona al formulario
    const form = card5.querySelector('form');
    form.insertAdjacentElement('beforebegin', zona);

    // --- dragover: se dispara mientras el elemento está sobre la zona ---
    zona.addEventListener('dragover', e => {
        e.preventDefault();
        zona.style.background = '#e8f4fd';
    });

    // --- dragleave: cuando el elemento sale de la zona sin soltar ---
    zona.addEventListener('dragleave', () => {
        zona.style.background = '';
    });

    // --- drop: cuando el usuario suelta el canvas sobre la zona ---
    zona.addEventListener('drop', e => {
        e.preventDefault();
        zona.style.background = '';

        if (!festividadArrastrada) return;

        const datos = FESTIVIDADES[festividadArrastrada];

        // Actualiza el contenido visual de la zona con la festividad elegida
        zona.innerHTML = `
            <strong style="color:${datos.color}; margin-left:8px; font-size:1rem">
                ${datos.nombre}
            </strong>
        `;

        // Actualiza el texto pequeño en el navbar
        actualizarNavbar(datos);

        // Guarda en localStorage para uso posterior en setDatosEvento()
        setFestividad({ id: festividadArrastrada, ...datos });
    });
}

//Funcion para inicializar los canvas de drag
function inicializarDrag() {
    document.querySelectorAll('canvas.festividad').forEach(canvas => {

        canvas.addEventListener('dragstart', e => {
            festividadArrastrada = canvas.id;
            e.dataTransfer.effectAllowed = 'copy';
            canvas.style.opacity = '0.5';
        });

        canvas.addEventListener('dragend', () => {
            canvas.style.opacity = '1';
            festividadArrastrada = null;
        });
    });
}

function actualizarNavbar(datos) {
    let indicador = document.getElementById('navbar-festividad-activa');

    // Si no existe el indicador, lo crea una sola vez
    if (!indicador) {
        indicador = document.createElement('small');
        indicador.id = 'navbar-festividad-activa';
        indicador.style.cssText = `
            font-size: 2rem;
            color: white;
            margin-left: 12px;
            align-self: center;
        `;
        // Lo inserta dentro del div de redes sociales del navbar
        const navRedes = document.querySelector('.lc-block.d-flex.ms-auto');
        if (navRedes) navRedes.insertAdjacentElement('beforebegin', indicador);
    }

    // Actualiza el texto cada vez que cambia la festividad
    indicador.textContent = `${datos.nombre}`;
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarCanvas();
    crearZonaDrop();
    inicializarDrag();

    // Si ya hay festividad, la restauramos pa que se vea el localStorage
    const guardada = getFestividad();
    if (guardada) {
        actualizarNavbar(guardada);

        const zona = document.getElementById('drop-zona-festividad');
        if (zona) {
            zona.innerHTML = `
                <strong style="color:${guardada.color}; margin-left:8px; font-size:1rem">
                    ${guardada.nombre}
                </strong>
            `;
        }
    }
});
