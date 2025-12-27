import type { CartaIndividual, CartaPlantilla } from "../shared/types";

const url_img_u_bebes = "/img/cartas/u_bebes/";
const url_img_u_basicos = "/img/cartas/u_basicos/";
const url_img_u_magicos = "/img/cartas/u_magicas/";
const url_img_magic = "/img/cartas/magicas/";
const url_img_upgrade = "/img/cartas/mejora/";
const url_img_downgrade = "/img/cartas/deterioro/";
const url_img_inst = "/img/cartas/instantanea/";

function generarID(longitud: number = 10): string {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  for (let i = 0; i < longitud; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    id += caracteres[indice];
  }
  return id;
}

const imgBebeUnicornio = [
  `${url_img_u_bebes}UU-Base-001-SE.png`, // rojo
  `${url_img_u_bebes}UU-Base-002-SE.png`, // pink
  `${url_img_u_bebes}UU-Base-003-SE.png`, // orange
  `${url_img_u_bebes}UU-Base-004-SE.png`, // yellow
  `${url_img_u_bebes}UU-Base-005-SE.png`, // green
  `${url_img_u_bebes}UU-Base-006-SE.png`, // blue
  `${url_img_u_bebes}UU-Base-007-SE.png`, // purple
  `${url_img_u_bebes}UU-Base-008-SE.png`, // black
  `${url_img_u_bebes}UU-Base-009-SE.png`, // white
  `${url_img_u_bebes}UU-Base-010-SE.png`, // brown
  `${url_img_u_bebes}UU-Base-011-SE.png`, // rainbow
  `${url_img_u_bebes}UU-Base-012-SE.png`, // death
];

function generarCartaBebeUnicornio(imagen: string[]): CartaPlantilla[] {
  return imagen.map((url) => ({
    nombre: "BEBE UNICORNIO",
    tipo: "BEBE UNICORNIO",
    imagen: url,
    descripcion:
      "Si esta carta es Sacrificada, Destruida o devuelta a tu mano, en su lugar, devuélvela a la Guardería.",
    // efecto: "",
    repeticiones: 1,
  }));
}

export const plantillas: CartaPlantilla[] = [
  {
    nombre: "RELINCHAR",
    tipo: "INSTANTANEO",
    imagen: `${url_img_inst}UU-Base-082-SE.png`,
    descripcion:
      "Usa esta carta cuando cualquier jugador intente jugar una carta. Evita que la carta de ese jugador entre en juego y envíala al Mazo de descarte",
    // efecto: "",
    repeticiones: 14,
  },
  {
    nombre: "SUPER RELINCHAR",
    tipo: "INSTANTANEO",
    imagen: `${url_img_inst}UU-Base-083-SE.png`,
    descripcion:
      "Usa esta carta cuando cualquier jugador intente jugar una carta. Evita que la carta de ese jugador entre en juego y envíala al Mazo de descarte. Esta carta no puede ser parada con Relinchar.",
    // efecto: "",
    repeticiones: 1,
  },

  //Unicornios BEBE
  ...generarCartaBebeUnicornio(imgBebeUnicornio),
  {
    nombre: "BEBE NARVAL",
    tipo: "BEBE UNICORNIO",
    imagen: `${url_img_u_bebes}UU-Base-013-SE.png`,
    descripcion:
      "Si esta carta es Sacrificada, Destruida o devuelta a tu mano, en su lugar, devuélvela a la Guardería.",
    // efecto: "",
    repeticiones: 1,
  },

  //Unicornios BASICOS
  {
    //GREEN
    nombre: "UNICORNIO BÁSICO",
    tipo: "UNICORNIO BÁSICO",
    imagen: `${url_img_u_basicos}UU-Base-017-SE.png`,
    descripcion: "Disco de vinilo y casettes recopilatorios solamente.",
    // efecto: "",
    repeticiones: 3,
  },
  {
    //BLUE
    nombre: "UNICORNIO BÁSICO",
    tipo: "UNICORNIO BÁSICO",
    imagen: `${url_img_u_basicos}UU-Base-018-SE.png`,
    descripcion: "Los collares resultones son solo para fechas señaladas",
    // efecto: "",
    repeticiones: 3,
  },
  {
    //PURPLE
    nombre: "UNICORNIO BÁSICO",
    tipo: "UNICORNIO BÁSICO",
    imagen: `${url_img_u_basicos}UU-Base-020-SE.png`,
    descripcion:
      "#nomaquillaje#nofiltros#soleado#desvergonzada#selfie#básico#TGIF#caballounicornionoimporta",
    // efecto: "",
    repeticiones: 3,
  },
  {
    //RED
    nombre: "UNICORNIO BÁSICO",
    tipo: "UNICORNIO BÁSICO",
    imagen: `${url_img_u_basicos}UU-Base-014-SE.png`,
    descripcion: "Las barbas son como... muy calientes.",
    // efecto: "",
    repeticiones: 3,
  },
  {
    //YELLOW
    nombre: "UNICORNIO BÁSICO",
    tipo: "UNICORNIO BÁSICO",
    imagen: `${url_img_u_basicos}UU-Base-016-SE.png`,
    descripcion: "Baila como si nadie te estuviera viendo.",
    // efecto: "",
    repeticiones: 3,
  },
  {
    //BROWN
    nombre: "UNICORNIO BÁSICO",
    tipo: "UNICORNIO BÁSICO",
    imagen: `${url_img_u_basicos}UU-Base-015-SE.png`,
    descripcion: "La especia de calabaza es la especia de la vida.",
    // efecto: "",
    repeticiones: 3,
  },
  {
    //PINK
    nombre: "UNICORNIO BÁSICO",
    tipo: "UNICORNIO BÁSICO",
    imagen: `${url_img_u_basicos}UU-Base-019-SE.png`,
    descripcion: "💖🙌💅🙌💖💁💁😂😂😂",
    // efecto: "",
    repeticiones: 3,
  },
  {
    //BASICO NARVAL
    nombre: "NARVAL",
    tipo: "UNICORNIO BÁSICO",
    imagen: `${url_img_u_basicos}UU-Base-021-SE.png`,
    descripcion:
      "Esta carta no tiene poderes especiales, ¡pero es tan linda..!",
    // efecto: "",
    repeticiones: 1,
  },

  // Unicornios MAGICOS
  {
    nombre: "RINOCORNIO",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-022-SE.png`,
    descripcion:
      "Si esta carta está en tu Establo al comienzo de tu turno, puedes DESTRUIR un Unicornio, luego termina tu turno inmediatamente.", //setTurno (false)
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "GATOCORNIO",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Apoc-007-2E.png`, //UU-Apoc-007-2E
    descripcion:
      "Mientras esta carta esta en tu Establo, no puede ser destruida o afectada por cartas Mágicas.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO NAVAJERO",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-024-V.png`,
    descripcion:
      "Si esta carta es Sacrificada o Destruida, puedes DESTRUIR un Unicornio.", // Sacrificada || Destruida = Destruir
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "PERRICORNIO",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-025-02.png`,
    descripcion:
      "Al final de tu turno, mueve al Pericornio al Establo del jugador de tu izquierda. Esta carta no puede ser sacrificada o destruida",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO ARCOIRIS",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-026-SE.png`,
    descripcion:
      "Cuando esta carta entra a tu Establo, tambien puedes poner un Unicornio Básico directamente a tu Establo desde tu mano.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO ZOMBI",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Apoc-006-2E.png`,
    descripcion:
      "Cuando esta carta está en tu Establo al comienzo de tu turno, puedes DESCARTAR un Unicorino. Si lo haces, elige un Unicornio del Mazo de descartes y llevalo directamente a tu Establo, luego finaliza inmediatamente tu turno.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO DESTRUCTOR",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Apoc-005-2E.png`,
    descripcion:
      "Cuando esta carta entra a tu Establo, cada jugador debe SACRIFICAR a un Unicornio.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO CON MOTOSIERRA",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-029-SE.png`,
    descripcion:
      "Cuando esta carta entra a tu Establo, puedes SACRIFICAR o DESTRUIR una carta de Mejora o Deterioro.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "LLAMACORNIO",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Apoc-004-2E.png`,
    descripcion:
      "Cuando esta carta entra a tu Establo, cada jugador debe DESCARTAR una carta. Mezcla el Mazo de descarte con el Mazo de robo.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "U.S.A.CORNIO",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-031-SE.png`,
    descripcion:
      "Cuando esta carta entra a tu Establo, puedes Robar una carta al azar de la mano de cualquier jugador y añadirla a tu mano.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO DESCOMUNAL",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-032-V.png`,
    descripcion:
      "Esta carta cuenta como dos Unicornios en tu Establo. Siempre que esta carta esté en tu Establo, no podras jugar ninguna carta Instantánea.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO SEDUCTOR",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-033-SE.png`,
    descripcion:
      "Cuando esta carta entra en tu Establo, puedes mover un Unicornio del Establo de un jugador a tu Establo. Si esta carta sale de tu Establo, devuelve al Unicornio a su Establo original.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO ANGELICAL",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Apoc-002-2E.png`,
    descripcion:
      "Si esta carta está en tu Establo al comienzo de tu turno, puedes SACRIFICARLA. Si lo haces, elige un Unicornio del Mazo de descartes para añadirlo directamente a tu Establo.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "REINA UNICORNIO",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-035-V.png`,
    descripcion:
      "Mientras esta carta está en tu Establo, ningún otro jugador puede jugar Unicornios Básicos.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO CODICIOSO",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-036-SE.png`,
    descripcion:
      "Cuando esta carta entra a tu Establo, ROBA una carta. Si esta carta es Sacrificada o Destruida, devúelvela a tu mano.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO MOLESTO",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-037-V.png`,
    descripcion:
      "Cuando esta carta entra en tu Establo, puedes elegir a cualquier jugador. Ese jugador debe DESCARTAR una carta. Si esta carta es Sacrificada o Destruida, devuélvela a tu mano.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO MARIPOSA",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-038-SE.png`,
    descripcion:
      "Cuando esta carta entra en tu Establo, puedes elegir una carta Mágica del Mazo de descartes y añadirla a tu mano. Si esta carta es Sacrificada o Destruida, devuélvela a tu mano.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO VELOZ",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-039-SE.png`,
    descripcion:
      "Cuando esta carta entra en tu Establo, puedes elegir una carta Instanánea del Mazo de descartes y añadirla a tu mano. Si esta carta es Sacrificada o Destruida, devuélvela a tu mano.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO MAJESTUOSO",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-040-SE.png`,
    descripcion:
      "Cuando esta carta entra en tu Establo, puedes elegir una Unicornio del Mazo de descartes y añadirlo a tu mano. Si esta carta es Sacrificada o Destruida, devuélvela a tu mano.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO FELIX",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Apoc-003-2E.png`,
    descripcion:
      "Cuando esta carta entra en tu Establo, DESCARTA una carta. Si esta carta es Sacrificada o Destruida, ponla directamente en tu Establo. Si no puedes DESCARTAR una carta, esta carta es Destruida.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "CUERNO DE MAIZ",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-042-SE.png`,
    descripcion:
      "Cuando esta carta entra en tu Establo, ROBA dos cartas y luego DESCARTA una.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "CABALLERO NEGRO",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-043-SE.png`,
    descripcion:
      "Si uno de tus Unicornios va a ser destruido, puedes SACRIFICAR esta carta en su lugar.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "TIBUCORNIO",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-044-SE.png`,
    descripcion:
      "Cuando esta carta entra en tu Establo, puedes DESTRUIR un Unicornio. Si lo haces, SACRIFICA esta carta.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO ULTRAFERTIL",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Apoc-001-2E.png`,
    descripcion:
      "Si esta carta está en tu Establo al comienzo de tu turno, puedes DESCARTAR una carta. Si lo haces, pon un Unicornio Bebe en tu Establo de la Guarderia.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "NARVAL PIRATA",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-045-SE.png`,
    descripcion:
      "Cuando esta carta entra en tu Establo, puedes buscar en el mazo de robo una carta de Deterioro. Añadela a tu mano, luego baraja el Mazo.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "TORPEDO NARVAL",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-046-SE.png`,
    descripcion:
      "Cuando esta carta entra en tu Establo, SACRIFICA todas las cartas de Deteriro que haya en tu Establo.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "NARVAL SEDUCTOR",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-047-SE.png`,
    descripcion:
      "Cuando esta carta entra en tu Establo, puedes mover una carta de Mejora del Establo de cualquier jugador a tu Establo.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "UNICORNIO SIRENA",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-048-SE.png`,
    descripcion:
      "Cuando esta carta entra en tu Establo, puedes devolver una carta del Establo de cualquier jugador a la mano de ese jugador.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "NARVAL CON CLASE",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-049-V.png`,
    descripcion:
      "Cuando esta carta entra en tu Establo, puedes buscar en el Mazo una carta de Mejora. Agrégala a tu mano y luego baraja el Mazo.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "EL GRAN NARVAL",
    tipo: "UNICORNIO MÁGICO",
    imagen: `${url_img_u_magicos}UU-Base-050-SE.png`,
    descripcion:
      "Cuando esta carta entra en tu Establo, puedes buscar en el Mazo una carta de 'Narval'. Agrégala a tu mano y luego baraja el Mazo.",
    // efecto: "",
    repeticiones: 1,
  },

  // CARTAS MAGICAS
  {
    nombre: "VENENO",
    tipo: "MÁGICA",
    imagen: `${url_img_magic}UU-Base-051-SE.png`,
    fondo: "/img/fondos/Veneno_f.jpeg",
    descripcion: "DESTRUYE un Unicornio.",
    mensaje: "Escoge un Unicornio del Establo de cualquier Jugador",
    efecto: {
      id: "efectoVeneno",
      modo: "objetivo",
    },
    condicion: {
      id: "condicionEstablo",
      args: [
        "todosJugadores",
        1,
        ["UNICORNIO BÁSICO", "UNICORNIO MÁGICO", "BEBE UNICORNIO"],
        "Debe de haber al menos 1 carta UNICORNIO en un Establo",
      ],
    },
    modoDeJugador: "cartaEstabloJugador",
    repeticiones: 3,
  },
  {
    nombre: "COZ",
    tipo: "MÁGICA",
    imagen: `${url_img_magic}UU-Base-052-SE.png`,
    fondo: "/img/fondos/Coz_f.jpeg",
    descripcion:
      "Devuelve una carta que esté en el Establo de cualquier jugador a la manode ese jugador. Ese jugador debe DESCARTAR una carta.",
    mensaje: "Escoge una Carta del Establo de cualquier Jugador",
    efecto: {
      id: "efectoCoz",
      modo: "objetivo",
    },
    condicion: {
      id: "condicionEstablo",
      args: [
        "todosJugadores",
        1,
        "CUALQUIERA",
        "Debe de haber al menos 1 carta en un Establo",
      ],
    },
    modoDeJugador: "cartaEstabloJugador",
    repeticiones: 2,
  },
  {
    nombre: "CAMBIO DE SUERTE",
    tipo: "MÁGICA",
    imagen: `${url_img_magic}UU-Base-053-SE.png`,
    fondo: "/img/fondos/Suerte_f.jpeg",
    descripcion:
      "ROBA dos cartas, DESCARTA tres cartas, luego juega otro turno.",
    mensaje: "ROBA dos cartas, DESCARTA tres cartas, luego juega otro turno.",
    efecto: {
      id: "efectoCambioDeSuerte",
      modo: "inmediato",
    },
    modoDeJugador: "cartaMazo",
    repeticiones: 20,
  },
  {
    nombre: "TORNADO BRILLANTE",
    tipo: "MÁGICA",
    imagen: `${url_img_magic}UU-Base-054-SE.png`,
    fondo: "/img/fondos/TornBrillante_f.jpeg",
    descripcion:
      "Devuelve una carta del Establo de cada jugador a la mano de ese jugador.",
    mensaje: "Escoge una Carta del Establo de cada Jugador",
    efecto: {
      id: "efectoTornadoBrillante",
      modo: "objetivo",
    },
    condicion: {
      id: "condicionEstablo",
      args: [
        "todosJugadores",
        1,
        "CUALQUIERA",
        "Debe de haber al menos 1 carta en un Establo",
      ],
    },
    modoDeJugador: "cartaEstabloJugador",
    repeticiones: 1,
  },
  {
    nombre: "INTERCAMBIO DE UNICORNIOS",
    tipo: "MÁGICA",
    imagen: `${url_img_magic}UU-Base-055-SE.png`,
    fondo: "/img/fondos/IntercUni_f.jpeg",
    descripcion:
      "Cambia un Unicornio de tu Establo por un Unicornio del Establo de cualquier otro jugador.",
    mensaje: "Escoge un Unicornio de tu Establo",
    efecto: {
      id: "efectoIntercambioUnicornios",
      modo: "objetivo",
    },
    condicion: [
      {
        id: "condicionEstablo",
        args: [
          "jugadorActual",
          1,
          ["UNICORNIO BÁSICO", "UNICORNIO MÁGICO", "BEBE UNICORNIO"],
          "Debes tener al menos 1 carta UNICORNIO en tu Establo",
        ],
      },
      {
        id: "condicionEstablo",
        args: [
          "demasJugadores",
          1,
          ["UNICORNIO BÁSICO", "UNICORNIO MÁGICO", "BEBE UNICORNIO"],
          "Los demas jugadores deben de tener al menos 1 carta UNICORNIO en un Establo",
        ],
      },
    ],
    modoDeJugador: "cartaEstabloJugador",
    repeticiones: 2,
  },
  {
    nombre: "REORIENTAR",
    tipo: "MÁGICA",
    imagen: `${url_img_magic}UU-Base-056-SE.png`,
    fondo: "/img/fondos/Reorientar_f.jpeg",
    descripcion:
      "Mueve una carta de Mejora o Deterioro del Establo de cualquier jugador al Establo de otro jugador.",
    mensaje: "Escoja una Carta de Mejora o Deterioro de un Establo",
    efecto: {
      id: "efectoReorientar",
      modo: "objetivo",
    },
    condicion: {
      id: "condicionEstablo",
      args: [
        "todosJugadores",
        1,
        ["DETERIORO", "MEJORA"],
        "Debe de haber al menos 1 carta de MEJORA o DETERIORO en un Establo",
      ],
    },
    modoDeJugador: "cartaEstabloJugador",
    repeticiones: 20,
  },
  {
    nombre: "TRATO INJUSTO",
    tipo: "MÁGICA",
    imagen: `${url_img_magic}UU-Base-057-SE.png`,
    fondo: "/img/fondos/TratoInjusto_f.jpeg",
    descripcion:
      "Intercambia las cartas de tu mano por las de cualquier otro jugador.",
    mensaje: "Escoja un Jugador para cambiar Cartas",
    efecto: {
      id: "efectoTratoInjusto",
      modo: "objetivo",
    },
    modoDeJugador: "cartaManoJugador",
    repeticiones: 2,
  },
  {
    nombre: "DOS-POR-UNO",
    tipo: "MÁGICA",
    imagen: `${url_img_magic}UU-Base-058-SE.png`,
    fondo: "/img/fondos/DosPorUno_f.jpeg",
    descripcion: "SACRIFICA una carta, luego DESTRUYE dos cartas.",
    mensaje: "Escoja una carta para SACRIFICAR",
    efecto: {
      id: "efectoDosPorUno",
      modo: "objetivo",
    },
    condicion: [
      {
        id: "condicionEstablo",
        args: [
          "jugadorActual",
          1,
          "CUALQUIERA",
          "Debes tener al menos 1 carta en tu Establo",
        ],
      },
      {
        id: "condicionEstablo",
        args: [
          "todosJugadores",
          2,
          "CUALQUIERA",
          "Debe de haber al menos 1 carta en los Establos",
        ],
      },
    ],
    modoDeJugador: "cartaEstabloJugador",
    repeticiones: 2,
  },
  {
    nombre: "RAYO ENCOGEDOR",
    tipo: "MÁGICA",
    imagen: `${url_img_magic}UU-Base-059-02.png`,
    descripcion:
      "Reemplaza todos los unicornios del Establo de un jugador con bebes unicornios de la Guarderia. Todos los unicornios reemplazados van al Mazo de descartes.",
    mensaje: "Seleccione un Jugador cuyo Establo sera afectado",
    efecto: {
      id: "efectoRayoEncogedor",
      modo: "objetivo",
    },
    condicion: [
      {
        id: "condicionEstablo",
        args: [
          "todosJugadores",
          1,
          ["UNICORNIO BÁSICO", "UNICORNIO MÁGICO", "BEBE UNICORNIO"],
          "Debe haber al menos 1 carta UNICORNIO en un Establo",
        ],
      },
    ],
    modoDeJugador: "cartaManoJugador",
    repeticiones: 1,
  },
  {
    nombre: "BLANCO FIJADO",
    tipo: "MÁGICA",
    imagen: `${url_img_magic}UU-Base-060-SE.png`,
    descripcion: "SACRIFICA o DESTRUYE una carta de Mejora o Deterioro.",
    mensaje: "Seleccione una carta de Mejora o Deterioro",
    efecto: {
      id: "efectoBlancoFijado",
      modo: "objetivo",
    },
    condicion: {
      id: "condicionEstablo",
      args: [
        "todosJugadores",
        1,
        ["DETERIORO", "MEJORA"],
        "Debe de haber al menos 1 carta de MEJORA o DETERIORO en un Establo",
      ],
    },
    modoDeJugador: "cartaEstabloJugador",
    repeticiones: 1,
  },
  {
    nombre: "VÓRTICE MÍSTICO",
    tipo: "MÁGICA",
    imagen: `${url_img_magic}UU-Base-061-SE.png`,
    descripcion:
      "Cada jugador debe DESCARTAR una carta. Mezcla el mazo de descarte con el mazo de robo.",
    efecto: {
      id: "efectoVorticeMistico",
      modo: "inmediato",
    },
    modoDeJugador: "descarte",
    repeticiones: 10,
  },
  {
    nombre: "BUEN NEGOCIO",
    tipo: "MÁGICA",
    imagen: `${url_img_magic}UU-Base-062-SE.png`,
    descripcion: "ROBA tres cartas, luego DESCARTA una carta.",
    mensaje: "ROBA tres cartas, luego DESCARTA una carta.",
    efecto: {
      id: "efectoBuenNegocio",
      modo: "inmediato",
    },
    modoDeJugador: "cartaMazo",
    repeticiones: 10,
  },
  {
    nombre: "AGITAR",
    tipo: "MÁGICA",
    imagen: `${url_img_magic}UU-Base-063-SE.png`,
    descripcion:
      "Baraja esta carta, junto a las cartas de tu mano y el mazo de descartes, luego ROBA cinco cartas.",
    mensaje: "ROBA 5 cartas del mazo de Descarte",
    efecto: {
      id: "efectoAgitar",
      modo: "inmediato",
    },
    modoDeJugador: "cartaMazoDescarte",
    repeticiones: 100,
  },
  {
    nombre: "ROBO FLAGRANTE",
    tipo: "MÁGICA",
    imagen: `${url_img_magic}UU-Base-064-SE.png`,
    descripcion:
      "Mira las cartas de la mano de cualquier jugador. Quitale una carta a tu elección y añadela a tu mano.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "BOTÓN DE RESETEO",
    tipo: "MÁGICA",
    imagen: `${url_img_magic}UU-Base-065-SE.png`,
    descripcion:
      "Cada jugador debe SACRIFICAR todas sus cartas de Mejora y Deterioro. Baraja el mazo de descartes y añadelo al mazo de robo.",
    // efecto: "",
    repeticiones: 1,
  },

  // CARTAS DE MEJORA
  {
    nombre: "MELENA ARCOIRIS",
    tipo: "MEJORA",
    imagen: `${url_img_upgrade}UU-Base-066-02.png`,
    descripcion:
      "Debes tener un Unicornio Básico en tu Establo para jugar esta carta. Si esta carta está en tu Establo al comienzo de tu turno, puedes traer un Unicornio Básico de tu mano directamente a tu Establo.",
    // efecto: "",
    repeticiones: 3,
  },
  {
    nombre: "COLA EXTRA",
    tipo: "MEJORA",
    imagen: `${url_img_upgrade}UU-Base-067-02.png`,
    descripcion:
      "Debes tener un Unicornio Básico en tu Establo para jugar esta carta. Si esta carta está en tu Establo al comienzo de tu turno, puedes ROBAR una carta extra.",
    // efecto: "",
    repeticiones: 3,
  },
  {
    nombre: "BOMBA BRILLANTE",
    tipo: "MEJORA",
    imagen: `${url_img_upgrade}UU-Base-068-SE.png`,
    descripcion:
      "Si esta carta está en tu Establo al comienzo de tu turno, puedes SACRIFICAR una carta de tu establo para luego DESTRUIR una carta del establo de otro jugador.",
    // efecto: "",
    repeticiones: 2,
  },
  {
    nombre: "¡HURRA!",
    tipo: "MEJORA",
    imagen: `${url_img_upgrade}UU-Base-069-SE.png`,
    descripcion:
      "Mientras esta carta esté en tu Establo, las cartas que juegues no pueden ser Paradas con la carta Relinchar.",
    // efecto: "",
    repeticiones: 2,
  },
  {
    nombre: "LAZO DE UNICORNIO",
    tipo: "MEJORA",
    imagen: `${url_img_upgrade}UU-Base-070-02.png`,
    descripcion:
      "Si esta carta está en tu Establo al comienzo de tu turno, puedes mover un Unicornio del Establo de un jugador a tu Establo. Al final de tu turno, mueve al Unicornio a su Establo original.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "AURA ARCOIRIS",
    tipo: "MEJORA",
    imagen: `${url_img_upgrade}UU-Base-071-SE.png`,
    descripcion:
      "Mientras esta carta esté en tu Establo, tus Unicornios no pueden ser destruidos.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "DOBLE COMBA",
    tipo: "MEJORA",
    imagen: `${url_img_upgrade}UU-Base-072-SE.png`,
    descripcion:
      "Si esta carta está en tu Establo al comienzo de tu turno, puedes jugar dos cartas durante tu turno en vez de una.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "RITUAL DE INVOCACIÓN",
    tipo: "MEJORA",
    imagen: `${url_img_upgrade}UU-Base-073-02.png`,
    descripcion:
      "Si esta carta está en tu Establo al comienzo de tu turno, puedes DESCARTAR dos Unicornios, luego traer un Unicornio directamente a tu Establo desde el mazo de descartes.",
    // efecto: "",
    repeticiones: 1,
  },

  // CARTAS DE DETERIORO
  {
    nombre: "ALAMBRE DE ESPINO",
    tipo: "DETERIORO",
    imagen: `${url_img_downgrade}UU-Base-074-SE.png`,
    descripcion:
      "Mientras esta carta esté en tu Establo, debes DESCARTAR una carta cada vez que un Unicornio entre o salga de tu Establo.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "PANDAMONIUM",
    tipo: "DETERIORO",
    imagen: `${url_img_downgrade}UU-Base-075-SE.png`,
    descripcion:
      "Mientras esta carta esté en tu Establo, todos los Unicornios se consideran Pandas y NO Unicornios. Las cartas que afectan a los Unicornios no afectan a los Pandas.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "RITUAL SÁDICO",
    tipo: "DETERIORO",
    imagen: `${url_img_downgrade}UU-Base-076-SE.png`,
    descripcion:
      "Si esta carta está en tu Establo al comienzo de tu turno, SACRIFICA un Unicornio, luego ROBA una carta extra.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "RALENTIZACIÓN",
    tipo: "DETERIORO",
    imagen: `${url_img_downgrade}UU-Base-077-SE.png`,
    descripcion:
      "Siempre que esta carta esté en tu Establo, no puedes jugar cartas Instantáneas.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "VIGILA-BEBES",
    tipo: "DETERIORO",
    imagen: `${url_img_downgrade}UU-Base-078-SE.png`,
    descripcion:
      "Mientras esta carta esté en tu Establo, debes jugar con las cartas de tu mano visibles para todos los jugadores.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "ESTABLO ROTO",
    tipo: "DETERIORO",
    imagen: `${url_img_downgrade}UU-Base-079-SE.png`,
    descripcion:
      "Mientras esta carta esté en tu Establo, no podrás jugar cartas de Mejora.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "LUZ CEGADORA",
    tipo: "DETERIORO",
    imagen: `${url_img_downgrade}UU-Base-080-SE.png`,
    descripcion:
      "Mientras esta carta esté en tu Establo, los efectos de tuss cartas de Unicornio no podrán ser activados.",
    // efecto: "",
    repeticiones: 1,
  },
  {
    nombre: "ESTABLO PEQUEÑO",
    tipo: "DETERIORO",
    imagen: `${url_img_downgrade}UU-Base-081-SE.png`,
    descripcion:
      "Mientras esta carta esté en tu Establo, solo puedes tener cinco Unicornios en tu Establo.",
    // efecto: "",
    repeticiones: 1,
  },
];

// Generar mazo real

export function generarMazo(): CartaIndividual[] {
  const mazo: CartaIndividual[] = [];

  for (const plantilla of plantillas) {
    for (let i = 0; i < plantilla.repeticiones; i++) {
      mazo.push({
        ...plantilla,
        id: generarID(), // cada carta fisica tiene su propio id
      });
    }
  }

  return mazo;
}
