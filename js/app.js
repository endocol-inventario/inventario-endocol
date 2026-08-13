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
