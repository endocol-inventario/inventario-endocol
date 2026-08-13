// ==========================================
// ENDOCOL - CONFIGURACIÓN CENTRAL DE API
// ==========================================

// Este archivo queda como configuración común para futuras páginas.
// Las páginas actuales de Entrada, Salida y Kardex conservan su lógica
// propia para no alterar lo que ya está funcionando.

window.ENDOCOL_API = "https://script.google.com/macros/s/AKfycbw3N9ndbQ5cAAnRFxBp3Cnb1Jsq0Dbg9ePUQWwmkdKkqgyUdNGQa0K5otg-O4Iezw3A/exec";

window.EndocolAPI = {
    buscarProducto: async function (codigo) {
        const url = window.ENDOCOL_API +
            "?accion=buscar&codigo=" +
            encodeURIComponent(codigo);

        const respuesta = await fetch(url, {
            method: "GET",
            cache: "no-store"
        });

        if (!respuesta.ok) {
            throw new Error("HTTP " + respuesta.status);
        }

        return respuesta.json();
    }
};
