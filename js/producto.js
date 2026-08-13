// ==========================================
// ENDOCOL - CONSULTA DE PRODUCTO
// ==========================================

(function () {
    "use strict";

    // URL DE LA API DE GOOGLE APPS SCRIPT
    const API = "https://script.google.com/macros/s/AKfycbw3N9ndbQ5cAAnRFxBp3Cnb1Jsq0Dbg9ePUQWwmkdKkqgyUdNGQa0K5otg-O4Iezw3A/exec";


    // ==========================================
    // INICIO
    // ==========================================

    document.addEventListener("DOMContentLoaded", function () {

        const parametros =
            new URLSearchParams(window.location.search);

        const codigo =
            (parametros.get("codigo") || "").trim();


        // ==========================================
        // CAMPOS
        // ==========================================

        const campoCodigo =
            document.getElementById("txtCodigo");

        const campoDescripcion =
            document.getElementById("txtDescripcion");

        const campoUnidad =
            document.getElementById("txtUnidad");

        const campoUbicacion =
            document.getElementById("txtUbicacion");

        const campoStock =
            document.getElementById("txtStock");

        const campoStockMinimo =
            document.getElementById("txtStockMinimo");

        const campoStockMaximo =
            document.getElementById("txtStockMaximo");

        const estado =
            document.getElementById("estadoProducto");

        const mensaje =
            document.getElementById("mensaje");


        // ==========================================
        // BOTONES
        // ==========================================

        const btnEntrada =
            document.getElementById("btnEntrada");

        const btnSalida =
            document.getElementById("btnSalida");

        const btnKardex =
            document.getElementById("btnKardex");

        const btnVolver =
            document.getElementById("btnVolver");


        // ==========================================
        // MOSTRAR MENSAJE
        // ==========================================

        function mostrarMensaje(texto, tipo) {

            if (!mensaje) {
                return;
            }

            mensaje.className =
                "alert alert-" + tipo;

            mensaje.textContent =
                texto;
        }


        // ==========================================
        // BLOQUEAR / DESBLOQUEAR BOTONES
        // ==========================================

        function bloquearBotones(bloquear) {

            [
                btnEntrada,
                btnSalida,
                btnKardex
            ].forEach(function (boton) {

                if (boton) {

                    boton.disabled =
                        bloquear;

                }

            });

        }


        // ==========================================
        // MOSTRAR ESTADO
        // ==========================================

        function mostrarEstado(valor) {

            if (!estado) {
                return;
            }


            const texto =
                String(
                    valor || "SIN MÍNIMO"
                )
                .trim()
                .toUpperCase();


            estado.textContent =
                texto;


            estado.className =
                "badge fs-6 px-3 py-2";


            // NORMAL
            if (texto === "NORMAL") {

                estado.classList.add(
                    "text-bg-success"
                );

            }


            // POR AGOTARSE
            else if (
                texto === "POR AGOTARSE"
            ) {

                estado.classList.add(
                    "text-bg-warning"
                );

                estado.classList.add(
                    "text-dark"
                );

            }


            // AGOTADO
            else if (
                texto === "AGOTADO"
            ) {

                estado.classList.add(
                    "text-bg-danger"
                );

            }


            // SOBRESTOCK
            else if (
                texto === "SOBRESTOCK"
            ) {

                estado.classList.add(
                    "text-bg-primary"
                );

            }


            // SIN MÍNIMO
            else {

                estado.classList.add(
                    "text-bg-secondary"
                );

            }

        }


        // ==========================================
        // VALIDAR CÓDIGO
        // ==========================================

        if (!codigo) {

            mostrarMensaje(
                "No se recibió el código del producto.",
                "danger"
            );

            bloquearBotones(true);

            return;
        }


        // Mostrar código inmediatamente
        if (campoCodigo) {

            campoCodigo.value =
                codigo;

        }


        mostrarMensaje(
            "Consultando producto...",
            "info"
        );


        // ==========================================
        // CONSULTAR API
        // ==========================================

        fetch(
            API +
            "?accion=buscar&codigo=" +
            encodeURIComponent(codigo),
            {
                method: "GET",
                cache: "no-store"
            }
        )


        // ==========================================
        // RESPUESTA HTTP
        // ==========================================

        .then(function (respuesta) {

            if (!respuesta.ok) {

                throw new Error(
                    "HTTP " +
                    respuesta.status
                );

            }

            return respuesta.json();

        })


        // ==========================================
        // PROCESAR PRODUCTO
        // ==========================================

        .then(function (producto) {

            console.log(
                "Respuesta API:",
                producto
            );


            if (
                producto.resultado !==
                "OK"
            ) {

                throw new Error(
                    producto.mensaje ||
                    "Producto no encontrado."
                );

            }


            // ======================================
            // DATOS BÁSICOS
            // ======================================

            if (campoCodigo) {

                campoCodigo.value =
                    producto.codigo ||
                    codigo;

            }


            if (campoDescripcion) {

                campoDescripcion.value =
                    producto.descripcion ||
                    "";

            }


            if (campoUnidad) {

                campoUnidad.value =
                    producto.unidad ||
                    "";

            }


            if (campoUbicacion) {

                campoUbicacion.value =
                    producto.ubicacion ||
                    "";

            }


            // ======================================
            // STOCK ACTUAL
            // ======================================

            if (campoStock) {

                campoStock.value =
                    producto.stock ?? 0;

            }


            // ======================================
            // STOCK MÍNIMO
            // ======================================

            if (campoStockMinimo) {

                if (
                    producto.stockMinimo ===
                    "" ||
                    producto.stockMinimo ===
                    null ||
                    producto.stockMinimo ===
                    undefined
                ) {

                    campoStockMinimo.value =
                        "";

                }

                else {

                    campoStockMinimo.value =
                        producto.stockMinimo;

                }

            }


            // ======================================
            // STOCK MÁXIMO
            // ======================================

            if (campoStockMaximo) {

                if (
                    producto.stockMaximo ===
                    "" ||
                    producto.stockMaximo ===
                    null ||
                    producto.stockMaximo ===
                    undefined
                ) {

                    campoStockMaximo.value =
                        "";

                }

                else {

                    campoStockMaximo.value =
                        producto.stockMaximo;

                }

            }


            // ======================================
            // ESTADO
            // ======================================

            mostrarEstado(
                producto.estado
            );


            // ======================================
            // MENSAJE DE ÉXITO
            // ======================================

            mostrarMensaje(
                "Producto encontrado correctamente.",
                "success"
            );


            // Habilitar botones
            bloquearBotones(false);

        })


        // ==========================================
        // ERROR
        // ==========================================

        .catch(function (error) {

            console.error(
                "Error consultando producto:",
                error
            );


            mostrarMensaje(
                "No fue posible consultar el producto: " +
                error.message,
                "danger"
            );


            bloquearBotones(true);

        });


        // ==========================================
        // BOTÓN ENTRADA
        // ==========================================

        if (btnEntrada) {

            btnEntrada.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "entrada.html?codigo=" +
                        encodeURIComponent(codigo);

                }
            );

        }


        // ==========================================
        // BOTÓN SALIDA
        // ==========================================

        if (btnSalida) {

            btnSalida.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "salida.html?codigo=" +
                        encodeURIComponent(codigo);

                }
            );

        }


        // ==========================================
        // BOTÓN KARDEX
        // ==========================================

        if (btnKardex) {

            btnKardex.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "kardex.html?codigo=" +
                        encodeURIComponent(codigo);

                }
            );

        }


        // ==========================================
        // BOTÓN VOLVER
        // ==========================================

        if (btnVolver) {

            btnVolver.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "index.html";

                }
            );

        }

    });

})();
