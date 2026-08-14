/*************************************************
 * NUEVA MATERIA PRIMA - ENDOCOL
 *************************************************/


const API =
  "https://script.google.com/macros/s/AKfycbw3N9ndbQ5cAAnRFxBp3Cnb1Jsq0Dbg9ePUQWwmkdKkqgyUdNGQa0K5otg-O4Iezw3A/exec";


const $ = id =>
  document.getElementById(id);


/*************************************************
 * INICIO
 *************************************************/

document.addEventListener(
  "DOMContentLoaded",
  function () {


    // ==========================================
    // BOTÓN VOLVER
    // ==========================================

    $("btnVolver").onclick =
      function () {

        location.href =
          "index.html";

      };


    // ==========================================
    // BOTÓN SUGERIR CÓDIGO
    // ==========================================

    $("btnSiguiente").onclick =
      sugerirCodigo;


    // ==========================================
    // BOTÓN GUARDAR
    // ==========================================

    $("btnGuardar").onclick =
      guardarMateriaPrima;


  }
);


/*************************************************
 * MENSAJES
 *************************************************/

function msg(
  texto,
  tipo = "danger"
) {


  $("mensaje").innerHTML =

    `<div class="alert alert-${tipo}">
      ${texto}
    </div>`;

}


/*************************************************
 * SUGERIR CÓDIGO
 *************************************************/

async function sugerirCodigo() {


  try {


    const respuesta =
      await fetch(
        API +
        "?accion=siguiente_codigo"
      );


    const datos =
      await respuesta.json();


    if (
      datos.resultado ===
      "OK"
    ) {


      $("txtCodigo").value =
        datos.codigo;


      msg(
        "Código sugerido: " +
        datos.codigo,
        "info"
      );

    }

    else {

      msg(
        datos.mensaje ||
        "No fue posible obtener un código."
      );

    }


  }

  catch (error) {


    msg(
      "Error consultando código: " +
      error.message
    );

  }

}


/*************************************************
 * GUARDAR MATERIA PRIMA
 *************************************************/

async function guardarMateriaPrima() {


  // ==========================================
  // OBTENER DATOS
  // ==========================================

  const codigo =
    $("txtCodigo")
      .value
      .trim()
      .toUpperCase();


  const descripcion =
    $("txtDescripcion")
      .value
      .trim();


  const unidad =
    $("txtUnidad")
      .value;


  const ubicacion =
    $("txtUbicacion")
      .value
      .trim();


  const stockInicial =
    Number(
      $("txtStockInicial")
        .value
    );


  const stockMinimo =
    Number(
      $("txtStockMinimo")
        .value
    );


  const stockMaximo =
    Number(
      $("txtStockMaximo")
        .value
    );


  const responsable =
    $("txtResponsable")
      .value
      .trim();


  const proveedor =
    $("txtProveedor")
      .value
      .trim();


  const observaciones =
    $("txtObservaciones")
      .value
      .trim();


  // ==========================================
  // VALIDAR CÓDIGO
  // ==========================================

  if (!codigo) {

    return msg(
      "Ingrese o genere un código."
    );

  }


  // ==========================================
  // VALIDAR DESCRIPCIÓN
  // ==========================================

  if (!descripcion) {

    return msg(
      "Ingrese la descripción."
    );

  }


  // ==========================================
  // VALIDAR STOCK INICIAL
  // ==========================================

  if (
    !Number.isFinite(
      stockInicial
    ) ||
    stockInicial < 0
  ) {

    return msg(
      "El stock inicial debe ser mayor o igual a cero."
    );

  }


  // ==========================================
  // VALIDAR STOCK MÍNIMO
  // ==========================================

  if (
    !Number.isFinite(
      stockMinimo
    ) ||
    stockMinimo < 0
  ) {

    return msg(
      "El stock mínimo debe ser mayor o igual a cero."
    );

  }


  // ==========================================
  // VALIDAR STOCK MÁXIMO
  // ==========================================

  if (
    !Number.isFinite(
      stockMaximo
    ) ||
    stockMaximo < 0
  ) {

    return msg(
      "El stock máximo debe ser mayor o igual a cero."
    );

  }


  // ==========================================
  // VALIDAR MÍNIMO VS MÁXIMO
  // ==========================================

  if (
    stockMaximo > 0 &&
    stockMinimo > stockMaximo
  ) {

    return msg(
      "El stock mínimo no puede ser mayor que el stock máximo."
    );

  }


  // ==========================================
  // BLOQUEAR BOTÓN
  // ==========================================

  $("btnGuardar").disabled =
    true;


  $("btnGuardar").innerHTML =
    "Guardando...";


  try {


    // ========================================
    // PREPARAR DATOS
    // ========================================

    const parametros =
      new URLSearchParams({

        accion:
          "alta_materia_prima",

        codigo:
          codigo,

        descripcion:
          descripcion,

        unidad:
          unidad,

        ubicacion:
          ubicacion,

        stockInicial:
          String(
            stockInicial
          ),

        stockMinimo:
          String(
            stockMinimo
          ),

        stockMaximo:
          String(
            stockMaximo
          ),

        responsable:
          responsable,

        proveedor:
          proveedor,

        observaciones:
          observaciones

      });


    // ========================================
    // ENVIAR AL APPS SCRIPT
    // ========================================

    const respuesta =
      await fetch(
        API,
        {

          method:
            "POST",

          body:
            parametros

        }
      );


    const datos =
      await respuesta.json();


    // ========================================
    // VALIDAR RESPUESTA
    // ========================================

    if (
      datos.resultado !==
      "OK"
    ) {

      throw new Error(
        datos.mensaje ||
        "No fue posible crear la materia prima."
      );

    }


    // ========================================
    // MENSAJE
    // ========================================

    msg(
      "Materia prima creada correctamente.",
      "success"
    );


    // ========================================
    // GENERAR URL DEL PRODUCTO
    // ========================================

    const url =

      "https://endocol-inventario.github.io/inventario-endocol/producto.html?codigo=" +

      encodeURIComponent(
        codigo
      );


    // ========================================
    // GENERAR QR
    // ========================================

    const qr =

      "https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=20&data=" +

      encodeURIComponent(
        url
      );


    // ========================================
    // MOSTRAR RESULTADO
    // ========================================

    $("datosCreada").innerHTML =

      "<strong>" +
      codigo +
      "</strong><br>" +
      descripcion +
      "<br><br>" +

      "Stock inicial: " +
      stockInicial +

      "<br>" +

      "Stock mínimo: " +
      stockMinimo +

      "<br>" +

      "Stock máximo: " +
      stockMaximo;


    $("imgQR").src =
      qr;


    $("btnAbrirProducto").href =
      url;


    $("btnDescargarQR").href =
      qr;


    $("resultadoQR").style.display =
      "block";


    // ========================================
    // LIMPIAR FORMULARIO
    // ========================================

    /*
     * NO limpiamos el formulario inmediatamente
     * para que el usuario pueda revisar los datos.
     */


  }

  catch (error) {


    msg(
      "No fue posible guardar la materia prima: " +
      error.message
    );

  }


  finally {


    $("btnGuardar").disabled =
      false;


    $("btnGuardar").innerHTML =
      "Guardar materia prima";

  }

}
