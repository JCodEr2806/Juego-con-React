import { CartaIndividual, JugadorEnPartida, ModoDeJugada, Sala, ZonasDeEfecto } from "../shared/types";
import { conditionsCarts } from "./effects/conditionsCards";
import { efectos } from "./effects/efectosCarts";

// Funciones de ROBAR
export function robarMazo(
  sala: Sala,
  io: any,
  posicion: number,
  jugador: JugadorEnPartida
) {
  const cartaRobada = sala.mazo.splice(posicion, 1)[0];

  if (cartaRobada) jugador.mano.push(cartaRobada);

  const cantidades: Record<string, number> = {};
  sala.ordenTurnos.forEach((j) => {
    cantidades[j.id] = j.mano.length;
  });
  // console.log(cantidades);

  io.to(sala.id).emit("mazoActualizado", sala.mazo);
  io.to(jugador.id).emit("cartaRobada", jugador.mano);
  io.to(sala.id).emit("cantidadesManos", cantidades);
  //console.log("Actualizar mazo desde robarMazo");
  //console.log(sala.mazo.map(c => c.nombre));

  return { mano: jugador.mano };
}

export function robarCarta(
  sala: Sala,
  io: any,
  posicion: number,
  jugadorActual: JugadorEnPartida,
  zona: ZonasDeEfecto,
  jugadorVictimaId?: string
) {

  let cartaRobada;
  
  switch (zona) {
    case "mazoRobo":
      cartaRobada = sala.mazo.splice(posicion, 1)[0]
      
      if(!cartaRobada) return console.warn("Carta no Encontrada");
      jugadorActual.mano.push(cartaRobada);
      
      io.to(sala.id).emit("mazoActualizado", sala.mazo);
      io.to(jugadorActual.id).emit("cartaRobada", jugadorActual.mano);
      
      break;
      
    case "mazoDescarte":
      console.log("mzao Descartes Antes:")
      sala.mazoDescarte.forEach(c =>{
        console.log(c.nombre)
      })
      cartaRobada = sala.mazoDescarte.splice(posicion, 1)[0];
      console.log("CartaRObada:")
      console.log(cartaRobada?.nombre)

      if(!cartaRobada) return console.warn("Carta no Encontrada");
      jugadorActual.mano.push(cartaRobada);
      
      io.to(sala.id).emit("mazoDescarteActualizada", sala.mazoDescarte);
      io.to(jugadorActual.id).emit("cartaRobada", jugadorActual.mano);

      break;

    case "manoJugador":
      const jugadorVictima = sala.ordenTurnos.find(j => j.id === jugadorVictimaId)
      if(!jugadorVictima) return console.warn("Jugador no Encontrada");

      cartaRobada = jugadorVictima?.mano.splice(posicion, 1)[0];

      if(!cartaRobada) return console.warn("Carta no Encontrada");
      jugadorActual.mano.push(cartaRobada);
      
      io.to(jugadorActual.id).emit("cartaRobada", jugadorActual.mano);
      io.to(jugadorVictima.id).emit("cartaRobada", jugadorVictima.mano);
      
      break;
      
    default:
      console.warn("Zona Incorrecta")
      break
  }

  const cantidades: Record<string, number> = {};
  sala.ordenTurnos.forEach((j) => {
    cantidades[j.id] = j.mano.length;
  });
  io.to(sala.id).emit("cantidadesManos", cantidades);

}

// Funciones de JUGAR CARTA
export function jugarCarta(
  sala: Sala,
  io: any,
  posicion: number,
  jugador: JugadorEnPartida
) {
  if (posicion < 0 || posicion >= jugador.mano.length) {
    return null; // posición inválida
  }
  // let destino: "mazoDescarte" | "establo";
  // Verificar si existe esa carta
  const cartaJugada = jugador.mano[posicion];
  if (!cartaJugada) return console.warn("Carta no encontrada");

  if (cartaJugada.condicion) {
    const condiciones = Array.isArray(cartaJugada.condicion)
      ? cartaJugada.condicion
      : [cartaJugada.condicion];

    for (const cond of condiciones) {
      console.log(cond);
      const condicionFn = conditionsCarts[cond.id];

      if (condicionFn) {
        const cumpleCondi = condicionFn(sala, io, jugador, ...cond.args);

        if (!cumpleCondi) {
          console.warn("La condicion no se cumple, lanza otra carta");
          jugador.modoActual = ["cartaMazo", "jugarCarta"];

          io.to(jugador.id).emit("modoActualActualizado", {
            modos: jugador.modoActual,
          });
          return;
        }
      }
    }
    console.log("Cumple con todas las condiciones");
  } else {
    console.log("carta sin condicion");
  }

  if (cartaJugada.tipo === "MEJORA" || cartaJugada.tipo === "DETERIORO") {
    // Escoger a q jugador sera mandado esta carta
    jugador.modoActual = ["jugarCarta", "modoSeleccion"];
    io.to(jugador.id).emit("modoActualActualizado", {
      modos: jugador.modoActual,
    });
    return cartaJugada;
  }

  const cartaExtraida = jugador.mano.splice(posicion, 1)[0];
  if (!cartaExtraida) return console.warn("No se pudo sacar esa carta");

  if (cartaExtraida.tipo === "MÁGICA" || cartaExtraida.tipo === "INSTANTANEO") {
    // CARTA VA AL MAZO DE DESCARTE
    sala.mazoDescarte.push(cartaExtraida);
    // destino = "mazoDescarte";

    io.to(sala.id).emit("mazoDescarteActualizada", sala.mazoDescarte);
  } else {
    // CARTA VA AL ESTABLO
    jugador.establo.push(cartaExtraida);
    // destino = "establo";

    const establos: Record<string, CartaIndividual[]> = {};
    sala.ordenTurnos.forEach((j) => {
      establos[j.id] = j.establo;
    });
    io.to(sala.id).emit("establosActualizado", establos);
  }

  io.to(jugador.id).emit("manoActualizada", jugador.mano);

  const cantidades: Record<string, number> = {};
  sala.ordenTurnos.forEach((j) => {
    cantidades[j.id] = j.mano.length;
  });
  // console.log(cantidades); // Comprobar cambio en el server
  io.to(sala.id).emit("cantidadesManos", cantidades);

  // Activar si hay efecto de la carta
  if (cartaExtraida.efecto) {
    if (cartaExtraida.modoDeJugador) {
      jugador.modoActual = [cartaExtraida.modoDeJugador];

      io.to(jugador.id).emit("modoActualActualizado", {
        modos: jugador.modoActual,
      });
      console.log("Modo Actualizado desde 'JugarCarta': " + jugador.modoActual);
    }

    sala.efectoPendiente = {
      jugadorQueJugo: jugador.id,
      efecto: cartaExtraida.efecto.id,
      cartaId: cartaExtraida.id,
    };
    console.log(sala.efectoPendiente);
    io.to(jugador.id).emit("efectoPendiente", sala.efectoPendiente.efecto);

    if (cartaExtraida.efecto.modo === "objetivo") {
      // Solo le enviamos las indicaciones al jugador q lanzo la carta

      // if (jugador.modoActual.includes("cartaEstabloJugador")) {
      //   let cantJugadores = 0;

      //   // Comprobar si alguien tiene el establo vacio
      //   sala.ordenTurnos.forEach((j) => {
      //     if (j.establo.length > 0) {
      //       cantJugadores++;
      //     } else {
      //       console.log("El Jugador " + j.nombre + " no tiene establo");
      //     }
      //   });

      //   if (cantJugadores === 0) {
      //     io.to(jugador.id).emit("efectoMensaje", {
      //       mensaje: "Ningun jugador tiene cartas en su Establo WBON",
      //       fondo: "/img/UU-Back-Main.png",
      //     });
      //     return;
      //   }
      // }

      io.to(jugador.id).emit("efectoMensaje", {
        mensaje: cartaExtraida.mensaje,
        fondo: cartaExtraida.fondo,
      });
    } else if (cartaExtraida.efecto.modo === "inmediato") {
      // Le enviamos las indicaciones al jugador q lanzo la carta y Iniciamos el Efecto
      io.to(jugador.id).emit("efectoMensaje", {
        mensaje: cartaExtraida.mensaje,
        fondo: cartaExtraida.fondo,
      });
      const funcionEfecto = efectos[cartaExtraida.efecto.id];
      if (funcionEfecto) {
        const resultado = funcionEfecto(sala, io, jugador.id, "directo");
        if (resultado) {
          console.log("Efecto inmediato resuelto");
        }
      }
    }
  } else {
    console.warn("Carta sin efectos");
    jugador.jugadasDisponible--;
  }

  return;
}

// Funciones de DESCARTAR
export function descartarCarta(
  sala: Sala,
  io: any,
  posicion: number,
  jugador: JugadorEnPartida
) {
  if (posicion < 0 || posicion >= jugador.mano.length) {
    return null; // posición inválida
  }
  const cartaDescartada = jugador.mano.splice(posicion, 1)[0];
  if (cartaDescartada) sala.mazoDescarte.push(cartaDescartada);

  const cantidades: Record<string, number> = {};
  sala.ordenTurnos.forEach((j) => {
    cantidades[j.id] = j.mano.length;
  });
  // console.log(cantidades); // Comprobar cambio en el server

  io.to(jugador.id).emit("manoActualizada", jugador.mano);
  io.to(sala.id).emit("mazoDescarteActualizada", sala.mazoDescarte);
  io.to(sala.id).emit("cantidadesManos", cantidades);

  return { mazoDescarte: sala.mazoDescarte, mano: jugador.mano };
}
