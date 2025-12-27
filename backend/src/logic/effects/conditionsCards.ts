// devo de poner los efectos arriba del todo, asi q cuando el jugador juegue esa carta, primero se deva de cumplir la condicion q se le a asignado

import { JugadorEnPartida, Sala, TipoCarta } from "../../shared/types";
import { coincideTipoCarta } from "./helpers/tipoCartaHelper";

export type ObjetivoCondicion =
  | "jugadorActual"
  | "demasJugadores"
  | "todosJugadores";

export const conditionsCarts: Record<
  string,
  (
    sala: Sala,
    io: any,
    jugador: JugadorEnPartida,
    ...args: any[]
  ) => boolean | void
> = {
  condicionEstablo,
};

export function condicionEstablo(
  sala: Sala,
  io: any,
  jugador: JugadorEnPartida,
  objetivo: ObjetivoCondicion,
  cantidad: number,
  tipoCarta: TipoCarta | "CUALQUIERA",
  mensaje: string
): boolean {
  switch (objetivo) {
    case "jugadorActual":
      return jugadorActualFunct(sala,io, jugador, cantidad, tipoCarta, mensaje);
    case "demasJugadores":
      return demasJugadoresFunct(sala, io, jugador, cantidad, tipoCarta, mensaje);
    case "todosJugadores":
      return cualquieraFunct(sala, io, jugador, cantidad, tipoCarta, mensaje);
    default:
      return false;
  }
}

function cualquieraFunct(
  sala: Sala,
  io: any,
  jugador: JugadorEnPartida,
  cantidad: number,
  tipoCarta: TipoCarta | "CUALQUIERA",
  mensaje: string
): boolean {
  let cartaCant = 0;

  sala.ordenTurnos.forEach((j) => {
    cartaCant +=
      tipoCarta === "CUALQUIERA"
        ? j.establo.length
        : j.establo.filter((c) => coincideTipoCarta(c.tipo, tipoCarta)).length;
  });

  if (cartaCant >= cantidad) {
    console.log("Almenos 1 jugador tiene cartas en su Establo");
    return true;
  }

  io.to(jugador.id).emit("efectoMensaje", {
    mensaje: mensaje || "Nose",
    fondo: "/img/UU-Back-2-Main.jpeg",
  });
  return false;
}

function jugadorActualFunct(
  sala: Sala,
  io: any,
  jugador: JugadorEnPartida,
  cantidad: number,
  tipoCarta: TipoCarta | "CUALQUIERA",
  mensaje: string,
): boolean {
  const cartaCant =
    tipoCarta === "CUALQUIERA"
      ? jugador.establo.length
      : jugador.establo.filter((c) => coincideTipoCarta(c.tipo, tipoCarta))
          .length;

  if (cartaCant >= cantidad) {
    console.log("Almenos TU tienes 1 carta");
    return true;
  }

  io.to(jugador.id).emit("efectoMensaje", {
    mensaje: mensaje || "Nose",
    fondo: "/img/UU-Back-2-Main.jpeg",
  });
  return false;
}

function demasJugadoresFunct(
  sala: Sala,
  io: any,
  jugador: JugadorEnPartida,
  cantidad: number,
  tipoCarta: TipoCarta | "CUALQUIERA",
  mensaje: string
): boolean {
  let cartaCant = 0;
  sala.ordenTurnos.forEach((j) => {
    if (jugador.id !== j.id) {
      cartaCant +=
        tipoCarta === "CUALQUIERA"
          ? j.establo.length
          : j.establo.filter((c) => coincideTipoCarta(c.tipo, tipoCarta))
              .length;
    }
  });

  if (cartaCant >= cantidad) {
    console.log("Almenos DEMAS jugador tiene 1 carta en su Establo");
    return true;
  }
  io.to(jugador.id).emit("efectoMensaje", {
    mensaje: mensaje || "Nose",
    fondo: "/img/UU-Back-2-Main.jpeg",
  });
  return false;
}

function tipoCarta(
  sala: Sala,
  io: any,
  jugador: JugadorEnPartida,
  objetivo: string,
  cantidad: number,
  tipoCarta: TipoCarta
) {
  switch (tipoCarta) {
    case "UNICORNIO BÁSICO":
      const CartUnic = jugador.establo.filter(
        (c) => c.tipo === "UNICORNIO BÁSICO"
      );
      if (CartUnic.length < cantidad) {
        console.log("TU no tienes suficientes cartas Unicornio");
      }
      break;
    case "UNICORNIO MÁGICO":
      const CartUnicM = jugador.establo.filter(
        (c) => c.tipo === "UNICORNIO BÁSICO"
      );
      if (CartUnicM.length < cantidad) {
        console.log("TU no tienes suficientes cartas Unicornio");
      }
      break;
    default:
      if (jugador.establo.length <= cantidad) {
        console.log("TU no tienes cartas en tu Establo");
      }
      break;
  }
}

function encontrarCarta(
  sala: Sala,
  io: any,
  jugador: JugadorEnPartida,
  objetivo: string,
  cantidad: number,
  tipoCarta: TipoCarta
) {
  const cartasEncontradas = jugador.establo.filter((c) => c.tipo === tipoCarta);
  if (cartasEncontradas.length < cantidad) {
    console.log("TU no tienes suficientes cartas Unicornio");
  }
}
