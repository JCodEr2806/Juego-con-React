import { CartaIndividual, JugadorEnPartida, Sala } from "../shared/types";
import {
  descartarCarta,
  jugarCarta,
  robarCarta,
  robarMazo,
} from "./drawManager";
import { efectos } from "./effects/efectosCarts";
import { barajarDobleMazo, barajarMazo } from "./mazo";

const mensajes = [
  { modo: "descarte", mensaje: "Ahora debes de Descartar" },
  { modo: "cartaMazo", mensaje: "Ahora debes de Robar" },
  { modo: "jugarCarta", mensaje: "Ahora debes de Robar" },
];

export function iniciarTurno(sala: Sala, io: any) {
  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;
  jugadorActual.jugadasDisponible = 2; // Recetear la jugada a 2

  // Notificar que es su turno
  io.to(sala.id).emit("turnoActualizado", { turnoActual: jugadorActual });
  jugadorActual.modoActual = ["cartaMazo"];

  io.to(jugadorActual.id).emit("modoActualActualizado", {
    modos: jugadorActual.modoActual,
  });
  console.log("Modo iniciar Juego:");
  console.log(jugadorActual.modoActual);
}

export function pasarTurno(sala: Sala, io: any) {
  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  let alguienDebeDescartar = false;

  sala.ordenTurnos.forEach((jugador) => {
    if (jugador.mano.length > 7) {
      jugador.jugadasDisponible = Infinity;

      jugador.modoActual = ["descarte"];

      io.to(jugador.id).emit("modoActualActualizado", {
        modos: jugador.modoActual,
        mensaje:
          "Al final de tu turno solo puedes tener como maximo 7 cartas. DESCARTA algunas cartas",
      });

      console.log(`Jugador ${jugador.nombre} debe descartar`);
      alguienDebeDescartar = true;

      // return; // No pasamos turno todavía
    }
  });

  if (alguienDebeDescartar) return console.warn("Jugadores con max");

  jugadorActual.modoActual = ["normal"];

  io.to(jugadorActual.id).emit("modoActualActualizado", {
    modos: jugadorActual.modoActual,
  });
  console.log("Modo final juego");
  console.log(jugadorActual.modoActual);

  sala.turnoActual = (sala.turnoActual + 1) % sala.ordenTurnos.length;
  iniciarTurno(sala, io);
}

export function jugadorRobaCarta(sala: Sala, jugadorId: string, io: any) {
  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  // Si en caso hay un efecto activo
  if (sala.efectoPendiente) {
    // Si hay efecto Pendiente, significa que hay jugador victima
    const jugadorVictima = sala.ordenTurnos.find((j) => j.id === jugadorId);
    if (!jugadorVictima) return console.warn("Jugador no encontrado");
    if (
      !(
        jugadorVictima.modoActual.includes("cartaMazo") ||
        jugadorVictima.modoActual.includes("cartaMazoDescarte")
      )
    ) {
      console.warn("Ese jugador no esta en modo CartaMazo");
      console.warn(jugadorVictima.nombre);
      console.warn(jugadorVictima.modoActual);
      return;
    }
    // ---------------------------------------

    // Todo efecto q maneje este tipo de jugada, deve de retornar un Dato
    if (sala.efectoPendiente.datos) {
      // Agarramos el primer modo q da el Efecto
      const pasoActual = sala.efectoPendiente.datos[0];
      
      // ------------------------------------

      // Activamos la funcion correspondiente
      if (pasoActual.zona) {
        robarCarta(sala, io, 0, jugadorVictima, pasoActual.zona);
      } else {
        robarMazo(sala, io, 0, jugadorVictima);
      }
      // Restamos la cantidad de vces q se jugara ese movimiento
      pasoActual.cantidad--;

      // Si la cantidad sigue siendo mayor a 0
      // significa q deve de repetirse denuevo
      if (pasoActual.cantidad > 0) {
        // deve descartar mas cartas
        jugadorVictima.modoActual = ["cartaMazo"];
        io.to(jugadorVictima.id).emit("modoActualActualizado", {
          modos: jugadorVictima.modoActual,
          mensaje: `Debes robar ${pasoActual.cantidad} carta(s) más`,
        });
        return;
      }
      // ----------------------------------------

      // Una vez la cantidad sea 0, quitar ese paso de los datos:
      sala.efectoPendiente.datos.shift(); // <- quitamos el primer dato

      // ----------------------------------------

      // Si en los datos aun hay mas paso, asignarle el siguiente
      if (sala.efectoPendiente.datos.length > 0) {
        const siguienteModo = sala.efectoPendiente.datos[0];
        jugadorVictima.modoActual = [siguienteModo.modo];

        // Le avisamos al jugador el cambio de modo
        io.to(jugadorVictima.id).emit("modoActualActualizado", {
          modos: jugadorVictima.modoActual,
        });

        // Le mandamos un mensaje del siguiente modo
        const mensajeModo = mensajes.find((m) => m.modo === siguienteModo.modo);
        io.to(jugadorVictima.id).emit("efectoMensaje", {
          mensaje: mensajeModo?.mensaje,
          fondo: "/img/UU-Back-Main.png",
        });

        return;
      } else {
        // significa q ya no hay mas pasos por jugar
        // Le asignamod el modo "Normal"
        jugadorVictima.modoActual = ["normal"];
        io.to(jugadorVictima.id).emit("modoActualActualizado", {
          modos: jugadorVictima.modoActual,
        });

        // Limpiamos los efectos pendientes
        sala.efectoPendiente = undefined;
        io.to(sala.id).emit("efectoPendiente", null);

        // Vereficar si ese jugador  tiene mas Jugadas Disponibles
        if (jugadorActual.jugadasDisponible <= 0) {
          // No tiene mas jugadas
          pasarTurno(sala, io);
        } else {
          // Significa q vuelve a jugar desde el inicio
          jugadorVictima.modoActual = ["cartaMazo"];
          io.to(jugadorVictima.id).emit("modoActualActualizado", {
            modos: jugadorVictima.modoActual,
          });
          io.to(jugadorVictima.id).emit("efectoMensaje", {
            mensaje: "Vuelve a jugar",
            fondo: "/img/UU-Back-Main.png",
          });
        }
      }
    }
  } else {
    console.warn("Sin efectos pendientes");
    console.warn(sala.efectoPendiente);
  }

  if (
    jugadorActual.id !== jugadorId ||
    !jugadorActual.modoActual.includes("cartaMazo")
  )
    return console.log("Jugador incorrecto");

  if (
    jugadorActual.jugadasDisponible <= 0 ||
    jugadorActual.jugadasDisponible === Infinity
  )
    return; //No podra jugar mas

  //Robar una carta del mazo
  robarMazo(sala, io, 0, jugadorActual);
  console.log("Modo Antes:");
  console.log(jugadorActual.modoActual);

  jugadorActual.jugadasDisponible--; //Restarle las jugadas

  if (jugadorActual.jugadasDisponible === 1) {
    jugadorActual.modoActual = ["cartaMazo", "jugarCarta"];

    io.to(jugadorActual.id).emit("modoActualActualizado", {
      modos: jugadorActual.modoActual,
    });
  } else {
    jugadorActual.modoActual = ["cartaMazo"];

    io.to(jugadorActual.id).emit("modoActualActualizado", {
      modos: jugadorActual.modoActual,
    });
  }

  if (jugadorActual.jugadasDisponible <= 0) {
    pasarTurno(sala, io); //Esto solo es como ejemplo
  }
}

let cartaJugada: CartaIndividual;

export function jugadorJuegaCarta(
  sala: Sala,
  jugadorId: string,
  io: any,
  posicion: number
) {
  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  // Si en caso hay un efecto activo
  if (sala.efectoPendiente) {
    // Si hay efecto Pendiente, significa que hay jugador victima
    const jugadorVictima = sala.ordenTurnos.find((j) => j.id === jugadorId);
    if (!jugadorVictima) return console.warn("Jugador no encontrado");
    if (!jugadorVictima.modoActual.includes("jugarCarta")) {
      console.warn("Ese jugador no esta en modo JugarCarta");
      console.warn(jugadorVictima.nombre);
      console.warn(jugadorVictima.modoActual);
      return;
    }
    // ---------------------------------------

    // Todo efecto q maneje este tipo de jugada, deve de retornar un Dato
    if (sala.efectoPendiente.datos) {
      // Agarramos el primer modo q da el Efecto
      const pasoActual = sala.efectoPendiente.datos[0];
      if (pasoActual.modo !== "jugarCarta")
        return console.warn("El jugador no esta en modo jugarCarta");
      // ------------------------------------

      // Activamos la funcion correspondiente
      const carta = jugarCarta(sala, io, posicion, jugadorVictima);
      if (carta) {
        cartaJugada = carta;
        console.log("Carta encontrada");
        console.log(cartaJugada);
        return;
      }
      // Restamos la cantidad de vces q se jugara ese movimiento
      pasoActual.cantidad--;

      // Si la cantidad sigue siendo mayor a 0
      // significa q deve de repetirse denuevo
      if (pasoActual.cantidad > 0) {
        // deve descartar mas cartas
        jugadorVictima.modoActual = ["jugarCarta"];
        io.to(jugadorVictima.id).emit("modoActualActualizado", {
          modos: jugadorVictima.modoActual,
          mensaje: `Debes Jugar ${pasoActual.cantidad} carta(s) más`,
        });
        return;
      }
      // ----------------------------------------

      // Una vez la cantidad sea 0, quitar ese paso de los datos:
      sala.efectoPendiente.datos.shift(); // <- quitamos el primer dato

      // ----------------------------------------

      // Si en los datos aun hay mas paso, asignarle el siguiente
      if (sala.efectoPendiente.datos.length > 0) {
        const siguienteModo = sala.efectoPendiente.datos[0];
        jugadorVictima.modoActual = [siguienteModo.modo];

        // Le avisamos al jugador el cambio de modo
        io.to(jugadorVictima.id).emit("modoActualActualizado", {
          modos: jugadorVictima.modoActual,
        });

        // Le mandamos un mensaje del siguiente modo
        const mensajeModo = mensajes.find((m) => m.modo === siguienteModo.modo);
        io.to(jugadorVictima.id).emit("efectoMensaje", {
          mensaje: mensajeModo?.mensaje,
          fondo: "/img/UU-Back-Main.png",
        });

        return;
      } else {
        // significa q ya no hay mas pasos por jugar
        // Le asignamod el modo "Normal"
        jugadorVictima.modoActual = ["normal"];
        io.to(jugadorVictima.id).emit("modoActualActualizado", {
          modos: jugadorVictima.modoActual,
        });

        // Limpiamos los efectos pendientes
        sala.efectoPendiente = undefined;
        io.to(sala.id).emit("efectoPendiente", null);

        // Vereficar si ese jugador  tiene mas Jugadas Disponibles
        if (jugadorActual.jugadasDisponible <= 0) {
          // No tiene mas jugadas
          pasarTurno(sala, io);
        } else {
          // Significa q vuelve a jugar desde el inicio
          jugadorVictima.modoActual = ["cartaMazo"];
          io.to(jugadorVictima.id).emit("modoActualActualizado", {
            modos: jugadorVictima.modoActual,
          });
          io.to(jugadorVictima.id).emit("efectoMensaje", {
            mensaje: "Vuelve a jugar",
            fondo: "/img/UU-Back-Main.png",
          });
        }
      }
    }
  } else {
    console.warn("Sin efectos pendientes");
    console.warn(sala.efectoPendiente);
  }

  if (
    jugadorActual.id !== jugadorId ||
    !jugadorActual.modoActual.includes("jugarCarta")
  )
    return;
  // if (jugadorActual.jugadasDisponible > 1) return; // No dejar jugar asta coger la carta del mazo inicial del turno
  jugadorActual.modoActual = ["jugarCarta"];
  io.to(jugadorActual.id).emit("modoActualActualizado", {
    modos: jugadorActual.modoActual,
  });
  if (
    jugadorActual.jugadasDisponible <= 0 ||
    jugadorActual.jugadasDisponible === Infinity
  )
    return; //No podra jugar mas

  const carta = jugarCarta(sala, io, posicion, jugadorActual);
  if (carta) {
    cartaJugada = carta;
    console.log("Carta encontrada");
    console.log(cartaJugada);
    return;
  }

  if (jugadorActual.jugadasDisponible <= 0) {
    pasarTurno(sala, io); //Esto solo es como ejemplo
  }
}

export function jugadorDescartaCarta(
  sala: Sala,
  jugadorId: string,
  io: any,
  posicion: number
) {
  const jugadorActual = sala.ordenTurnos[sala.turnoActual] as JugadorEnPartida;

  // Si en caso hay un efecto activo
  if (sala.efectoPendiente) {
    // Si hay efecto Pendiente, significa que hay jugador victima
    const jugadorVictima = sala.ordenTurnos.find((j) => j.id === jugadorId);
    if (!jugadorVictima) return console.warn("Jugador no encontrado");
    if (!jugadorVictima.modoActual.includes("descarte")) {
      console.warn("Ese jugador no esta en modo Descarte");
      console.warn(jugadorVictima.nombre);
      console.warn(jugadorVictima.modoActual);
      return;
    }
    // ---------------------------------------

    // Todo efecto q maneje este tipo de jugada, deve de retornar un Dato
    if (sala.efectoPendiente.datos) {
      // Agarramos el primer modo q da el Efecto
      const pasoActual = sala.efectoPendiente.datos[0];
      if (pasoActual.modo !== "descarte")
        return console.warn("El jugador no esta en modo descarte");
      // ------------------------------------

      if (sala.efectoPendiente?.datos?.[0].victimasData) {
        sala.efectoPendiente.datos?.[0].victimasData.forEach(
          (victima: { id: string; cantidad: number }) => {
            if (victima.id === jugadorVictima.id) {
              if (victima.cantidad <= 0)
                return console.warn(
                  "Esa victima ya no debe descartar mas cartas"
                );

              const jugadorVictimaData = sala.ordenTurnos.find(
                (j) => j.id === victima.id
              );

              if (!jugadorVictimaData)
                return console.warn("Jugador victima no encontrado");
              descartarCarta(sala, io, posicion, jugadorVictimaData);

              // Restamos la cantidad de vces q se jugara ese movimiento
              victima.cantidad--;
            }
          }
        );
        // Si todas las victimas ya no tienen cantidad, significa q ese paso ya se completo
        const todasCompletadas =
          sala.efectoPendiente.datos[0].victimasData.every(
            (v: { id: string; cantidad: number }) => v.cantidad <= 0
          );
        if (!todasCompletadas) {
          console.log(sala.efectoPendiente.datos?.[0].victimasData);
          return console.log("Aun faltan victimas por descartar");
        }

        if (sala.efectoPendiente.datos[0].volverAJugar === false) {
          console.log("No volvera a jugar");
          jugadorActual.jugadasDisponible--; //Restaurale las jugadas
        }
      } else {
        // Activamos la funcion correspondiente
        descartarCarta(sala, io, posicion, jugadorVictima);
        // Restamos la cantidad de vces q se jugara ese movimiento
      }

      pasoActual.cantidad--;

      // Si la cantidad sigue siendo mayor a 0
      // significa q deve de repetirse denuevo
      if (pasoActual.cantidad > 0) {
        // deve descartar mas cartas
        jugadorVictima.modoActual = ["descarte"];
        io.to(jugadorVictima.id).emit("modoActualActualizado", {
          modos: jugadorVictima.modoActual,
          mensaje: `Debes descartar ${pasoActual.cantidad} carta(s) más`,
        });
        return;
      }

      let mensajeEfectoFinal;
      if (pasoActual.efectFinal) {
        switch (pasoActual.efectFinal.tipo) {
          case "Mazo":
            switch (pasoActual.efectFinal.id) {
              case "dobleMazo":
                // Barajear los dos mazos
                sala.mazo = barajarDobleMazo(
                  pasoActual.efectFinal.mazo1,
                  pasoActual.efectFinal.mazo2
                );

                io.to(sala.id).emit("mazoActualizado", sala.mazo);
                console.log("Se barajeo el mazo de descarte con el de robo");
                sala.mazoDescarte = [];
                io.to(sala.id).emit(
                  "mazoDescarteActualizada",
                  sala.mazoDescarte
                );
                break;
              case "barajarMazo":
                // Barajear solo un mazo
                break;
            }
            break;
        }
        mensajeEfectoFinal = pasoActual.efectFinal.descripcion;
      } else {
        console.log("No hay efecto final");
      }

      if (pasoActual.volverAJugar === false) {
        jugadorActual.jugadasDisponible--; //Restaurale las jugadas
      }
      // ----------------------------------------

      // Una vez la cantidad sea 0, quitar ese paso de los datos:
      sala.efectoPendiente.datos.shift(); // <- quitamos el primer dato
      io.to(sala.id).emit("efectoMensaje", {
        mensaje: mensajeEfectoFinal ?? "Efecto finalizado",
        fondo: "/img/UU-Back-Main.png",
      });

      // ----------------------------------------

      // Si en los datos aun hay mas paso, asignarle el siguiente
      if (sala.efectoPendiente.datos.length > 0) {
        const siguienteModo = sala.efectoPendiente.datos[0];
        jugadorVictima.modoActual = [siguienteModo.modo];

        // Le avisamos al jugador el cambio de modo
        io.to(jugadorVictima.id).emit("modoActualActualizado", {
          modos: jugadorVictima.modoActual,
        });

        // Le mandamos un mensaje del siguiente modo
        const mensajeModo = mensajes.find((m) => m.modo === siguienteModo.modo);
        io.to(jugadorVictima.id).emit("efectoMensaje", {
          mensaje: mensajeModo?.mensaje,
          fondo: "/img/UU-Back-Main.png",
        });

        return;
      } else {
        // significa q ya no hay mas pasos por jugar
        // Le asignamod el modo "Normal"
        jugadorVictima.modoActual = ["normal"];
        io.to(jugadorVictima.id).emit("modoActualActualizado", {
          modos: jugadorVictima.modoActual,
        });

        // Limpiamos los efectos pendientes
        sala.efectoPendiente = undefined;
        io.to(sala.id).emit("efectoPendiente", null);

        // Vereficar si ese jugador  tiene mas Jugadas Disponibles
        if (jugadorActual.jugadasDisponible <= 0) {
          // No tiene mas jugadas
          pasarTurno(sala, io);
        } else {
          console.log(jugadorActual.jugadasDisponible);
          // Significa q vuelve a jugar desde el inicio
          jugadorVictima.modoActual = ["cartaMazo"];
          io.to(jugadorVictima.id).emit("modoActualActualizado", {
            modos: jugadorVictima.modoActual,
          });
          io.to(jugadorVictima.id).emit("efectoMensaje", {
            mensaje: "Vuelve a jugar",
            fondo: "/img/UU-Back-Main.png",
          });
        }
      }
    }
  } else {
    console.warn("Sin efectos pendientes");
    console.warn(sala.efectoPendiente);
  }

  const jugadorEnDescarte = sala.ordenTurnos.find((j) => j.id === jugadorId);
  if (!jugadorEnDescarte) return;
  if (
    jugadorEnDescarte.mano.length > 7 &&
    jugadorEnDescarte.modoActual.includes("descarte")
  ) {
    // Significa q esta en modo Descarte Forzado
    descartarCarta(sala, io, posicion, jugadorEnDescarte);

    if (jugadorEnDescarte.mano.length <= 7) {
      jugadorEnDescarte.modoActual = ["normal"];

      io.to(jugadorEnDescarte.id).emit("modoActualActualizado", {
        modos: jugadorEnDescarte.modoActual,
      });

      pasarTurno(sala, io); //Esto solo es como ejemplo
      return;
    }
    return console.warn(
      "Te falta descartar mas cartas " + jugadorEnDescarte.nombre
    );
  }

  if (
    jugadorActual.id !== jugadorId ||
    !jugadorActual.modoActual.includes("descarte")
  )
    return console.warn("Jugador Incorrecto");

  descartarCarta(sala, io, posicion, jugadorActual);

  if (jugadorActual.mano.length <= 7) {
    // jugadorActual.enModoDescarte = false;
    jugadorActual.jugadasDisponible = 0;
    // io.to(jugadorActual.id).emit("resetForzarDescarte");

    jugadorActual.modoActual = ["normal"];

    io.to(jugadorActual.id).emit("modoActualActualizado", {
      modos: jugadorActual.modoActual,
    });
    console.log("Modo final descarte: ");
    console.log(jugadorActual.modoActual);

    sala.turnoActual = (sala.turnoActual + 1) % sala.ordenTurnos.length;
    iniciarTurno(sala, io);
    return;
  }
}

export function resolverEfecto(
  sala: Sala,
  io: any,
  jugadorVictimaId: string,
  zona: string,
  cartaPosicion?: number,
  cartaId?: string
) {
  if (!sala.efectoPendiente) return;

  const jugadorActual = sala.ordenTurnos[sala.turnoActual];
  if (!jugadorActual) return;

  const jugador = sala.ordenTurnos.find((j) => j.id === jugadorVictimaId);
  if (!jugador) return;

  const { efecto } = sala.efectoPendiente;
  const funcionEfecto = efectos[efecto];

  // Agarramos el primer modo q da el Efecto

  if (funcionEfecto) {
    const resuelto = funcionEfecto(
      sala,
      io,
      jugadorVictimaId,
      zona,
      cartaPosicion,
      cartaId
    );
    if (!sala.efectoPendiente.datos)
      return console.warn("No hay datos para seguir");

    const pasoActual = sala.efectoPendiente.datos[0];

    if (resuelto === true) {
      pasoActual.cantidad--;

      if (pasoActual.mensajeData && pasoActual.mensajeData.length > 0) {
        pasoActual.mensajeData.forEach(
          (msg: { objetivo: string; mensaje: string; fondo?: string }) => {
            const fondo = msg.fondo ?? "/img/UU-Back-Main.png";

            switch (msg.objetivo) {
              case "victima":
                io.to(jugador.id).emit("efectoMensaje", {
                  mensaje: msg.mensaje,
                  fondo,
                });
                break;

              case "jugadorActual":
                io.to(jugadorActual.id).emit("efectoMensaje", {
                  mensaje: msg.mensaje,
                  fondo,
                });
                break;

              case "sala":
                io.to(sala.id).except(jugador.id).emit("efectoMensaje", {
                  mensaje: msg.mensaje,
                  fondo,
                });
                break;

              default:
                console.log("Objetivo desconocido:", msg.objetivo);
                break;
            }
          }
        );
      }

      if (pasoActual.victima) {
        const victimas = sala.ordenTurnos.filter((j) =>
          pasoActual.victimasId?.includes(j.id)
        );
        if (victimas.length === 0)
          return console.warn("No se encontraron victimas para el efecto");

        // Significa q ese evento va para la victima
        if (jugador.id === jugadorActual.id) {
          console.log("No cambiar a modo Normal");
          jugadorActual.jugadasDisponible--;
          return;
        }
        console.log("Este evento va para la victima");
      } else {
        if (pasoActual.cantidad > 0) {
          // Signidica que ese paso deve de repetirse Cantidad es veces
          console.log("Este paso se repetira mas veces");
          console.log(pasoActual);
          return;
        }

        // Una vez la cantidad sea 0, quitar ese paso de los datos:
        sala.efectoPendiente.datos.shift(); // <- quitamos el primer dato

        // Si en los datos aun hay mas paso, asignarle el siguiente
        if (sala.efectoPendiente.datos.length > 0) {
          const siguienteModo = sala.efectoPendiente.datos[0];
          if (Array.isArray(siguienteModo.modo)) {
            jugadorActual.modoActual = siguienteModo.modo;
          } else {
            jugadorActual.modoActual = [siguienteModo.modo];
          }
          console.log(jugadorActual.modoActual);

          // Le avisamos al jugador el cambio de modo
          io.to(jugadorActual.id).emit("modoActualActualizado", {
            modos: jugadorActual.modoActual,
          });

          // Le mandamos un mensaje del siguiente modo
          const mensajeModo = mensajes.find(
            (m) => m.modo === siguienteModo.modo
          );
          io.to(jugadorActual.id).emit("efectoMensaje", {
            mensaje: mensajeModo?.mensaje,
            fondo: "/img/UU-Back-Main.png",
          });

          return;
        }
      }

      // if (!jugador.modoActual.includes("normal"))
      //   return console.log("Ese jugador esta en efecto");

      // significa q ya no hay mas pasos por jugar
      // Le asignamod el modo "Normal"
      jugadorActual.modoActual = ["normal"];
      io.to(jugadorActual.id).emit("modoActualActualizado", {
        modos: jugadorActual.modoActual,
      });

      // Aser q si aun hay efecto pendiente, no restarle
      jugadorActual.jugadasDisponible--; //va al final

      if (!jugador.modoActual.includes("normal"))
        return console.log("Ese jugador esta en efecto");

      // Limpiamos los efectos pendientes
      sala.efectoPendiente = undefined;
      io.to(sala.id).emit("efectoPendiente", null);

      // Vereficar si ese jugador  tiene mas Jugadas Disponibles
      if (jugadorActual.jugadasDisponible <= 0) {
        // No tiene mas jugadas
        pasarTurno(sala, io);
      }

      console.log("Efecto con exito");
    } else {
      console.log("Efecto fallido");
      console.log(resuelto);
    }
  }
}

export function asignarCarta(
  sala: Sala,
  io: any,
  jugadorVictimaId: string,
  jugadorActualId: string
) {
  const jugador = sala.ordenTurnos.find((j) => j.id === jugadorVictimaId);
  if (!jugador) return console.warn("Jugador no encontrado (Victima)");

  const jugadorActual = sala.ordenTurnos.find((j) => j.id === jugadorActualId);
  if (!jugadorActual) return console.warn("Jugador no encontrado (Actual)");

  if (!cartaJugada) return console.warn("Carta jugada no encontrada");

  // Extraer la carta del jugador Actual
  const cartaIndex = jugadorActual.mano.findIndex(
    (c) => c.id === cartaJugada.id
  );
  const cartaExtraida = jugadorActual.mano.splice(cartaIndex, 1)[0];
  if (!cartaExtraida) return;

  io.to(jugadorActual.id).emit("manoActualizada", jugadorActual.mano);

  // Actualizar establos
  jugador.establo.push(cartaExtraida);

  const establos: Record<string, CartaIndividual[]> = {};
  sala.ordenTurnos.forEach((j) => {
    establos[j.id] = j.establo;
  });
  io.to(sala.id).emit("establosActualizado", establos);

  // Actualizar las cantidades de las manos
  const cantidades: Record<string, number> = {};
  sala.ordenTurnos.forEach((j) => {
    cantidades[j.id] = j.mano.length;
  });
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

    // Le enviamos las indicaciones al jugador q lanzo la carta
    io.to(jugador.id).emit("efectoMensaje", {
      mensaje: cartaExtraida.mensaje,
      fondo: cartaExtraida.fondo,
    });
  } else {
    console.warn("Carta sin efectos");
    jugadorActual.jugadasDisponible--;
  }

  if (jugador.id === jugadorActual.id) {
    io.to(jugador.id).emit("efectoMensaje", {
      mensaje: "Pusiste la carta " + cartaExtraida.nombre + " a tu Establo",
      fondo: "/img/UU-Back-Main.png",
    });
  } else {
    io.to(jugador.id).emit("efectoMensaje", {
      mensaje:
        "El jugador " +
        jugadorActual.nombre +
        " te puso la carta " +
        cartaExtraida.nombre +
        " a tu Establo",
      fondo: "/img/UU-Back-Main.png",
    });
  }

  if (jugadorActual.jugadasDisponible <= 0) {
    pasarTurno(sala, io);
  }
}
