// ==========================================
// ENDOCOL - PÁGINA PRINCIPAL
// ==========================================

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        const campoCodigo = document.getElementById("txtCodigo");
        const btnBuscar = document.getElementById("btnBuscar");

        function buscarProducto() {
            const codigo = campoCodigo.value.trim();

            if (!codigo) {
                alert("Ingrese el código del material.");
                campoCodigo.focus();
                return;
            }

            window.location.href =
                "producto.html?codigo=" + encodeURIComponent(codigo);
        }

        if (btnBuscar) {
            btnBuscar.addEventListener("click", buscarProducto);
        }

        if (campoCodigo) {
            campoCodigo.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    buscarProducto();
                }
            });
        }
    });
})();
// ==========================================
// ENDOCOL - DASHBOARD DE INVENTARIO
// ==========================================

(function () {

    "use strict";

    const API =
        "https://script.google.com/macros/s/AKfycbw3N9ndbQ5cAAnRFxBp3Cnb1Jsq0Dbg9ePUQWwmkdKkqgyUdNGQa0K5otg-O4Iezw3A/exec";


    // ==========================================
    // INICIAR DASHBOARD
    // ==========================================

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            cargarDashboard();

        }
    );


    // ==========================================
    // CONSULTAR INVENTARIO
    // ==========================================

    function cargarDashboard() {

        const mensaje =
            document.getElementById(
                "dashboardMensaje"
            );

        const contenido =
            document.getElementById(
                "dashboardContenido"
            );


        if (!mensaje || !contenido) {

            return;

        }


        mensaje.style.display =
            "block";

        mensaje.textContent =
            "Consultando inventario...";


        contenido.style.display =
            "none";


        /*
         * IMPORTANTE:
         * Usamos una acción nueva de la API:
         *
         * accion=inventario
         *
         */

        const url =
            API +
            "?accion=inventario";


        fetch(url, {
            method: "GET",
            cache: "no-store"
        })


        .then(function (respuesta) {

            if (!respuesta.ok) {

                throw new Error(
                    "HTTP " +
                    respuesta.status
                );

            }


            return respuesta.json();

        })


        .then(function (datos) {

            console.log(
                "Dashboard - respuesta API:",
                datos
            );


            if (
                datos.resultado !==
                "OK"
            ) {

                throw new Error(
                    datos.mensaje ||
                    "No fue posible consultar el inventario."
                );

            }


            procesarDashboard(
                datos.productos || []
            );


            mensaje.style.display =
                "none";


            contenido.style.display =
                "block";

        })


        .catch(function (error) {

            console.error(
                "Error Dashboard:",
                error
            );


            mensaje.className =
                "alert alert-danger";


            mensaje.textContent =
                "No fue posible cargar el Dashboard: " +
                error.message;


            mensaje.style.display =
                "block";

        });

    }


    // ==========================================
    // PROCESAR INVENTARIO
    // ==========================================

    function procesarDashboard(
        productos
    ) {


        let total =
            productos.length;


        let normal =
            0;

        let porAgotarse =
            0;

        let agotado =
            0;

        let sobrestock =
            0;


        const alertas =
            [];


        productos.forEach(
            function (producto) {


                const estado =
                    String(
                        producto.estado ||
                        ""
                    )
                    .trim()
                    .toUpperCase();


                // ==================================
                // CONTADORES
                // ==================================

                if (
                    estado ===
                    "NORMAL"
                ) {

                    normal++;

                }


                else if (
                    estado ===
                    "POR AGOTARSE"
                ) {

                    porAgotarse++;

                    alertas.push(
                        producto
                    );

                }


                else if (
                    estado ===
                    "AGOTADO"
                ) {

                    agotado++;

                    alertas.push(
                        producto
                    );

                }


                else if (
                    estado ===
                    "SOBRESTOCK"
                ) {

                    sobrestock++;

                }

            }
        );


        // ==========================================
        // ACTUALIZAR INDICADORES
        // ==========================================

        colocarTexto(
            "totalMaterias",
            total
        );


        colocarTexto(
            "totalNormal",
            normal
        );


        colocarTexto(
            "totalPorAgotarse",
            porAgotarse
        );


        colocarTexto(
            "totalAgotado",
            agotado
        );


        colocarTexto(
            "totalSobrestock",
            sobrestock
        );


        // ==========================================
        // ORDENAR ALERTAS
        // AGOTADO PRIMERO
        // ==========================================

        alertas.sort(
            function (a, b) {

                const estadoA =
                    String(
                        a.estado || ""
                    )
                    .toUpperCase();


                const estadoB =
                    String(
                        b.estado || ""
                    )
                    .toUpperCase();


                if (
                    estadoA ===
                    "AGOTADO" &&
                    estadoB !==
                    "AGOTADO"
                ) {

                    return -1;

                }


                if (
                    estadoB ===
                    "AGOTADO" &&
                    estadoA !==
                    "AGOTADO"
                ) {

                    return 1;

                }


                return 0;

            }
        );


        // ==========================================
        // MOSTRAR TABLA
        // ==========================================

        mostrarAlertas(
            alertas
        );

    }


    // ==========================================
    // COLOCAR TEXTO
    // ==========================================

    function colocarTexto(
        id,
        valor
    ) {

        const elemento =
            document.getElementById(
                id
            );


        if (elemento) {

            elemento.textContent =
                valor;

        }

    }


    // ==========================================
    // TABLA DE ALERTAS
    // ==========================================

    function mostrarAlertas(
        productos
    ) {

        const tabla =
            document.getElementById(
                "tablaAlertas"
            );


        if (!tabla) {

            return;

        }


        tabla.innerHTML =
            "";


        if (
            productos.length ===
            0
        ) {

            tabla.innerHTML = `
                <tr>
                    <td
                        colspan="5"
                        class="text-center text-success"
                    >
                        ✅ No hay materias primas que requieran atención.
                    </td>
                </tr>
            `;

            return;

        }


        productos.forEach(
            function (producto) {


                const estado =
                    String(
                        producto.estado ||
                        ""
                    )
                    .trim()
                    .toUpperCase();


                let claseEstado =
                    "";


                if (
                    estado ===
                    "AGOTADO"
                ) {

                    claseEstado =
                        "estado-agotado";

                }


                else if (
                    estado ===
                    "POR AGOTARSE"
                ) {

                    claseEstado =
                        "estado-agotarse";

                }


                const fila =
                    document.createElement(
                        "tr"
                    );


                fila.innerHTML = `

                    <td>
                        <strong>
                            ${escapeHTML(
                                producto.codigo
                            )}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(
                            producto.descripcion
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            producto.stock
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            producto.stockMinimo
                        )}
                    </td>

                    <td class="${claseEstado}">
                        ${escapeHTML(
                            estado
                        )}
                    </td>

                `;


                tabla.appendChild(
                    fila
                );

            }
        );

    }


    // ==========================================
    // SEGURIDAD HTML
    // ==========================================

    function escapeHTML(
        valor
    ) {

        return String(
            valor ?? ""
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

})();
