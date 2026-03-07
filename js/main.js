//CODIGO QUE VINCULA LOS REGISTROS Y FUNCIONALIDADES CON EL INDEX

var idEtiqueta = 0;

//Funcion para registrar datos evento
const inputNombreOrg = document.getElementById('input-nombre-organizador');
const inputFecha = document.getElementById('input-fecha-intercambio');
const inputPresupuesto = document.getElementById('input-monto-intercambio');

//FUNCION PARA LA NAVEGACION DE PARTICIPANTES
function generarLista(elemento) {
    let checkboxs = '';
    const participantes = obtenerParticipantes();
    const listaValidos = obtenerValidosParticipante(participantes[idEtiqueta]);

    participantes.forEach(participante => {
        if (participante === participantes[idEtiqueta]) return;

        const checado = !listaValidos.includes(participante);

        checkboxs += `<input type="checkbox" id="${participante}" name="validos" 
                        value="${participante}" ${checado ? 'checked' : ''}>
                      <label for="${participante}">${participante}</label><br>`;
    });

    elemento.innerHTML = checkboxs;
}

function inicializarTarjetaExcepcion(elemento) {
    elemento.innerHTML = `
    <div class="card-body">
        <h5 class="card-title text-center">Excepciones</h5>
        <div class="mb-3">
            <label class="form-label">Nombre:</label>
            <input type="text" class="form-control" id="input-participante-excepcion" disabled/>
        </div>
        <div class="mb-3">
            <label class="form-label">Selecciona excepción:</label>
            <div class="container-checkbox-registros"></div>
        </div>
        <div class="d-flex justify-content-around flex-column flex-md-row justify-content-md-between gap-2 mt-3">
            <button class="btn btn-primary mb-4 d-flex" id="btn-agregar-excepciones">Agregar</button>
            <button type="button" class="btn btn-primary mb-4 d-flex" id="boton-verificar-excepcion"
                data-bs-toggle="modal" data-bs-target="#modalResumen">
                Terminado
            </button>
        </div>
        <div class="d-flex justify-content-around mt-3">
            <button type="button" class="btn btn-primary" id="btn-excepcion-anterior">←</button>
            <button type="button" class="btn btn-primary" id="btn-excepcion-siguiente">→</button>
        </div>
    </div>
    `;

    const botonAgregar = elemento.querySelector('#btn-agregar-excepciones');
    botonAgregar.addEventListener('click', () => {
        const resultado = guardarExcepcionesActuales(elemento);
        if (!resultado.exito) alert(resultado.razon);
        else alert('Excepciones guardadas');
    });

    botonVerificar.addEventListener('click', (e) => {
        const resultado = guardarExcepcionesActuales(elemento);
        if (!resultado.exito) {
            e.stopPropagation(); // Evita que Bootstrap abra el modal
            alert(resultado.razon);
        }
    });

    const botonSiguiente = elemento.querySelector('#btn-excepcion-siguiente');
    botonSiguiente.addEventListener('click', () => {
        const participantes = obtenerParticipantes();
        if (idEtiqueta < participantes.length - 1) {
            idEtiqueta++;
            actualizarTarjetaExcepcion(elemento);
        }
    });

    const botonAnterior = elemento.querySelector('#btn-excepcion-anterior');
    botonAnterior.addEventListener('click', () => {
        if (idEtiqueta > 0) {
            idEtiqueta--;
            actualizarTarjetaExcepcion(elemento); 
        }
    });

    // Carga los datos del primer participante
    actualizarTarjetaExcepcion(elemento);
}

function guardarExcepcionesActuales(elemento) {
    const participantes = obtenerParticipantes();
    const marcados = elemento.querySelectorAll('.container-checkbox-registros input:checked');
    const excepciones = [...marcados].map(cb => cb.value);
    return actualizarValidosParticipante(participantes[idEtiqueta], excepciones);
}

function actualizarTarjetaExcepcion(elemento) {
    const participantes = obtenerParticipantes();

    // Solo cambia el valor del input, no reconstruye nada
    const inputNombre = elemento.querySelector('#input-participante-excepcion');
    inputNombre.value = participantes[idEtiqueta];

    // Solo regenera los checkboxes
    const listaCB = elemento.querySelector('.container-checkbox-registros');
    generarLista(listaCB);
}

//ASIGNACION A BOTONES Y DEMAS
const botonIntercambio = document.getElementById('btn-evento');
botonIntercambio.addEventListener('click', () => {
    const nombreOrg = inputNombreOrg.value;
    const fecha = inputFecha.value;
    const presupuesto = inputPresupuesto.value;

    const festividad = getFestividad();
    const nombreEve = festividad ? festividad.nombre : "";

    setDatosEvento(nombreOrg, nombreEve, fecha, presupuesto);
});

const botonSorteo = document.getElementById('boton-sorteo');
botonSorteo.addEventListener('click', () => {
    const parejas = realizarIntercambio();

    if (!parejas) {
        alert('No fue posible realizar el intercambio, revisa las exclusiones.');
        return;
    }

    setParejas(parejas);
    window.location.href = '/sorteo.html';
})

document.addEventListener('DOMContentLoaded', () => {
    inicializar();
    inicializarTarjetaExcepcion(document.getElementById('card-excepciones')); 
});