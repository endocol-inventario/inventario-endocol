 const API = "https://script.google.com/macros/s/AKfycbw3N9ndbQ5cAAnRFxBp3Cnb1Jsq0Dbg9ePUQWwmkdKkqgyUdNGQa0K5otg-O4Iezw3A/exec";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener código desde los parámetros de la URL (?codigo=XXX)
    const parametros = new URLSearchParams(window.location.search);
    const codigoParam = parametros.get("codigo");

    if (codigoParam) {
        document.getElementById("txtCodigo").value = codigoParam;
    }

    // 2. Evento del botón Guardar
    const btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.addEventListener("click", registrarEntrada);
});

async function registrarEntrada() {
    const btnGuardar = document.getElementById("btnGuardar");
    
    const txtCodigo = document.getElementById("txtCodigo").value.trim();
    const txtCantidad = document.getElementById("txtCantidad").value.trim();
    const txtResponsable = document.getElementById("txtResponsable").value.trim();
    const txtProveedor = document.getElementById("txtProveedor").value.trim();
    const txtObs = document.getElementById("txtObs").value.trim();

    if (!txtCodigo) {
        alert("Falta el código del producto.");
        return;
    }

    if (!txtCantidad || Number(txtCantidad) <= 0) {
        alert("Ingresa una cantidad válida mayor a cero.");
        return;
    }

    btnGuardar.disabled = true;
    btnGuardar.textContent = "Guardando...";

    // Preparar datos como parámetros de formulario
    const payload = new URLSearchParams();
    payload.append("accion", "entrada");
    payload.append("codigo", txtCodigo);
    payload.append("cantidad", txtCantidad);
    payload.append("responsable", txtResponsable);
    payload.append("proveedor", txtProveedor);
    payload.append("observaciones", txtObs);

    try {
        const respuesta = await fetch(API, {
            method: "POST",
            body: payload
        });

        const resultado = await respuesta.json();

        if (resultado.resultado === "OK") {
            alert("¡Entrada registrada correctamente!");
            document.getElementById("txtCantidad").value = "";
            document.getElementById("txtProveedor").value = "";
            document.getElementById("txtResponsable").value = "";
            document.getElementById("txtObs").value = "";
        } else {
            alert("Error desde el servidor: " + resultado.mensaje);
        }

    } catch (error) {
        console.error("Detalle del error:", error);
        alert("Fallo de conexión al guardar: " + error.message);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Guardar Entrada";
    }
}

    

