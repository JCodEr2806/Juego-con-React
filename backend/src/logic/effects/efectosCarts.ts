import { CartaIndividual, JugadorEnPartida, Sala } from "../../shared/types";
import { descartarCarta } from "../drawManager";
import { barajarMazo } from "../mazo";
import { pasarTurno } from "../turnManager";

// PALABRAS CLAVES
// SACRIFICAR: Envia una carta de tu Establo al mazo de descartes
// DESTRUIR: Envia una carta del Establo de otro jugador al mazo de descartes
// DESCARTAR: Envia una carta de tu mano al mazo de descartes

// EN JUEGO: Cartas acltuamente en el Establo de un jugador
// TRAER DIRECTAMENTE: Añade la carta de tu Establo inmediatamente
// ENTRAR EN JUEGO: No cuenta como tu accion de este turno

export const efectos: Record<
  string,
  (
    sala: Sala,
    io: any,
    jugadorVictimaId: string,
    zona: string,
    cartaPosicion?: number,
    cartaId?: string
  ) => boolean | void
> = {
  efectoVeneno: efectoVeneno,
  efectoCoz: efectoCoz,
  efectoCambioDeSuerte: efectoCambioDeSuerte,
  efectoTornadoBrillante: efectoTornadoBrillante,
  efectoIntercambioUnicornios: efectoIntercambioUnicornios,
  efectoReorientar: efectoReorientar,
  efectoTratoInjusto: efectoTratoInjusto,
  efectoDosPorUno: efectoDosPorUno,
  efectoRayoEncogedor: efectoRayoEncogedor,
  efectoBlancoFijado: efectoBlancoFijado,
  efectoVorticeMistico: efectoVorticeMistico,
  efectoBuenNegocio: efectoBuenNegocio,
  efectoAgitar: efectoAgitar,
};

//Objetivo
export function efectoVeneno(
  sala: Sala,
  io: any,
  jugadorVictimaId: string,
  zona: string,
  cartaPosicion?: number,
  cartaId?: string
): boolean {
  //Aca usare solo la cartaId
  //Porque la POSICION de las cartas varia segun su tipo
  if (!sala.efectoPendiente) {
    console.warn("Sin efecto");
    return false;
  }

  //Cambiamos el modo del jugador respectivamente a lo que hara el efecto
  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  // -----------------------------------------------------------------------

  const jugador = sala.ordenTurnos.find((j) => j.id === jugadorVictimaId); // Encontrar al jugador victima
  if (!jugador) return false;

  if (zona !== "Establo") {
    console.warn("Carta no es del Establo");
    return false;
  } // Verificar que la carta venga del establo

  // Verificamos si la ID no es nulo
  if (cartaId === undefined) {
    console.warn("Cartas no cuadran");
    console.warn(cartaId);
    return false;
  }

  const cartaVictima = jugador.establo.find((c) => c.id === cartaId);

  if (!cartaVictima) {
    console.log("Carta no encontrada");
    return false;
  }

  const cartaVictimaIndex = jugador.establo.findIndex(
    (c) => c.id === cartaVictima.id
  );

  if (
    cartaVictima.tipo === "UNICORNIO BÁSICO" ||
    cartaVictima.tipo === "UNICORNIO MÁGICO" ||
    cartaVictima.tipo === "BEBE UNICORNIO"
  ) {
    //Extraer la carta del establo del JugadorVictima
    const cartaExtraida: CartaIndividual | undefined = jugador.establo.splice(
      cartaVictimaIndex,
      1
    )[0];
    if (!cartaExtraida) return false;
    sala.mazoDescarte.push(cartaExtraida);

    io.to(sala.id).emit("mazoDescarteActualizada", sala.mazoDescarte);

    const establos: Record<string, CartaIndividual[]> = {};
    sala.ordenTurnos.forEach((j) => {
      establos[j.id] = j.establo;
    });
    io.to(sala.id).emit("establosActualizado", establos);

    // Sirve tanto para mandar mensaje como para asignar el efecto pendiente
    sala.efectoPendiente.datos = [
      {
        modo: "descarte",
        cantidad: 1,
        mensajeData: [
          {
            objetivo: "victima",
            mensaje:
              "El jugador " +
              jugadorActual.nombre +
              " te DESTRUYO un Unicornio",
            fondo: "/img/fondos/Veneno_f.jpeg",
          },
          {
            objetivo: "sala",
            mensaje:
              "El jugador " +
              jugadorActual.nombre +
              " le DESTRUYO un Unicornio a " +
              jugador.nombre,
          },
        ],
      },
    ];

    // io.to(jugador.id).emit("efectoMensaje", {
    //   mensaje:
    //     "El jugador " + jugadorActual.nombre + " te DESTRUYO un Unicornio",
    //   fondo: "/img/UU-Back-Main.png",
    // });

    console.log("jugador Victima: " + jugador.nombre);
    console.log("carta Victima: " + cartaExtraida.nombre);

    return true;
  }

  console.warn(
    "El tipo de carta es Incorrecto, seleccione uno de tipo Unicornio"
  );
  io.to(sala.efectoPendiente?.jugadorQueJugo).emit("efectoMensaje", {
    mensaje: "Debes elegir un unicornio",
    fondo: "/img/UU-Back-Main.png",
  });
  return false;
}

export function efectoCoz(
  sala: Sala,
  io: any,
  jugadorVictimaId: string,
  zona: string,
  cartaPosicion?: number,
  cartaId?: string
): boolean {
  //Aca usare solo la cartaId

  //Buscamos el jugador q lanzo la carta
  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  const jugador = sala.ordenTurnos.find((j) => j.id === jugadorVictimaId); // Encontrar al jugador victima
  if (!jugador) return false;

  if (zona !== "Establo") {
    console.warn("Carta no es del Establo");
    return false;
  } // Verificar que la carta venga del establo

  // Verificamos si la ID no es nulo
  if (cartaId === undefined) {
    console.warn("Cartas no cuadran");
    console.warn(cartaId);
    return false;
  }

  const cartaVictima = jugador.establo.find((c) => c.id === cartaId);

  if (!cartaVictima) {
    console.log("Carta no encontrada");
    return false;
  }

  const cartaVictimaIndex = jugador.establo.findIndex(
    (c) => c.id === cartaVictima.id
  );

  //Extraer la carta del establo del JugadorVictima
  const cartaExtraida: CartaIndividual | undefined = jugador.establo.splice(
    cartaVictimaIndex,
    1
  )[0];
  if (!cartaExtraida) {
    console.warn("Carta no encontrada");
    console.log(cartaExtraida);
    return false;
  }
  const establos: Record<string, CartaIndividual[]> = {};
  sala.ordenTurnos.forEach((j) => {
    establos[j.id] = j.establo;
  });
  io.to(sala.id).emit("establosActualizado", establos);

  // console.log("Mano del jugador " + jugador.nombre);
  // console.log(jugador.mano);
  jugador.mano.push(cartaExtraida);
  // console.log("Mano despues del jugador " + jugador.nombre);
  // console.log(jugador.mano);

  const cantidades: Record<string, number> = {};
  sala.ordenTurnos.forEach((j) => {
    cantidades[j.id] = j.mano.length;
  });

  console.log("Catindades de Jugadores: ");
  console.log(cantidades);

  io.to(jugador.id).emit("manoActualizada", jugador.mano);
  io.to(sala.id).emit("cantidadesManos", cantidades);

  if (!sala.efectoPendiente) {
    console.log("Sala sin efectos pendientes: ");
    console.log(sala.efectoPendiente);

    return false;
  }

  sala.efectoPendiente.datos = [
    {
      modo: "descarte",
      cantidad: 1,
      victima: true,
      mensajeData: [
        {
          objetivo: "victima",
          mensaje: "Deves Descartar 1 cartas",
        },
        {
          objetivo: "sala",
          mensaje: "El jugador " + jugador.nombre + " deve Descartar 1 carta",
        },
      ],
    },
  ];

  jugadorActual.modoActual = ["normal"];
  io.to(jugadorActual.id).emit("modoActualActualizado", {
    modos: jugadorActual.modoActual,
  });

  jugador.modoActual = ["descarte"];
  io.to(jugador.id).emit("modoActualActualizado", {
    modos: jugador.modoActual,
  });
  console.log(jugador.nombre);
  console.log(jugador.modoActual);

  // io.to(jugador.id).emit("efectoMensaje", {
  //   mensaje: "Deves Descartar 1 cartas",
  //   fondo: "/img/UU-Back-Main.png",
  // });

  return true;
}

export function efectoCambioDeSuerte(
  sala: Sala,
  io: any,
  jugadorVictimaId: string,
  zona: string,
  cartaPosicion?: number,
  cartaId?: string
): boolean {
  if (!sala.efectoPendiente) {
    console.log("Sala sin efectos pendientes: ");
    console.log(sala.efectoPendiente);

    return false;
  }

  // Efecto en cadena
  // Debo de hacer q se valla quitando uno por uno los modos, compararlo dese el turnmanager si es array o no
  sala.efectoPendiente.datos = [
    { modo: "cartaMazo", cantidad: 2 },
    { modo: "descarte", cantidad: 3, volverAJugar: true, victima: false },
  ];
  console.log("datos actualizados");
  console.log(sala.efectoPendiente.datos);

  //Buscamos el jugador q lanzo la carta
  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  // const jugador = sala.ordenTurnos.find((j) => j.id === jugadorVictimaId);

  jugadorActual.jugadasDisponible = 2; //Restaurale las jugadas

  return true;
}

let jugadorSeleccionadoId: string[] = [];
let cantJugadores = 0;
export function efectoTornadoBrillante(
  sala: Sala,
  io: any,
  jugadorVictimaId: string,
  zona: string,
  cartaPosicion?: number,
  cartaId?: string
): boolean {
  if (!sala.efectoPendiente) {
    console.log("Sala sin efectos pendientes: ");
    console.log(sala.efectoPendiente);

    return false;
  }

  //Buscamos el jugador q lanzo la carta
  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  const jugador = sala.ordenTurnos.find((j) => j.id === jugadorVictimaId); // Encontrar al jugador victima
  if (!jugador) return false;

  if (jugadorSeleccionadoId.find((jId) => jId === jugador.id)) {
    console.warn("Jugador Repetido");
    return false;
  }

  if (zona !== "Establo") {
    console.warn("Carta no es del Establo");
    return false;
  } // Verificar que la carta venga del establo

  // Verificamos si la ID no es nulo
  if (cartaId === undefined) {
    console.warn("Cartas no cuadran");
    console.warn(cartaId);
    return false;
  }

  const cartaVictima = jugador.establo.find((c) => c.id === cartaId);

  if (!cartaVictima) {
    console.log("Carta no encontrada");
    return false;
  }

  const cartaVictimaIndex = jugador.establo.findIndex(
    (c) => c.id === cartaVictima.id
  );

  //1- Extraer la carta del establo del JugadorVictima
  const cartaExtraida: CartaIndividual | undefined = jugador.establo.splice(
    cartaVictimaIndex,
    1
  )[0];
  if (!cartaExtraida) {
    console.warn("Carta no encontrada");
    console.log(cartaExtraida);
    return false;
  }
  const establos: Record<string, CartaIndividual[]> = {};
  sala.ordenTurnos.forEach((j) => {
    establos[j.id] = j.establo;
  });
  io.to(sala.id).emit("establosActualizado", establos);

  // console.log("Mano del jugador " + jugador.nombre);
  // console.log(jugador.mano);
  jugador.mano.push(cartaExtraida);
  jugadorSeleccionadoId.push(jugador.id);
  // console.log("Mano despues del jugador " + jugador.nombre);
  // console.log(jugador.mano);

  const cantidades: Record<string, number> = {};
  sala.ordenTurnos.forEach((j) => {
    cantidades[j.id] = j.mano.length;
  });

  console.log("Catindades de Jugadores: ");
  console.log(cantidades);

  io.to(jugador.id).emit("manoActualizada", jugador.mano);
  io.to(sala.id).emit("cantidadesManos", cantidades);

  // Esto no sera necesario ya q ya pusimos las condiciones
  // if (cantJugadores === 0) {
  //   io.to(jugadorActual.id).emit("efectoMensaje", {
  //     mensaje: "Ningun jugador tiene cartas en su Establo WBON",
  //     fondo: "/img/UU-Back-Main.png",
  //   });
  //   return true;
  // }

  // Como es un efeto de Objetivo, se usara varias veces
  // Para no estar reiniciando tantas los datos segun las
  // veces q se use, verificamos si ya esta este dato
  if (!sala.efectoPendiente.datos) {
    // Significa  que no hay datos de este efecto en juego
    // Tonces cambiamos el estado a este modo

    sala.ordenTurnos.forEach((j) => {
      if (j.establo.length > 0) {
        cantJugadores++;
      } else {
        console.log("El Jugador " + j.nombre + " no tiene establo");
      }
    });

    console.log(cantJugadores);

    console.log("Le asignamos los Datos");
    sala.efectoPendiente.datos = [
      { modo: "cartaEstabloJugador", cantidad: cantJugadores + 1 },
    ];
  } else {
    console.log("Este efecto ya esta siendo usado, no cambiar nada");
  }

  console.log(jugadorSeleccionadoId.length);
  console.log(cantJugadores + 1);

  if (jugadorSeleccionadoId.length === cantJugadores + 1) {
    console.log(jugadorSeleccionadoId);
    jugadorSeleccionadoId = []; // Limpiar los jugadores
    console.log(jugadorSeleccionadoId);
    cantJugadores = 0; // Limpiar la cantidad de jugadores
  }

  // jugadorActual.modoActual = ["normal"];
  // io.to(jugadorActual.id).emit("modoActualActualizado", {
  //   modos: jugadorActual.modoActual,
  // });

  io.to(jugador.id).emit("efectoMensaje", {
    mensaje:
      "El jugador " +
      jugadorActual.nombre +
      " te devolvio una carta a tu establo",
    fondo: "/img/UU-Back-Main.png",
  });

  return true;
}

let turnoCartaVictima = false;
let cartasSeleccionadas: (CartaIndividual | undefined)[] = [];

export function efectoIntercambioUnicornios(
  sala: Sala,
  io: any,
  jugadorVictimaId: string,
  zona: string,
  cartaPosicion?: number,
  cartaId?: string
): boolean {
  if (!sala.efectoPendiente) {
    console.warn("Sin efecto");
    return false;
  }

  //Primero deve escoger una carta Unicornio de su establo
  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  const jugador = sala.ordenTurnos.find((j) => j.id === jugadorVictimaId); // Encontrar al jugador victima
  if (!jugador) return false;

  if (zona !== "Establo") {
    console.warn("Carta no es del Establo");
    return false;
  } // Verificar que la carta venga del establo

  // Verificamos si la ID no es nulo
  if (cartaId === undefined) {
    console.warn("Cartas no cuadran");
    console.warn(cartaId);
    return false;
  }

  const cartaSelect =
    jugador.establo.find((c) => c.id === cartaId) ||
    jugadorActual.establo.find((c) => c.id === cartaId);

  if (
    cartaSelect?.tipo !== "UNICORNIO BÁSICO" &&
    cartaSelect?.tipo !== "UNICORNIO MÁGICO" &&
    cartaSelect?.tipo !== "BEBE UNICORNIO"
  ) {
    io.to(jugadorActual.id).emit("efectoMensaje", {
      mensaje: "Debes de escoger un Unicornio",
      fondo: "/img/UU-Back-Main.png",
    });
    return false;
  }

  if (
    !jugadorActual.establo.find((c) => c.id === cartaId) &&
    cartasSeleccionadas.length === 0
  ) {
    io.to(jugadorActual.id).emit("efectoMensaje", {
      mensaje: "Primero escoje un Unicornio de tu Establo",
      fondo: "/img/UU-Back-Main.png",
    });
    return false;
  }

  if (jugadorActual.establo.find((c) => c.id === cartaId)) {
    // Significa q es la carta de su establo
    const cartaJugadorActSelect = jugadorActual.establo.find(
      (c) => c.id === cartaId
    );

    // Ponemos esa carta con la id como JugadorActual
    cartasSeleccionadas[0] = cartaJugadorActSelect;
    // Dejar seleccionar a otro jugador

    sala.efectoPendiente.datos = [
      {
        modo: "cartaEstabloJugador",
        cantidad: 2,
      },
    ];

    io.to(jugadorActual.id).emit("efectoMensaje", {
      mensaje: "Ahora escoge un Unicornio del Establo de otro Jugador",
      fondo: "/img/fondos/IntercUni_f.jpeg",
    });

    turnoCartaVictima = true;
    return true;
  }
  // Momento de seleccionar la carta del JugadorVictima
  if (turnoCartaVictima) {
    if (jugador.establo.find((c) => c.id === cartaId)) {
      const cartaJugadorVictSelect = jugador.establo.find(
        (c) => c.id === cartaId
      );

      // Ponemos esa carta con la id como JugadorVictima
      cartasSeleccionadas[1] = cartaJugadorVictSelect;

      if (cartasSeleccionadas) {
        const cartaJgAct = cartasSeleccionadas[0];
        const cartaJgVict = cartasSeleccionadas[1];

        // Quitar la carta del establo de JugadorActual
        jugadorActual.establo.splice(
          jugadorActual.establo.findIndex((c) => c.id === cartaJgAct?.id),
          1
        );

        // Quitar la carta del establo de JugadorVictima
        jugador.establo.splice(
          jugador.establo.findIndex((c) => c.id === cartaJgVict?.id),
          1
        );

        // Agregar las cartas intercambiadas a los establos correspondientes
        jugadorActual.establo.push(cartaJgVict!);
        jugador.establo.push(cartaJgAct!);

        //Actualizamos establos
        const establos: Record<string, CartaIndividual[]> = {};
        sala.ordenTurnos.forEach((j) => {
          establos[j.id] = j.establo;
        });
        io.to(sala.id).emit("establosActualizado", establos);

        io.to(jugador.id).emit("efectoMensaje", {
          mensaje:
            "Se remplazo el Unicornio " +
            cartaJgVict?.nombre +
            " por " +
            cartaJgAct?.nombre,
          fondo: "/img/UU-Back-Main.png",
        });

        turnoCartaVictima = false;
        cartasSeleccionadas = [];
        return true;
      }
    }
  }
  return false;
}

export function efectoReorientar(
  sala: Sala,
  io: any,
  jugadorVictimaId: string,
  zona: string,
  cartaPosicion?: number,
  cartaId?: string
): boolean {
  if (!sala.efectoPendiente) {
    console.warn("Sin efecto");
    return false;
  }
  // Condicion: Carta de Mejora o Deterioro en el establo

  // 1. Selecciona una carta de cualquier Jugador
  // 2. Selecciona el nombre del Jugador al que se la quieres poner
  // 3. La carta seleccionada se pone en el establo del Jugador seleccionado

  // Condicion durante el efecto: No puede escoger al mismo jugador que escogio la carta

  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  const jugador = sala.ordenTurnos.find((j) => j.id === jugadorVictimaId);
  if (!jugador) return false;

  // Cambiar el nomber ManoJugador por zonaDeSeleccion
  if (zona !== "Establo" && zona !== "ManoJugador") {
    console.warn("Carta no es del Establo o ManoJugador");
    return false;
  }

  if (zona === "Establo") {
    const cartaSelect = jugador.establo.find((c) => c.id === cartaId);

    if (cartaSelect?.tipo !== "DETERIORO" && cartaSelect?.tipo !== "MEJORA") {
      io.to(jugadorActual.id).emit("efectoMensaje", {
        mensaje: "Debes de escoger una carta de Mejora o Deterioro",
        fondo: "/img/UU-Back-Main.png",
      });
      return false;
    }

    cartasSeleccionadas[0] = cartaSelect;
    jugadorSeleccionadoId[0] = jugador.id;

    // Poner en 2 modos:
    // [CartaManoJugador, CartaEstabloJugador]
    // Esto para que puede seleccionar otra carta si cambia de opinion
    sala.efectoPendiente.datos = [
      {
        modo: "cartaEstabloJugador",
        cantidad: 1,
        mensajeData: [
          {
            objetivo: "jugadorActual",
            mensaje: "Ahora escoge un Jugador al que le quieres poner la carta",
          },
        ],
      },
      {
        modo: ["cartaManoJugador", "cartaEstabloJugador"],
        cantidad: 1,
        mensajeData: [
          {
            objetivo: "victima",
            mensaje:
              "El jugador " +
              jugadorActual.nombre +
              " te puso la carta " +
              cartasSeleccionadas[0].nombre,
          },
        ],
      },
    ];

    return true;
  } // Verificar que la carta venga del establo

  // Significa q ya escogio la carta, ahora le toca escoger el jugador
  if (zona === "ManoJugador" && cartasSeleccionadas.length === 1) {
    if (jugador.id === jugadorSeleccionadoId[0]) {
      io.to(jugadorActual.id).emit("efectoMensaje", {
        mensaje: "No puedes escoger al mismo Jugador",
        fondo: "/img/UU-Back-Main.png",
      });
      return false;
    }

    // Buscamos al jugador donde se le quitara la carta
    const jugadorVictimaInicial = sala.ordenTurnos.find(
      (j) => j.id === jugadorSeleccionadoId[0]
    );
    if (!jugadorVictimaInicial) return false;

    const cartaSelectIndex = jugadorVictimaInicial.establo.findIndex(
      (c) => c.id === cartasSeleccionadas[0]?.id
    );

    jugadorVictimaInicial.establo.splice(cartaSelectIndex, 1);
    jugador.establo.push(cartasSeleccionadas[0]!);

    //Actualizamos establos
    const establos: Record<string, CartaIndividual[]> = {};
    sala.ordenTurnos.forEach((j) => {
      establos[j.id] = j.establo;
    });
    io.to(sala.id).emit("establosActualizado", establos);

    // Limpiamos las variables
    cartasSeleccionadas = [];
    jugadorSeleccionadoId = [];

    return true;
  }

  return false;
}

export function efectoTratoInjusto(
  sala: Sala,
  io: any,
  jugadorVictimaId: string,
  zona: string,
  cartaPosicion?: number,
  cartaId?: string
): boolean {
  if (!sala.efectoPendiente) {
    console.warn("Sin efecto");
    return false;
  }
  sala.efectoPendiente.datos = [{ modo: "cartaManoJugador", cantidad: 1 }];

  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  const jugador = sala.ordenTurnos.find((j) => j.id === jugadorVictimaId); // Encontrar al jugador victima
  if (!jugador) {
    console.log("Jugador no encontrado");
    console.log(jugador);
    return false;
  }

  if (zona !== "ManoJugador") {
    io.to(jugadorActual.id).emit("efectoMensaje", {
      mensaje: "Deve de escoge la Mano de un Jugador",
      fondo: "/img/UU-Back-Main.png",
    });

    console.warn("Carta no es del ManoJugador");
    return false;
  } // Verificar que la carta venga del ManoJugador

  if (jugadorActual.id === jugador.id) {
    io.to(jugadorActual.id).emit("efectoMensaje", {
      mensaje: "No puede escoger su propia Mano",
      fondo: "/img/UU-Back-Main.png",
    });

    console.warn("Mano de la Victima igual al del Actuañ");
    return false;
  }

  if (jugadorActual.mano.length <= 0) {
    console.log(jugadorActual.mano);
    io.to(jugadorActual.id).emit("efectoMensaje", {
      mensaje: "Usted no tiene ninguna carta en su mano",
      fondo: "/img/UU-Back-Main.png",
    });

    return true;
  }
  const cartasJugadorActual = jugadorActual.mano.splice(
    0,
    jugadorActual.mano.length
  );

  if (jugador.mano.length <= 0) {
    io.to(jugadorActual.id).emit("efectoMensaje", {
      mensaje: "Ese Jugador no tiene ninguna Carta ",
      fondo: "/img/UU-Back-Main.png",
    });

    return false;
  }
  const cartasJugadorVictima = jugador.mano.splice(0, jugador.mano.length);

  jugadorActual.mano.push(...cartasJugadorVictima);
  jugador.mano.push(...cartasJugadorActual);

  io.to(jugadorActual.id).emit("manoActualizada", jugadorActual.mano);
  io.to(jugador.id).emit("manoActualizada", jugador.mano);

  const cantidades: Record<string, number> = {};
  sala.ordenTurnos.forEach((j) => {
    cantidades[j.id] = j.mano.length;
  });

  console.log("Catindades de Jugadores: ");
  console.log(cantidades);
  io.to(sala.id).emit("cantidadesManos", cantidades);

  io.to(jugador.id).emit("efectoMensaje", {
    mensaje: "El Jugador " + jugadorActual.nombre + " cambio cartas contigo",
    fondo: "/img/UU-Back-Main.png",
  });

  return true;
}

let cartasSacrificadas: (CartaIndividual | undefined)[] = [];
export function efectoDosPorUno(
  sala: Sala,
  io: any,
  jugadorVictimaId: string,
  zona: string,
  cartaPosicion?: number,
  cartaId?: string
): boolean {
  if (!sala.efectoPendiente) {
    console.warn("Sin efecto");
    return false;
  }
  // Condicion: 1 carta en tu establo
  // Condicion: 1 carta en cualquier establo

  // 1. Selecciona una carta de tu Establo
  // 2. Selecciona el 2 cartas cualquiera de los Establos
  // 3. Las cartas seleccionadas se Sacrifican (Descartan)

  // Condicion durante el efecto: No puede escoger la misma carta de Sacrificio

  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  const jugador = sala.ordenTurnos.find((j) => j.id === jugadorVictimaId);
  if (!jugador) return false;

  // TODAS LAS CARTAS SERAN DEL ESTABLO
  if (zona !== "Establo") {
    console.warn("Carta no es del Establo");
    return false;
  }

  // Paso 1: Seleccionar la carta de su establo para Sacrificar
  if (cartasSacrificadas.length === 0) {
    const cartaSacrificada = jugadorActual.establo.find(
      (c) => c.id === cartaId
    );
    if (!cartaSacrificada) {
      io.to(sala.efectoPendiente?.jugadorQueJugo).emit("efectoMensaje", {
        mensaje: "Primero escoge una carta de tu Establo",
        fondo: "/img/UU-Back-Main.png",
      });
      return false;
    }
    cartasSacrificadas[0] = cartaSacrificada;

    cantJugadores = 0;
    sala.ordenTurnos.forEach((j) => {
      if (cantJugadores < 3) {
        j.establo.forEach((c) => {
          if (cantJugadores < 3) {
            cantJugadores++;
          }
        });
      }
    });

    console.log("Numero de jugadas: " + cantJugadores);

    sala.efectoPendiente.datos = [
      {
        modo: "cartaEstabloJugador",
        cantidad: cantJugadores,
      },
    ];

    io.to(jugadorActual.id).emit("efectoMensaje", {
      mensaje:
        "Ahora escoge " + (cantJugadores - 1) + " cartas de cualquier Establo",
      fondo: "/img/fondos/DosPorUno_f.jpeg",
    });

    return true;
  } else if (cartasSacrificadas.length === 1) {
    // Paso 2: Seleccionar las 2 cartas de cualquier establo

    const cartaVictima = jugador.establo.find((c) => c.id === cartaId);
    if (!cartaVictima) {
      console.log("Carta no encontrada");
      return false;
    }

    // Verificaciones de Error
    if (cartaVictima.id === cartasSacrificadas[0]?.id) {
      io.to(sala.efectoPendiente?.jugadorQueJugo).emit("efectoMensaje", {
        mensaje: "No puedes escoger la misma carta que Sacrificaste",
        fondo: "/img/UU-Back-Main.png",
      });
      return false;
    }

    cartasSeleccionadas.push(cartaVictima);

    // Quitar la carta del establo del JugadorVictima
    const cartaSelectIndex = jugador.establo.findIndex(
      (c) => c.id === cartasSeleccionadas[0]?.id
    );

    const cartaExtraida: CartaIndividual | undefined = jugador.establo.splice(
      cartaSelectIndex,
      1
    )[0];

    if (!cartaExtraida) {
      console.warn("Carta no encontrada");
      console.log(cartaExtraida);
      return false;
    }
    sala.mazoDescarte.push(cartaExtraida);

    io.to(sala.id).emit("mazoDescarteActualizada", sala.mazoDescarte);

    const establos: Record<string, CartaIndividual[]> = {};
    sala.ordenTurnos.forEach((j) => {
      establos[j.id] = j.establo;
    });
    io.to(sala.id).emit("establosActualizado", establos);

    io.to(jugador.id).emit("efectoMensaje", {
      mensaje: "El jugador " + jugadorActual.nombre + " te Destruyo una carta",
      fondo: "/img/UU-Back-Main.png",
    });

    // Paso 3: Sacrificar las carta seleccionada
    console.log(sala.efectoPendiente.datos[0].cantidad);
    if (cartasSeleccionadas.length === cantJugadores - 1) {
      const cartaSacrificadaIndex = jugadorActual.establo.findIndex(
        (c) => c.id === cartasSacrificadas[0]?.id
      );
      const cartaExtraida: CartaIndividual | undefined =
        jugadorActual.establo.splice(cartaSacrificadaIndex, 1)[0];

      if (!cartaExtraida) {
        console.warn("Carta no encontrada");
        console.log(cartaExtraida);
        return false;
      }
      sala.mazoDescarte.push(cartaExtraida);

      io.to(sala.id).emit("mazoDescarteActualizada", sala.mazoDescarte);

      const establos: Record<string, CartaIndividual[]> = {};
      sala.ordenTurnos.forEach((j) => {
        establos[j.id] = j.establo;
      });
      io.to(sala.id).emit("establosActualizado", establos);

      io.to(jugadorActual.id).emit("efectoMensaje", {
        mensaje: "Se sacrifico la carta " + cartaExtraida.nombre,
        fondo: "/img/fondos/DosPorUno_f.jpeg",
      });

      // Limpiamos las variables
      cartasSacrificadas = [];
      cartasSeleccionadas = [];
      cantJugadores = 0;
    }

    return true;
  }

  return false;
}

export function efectoRayoEncogedor(
  sala: Sala,
  io: any,
  jugadorVictimaId: string,
  zona: string,
  cartaPosicion?: number,
  cartaId?: string
): boolean {
  if (!sala.efectoPendiente) {
    console.warn("Sin efecto");
    return false;
  }
  // Condicion: 1 carta Unicornio en cualquier establo

  // 1. Selecciona al jugador
  // 2. El jugador seleccionado, se le cambiaran sus Unicornios por Bebes

  // Condicion durante el efecto: Ninguna

  sala.efectoPendiente.datos = [{ modo: "cartaManoJugador", cantidad: 1 }];

  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  // 1. Selecciona a la victima
  const jugador = sala.ordenTurnos.find((j) => j.id === jugadorVictimaId); // Encontrar al jugador victima
  if (!jugador) {
    console.log("Jugador no encontrado");
    console.log(jugador);
    return false;
  }

  if (zona !== "ManoJugador") {
    io.to(jugadorActual.id).emit("efectoMensaje", {
      mensaje: "Deves escoger a un Jugador",
      fondo: "/img/UU-Back-Main.png",
    });

    console.warn("Carta no es del ManoJugador");
    return false;
  }

  // 2. 2.1: Generamos la misma cantidad de Uni a UniBebes
  const cantUni = jugador.establo.filter(
    (c) =>
      c.tipo === "UNICORNIO BÁSICO" ||
      c.tipo === "UNICORNIO MÁGICO" ||
      c.tipo === "BEBE UNICORNIO"
  );

  let uniBebesArray = [];
  for (let i = 0; i < cantUni.length; i++) {
    const randomIndex = Math.floor(Math.random() * sala.mazoBebes.length);
    const uni = sala.mazoBebes.splice(randomIndex, 1)[0];
    if (uni) {
      uniBebesArray.push(uni);
    }
  }

  // 2 2.2: Sacamos los Uni del establo
  const cartasUniSacadas = jugador.establo.filter(
    (c) =>
      c.tipo === "UNICORNIO BÁSICO" ||
      c.tipo === "UNICORNIO MÁGICO" ||
      c.tipo === "BEBE UNICORNIO"
  );
  cartasUniSacadas.forEach((c) => {
    const index = jugador.establo.findIndex((card) => card.id === c.id);
    if (index !== -1) {
      jugador.establo.splice(index, 1);
    }
  });

  // 2.3: Mandamos los Uni al mazo de descartes
  sala.mazoDescarte.push(...cartasUniSacadas);
  io.to(sala.id).emit("mazoDescarteActualizada", sala.mazoDescarte);

  // 2.4: Mandamos los UniBebes al establo
  jugador.establo.push(...uniBebesArray);
  const establos: Record<string, CartaIndividual[]> = {};
  sala.ordenTurnos.forEach((j) => {
    establos[j.id] = j.establo;
  });
  io.to(sala.id).emit("establosActualizado", establos);

  io.to(jugador.id).emit("efectoMensaje", {
    mensaje: "Te convirtieron tus Unicornios en Bebes",
    fondo: "/img/fondos/IntercUni_f.jpeg",
  });

  return true;
}

export function efectoBlancoFijado(
  sala: Sala,
  io: any,
  jugadorVictimaId: string,
  zona: string,
  cartaPosicion?: number,
  cartaId?: string
): boolean {
  if (!sala.efectoPendiente) {
    console.warn("Sin efecto");
    return false;
  }

  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  const jugador = sala.ordenTurnos.find((j) => j.id === jugadorVictimaId); // Encontrar al jugador victima
  if (!jugador) return false;

  if (zona !== "Establo") {
    console.warn("Carta no es del Establo");
    return false;
  } // Verificar que la carta venga del establo

  // Verificamos si la ID no es nulo
  if (cartaId === undefined) {
    console.warn("Cartas no cuadran");
    console.warn(cartaId);
    return false;
  }

  // Condicion: Carta de Mejora o Deterioro en el establo

  // 1. Selecciona una carta de Mejora o Deterioro de cualquier Jugador
  // 2. La carta seleccionada se Destruye (Descarta)

  // Condicion durante el efecto: Ninguna

  const cartaVictima = jugador.establo.find((c) => c.id === cartaId);

  if (!cartaVictima) {
    console.log("Carta no encontrada");
    return false;
  }

  if (cartaVictima.tipo !== "DETERIORO" && cartaVictima.tipo !== "MEJORA") {
    io.to(jugadorActual.id).emit("efectoMensaje", {
      mensaje: "Debes de escoger una carta de Mejora o Deterioro",
      fondo: "/img/UU-Back-Main.png",
    });
    return false;
  }

  const cartaVictimaIndex = jugador.establo.findIndex(
    (c) => c.id === cartaVictima.id
  );

  // Quitar la carta del establo del JugadorVictima
  const cartaExtraida: CartaIndividual | undefined = jugador.establo.splice(
    cartaVictimaIndex,
    1
  )[0];
  if (!cartaExtraida) {
    console.warn("Carta no encontrada");
    console.log(cartaExtraida);
    return false;
  }

  sala.mazoDescarte.push(cartaExtraida);

  io.to(sala.id).emit("mazoDescarteActualizada", sala.mazoDescarte);

  const establos: Record<string, CartaIndividual[]> = {};
  sala.ordenTurnos.forEach((j) => {
    establos[j.id] = j.establo;
  });
  io.to(sala.id).emit("establosActualizado", establos);

  sala.efectoPendiente.datos = [
    {
      modo: "cartaEstabloJugador",
      cantidad: 1,
      mensajeData: [
        {
          objetivo: "victima",
          mensaje:
            jugadorActual.id === jugador.id
              ? "SACRIFICASTE tu carta " + cartaExtraida.nombre
              : "El jugador " +
                jugadorActual.nombre +
                " te DESTRUYO la carta " +
                cartaExtraida.nombre,
          fondo: "/img/fondos/Veneno_f.jpeg",
        },
      ],
    },
  ];
  return true;
}

export function efectoVorticeMistico(
  sala: Sala,
  io: any,
  jugadorVictimaId: string,
  zona: string,
  cartaPosicion?: number,
  cartaId?: string
): boolean {
  if (!sala.efectoPendiente) {
    console.warn("Sin efecto");
    return false;
  }

  // Condicion: Ninguna

  // 1. Cada Jugador descarta una carta
  // 2. Barajear el mazo de descarte con el de robo

  // Condicion durante el efecto: Ninguna

  sala.efectoPendiente.datos = [
    {
      modo: "descarte",
      cantidad: 1,
      victima: true,
      victimasData: [],
      volverAJugar: false,
      efectFinal: {
        id: "dobleMazo",
        descripcion: "Se barajeo el mazo de descarte con el de robo",
        mazo1: sala.mazo,
        mazo2: sala.mazoDescarte,
        tipo: "Mazo",
      },
    },
  ];

  sala.ordenTurnos.forEach((j) => {
    j.modoActual = ["descarte"];

    io.to(j.id).emit("modoActualActualizado", {
      modos: j.modoActual,
    });

    sala.efectoPendiente?.datos?.[0].victimasData.push({
      id: j.id,
      nombre: j.nombre,
      cantidad: 1,
    });

    io.to(j.id).emit("efectoMensaje", {
      mensaje: "Deves Descartar 1 carta por el efecto Vortice Mistico",
      fondo: "/img/UU-Back-Main.png",
    });
  });

  console.log(sala.efectoPendiente.datos?.[0].victimasData);

  return true;
}

export function efectoBuenNegocio(
  sala: Sala,
  io: any,
  jugadorVictimaId: string,
  zona: string,
  cartaPosicion?: number,
  cartaId?: string
): boolean {
  if (!sala.efectoPendiente) {
    console.log("Sala sin efectos pendientes: ");
    console.log(sala.efectoPendiente);

    return false;
  }

  // Efecto en cadena
  // Debo de hacer q se valla quitando uno por uno los modos, compararlo dese el turnmanager si es array o no
  sala.efectoPendiente.datos = [
    { modo: "cartaMazo", cantidad: 3 },
    { modo: "descarte", cantidad: 1, volverAJugar: false, victima: false },
  ];
  console.log("datos actualizados");
  console.log(sala.efectoPendiente.datos);

  return true;
}

export function efectoAgitar(
  sala: Sala,
  io: any,
  jugadorVictimaId: string,
  zona: string,
  cartaPosicion?: number,
  cartaId?: string
): boolean {
  if (!sala.efectoPendiente) {
    console.log("Sala sin efectos pendientes: ");
    console.log(sala.efectoPendiente);

    return false;
  }

  // Condicion: Almenos 1 carta en el mazo de descarte

  // 1. Sacarle todas las cartas de la mano del Jugador
  // 2. Se mesclara la mano del Jugador con el mazo de descarte
  // 3. Se barajea el mazo de descarte
  // 4. Dejar al Jugador robar 5 cartas || las cartas que haya en el mazo si son menores a 5

  // Condicion durante el efecto: Solo podra Robar Cartas del Mazo

  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  //Paso 1 y 2: Sacamos las cartas de la mano del jugador y lo ponemos en el mazo de descarte
  const cartasJugador = jugadorActual.mano.splice(0, jugadorActual.mano.length);

  sala.mazoDescarte.push(...cartasJugador);

  sala.mazoDescarte.forEach((c) => {
    console.log(c.nombre);
  });
  io.to(jugadorActual.id).emit("cartaRobada", jugadorActual.mano);

  const cantidades: Record<string, number> = {};
  sala.ordenTurnos.forEach((j) => {
    cantidades[j.id] = j.mano.length;
  });
  io.to(sala.id).emit("cantidadesManos", cantidades);

  //Paso 3: Barajeamos las cartas
  sala.mazoDescarte = barajarMazo(sala.mazoDescarte);

  io.to(sala.id).emit("mazoDescarteActualizada", sala.mazoDescarte);

  //Paso 4: Dejar al Jugador en modo Robar para coger solo 5 cartas o menos segun la cantidad de cartas que haya en el mazo de Descartes
  sala.efectoPendiente.datos = [
    { modo: "cartaMazoDescarte", zona: "mazoDescarte", cantidad: 5 },
  ];

  return true;
}
