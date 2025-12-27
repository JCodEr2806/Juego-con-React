import { generarMazo } from "../data/cartas";
import { CartaIndividual, JugadorEnPartida, Sala } from "../shared/types";
import { asignarCartas, barajarMazo, separarUniBebes } from "./mazo";

export function iniciarPartida(sala: Sala, io: any) {
  //Mezclar jugadpres
  const jugadoresMezclados: JugadorEnPartida[] = sala.jugadores.map((j) => ({
    ...j,
    mano: [],
    mesa: [],
  }));
  for (let i = jugadoresMezclados.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [jugadoresMezclados[i]!, jugadoresMezclados[j]!] = [
      jugadoresMezclados[j]!,
      jugadoresMezclados[i]!,
    ];
  }

  sala.ordenTurnos = jugadoresMezclados;
  sala.turnoActual = 0;

  if (!sala.ordenTurnos[0]) return console.warn("Jugador no encontrado");

  const jugadorEnTurnoInicial = sala.ordenTurnos[0];

  jugadorEnTurnoInicial.modoActual = ["cartaMazo"];

  io.to(jugadorEnTurnoInicial.id).emit("modoActualActualizado", {
    modos: jugadorEnTurnoInicial.modoActual,
  });

  //Crear y separar mazo
  let mazo = generarMazo();
  let { bebes: guarderia, resto } = separarUniBebes(mazo);
  mazo = barajarMazo(resto);

  sala.cartasJugadores = {};

  sala.mazoBebes = guarderia;

  //Repartir cartas
  jugadoresMezclados.forEach((jugador) => {
    jugador.mano = asignarCartas(mazo, 5);
    const cartaBeba: CartaIndividual | undefined = sala.mazoBebes.shift();
    if (!cartaBeba) return;
    jugador.establo.push(cartaBeba);
    const establos: Record<string, CartaIndividual[]> = {};
    sala.ordenTurnos.forEach((j) => {
      establos[j.id] = j.establo;
    });
    io.to(sala.id).emit("establosActualizado", establos);

    // Valor de prueba, luego se Borra
    sala.cartasJugadores![jugador.id] = jugador.mano;

    io.to(jugador.id).emit("cartasIniciales", jugador.mano);

    console.log(
      //ver las cartas de los demas
      `Cartas de ${jugador.nombre} (${jugador.id}):`,
      jugador.mano.map((c) => c.nombre)
    );
  });

  // Calcular y enviar cantidades iniciales de mano
  const cantidades: Record<string, number> = {};
  sala.ordenTurnos.forEach((j) => {
    cantidades[j.id] = j.mano.length;
  });
  io.to(sala.id).emit("cantidadesManos", cantidades);

  // Guardar el mazo restante
  sala.mazo = mazo;

  sala.mazoDescarte = [];

  io.to(sala.id).emit("mazoActualizado", mazo);
  io.to(sala.id).emit("guarderiaActualizada", guarderia);
  io.to(sala.id).emit("mazoDescarteActualizada", sala.mazoDescarte);
  //console.log("Mazo antes de robar:", sala.mazo.map(c => c.nombre));

  io.to(sala.id).emit("partidaIniciada", {
    ordenTurnos: jugadoresMezclados.filter(Boolean),
  });

  io.to(sala.id).emit("turnoActualizado", {
    turnoActual: jugadoresMezclados[0],
  });

  // Comprobar las cartas de todos, BORRAR DESPUES
  io.to(sala.id).emit("cartasDeTodos", sala.cartasJugadores);

  console.log("Partida iniciada en sala:", sala.id);
}
