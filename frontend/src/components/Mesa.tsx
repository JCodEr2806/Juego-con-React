import type { Jugador } from "../shared/types";
import { useGame } from "../context/GameContext";
import { Carta } from "./Carta";
import { useEffect, useState } from "react";
import { Mazo } from "./MesaComponents/Mazo";
import { ShowCards } from "./Cartas/ShowCards";
import { Establo } from "./MesaComponents/Establo";
import { EffectsWarning } from "./Cartas/EffectsWarning";

interface MesaProps {
  jugadorId: string;
  jugadoresOrdenados: Jugador[];
}

function Mesa({ jugadorId, jugadoresOrdenados }: MesaProps) {
  const { cartasJugador, cantidadesManos, establos, modoActual } = useGame(); // para comprobar tus cartas ESTA USAREMOS
  //const { cartasDeTodos, setCartasDeTodos } = useGame(); //Solo para comprobar las cartas de todos
  const { mazo, mazoBebes, mazoDeDescarte } = useGame();
  const { roomId, socket, turnoActual, jugadores } = useGame();
  const [hoverCardIdx, setHoverCardIdx] = useState<{
    jugadorId: string;
    idx: number;
    zona: "mano" | "establo" | "unicornio" | "mejora" | "deterioro";
  } | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log(modoActual);
  }, [modoActual]);
  // console.log(turnoActual);
  // useEffect(() => {
  //   console.log("cantidades de mano:", cantidadesManos);
  // }, [cantidadesManos]);

  // Por si ocurre un error
  if (!jugadorId || jugadoresOrdenados.length === 0) {
    return <div>Cargando Partida...</div>;
  }

  const indexJugador = jugadoresOrdenados.findIndex((j) => j?.id === jugadorId);

  if (indexJugador === -1) {
    return <div>Error: jugador no encontrado en la partida.</div>;
  }
  // ----------------------------------------

  // Reordemar visualmente los jugadores para que el jugador actual este al final
  const jugadoresRotados = [
    ...jugadoresOrdenados.slice(indexJugador + 1),
    ...jugadoresOrdenados.slice(0, indexJugador + 1),
  ];

  // Establecer las posiciones a los jugadores
  const posiciones: Record<string, string> = {
    bottom: "bottom-[-80px] left-[50%] transform -translate-x-1/2",
    top: "top-[-80px] left-[50%] transform -translate-x-1/2 rotate-180",
    left: "top-[50%] left-[-80px] transform -translate-y-1/2 rotate-90",
    right: "top-[50%] right-[-80px] transform -translate-y-1/2 rotate-[-90deg]",
  };

  const getPosicion = (
    jugadorIdActual: string,
    jugador: Jugador,
    index: number
  ) => {
    if (jugador.id === jugadorIdActual) return posiciones.bottom;
    if (index === 0) return posiciones.left;
    if (index === 1) return posiciones.top;
    if (index === 2) return posiciones.right;
    return ""; // Pronto añadire mas
  };

  // Obtener la carta en hover (solo para el jugador actual)
  let cartaHover = null;
  if (hoverCardIdx) {
    if (hoverCardIdx.zona === "mano") {
      cartaHover =
        hoverCardIdx.jugadorId === jugadorId
          ? cartasJugador[hoverCardIdx.idx]
          : null; //La mano de los otros no se ven
    } else if (hoverCardIdx.zona === "mejora") {
      const cartasMejora =
        establos[hoverCardIdx.jugadorId]?.filter((c) => c.tipo === "MEJORA") ||
        [];
      cartaHover = cartasMejora[hoverCardIdx.idx] || null;
    } else if (hoverCardIdx.zona === "deterioro") {
      const cartasDeterioro =
        establos[hoverCardIdx.jugadorId]?.filter(
          (c) => c.tipo === "DETERIORO"
        ) || [];
      cartaHover = cartasDeterioro[hoverCardIdx.idx] || null;
    } else if (hoverCardIdx.zona === "unicornio") {
      const cartasUnicornio =
        establos[hoverCardIdx.jugadorId]?.filter((c) =>
          ["BEBE UNICORNIO", "UNICORNIO BÁSICO", "UNICORNIO MÁGICO"].includes(
            c.tipo
          )
        ) || [];
      cartaHover = cartasUnicornio[hoverCardIdx.idx] || null;
    }
  }

  const handleMouseEnter = (
    jugadorId: string,
    idx: number,
    zona: "mano" | "establo" | "unicornio" | "mejora" | "deterioro"
  ) => {
    const timeoutId = setTimeout(() => {
      setHoverCardIdx({ jugadorId, idx, zona });
    }, 100);
    setHoverTimeout(timeoutId);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoverCardIdx(null);
  };

  //Asignar acciones al Mazo
  const yo = jugadores.find((j) => j.id === socket.id);
  const esMiTurno = yo && turnoActual?.id === yo.id;

  return (
    <div className="mesa relative h-screen overflow-hidden">
      {(modoActual?.modos.includes("modoSeleccion") ||
        modoActual?.modos.includes("cartaManoJugador")) && (
        <div className="fixed inset-0 flex items-center justify-center ">
          <div className="flex justify-center gap-2">
            {jugadoresRotados.map((j) => {
              return (
                <button
                  key={j.id}
                  className="bg-black/80 backdrop-blur-sm rounded-lg shadow-2xl p-4 flex items-center text-white cursor-pointer hover:bg-black/90 transition-all"
                  onClick={() => {
                    if (!yo) return;
                    if (modoActual.modos.includes("modoSeleccion")) {
                      socket.emit("asignarCarta", {
                        salaId: roomId,
                        jugadorVictimaId: j.id,
                        jugadorActualId: yo.id,
                      });
                    } else if (modoActual.modos.includes("cartaManoJugador")) {
                      socket.emit("resolverEfecto", {
                        salaId: roomId,
                        jugadorVictimaId: j.id,
                        zona: "ManoJugador",
                      });
                      console.log("cartaMano");
                    }
                  }}
                >
                  {j.nombre} {j.id === jugadorId ? "(Tú)" : ""}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* MODO DE DESCARTE */}
      {modoActual?.mensaje && (
        <div className="fixed inset-0 flex items-center justify-center z-[99999] pointer-events-none text-white font-bold ">
          <div className="w-[300px] bg-red-900/80 backdrop-blur-xs rounded-lg shadow-2xl p-4 flex flex-col items-center text-center">
            {modoActual?.mensaje}
          </div>
        </div>
      )}
      <EffectsWarning />
      {/* Overlay de carta ampliada en el centro */}
      {cartaHover && <ShowCards carta={cartaHover} />}
      {/* MAZO DE BEBE */}
      <div className="absolute top-[-40px] left-12 scale-90 rotate-45">
        <Mazo mazo={mazoBebes} mazoVisible={true} />
      </div>
      {/* MAZO DE ROBO */}
      <div
        className={`absolute top-[-40px] right-12 scale-90 rotate-[-45deg] transition-all ${
          esMiTurno || modoActual?.modos.includes("cartaMazo")
            ? "shadow-yellow-200 cursor-pointer hover:scale-100"
            : "opacity-50 cursor-not-allowed"
        }`}
        onClick={() => {
          if (esMiTurno || modoActual?.modos.includes("cartaMazo")) {
            socket.emit("robarMazo", { salaId: roomId, jugadorId: yo?.id });
          } else {
            console.log("datos no cuadran");
          }
        }}
      >
        <Mazo mazo={mazo} mazoVisible={false} />
      </div>
      {/* MAZO DE DESCARTE */}
      <div
        className={`absolute top-[-30px] right-[240px] scale-90 rotate-[-90deg] transition-all ${
          esMiTurno || modoActual?.modos.includes("cartaMazoDescarte")
            ? "shadow-yellow-200 cursor-pointer hover:scale-100"
            : "opacity-50 cursor-not-allowed"
        }`}
        onClick={() => {
          if (esMiTurno || modoActual?.modos.includes("cartaMazoDescarte")) {
            socket.emit("robarMazo", { salaId: roomId, jugadorId: yo?.id });
          } else {
            console.log("datos no cuadran");
          }
        }}
      >
        <Mazo mazo={mazoDeDescarte} mazoVisible={true} />
      </div>

      {/* JUGADOR */}
      {jugadoresRotados.map((j, i) => {
        const ordenOriginal =
          jugadoresOrdenados.findIndex((p) => p.id === j.id) + 1;

        const posicion = getPosicion(jugadorId, j, i);
        const cartasMostrar =
          j.id === jugadorId
            ? cartasJugador
            : Array(cantidadesManos[j.id] || 0).fill({
                id: "oculta",
                nombre: "Carta Oculta",
                imagen: "/img/UU-Back-Main.png",
              });

        return (
          <div
            key={j.id}
            className={`absolute bg-transparent flex flex-col items-center gap-1 ${posicion}`}
          >
            <div className="flex justify-center items-center">
              <Establo
                cartas={establos[j.id] || []}
                jugadorId={j.id}
                hoverCardIdx={hoverCardIdx}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
              />
            </div>
            <div className="flex justify-center items-center gap-2 m-1">
              <h4 className="font-bold">
                {ordenOriginal}. {j.nombre} {j.id === jugadorId ? "(Tú)" : ""}{" "}
              </h4>
              {turnoActual?.id === j.id && (
                <span className="bg-amber-600 shadow-amber-400/50 py-2 px-3 rounded-2xl text-white font-semibold">
                  Tu Turno
                </span>
              )}
            </div>
            {/* MANO DEL JUGADOR */}
            <div className="flex justify-center items-center">
              {cartasMostrar.map((carta, idx) => {
                const isJugadorActual = j.id === jugadorId;
                const transform =
                  isJugadorActual &&
                  hoverCardIdx?.jugadorId === j.id &&
                  hoverCardIdx.idx === idx &&
                  hoverCardIdx.zona === "mano"
                    ? "translateY(-50px) scale(1.1)"
                    : "";

                return (
                  <div
                    key={`${carta.id}-${idx}`}
                    className="transition-all duration-200"
                    style={{
                      transform: transform,
                      marginLeft: idx === 0 ? "0" : "-80px",
                    }}
                    {...(isJugadorActual
                      ? {
                          onMouseEnter: () =>
                            handleMouseEnter(j.id, idx, "mano"),
                          onMouseLeave: () => handleMouseLeave(),
                          onClick: () => {
                            if (modoActual?.modos.includes("jugarCarta")) {
                              console.log("Modo Jugar Carta");
                              socket.emit("jugarCarta", {
                                salaId: roomId,
                                jugadorId: yo?.id,
                                posicion: idx,
                              });
                            } else if (modoActual?.modos.includes("descarte")) {
                              console.log("Modo Descarte");
                              socket.emit("descartarCarta", {
                                salaId: roomId,
                                jugadorId: yo?.id,
                                posicion: idx,
                              });
                            } else {
                              console.log("Ningun dato cuadra");
                            }
                          },
                          //                     onClick={() => {
                          //   if (!esMiTurno) return;
                          //   socket.emit("robarMazo", { salaId: roomId, jugadorId: yo.id });
                          // }}
                        }
                      : {})}
                  >
                    <Carta carta={carta} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Mesa;
