//CODIGO QUE VINCULA LOS REGISTROS Y FUNCIONALIDADES CON EL INDEX

var idEtiqueta = 0;

//Funcion para registrar datos evento
const inputNombreOrg = document.getElementById('input-nombre-organizador');
const inputFecha = document.getElementById('input-fecha-intercambio');
const inputPresupuesto = document.getElementById('input-monto-intercambio');

//FUNCIONES PARA LA CAPTURA DE PARTICIPANTES NUEVOS

//FUNCION CAPTURA ORGANIZADOR COMO MIEMBRO
const checkboxOrganizador = document.getElementById('checkbox-organizador');
const botonSiguienteOrganizador = document.getElementById('boton-sig-organizador');
botonSiguienteOrganizador.addEventListener('click', () => {
    if (checkboxOrganizador.checked) {
        const nombreOrg = inputNombreOrg.value;
        if (nombreOrg.trim() === '') return;
        registrarParticipante(nombreOrg);
    }
});

//FUNCION PARA REGISTRAR NUEVOS PARTICIPANTES
const inputNombreParticipante = document.getElementById('input-nombre-participante');
const botonAgregar = document.getElementById('btn-agregar');
botonAgregar.addEventListener('click', () => {
    const nombre = inputNombreParticipante.value.trim();
    if (nombre === '') return; 

    registrarParticipante(nombre);
    inputNombreParticipante.value = ''; 
});

//FUNCION PARA LA NAVEGACION DE PARTICIPANTES EN EXCEPCIONES
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

function generarListaResumen(elemento) {
    let lista = '';
    const participantes = obtenerParticipantes();
    const listaValidos = obtenerValidosParticipante(participantes[idEtiqueta]);

    participantes.forEach(participante => {
        if (participante === participantes[idEtiqueta]) return;

        const esExcepcion = !listaValidos.includes(participante);

        lista += `
            <input type="checkbox" id="r-${participante}" disabled 
                ${esExcepcion ? 'checked' : ''}>
            <label for="r-${participante}">${participante}</label><br>
        `;
    });

    elemento.innerHTML = lista;
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
        if (!resultado.exito) {
            alert(resultado.razon);
            generarLista(elemento.querySelector('.container-checkbox-registros'));
        } 
        else alert('Excepciones guardadas');
    });

    const botonVerificar = elemento.querySelector('#boton-verificar-excepcion');
    botonVerificar.addEventListener('click', (e) => {
        const resultado = guardarExcepcionesActuales(elemento);
        if (!resultado.exito) {
            e.stopPropagation(); // Evita que Bootstrap abra el modal
            alert(resultado.razon);
            generarLista(elemento.querySelector('.container-checkbox-registros'));
        } else {
            actualizarTarjetaResumen(document.getElementById('card-resumen'));
            idEtiqueta=0;
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
    const noMarcados = elemento.querySelectorAll('.container-checkbox-registros input:not(:checked)');
    const validos = [...noMarcados].map(cb => cb.value);
    
    return actualizarValidosParticipante(participantes[idEtiqueta], validos);
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

//FUNCION PARA NAVEGACION DE PARTICIPANTES EN RESUMEN
function inicializarTarjetaResumen(elemento) {
    elemento.innerHTML = `
    <div class="card-body">
        <h5 class="card-title text-center">Resumen</h5>
        <div class="mb-3">
            <label class="form-label">Nombre:</label>
            <input type="text" class="form-control" id="input-participante-resumen" disabled/>
        </div>
        <div class="mb-3">
            <div class="container-checkbox-registros"></div>
        </div>
        <div class="d-flex justify-content-around">
            <button type="button" id="boton-sorteo" class="btn btn-primary">Hacer sorteo</button>
        </div>
        <div class="d-flex justify-content-around mt-3 flex-column flex-md-row justify-content-md-between gap-2">
            <button type="button" class="btn btn-primary" id="btn-resumen-anterior">←</button>
            <button type="button" class="btn btn-primary" id="btn-resumen-siguiente">→</button>
        </div>
    </div>
    `;

    const botonSiguiente = elemento.querySelector('#btn-resumen-siguiente');
    botonSiguiente.addEventListener('click', () => {
        const participantes = obtenerParticipantes();
        if (idEtiqueta < participantes.length - 1) {
            idEtiqueta++;
            actualizarTarjetaResumen(elemento);
        }
    });

    const botonAnterior = elemento.querySelector('#btn-resumen-anterior');
    botonAnterior.addEventListener('click', () => {
        if (idEtiqueta > 0) {
            idEtiqueta--;
            actualizarTarjetaResumen(elemento);
        }
    });

    const botonSorteo = elemento.querySelector('#boton-sorteo');
    botonSorteo.addEventListener('click', () => {
        const parejas = realizarIntercambio();

        if (!parejas) {
            alert('No fue posible realizar el intercambio, revisa las exclusiones.');
            return;
        }

        setParejas(parejas);
        window.location.href = '/sorteo.html';
    })

    document.getElementById("btn-proceder-sorteo").addEventListener("click", () => {

    const parejas = realizarIntercambio();

    if (!parejas) {
        alert("No fue posible realizar el intercambio, revisa las exclusiones.");
        return;
    }

    setParejas(parejas);
    window.location.href = "/sorteo.html";

});

}

function actualizarTarjetaResumen(elemento) {
    const participantes = obtenerParticipantes();

    const inputNombre = elemento.querySelector('#input-participante-resumen');
    inputNombre.value = participantes[idEtiqueta];

    const listaCB = elemento.querySelector('.container-checkbox-registros');
    generarListaResumen(listaCB);
}

//ASIGNACION A BOTONES Y DEMAS
const botonIntercambio = document.getElementById('btn-evento');
botonIntercambio.addEventListener('click', () => {

    guardarFestividad();

    const nombreOrg = inputNombreOrg.value;
    const fecha = inputFecha.value;
    const presupuesto = inputPresupuesto.value;

    const festividad = getFestividad();
    const nombreEve = festividad ? festividad.nombre : "";

    setDatosEvento(nombreOrg, nombreEve, fecha, presupuesto);
    actualizarNavbar(festividad);
    actualizarTarjetaExcepcion(document.getElementById('card-excepciones'));

});

document.addEventListener('DOMContentLoaded', () => {
    inicializar();
    inicializarTarjetaExcepcion(document.getElementById('card-excepciones'));
    inicializarTarjetaResumen(document.getElementById('card-resumen'));
});