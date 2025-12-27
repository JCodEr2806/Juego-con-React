import { JugadorEnPartida, Sala, ZonasDeEfecto } from "../../shared/types";
import { robarCarta } from "../drawManager";

export function robarCartaEfect(
  sala: Sala,
  io: any,
  posicion: number,
  jugadorVictimaId: string,
  zona: ZonasDeEfecto
) {
  // Aca solo se pueden ROBAR CARTAS DE LOS JUGADORES

  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;
  const jugadorVictima = sala.ordenTurnos.find(
    (j) => j.id === jugadorVictimaId
  );
}

export function robarMazoEfect(
  sala: Sala,
  io: any,
  posicion: number,
  zona: ZonasDeEfecto
) {
  // Aca solo se pueden ROBAR CARTAS DEL MAZO

  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  robarCarta(sala, io, posicion, jugadorActual, zona);
}
