const API = "https://script.google.com/macros/s/AKfycbw3N9ndbQ5cAAnRFxBp3Cnb1Jsq0Dbg9ePUQWwmkdKkqgyUdNGQa0K5otg-O4Iezw3A/exec";

document.addEventListener("DOMContentLoaded", () => {
    // Capturar el parámetro ?codigo=XXX de la URL
    const parametros = new URLSearchParams(window.location.search);
    const codigoParam = parametros.get("codigo");

    if (codigoParam) {
        document.getElementById("txtCodigo").value = codigoParam;
    }

    // Vincular evento al botón de guardar salida
    const btnGuardar = document.getElementById("btnGuardarSalida");
    if (btnGuardar) {
        btnGuardar.addEventListener("click", registrarSalida);
    }
});

async function registrarSalida() {
    const btnGuardar = document.getElementById("btnGuardarSalida");
    
    // Captura de datos del formulario HTML
    const txtCodigo = document.getElementById("txtCodigo").value.trim();
    const txtCantidad = document.getElementById("txtCantidad").value.trim();
    const txtResponsable = document.getElementById("txtResponsable").value.trim();
    
    // Capturar destino u observaciones (con fallback en caso de que un id no exista)
    const inputDestino = document.getElementById("txtDestino");
    const txtDestino = inputDestino ? inputDestino.value.trim() : "";

    const inputObs = document.getElementById("txtObs");
    const txtObs = inputObs ? inputObs.value.trim() : "";

    // Validaciones básicas
    if (!txtCodigo) {
        alert("Falta el código del producto.");
        return;
    }

    if (!txtCantidad || Number(txtCantidad) <= 0) {
        alert("Ingresa una cantidad válida a retirar mayor a cero.");
        return;
    }

    // Bloquear el botón para evitar múltiples peticiones
    btnGuardar.disabled = true;
    btnGuardar.textContent = "Procesando salida...";

    // Construcción del payload con todos los datos requeridos
    const payload = new URLSearchParams();
    payload.append("accion", "salida");
    payload.append("codigo", txtCodigo);
    payload.append("cantidad", txtCantidad);
    payload.append("responsable", txtResponsable);
    payload.append("destino", txtDestino);         // Envía a Columna F en Excel
    payload.append("observaciones", txtObs);       // Envía a Columna G en Excel

    try {
        const respuesta = await fetch(API, {
            method: "POST",
            body: payload
        });

        const resultado = await respuesta.json();

        if (resultado.resultado === "OK") {
            alert("¡Salida registrada e inventario actualizado con éxito!");
            
            // Limpiar formulario tras el éxito
            document.getElementById("txtCantidad").value = "";
            document.getElementById("txtResponsable").value = "";
            if (inputDestino) inputDestino.value = "";
            if (inputObs) inputObs.value = "";
        } else {
            // Muestra el error enviado por Apps Script (ej: Stock insuficiente)
            alert("Error: " + resultado.mensaje);
        }

    } catch (error) {
        console.error("Error en la petición de salida:", error);
        alert("Fallo de conexión al intentar registrar la salida.");
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Guardar Salida";
    }
}