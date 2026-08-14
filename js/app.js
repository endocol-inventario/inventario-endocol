// ==========================================
// ENDOCOL - SISTEMA PRINCIPAL
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    // ==========================================
    // ELEMENTOS PRINCIPALES
    // ==========================================

    const txtCodigo =
        document.getElementById("txtCodigo");

    const btnBuscar =
        document.getElementById("btnBuscar");

    const btnNuevaMateria =
        document.getElementById("btnNuevaMateria");

    const btnEscanear =
        document.getElementById("btnEscanear");


    // ==========================================
    // BUSCAR PRODUCTO
    // ==========================================

    function buscarProducto() {

        if (!txtCodigo) {
            return;
        }


        const codigo =
            txtCodigo.value
                .trim()
                .toUpperCase();


        if (!codigo) {

            alert(
                "Ingrese el código del material."
            );

            txtCodigo.focus();

            return;

        }


        window.location.href =
            "producto.html?codigo=" +
            encodeURIComponent(codigo);

    }


    // ==========================================
    // BOTÓN BUSCAR
    // ==========================================

    if (btnBuscar) {

        btnBuscar.addEventListener(
            "click",
            buscarProducto
        );

    }


    // ==========================================
    // ENTER EN CÓDIGO
    // ==========================================

    if (txtCodigo) {

        txtCodigo.addEventListener(
            "keydown",
            function (evento) {

                if (
                    evento.key ===
                    "Enter"
                ) {

                    buscarProducto();

                }

            }
        );

    }


    // ==========================================
    // NUEVA MATERIA PRIMA
    // ==========================================

    if (btnNuevaMateria) {

        btnNuevaMateria.addEventListener(
            "click",
            function () {

                window.location.href =
                    "nueva-materia.html";

            }
        );

    }


    // ==========================================
    // ESCANEAR QR
    // ==========================================

    if (btnEscanear) {

        btnEscanear.addEventListener(
            "click",
            function () {

                alert(
                    "Escanea el QR con la cámara normal del celular. " +
                    "El QR abrirá directamente la ficha del material."
                );

            }
        );

    }


    // ==========================================
    // DASHBOARD
    // ==========================================

    cargarDashboard();


});


// ==========================================
// CONFIGURACIÓN API
// ==========================================

const API_INVENTARIO =
    "https://script.google.com/macros/s/AKfycbw3N9ndbQ5cAAnRFxBp3Cnb1Jsq0Dbg9ePUQWwmkdKkqgyUdNGQa0K5otg-O4Iezw3A/exec";


// ==========================================
// CARGAR DASHBOARD
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


    // Si estamos en una página
    // que no tiene Dashboard,
    // simplemente no hacemos nada.

    if (
        !mensaje ||
        !contenido
    ) {

        return;

    }


    mensaje.style.display =
        "block";

    mensaje.className =
        "dashboard-loading";

    mensaje.textContent =
        "Consultando inventario...";


    contenido.style.display =
        "none";


    const url =
        API_INVENTARIO +
        "?accion=inventario";


    console.log(
        "Consultando Dashboard:",
        url
    );


    fetch(
        url,
        {
            method: "GET",
            cache: "no-store"
        }
    )


    .then(
        function (respuesta) {

            if (!respuesta.ok) {

                throw new Error(
                    "HTTP " +
                    respuesta.status
                );

            }


            return respuesta.json();

        }
    )


    .then(
        function (datos) {

            console.log(
                "Respuesta Dashboard:",
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

        }
    )


    .catch(
        function (error) {

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

        }
    );

}


// ==========================================
// PROCESAR DATOS
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
                    producto.estado || ""
                )
                .trim()
                .toUpperCase();


            switch (estado) {


                case "NORMAL":

                    normal++;

                    break;


                case "POR AGOTARSE":

                    porAgotarse++;

                    alertas.push(
                        producto
                    );

                    break;


                case "AGOTADO":

                    agotado++;

                    alertas.push(
                        producto
                    );

                    break;


                case "SOBRESTOCK":

                    sobrestock++;

                    break;

            }

        }
    );


    // ==========================================
    // INDICADORES
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
    // TABLA DE ALERTAS
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
// MOSTRAR ALERTAS
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


    // AGOTADOS PRIMERO

    productos.sort(
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


    productos.forEach(
        function (producto) {

            const estado =
                String(
                    producto.estado || ""
                )
                .trim()
                .toUpperCase();


            let clase =
                "";


            if (
                estado ===
                "AGOTADO"
            ) {

                clase =
                    "estado-agotado";

            }


            else if (
                estado ===
                "POR AGOTARSE"
            ) {

                clase =
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

                <td class="${clase}">
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
// SEGURIDAD
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
