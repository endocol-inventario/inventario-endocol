/*************************************************
 * ETIQUETAS QR - ENDOCOL
 *************************************************/


const API =
    "https://script.google.com/macros/s/AKfycbw3N9ndbQ5cAAnRFxBp3Cnb1Jsq0Dbg9ePUQWwmkdKkqgyUdNGQa0K5otg-O4Iezw3A/exec";


const URL_PRODUCTO =
    "https://endocol-inventario.github.io/inventario-endocol/producto.html?codigo=";


let inventario = [];

let materiasFiltradas = [];


/*************************************************
 * INICIO
 *************************************************/

document.addEventListener(
    "DOMContentLoaded",
    function () {


        document
            .getElementById("btnVolver")
            .onclick = function () {

                window.location.href =
                    "index.html";

            };


        document
            .getElementById("btnActualizar")
            .onclick =
            cargarInventario;


        document
            .getElementById("btnImprimir")
            .onclick =
            imprimirSeleccionadas;


        document
            .getElementById("btnTodas")
            .onclick =
            seleccionarTodas;


        document
            .getElementById("txtBuscar")
            .addEventListener(
                "input",
                filtrarInventario
            );


        cargarInventario();

    }
);


/*************************************************
 * CARGAR INVENTARIO
 *************************************************/

async function cargarInventario() {


    const contenedor =
        document.getElementById(
            "contenedorEtiquetas"
        );


    contenedor.innerHTML =

        `<div class="cargando">
            🔄 Consultando inventario...
        </div>`;


    try {


        const respuesta =
            await fetch(
                API +
                "?accion=inventario"
            );


        if (!respuesta.ok) {

            throw new Error(
                "HTTP " +
                respuesta.status
            );

        }


        const datos =
            await respuesta.json();


        if (
            datos.resultado !==
            "OK"
        ) {

            throw new Error(
                datos.mensaje ||
                "No fue posible consultar el inventario."
            );

        }


        inventario =
            datos.inventario ||
            datos.productos ||
            datos.datos ||
            [];


        /*
         * Por seguridad, eliminar registros
         * que no tengan código.
         */

        inventario =
            inventario.filter(
                function (item) {

                    return item.codigo &&
                        String(
                            item.codigo
                        ).trim() !== "";

                }
            );


        materiasFiltradas =
            inventario.slice();


        actualizarContador();


        mostrarEtiquetas();


    }

    catch (error) {


        console.error(
            error
        );


        contenedor.innerHTML =

            `<div class="error">
                ❌ No fue posible consultar el inventario.<br><br>
                ${error.message}
            </div>`;

    }

}


/*************************************************
 * MOSTRAR ETIQUETAS
 *************************************************/

function mostrarEtiquetas() {


    const contenedor =
        document.getElementById(
            "contenedorEtiquetas"
        );


    contenedor.innerHTML = "";


    if (
        materiasFiltradas.length ===
        0
    ) {


        contenedor.innerHTML =

            `<div class="alert alert-warning">
                No se encontraron materias primas.
            </div>`;


        return;

    }


    materiasFiltradas.forEach(
        function (producto, indice) {


            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "etiqueta-wrapper";


            const etiqueta =
                document.createElement(
                    "div"
                );


            etiqueta.className =
                "etiqueta";


            /*
             * ID único para el checkbox
             */

            const idCheck =
                "qr_" +
                indice;


            /*
             * Checkbox
             */

            const check =
                document.createElement(
                    "input"
                );


            check.type =
                "checkbox";


            check.className =
                "form-check-input seleccion no-imprimir";


            check.id =
                idCheck;


            check.checked =
                true;


            /*
             * Código QR
             */

            const codigo =
                String(
                    producto.codigo
                ).trim();


            const descripcion =
                String(
                    producto.descripcion ||
                    ""
                ).trim();


            const ubicacion =
                String(
                    producto.ubicacion ||
                    ""
                ).trim();


            const urlProducto =
                URL_PRODUCTO +
                encodeURIComponent(
                    codigo
                );


            const urlQR =

                "https://api.qrserver.com/v1/create-qr-code/" +

                "?size=500x500" +

                "&margin=20" +

                "&data=" +

                encodeURIComponent(
                    urlProducto
                );


            /*
             * HTML etiqueta
             */

            etiqueta.innerHTML =

                `
                <div class="logo-texto">
                    ENDOCOL
                </div>

                <img
                    class="qr"
                    src="${urlQR}"
                    alt="QR ${codigo}"
                    loading="lazy">

                <div class="codigo">
                    ${escapeHTML(codigo)}
                </div>

                <div class="descripcion">
                    ${escapeHTML(descripcion)}
                </div>

                ${
                    ubicacion
                    ?
                    `<div class="ubicacion">
                        Ubicación: ${escapeHTML(ubicacion)}
                    </div>`
                    :
                    ""
                }

                `;


            wrapper.appendChild(
                check
            );


            wrapper.appendChild(
                etiqueta
            );


            contenedor.appendChild(
                wrapper
            );

        }
    );

}


/*************************************************
 * FILTRAR INVENTARIO
 *************************************************/

function filtrarInventario() {


    const texto =
        document
            .getElementById(
                "txtBuscar"
            )
            .value
            .trim()
            .toLowerCase();


    if (!texto) {

        materiasFiltradas =
            inventario.slice();

    }

    else {

        materiasFiltradas =
            inventario.filter(
                function (producto) {


                    const codigo =
                        String(
                            producto.codigo ||
                            ""
                        )
                        .toLowerCase();


                    const descripcion =
                        String(
                            producto.descripcion ||
                            ""
                        )
                        .toLowerCase();


                    return (

                        codigo.includes(
                            texto
                        )

                        ||

                        descripcion.includes(
                            texto
                        )

                    );

                }
            );

    }


    actualizarContador();

    mostrarEtiquetas();

}


/*************************************************
 * CONTADOR
 *************************************************/

function actualizarContador() {


    document
        .getElementById(
            "contador"
        )
        .textContent =
        materiasFiltradas.length;

}


/*************************************************
 * SELECCIONAR TODAS
 *************************************************/

function seleccionarTodas() {


    const checks =
        document.querySelectorAll(
            ".seleccion"
        );


    if (
        checks.length ===
        0
    ) {

        return;

    }


    let todasMarcadas =
        true;


    checks.forEach(
        function (check) {

            if (!check.checked) {

                todasMarcadas =
                    false;

            }

        }
    );


    checks.forEach(
        function (check) {

            check.checked =
                !todasMarcadas;

        }
    );


    document
        .getElementById(
            "btnTodas"
        )
        .textContent =
        todasMarcadas
            ?
            "☑ Seleccionar todas"
            :
            "☐ Quitar selección";

}


/*************************************************
 * IMPRIMIR SELECCIONADAS
 *************************************************/

function imprimirSeleccionadas() {


    const checks =
        document.querySelectorAll(
            ".seleccion"
        );


    let cantidad =
        0;


    checks.forEach(
        function (check) {

            if (
                check.checked
            ) {

                cantidad++;

            }

        }
    );


    if (
        cantidad ===
        0
    ) {

        alert(
            "Seleccione al menos una etiqueta para imprimir."
        );


        return;

    }


    /*
     * Ocultar etiquetas no seleccionadas
     */

    const wrappers =
        document.querySelectorAll(
            ".etiqueta-wrapper"
        );


    wrappers.forEach(
        function (
            wrapper,
            indice
        ) {


            const check =
                wrapper.querySelector(
                    ".seleccion"
                );


            if (
                !check.checked
            ) {

                wrapper.classList.add(
                    "no-imprimir"
                );

            }

        }
    );


    /*
     * Imprimir
     */

    window.print();


    /*
     * Volver a mostrar todo
     */

    setTimeout(
        function () {

            wrappers.forEach(
                function (
                    wrapper
                ) {

                    wrapper.classList.remove(
                        "no-imprimir"
                    );

                }
            );

        },
        1000
    );

}


/*************************************************
 * ESCAPAR HTML
 *************************************************/

function escapeHTML(texto) {


    return String(
        texto
    )

    .replace(
        /&/g,
        "&amp;"
    )

    .replace(
        /</g,
        "&lt;"
    )

    .replace(
        />/g,
        "&gt;"
    )

    .replace(
        /"/g,
        "&quot;"
    )

    .replace(
        /'/g,
        "&#039;"
    );

}
