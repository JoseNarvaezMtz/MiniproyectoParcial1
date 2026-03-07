/* LOGICA DE INTERCAMBIO */

/*
    Este JS solo tiene funciones para el intercambio, no se vincula con ningun
    elemento HTML en especifico.
*/

//FUNCION PRINCIPAL
function realizarIntercambio() {
    //Datos
    const listas = JSON.parse(localStorage.getItem('listas'));
    const participantes = JSON.parse(localStorage.getItem('participantes'));

    //Mapeo
    const entradas = participantes
        .map(p => ({ nombre: p, validos: [...listas[p]] }))
        .sort((a, b) => a.validos.length - b.validos.length);

    const parejas = [];
    const asignados = new Set(); // Map de asignaciones en backtracking

    function resolver(indice) {

        // Caso base: ya asignamos a todos, finalizamos
        if (indice === entradas.length) return true;

        const participante = entradas[indice];

        // Mezclamos los validos para que varien los resultados
        const validosAleatorios = [...participante.validos]
            .sort(() => Math.random() - 0.5);

        for (const candidato of validosAleatorios) {

            // Si el candidato todavía está disponible, lo asignamos
            if (!asignados.has(candidato)) {
                parejas.push({ nombre: participante.nombre, objetivo: candidato });
                asignados.add(candidato);

                // Avanzamos al siguiente nivel del backtracking
                if (resolver(indice + 1)) return true;

                // Si el resto falló, deshacemos esta asignación y probamos otro candidato
                parejas.pop();
                asignados.delete(candidato);
            }
        }

        // Ningún candidato funciona, backtrackeamos
    }

    const exito = resolver(0);

    if (!exito) return null; // Si hall hizo bien su trabajo, esto nunca pasa

    return parejas;
}
