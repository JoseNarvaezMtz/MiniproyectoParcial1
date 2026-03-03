/* LOGICA DE DATOS */

/*
    Este JS solo tiene funciones de manejo de localStorage, se vincula con elementos
    como listas entre otros.
*/

/*
    ESTRUCTURAS A GUARDAR:

    participantes = ['nombre1', 'nombre2', ..., 'nombreN'];


*/

//      FUNCIONES PARA REGISTRO DE DATOS
function registrarParticipante(participante) {

    //Obtenemos los datos
    const lista = JSON.parse(localStorage.getItem('participantes'));
    const listas = JSON.parse(localStorage.getItem('listas'));

    if (lista.find(participante)) return;

    listas[participante] = lista;
    lista.push(participante);

    localStorage.setItem('participantes', lista);
    localStorage.setItem('listas', listas);
}

//      FUNCIONES DE OBTENCION DE DATOS

//Funcion para retornar lista de participantes total
function obtenerParticipantes() {
    return JSON.parse(localStorage.getItem('participantes'));
}

//Funcion para obtener lista de validos para regalar a cierto participante
function obtenerValidosParticipante(participante) {
    const listas = JSON.parse(localStorage.getItem('listas'));

    if (!listas) return []; //Verificacion por precaucion

    return listas[participante] || [];
}

//FUNCIONES DE MODIFICACION

//Funcion para modificar lista de disponibles un participante
function actualizarValidosParticipante(participante, nuevo) {

    //Obtenemos los datos
    const listas = JSON.parse(localStorage.getItem('listas'));
    const listaGeneral = JSON.parse(localStorage.getItem('participantes'));

    //Obtenemos lista del especifico
    var lista = listas[participante];

    //Verificamos a ver si es que ya va a seleccionar todos
    if (lista.length === listaGeneral.length-1) {
        lista = listaGeneral;
        return;
    }
}