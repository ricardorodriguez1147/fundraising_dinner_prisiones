document.addEventListener("DOMContentLoaded", function () {

  // ============================================================
  // CARGAR PARTICIPANTES DESDE LOCALSTORAGE
  // ============================================================

  var numerosJSON = localStorage.getItem("arregloNumerosTotales");

  var numeros = [];

  try {
    numeros = numerosJSON ? JSON.parse(numerosJSON) : [];
  } catch (error) {
    numeros = [];
  }

  // Aseguramos que siempre sea un arreglo
  if (!Array.isArray(numeros)) {
    numeros = [];
  }

  const btnSeleccionar = document.getElementById('id_div_boton');

  if (numeros.length > 0) {

    ImprimirNumeros(numeros);

    btnSeleccionar.style.display = "flex";

    TotalFichas();

  } else {

    CerrarModal('contai-ingreso-numeros');

    TotalFichas();

  }

});


// ============================================================
// CONTADOR DE FICHAS
// ============================================================

const TotalFichas = () => {

  var numerosJSON =
    localStorage.getItem("arregloNumerosTotales");

  var numeros = [];

  try {
    numeros = numerosJSON ? JSON.parse(numerosJSON) : [];
  } catch (error) {
    numeros = [];
  }

  if (!Array.isArray(numeros)) {
    numeros = [];
  }

  let valor = document.getElementById('pr');

  if (!valor) return;

  let numeroFichas = numeros.length;

  valor.innerHTML = `Total de fichas ${numeroFichas}`;
};


// ============================================================
// ARREGLO PRINCIPAL
// ============================================================

let arregloNumerosTotales = [];


// ============================================================
// GUARDAR EN LOCALSTORAGE
// ============================================================

const GuardaArr = () => {

  var numerosJSON =
    JSON.stringify(arregloNumerosTotales);

  localStorage.setItem(
    "arregloNumerosTotales",
    numerosJSON
  );

};


// ============================================================
// NÚMEROS SELECCIONADOS
// ============================================================

let numerosselecionados = [];


// ============================================================
// NÚMEROS DEL TABLERO
// ============================================================

let arregloNumerosTablero = [];


// ============================================================
// SEPARAR NOMBRE Y APELLIDO
// ============================================================

const SepararNombreApellido = (nombreCompleto) => {

  const partes = nombreCompleto
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (partes.length === 0) {

    return {
      nombre: "",
      apellido: ""
    };

  }

  if (partes.length === 1) {

    return {
      nombre: partes[0],
      apellido: ""
    };

  }

  return {

    nombre: partes[0],

    apellido: partes
      .slice(1)
      .join(" ")

  };

};


// ============================================================
// OBTENER NOMBRE COMPLETO
// ============================================================

const ObtenerNombreCompleto = (participante) => {

  if (!participante) {
    return "";
  }

  return `${participante.nombre || ""} ${participante.apellido || ""}`
    .trim();

};


// ============================================================
// PARSEAR PARTICIPANTE
//
// FORMATO:
//
// 206 - Nicolás Useche
// 232 - Yaniry Rodríguez
// 295 - Doris Galindo
// ============================================================

const ParsearParticipante = (linea) => {

  const texto = linea.trim();

  if (!texto) {
    return null;
  }

  /*
   * Busca:
   *
   * número - nombre completo
   *
   * Ejemplo:
   *
   * 206 - Nicolás Useche
   */

  const coincidencia =
    texto.match(/^(\d+)\s*-\s*(.+)$/);

  if (!coincidencia) {
    return null;
  }

  const numero =
    Number(coincidencia[1]);

  const nombreCompleto =
    coincidencia[2].trim();

  if (!Number.isInteger(numero)) {
    return null;
  }

  if (!nombreCompleto) {
    return null;
  }

  const datos =
    SepararNombreApellido(nombreCompleto);

  return {

    numero: numero,

    nombre: datos.nombre,

    apellido: datos.apellido

  };

};


// ============================================================
// CARGAR LOS DATOS DEL TEXTAREA
// ============================================================

const NumeroFichas = () => {

  let textTarea =
    document.getElementById('numeros_ingresados');

  if (!textTarea) {
    return;
  }

  const lineas =
    textTarea.value
      .split(/\r?\n/)
      .map(linea => linea.trim())
      .filter(linea => linea !== "");


  const participantes = [];

  const numerosExistentes = new Set();


  lineas.forEach(linea => {

    const participante =
      ParsearParticipante(linea);

    if (!participante) {
      return;
    }


    /*
     * Evitamos números repetidos.
     */

    if (
      numerosExistentes.has(
        participante.numero
      )
    ) {
      return;
    }


    numerosExistentes.add(
      participante.numero
    );


    participantes.push(
      participante
    );

  });


  arregloNumerosTotales =
    participantes;

  GuardaArr();

};


// ============================================================
// EDITAR NÚMEROS
// ============================================================

const EditarNumeros = () => {

  const textarea =
    document.getElementById(
      'numeros_ingresados'
    );

  if (!textarea) {
    return;
  }


  var numerosJSON =
    localStorage.getItem(
      "arregloNumerosTotales"
    );

  var numeros = [];

  try {

    numeros =
      numerosJSON
        ? JSON.parse(numerosJSON)
        : [];

  } catch (error) {

    numeros = [];

  }


  if (!Array.isArray(numeros)) {
    numeros = [];
  }


  /*
   * Convertimos los objetos nuevamente
   * al formato que el usuario puede editar:
   *
   * 206 - Nicolás Useche
   * 232 - Yaniry Rodríguez
   */

  textarea.value =
    numeros
      .slice()
      .sort(
        (a, b) =>
          Number(a.numero) -
          Number(b.numero)
      )
      .map(participante => {

        return `${participante.numero} - ${ObtenerNombreCompleto(participante)}`;

      })
      .join("\n");


  MostrarModalRegistro(
    'contai-ingreso-numeros'
  );


  const texto =
    document.getElementById(
      'textonum'
    );

  if (texto) {
    texto.style.color = "white";
  }

};


// ============================================================
// NUEVO JUEGO
// ============================================================

const NuevoJuego = () => {

  document.getElementById(
    'numeros_ingresados'
  ).value = "";


  MostrarModalRegistro(
    'contai-ingreso-numeros'
  );


  const texto =
    document.getElementById(
      'textonum'
    );

  if (texto) {
    texto.style.color = "white";
  }

};


// ============================================================
// MOSTRAR MODAL
// ============================================================

const MostrarModalRegistro = id_modal => {

  let divcontainer =
    document.getElementById(
      id_modal
    );

  if (!divcontainer) {
    return;
  }

  divcontainer.style.visibility =
    "visible";

};


// ============================================================
// GENERAR NÚMEROS / PARTICIPANTES
// ============================================================

const GenerarNumeros = () => {

  try {

    const numerosTexto =
      document.getElementById(
        'numeros_ingresados'
      );

    const textoMensaje =
      document.getElementById(
        'textonum'
      );


    if (!numerosTexto) {
      return;
    }


    if (
      numerosTexto.value.trim() === ""
    ) {

      if (textoMensaje) {
        textoMensaje.style.color =
          "red";
      }

      return;
    }


    /*
     * Validamos las líneas antes de guardar.
     */

    const lineas =
      numerosTexto.value
        .split(/\r?\n/)
        .map(linea => linea.trim())
        .filter(linea => linea !== "");


    const participantes = [];

    const numerosExistentes =
      new Set();

    const errores = [];


    lineas.forEach((linea, index) => {

      const participante =
        ParsearParticipante(linea);


      if (!participante) {

        errores.push(
          `Línea ${index + 1}: ${linea}`
        );

        return;
      }


      if (
        numerosExistentes.has(
          participante.numero
        )
      ) {

        errores.push(
          `Número duplicado: ${participante.numero}`
        );

        return;
      }


      numerosExistentes.add(
        participante.numero
      );


      participantes.push(
        participante
      );

    });


    /*
     * Si encontramos errores,
     * mostramos el modal original
     * de error.
     */

    if (errores.length > 0) {

      MostrarError(
        `Hay datos que no tienen el formato correcto.\n\n` +
        `${errores.join("\n")}\n\n` +
        `Ejemplo correcto:\n206 - Nicolás Useche`
      );

      return;

    }


    if (participantes.length === 0) {

      MostrarError(
        "No se encontraron participantes válidos."
      );

      return;

    }


    /*
     * Ordenamos por número.
     */

    participantes.sort(
      (a, b) =>
        a.numero - b.numero
    );


    /*
     * Guardamos.
     */

    arregloNumerosTotales =
      [...participantes];

    GuardaArr();


    /*
     * Mostrar botón Seleccionar / Editar.
     */

    const btnSeleccionar =
      document.getElementById(
        'id_div_boton'
      );

    if (btnSeleccionar) {
      btnSeleccionar.style.display =
        "flex";
    }


    /*
     * Mostrar tablero.
     */

    ImprimirNumeros(
      arregloNumerosTotales
    );


    /*
     * Cerrar modal.
     */

    CerrarModal(
      'contai-ingreso-numeros'
    );


    TotalFichas();


  } catch (error) {

    console.error(
      "Error al generar participantes:",
      error
    );

    MostrarError(
      "Ocurrió un error al procesar los participantes."
    );

  }

};


// ============================================================
// IMPRIMIR NÚMEROS EN EL TABLERO
// ============================================================

const ImprimirNumeros = (arregloNumerosTablero) => {

  try {

    const containernumeros =
      document.getElementById(
        'container_numeros'
      );


    if (!containernumeros) {
      return;
    }


    containernumeros.innerHTML =
      "";


    arregloNumerosTablero.forEach(
      participante => {

        if (!participante) {
          return;
        }


        const numero =
          Number(participante.numero);


        if (!Number.isInteger(numero)) {
          return;
        }


        let divNumero =
          document.createElement(
            "div"
          );


        /*
         * Conservamos la clase
         * numero-div original.
         */

        divNumero.innerHTML = `
          <div
            id="${numero}"
            class="numero-div"
          >
            <p>${numero}</p>
          </div>
        `;


        containernumeros.appendChild(
          divNumero
        );

      }
    );


    TotalFichas();


  } catch (error) {

    console.error(
      "Error imprimiendo números:",
      error
    );

  }

};


// ============================================================
// SELECCIONAR GANADOR
// ============================================================

const Seleccionar = () => {

  try {

    var numerosJSON =
      localStorage.getItem(
        "arregloNumerosTotales"
      );


    var numeros = [];

    try {

      numeros =
        numerosJSON
          ? JSON.parse(numerosJSON)
          : [];

    } catch (error) {

      numeros = [];

    }


    if (
      !Array.isArray(numeros) ||
      numeros.length === 0
    ) {

      MostrarError(
        "No hay fichas para seleccionar."
      );

      return;

    }


    /*
     * Selección aleatoria.
     */

    let numeroElementos =
      Math.floor(
        Math.random() *
        numeros.length
      );


    /*
     * Aquí obtenemos EL OBJETO completo.
     *
     * Ejemplo:
     *
     * {
     *   numero: 206,
     *   nombre: "Nicolás",
     *   apellido: "Useche"
     * }
     */

    const ganador =
      numeros[numeroElementos];


    /*
     * Mostrar ganador.
     */

    MostarModalNumeroGanador(
      ganador
    );


    /*
     * Eliminar ganador
     * del arreglo.
     */

    numeros.splice(
      numeroElementos,
      1
    );


    /*
     * Actualizar arreglo global.
     */

    arregloNumerosTotales =
      [...numeros];


    /*
     * Actualizar tablero.
     */

    ImprimirNumeros(
      arregloNumerosTotales
    );


    /*
     * Mantener la función
     * original de exportar los
     * números restantes.
     */

    ExportarConsola(
      arregloNumerosTotales
    );


    /*
     * Guardar nuevamente.
     */

    var nuevoJSON =
      JSON.stringify(
        arregloNumerosTotales
      );


    localStorage.setItem(
      "arregloNumerosTotales",
      nuevoJSON
    );


    TotalFichas();


  } catch (error) {

    console.error(
      "Error seleccionando ganador:",
      error
    );

  }

};


// ============================================================
// EXPORTAR / ACTUALIZAR TEXTAREA
// ============================================================

const ExportarConsola = (numeros) => {

  try {

    var salida = "";


    for (
      var i = 0;
      i < numeros.length;
      i++
    ) {

      /*
       * Ahora exportamos:
       *
       * 206 - Nicolás Useche
       *
       * en lugar de solamente:
       *
       * 206
       */

      salida +=
        `${numeros[i].numero} - ${ObtenerNombreCompleto(numeros[i])}`;


      if (i < numeros.length - 1) {
        salida += "\n";
      }

    }


    console.log(salida);


    const textarea =
      document.getElementById(
        'numeros_ingresados'
      );


    if (textarea) {
      textarea.value = salida;
    }


  } catch (error) {

    console.error(
      "Error exportando participantes:",
      error
    );

  }

};


// ============================================================
// MOSTRAR GANADOR
// ============================================================

const MostarModalNumeroGanador = (participante) => {

  try {

    let divcontainer =
      document.getElementById(
        'contai-mensaje'
      );


    if (!divcontainer) {
      return;
    }


    divcontainer.style.visibility =
      "visible";


    /*
     * Número ganador.
     */

    let mensaje =
      document.getElementById(
        'lbl-mensaje'
      );


    if (mensaje) {

      mensaje.innerHTML =
        `${participante.numero}, 
        ${participante.nombre} 
        ${participante.apellido}`;

    }


    /*
     * Nombre del ganador.
     */

    let nombreGanador =
      document.getElementById(
        'nombre-ganador'
      );


    if (nombreGanador) {

      nombreGanador.innerHTML =
        ObtenerNombreCompleto(
          participante
        );

    }


    /*
     * Confeti original.
     */

    launchConfetti();


  } catch (error) {

    console.error(
      "Error mostrando ganador:",
      error
    );

  }

};


// ============================================================
// CONFETI
// ============================================================

var count = 1000;

var defaults = {
  origin: {
    y: 0.5
  }
};


function fire(
  particleRatio,
  opts
) {

  confetti({

    ...defaults,

    ...opts,

    particleCount:
      Math.floor(
        count *
        particleRatio
      )

  });

}


function launchConfetti() {

  fire(0.80, {

    spread: 500,

    startVelocity: 500,

  });


  fire(0.20, {

    spread: 200,

  });


  fire(0.35, {

    spread: 100,

    decay: 0.91,

    scalar: 2

  });


  fire(0.1, {

    spread: 500,

    startVelocity: 500,

    decay: 5.92,

    scalar: 2

  });


  fire(0.1, {

    spread: 600,

    startVelocity: 500,

  });

}


// ============================================================
// CERRAR MODAL DE ERROR
// ============================================================

const cerrarModalAceptar = () => {

  const btnSeleccionar =
    document.getElementById(
      'id_div_boton'
    );


  if (btnSeleccionar) {

    btnSeleccionar.style.display =
      "none";

  }


  const valor =
    document.getElementById(
      'pr'
    );


  if (valor) {

    valor.innerHTML = "";

  }


  CerrarModal(
    'contai-error'
  );

};


// ============================================================
// CERRAR MODAL
// ============================================================

const CerrarModal = (modal) => {

  try {

    let divcontainer =
      document.getElementById(
        modal
      );


    if (!divcontainer) {
      return;
    }


    divcontainer.style.visibility =
      "collapse";


    const texto =
      document.getElementById(
        'textonum'
      );


    if (texto) {

      texto.style.color =
        'black';

    }


  } catch (error) {

    console.error(
      "Error cerrando modal:",
      error
    );

  }

};


// ============================================================
// MOSTRAR ERROR
// ============================================================

const MostrarError = (mensa) => {

  let divcontainer =
    document.getElementById(
      'contai-error'
    );


  let mensaje_error =
    document.getElementById(
      'mensaje_error-error'
    );


  if (divcontainer) {

    divcontainer.style.visibility =
      "visible";

  }


  if (mensaje_error) {

    mensaje_error.textContent =
      mensa;

  }


  CerrarModal(
    'contai-ingreso-numeros'
  );


  CerrarModal(
    'contai-mensaje'
  );

};


// ============================================================
// VALIDAR TEXTO
// ============================================================

/*
 * IMPORTANTE:
 *
 * Antes esta función solamente permitía:
 *
 * 0-9 y ,
 *
 * porque el sistema solamente aceptaba números.
 *
 * Ahora necesitamos letras, espacios, tildes y guiones.
 *
 * Por eso NO bloqueamos las teclas.
 */

const validaNumerosComa = (e) => {

  return true;

};