//CODIGO QUE VINCULA LOS REGISTROS Y FUNCIONALIDADES CON EL INDEX

//Funcion para registrar datos evento
const inputNombreOrg = document.getElementById('input-nombre-organizador');
const inputFecha = document.getElementById('input-fecha-intercambio');
const inputPresupuesto = document.getElementById('input-monto-intercambio');

function guardarDatosEvento() {
    const nombreOrg = inputNombreOrg.value;
    const fecha = inputFecha.value;
    const presupuesto = inputPresupuesto.value;

    const festividad = getFestividad();
    const nombreEve = festividad ? festividad.nombre : "";

    setDatosEvento(nombreOrg, nombreEve, fecha, presupuesto);
}


//ASIGNACION A BOTONES Y DEMAS
const botonIntercambio = document.getElementById('btn-evento');
botonIntercambio.addEventListener('click', guardarDatosEvento);

//INICIALIZACION DE LOCALSTORAGE
inicializar();