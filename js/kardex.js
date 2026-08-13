// ======================================
// CONFIGURACIÓN API
// ======================================

const API = "https://script.google.com/macros/s/AKfycbw3N9ndbQ5cAAnRFxBp3Cnb1Jsq0Dbg9ePUQWwmkdKkqgyUdNGQa0K5otg-O4Iezw3A/exec";

// ======================================
// OBTENER CÓDIGO DEL PRODUCTO
// ======================================

const parametros = new URLSearchParams(
    window.location.search
);

const codigo = parametros.get("codigo");


// ======================================
// MOSTRAR CÓDIGO
// ======================================

const campoCodigo =
    document.getElementById("txtCodigoKardex");

if (campoCodigo) {

    campoCodigo.value = codigo || "";

}


// ======================================
// CARGAR KARDEX
// ======================================

async function cargarKardex() {

    const tabla =
        document.getElementById("tablaKardex");


    // Verificar código

    if (!codigo) {

        tabla.innerHTML = `
            <tr>
                <td colspan="6"
                    class="text-center text-danger">

                    No se encontró el código
                    del producto.

                </td>
            </tr>
        `;

        return;

    }


    // Mostrar mensaje de carga

    tabla.innerHTML = `
        <tr>
            <td colspan="6"
                class="text-center">

                Cargando movimientos...

            </td>
        </tr>
    `;


    try {

        // ======================================
        // CONSULTAR API
        // ======================================

        const url =
            API +
            "?accion=kardex&codigo=" +
            encodeURIComponent(codigo);


        console.log(
            "Consultando Kardex:",
            url
        );


        const respuesta =
            await fetch(url);


        const resultado =
            await respuesta.json();


        console.log(
            "Respuesta API:",
            resultado
        );


        // ======================================
        // VERIFICAR RESPUESTA
        // ======================================

        if (
            resultado.resultado !== "OK"
        ) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="6"
                        class="text-center text-danger">

                        ${
                            resultado.mensaje ||
                            "Error consultando Kardex."
                        }

                    </td>
                </tr>
            `;

            return;

        }


        // ======================================
        // SIN MOVIMIENTOS
        // ======================================

        if (
            !resultado.movimientos ||
            resultado.movimientos.length === 0
        ) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="6"
                        class="text-center">

                        No hay movimientos
                        registrados para este producto.

                    </td>
                </tr>
            `;

            return;

        }


        // ======================================
        // LIMPIAR TABLA
        // ======================================

        tabla.innerHTML = "";


        // ======================================
        // MOSTRAR MOVIMIENTOS
        // ======================================

        resultado.movimientos.forEach(
            function(mov) {

                const fila =
                    document.createElement("tr");


                // ----------------------------------
                // COLOR DEL MOVIMIENTO
                // ----------------------------------

                const claseMovimiento =
                    mov.tipo === "ENTRADA"
                        ? "text-success fw-bold"
                        : "text-danger fw-bold";


                // ----------------------------------
                // SIGNO DE CANTIDAD
                // ----------------------------------

                const signo =
                    mov.tipo === "ENTRADA"
                        ? "+"
                        : "-";


                // ----------------------------------
                // FECHA
                // ----------------------------------

                const fecha =
                    new Date(mov.fecha);


                // ----------------------------------
                // CREAR FILA
                // ----------------------------------

                fila.innerHTML = `

                    <td>
                        ${fecha.toLocaleString("es-CO")}
                    </td>


                    <td
                        class="${claseMovimiento}">

                        ${mov.tipo}

                    </td>


                    <td
                        class="${claseMovimiento}">

                        ${signo}${mov.cantidad}

                    </td>


                    <td>

                        ${mov.stockAnterior}

                    </td>


                    <td
                        class="fw-bold">

                        ${mov.stockNuevo}

                    </td>


                    <td>

                        ${mov.responsable || ""}

                    </td>

                `;


                // ----------------------------------
                // AGREGAR FILA
                // ----------------------------------

                tabla.appendChild(fila);

            }
        );


    }

    catch (error) {

        // ======================================
        // ERROR DE CONEXIÓN
        // ======================================

        console.error(
            "Error consultando Kardex:",
            error
        );


        tabla.innerHTML = `
            <tr>

                <td colspan="6"
                    class="text-center text-danger">

                    No fue posible conectar
                    con la API.

                </td>

            </tr>
        `;

    }

}


// ======================================
// INICIAR CONSULTA
// ======================================

cargarKardex();
