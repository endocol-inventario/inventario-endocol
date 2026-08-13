// ==========================================
// ENDOCOL - CONSULTA DE PRODUCTO
// ==========================================

(function () {
    "use strict";

    const API = "https://script.google.com/macros/s/AKfycbw3N9ndbQ5cAAnRFxBp3Cnb1Jsq0Dbg9ePUQWwmkdKkqgyUdNGQa0K5otg-O4Iezw3A/exec";

    document.addEventListener("DOMContentLoaded", function () {
        const parametros = new URLSearchParams(window.location.search);
        const codigo = (parametros.get("codigo") || "").trim();

        const campoCodigo = document.getElementById("txtCodigo");
        const campoDescripcion = document.getElementById("txtDescripcion");
        const campoUnidad = document.getElementById("txtUnidad");
        const campoUbicacion = document.getElementById("txtUbicacion");
        const campoStock = document.getElementById("txtStock");
        const mensaje = document.getElementById("mensaje");
        const btnEntrada = document.getElementById("btnEntrada");
        const btnSalida = document.getElementById("btnSalida");
        const btnKardex = document.getElementById("btnKardex");
        const btnVolver = document.getElementById("btnVolver");

        function mostrarMensaje(texto, tipo) {
            if (!mensaje) return;
            mensaje.className = "alert alert-" + tipo;
            mensaje.textContent = texto;
        }

        function bloquearBotones(bloquear) {
            [btnEntrada, btnSalida, btnKardex].forEach(function (boton) {
                if (boton) boton.disabled = bloquear;
            });
        }

        if (!codigo) {
            mostrarMensaje("No se recibió el código del producto.", "danger");
            bloquearBotones(true);
            return;
        }

        campoCodigo.value = codigo;
        mostrarMensaje("Consultando producto...", "info");

        fetch(API + "?accion=buscar&codigo=" + encodeURIComponent(codigo), {
            method: "GET",
            cache: "no-store"
        })
            .then(function (respuesta) {
                if (!respuesta.ok) {
                    throw new Error("HTTP " + respuesta.status);
                }
                return respuesta.json();
            })
            .then(function (producto) {
                if (producto.resultado !== "OK") {
                    throw new Error(producto.mensaje || "Producto no encontrado.");
                }

                campoCodigo.value = producto.codigo || codigo;
                campoDescripcion.value = producto.descripcion || "";
                campoUnidad.value = producto.unidad || "";
                campoUbicacion.value = producto.ubicacion || "";
                campoStock.value = producto.stock ?? 0;

                mensaje.className = "alert alert-success";
                mensaje.textContent = "Producto encontrado correctamente.";
                bloquearBotones(false);
            })
            .catch(function (error) {
                console.error("Error consultando producto:", error);
                mostrarMensaje("No fue posible consultar el producto: " + error.message, "danger");
                bloquearBotones(true);
            });

        if (btnEntrada) {
            btnEntrada.addEventListener("click", function () {
                window.location.href = "entrada.html?codigo=" + encodeURIComponent(codigo);
            });
        }

        if (btnSalida) {
            btnSalida.addEventListener("click", function () {
                window.location.href = "salida.html?codigo=" + encodeURIComponent(codigo);
            });
        }

        if (btnKardex) {
            btnKardex.addEventListener("click", function () {
                window.location.href = "kardex.html?codigo=" + encodeURIComponent(codigo);
            });
        }

        if (btnVolver) {
            btnVolver.addEventListener("click", function () {
                window.location.href = "index.html";
            });
        }
    });
})();
