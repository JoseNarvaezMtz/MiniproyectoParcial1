/* LOGICA DE DATOS */

/*
    ESTRUCTURAS A GUARDAR:

    participantes = ['nombre1', 'nombre2', ..., 'nombreN'];
    listas = {'nombre1': ['valido1','valido2','valido3'], 'nombre2': ['valido1','valido2','valido3']}
*/

const predParticipantes = [
    'Pancho Perez',
    'Carlos Quesos',
    'Toño Estrellas',
    'Adolf Müller'
]

//      FUNCIONES PARA REGISTRO DE DATOS
function registrarParticipante(participante) {
    const lista = JSON.parse(localStorage.getItem('participantes'));
    const listas = JSON.parse(localStorage.getItem('listas'));

    if (lista.includes(participante)) return;

    // Añadimos el nuevo participante a los válidos de todos los demás
    lista.forEach(p => {
        if (!listas[p].includes(participante) && listas[p].length === lista.length) { //Solo en caso de que ya tenga la lista completa
            listas[p].push(participante);
        }
    });

    // Asignamos lista (CON EL FILTER QUE SE ME OLVIDA AAAAA)
    listas[participante] = lista.filter(p => p !== participante);
    lista.push(participante);

    localStorage.setItem('participantes', JSON.stringify(lista));
    localStorage.setItem('listas', JSON.stringify(listas));
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
function actualizarValidosParticipante(participante, nuevaLista) {

    //Obtenemos los datos
    const listas = JSON.parse(localStorage.getItem('listas'));
    const participantes = JSON.parse(localStorage.getItem('participantes'));

    //Si ya agrego todos o si no tiene a nadie, pues le dejamos todos menos a el mismo
    if (nuevaLista.length >= participantes.length - 1 || nuevaLista.length === 0) {
        listas[participante] = [...participantes].filter(p => p !== participante);
        localStorage.setItem('listas', JSON.stringify(listas));
        return { exito: true };
    }

    //Verificacion
    const listasSimuladas = { ...listas, [participante]: nuevaLista };

    const resultado = verificarCambio(listasSimuladas, participantes);

    //Si no es posible lo mandamos a volar
    if (!resultado.valido) {
        console.error(resultado.problema);
        return { exito: false, razon: resultado.problema };
    }

    //En caso de ser posible lo hacemos y ya
    listas[participante] = nuevaLista;
    localStorage.setItem('listas', JSON.stringify(listas));

    console.log('Lista de validos comprobada y modificada correctamente');

    return { exito: true };
}

//      FUNCIONES DE VERIFICACION

/* PARA LA VERIFICACION: */
function verificarCambio(listas, participantes) {
    const entradas = participantes
        .map(p => ({ nombre: p, validos: listas[p] })) //p = Participante
        .sort((a, b) => a.validos.length - b.validos.length);
        // a y b son las pocisiones de primero y segundo

    for (let i = 0; i < entradas.length; i++) {

        const unionValidos = new Set(); //Para manejar los validos y que no se repitan
        
        // Construimos la unión de validos desde i hacia adelante
        for (let j = i; j < entradas.length; j++) {
            entradas[j].validos.forEach(v => unionValidos.add(v));

            const tamanoGrupo = j - i + 1;
            const tamanoUnion = unionValidos.size;

            // Verificacion del teorema de Hall: mas participantes que validos
            if (tamanoUnion < tamanoGrupo) {
                return {
                    valido: false,
                    problema: `El grupo [${entradas.slice(i, j+1).map(e => e.nombre).join(', ')}] ` +
                            `tiene ${tamanoGrupo} personas pero solo ${tamanoUnion} opción(es) válida(s): ` +
                            `[${[...unionValidos].join(', ')}]`
                };
            }
        }
    }

    return { valido: true, problema: null };
}

//FUNCION CAPTURA DATOS EVENTO
function setDatosEvento(nombreOrg, nombreEve, fecha, presupuesto) {
    const evento = {nombreOrg, nombreEve, fecha, presupuesto};
    localStorage.setItem('evento', JSON.stringify(evento));
}

//FUNCION LECTURA DATOS EVENTO
function getDatosEvento() {
    return JSON.parse(localStorage.getItem('evento'));
}

// FUNCION GUARDAR FESTIVIDAD
function setFestividad(festividad) {
    localStorage.setItem('festividad', JSON.stringify(festividad));
}

// FUNCION OBTENER FESTIVIDAD
function getFestividad() {
    return JSON.parse(localStorage.getItem('festividad'));
}

//FUNCION DE INICIALIZACION (HACERLA AL INICIO)
function inicializar() {
    if (!localStorage.getItem('participantes')) {
        localStorage.setItem('participantes', JSON.stringify(predParticipantes));
    }

    let predLista = {}

    predParticipantes.forEach(participante => {
        predLista[participante] = predParticipantes.filter(p => p !== participante);
    })

    if (!localStorage.getItem('listas')) {
        localStorage.setItem('listas', JSON.stringify(predLista));
    }
}