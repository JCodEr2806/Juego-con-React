import { useGame } from "../../context/GameContext";
import type { CartaIndividual } from "../../shared/types";
import { Carta } from "../Carta";

interface Props {
  cartas: CartaIndividual[];

  jugadorId: string;
  hoverCardIdx: { jugadorId: string; idx: number; zona: string } | null;
  handleMouseEnter: (
    jugadorId: string,
    idx: number,
    zona: "mano" | "establo" | "unicornio" | "mejora" | "deterioro"
  ) => void;
  handleMouseLeave: () => void;
}

export function Establo({
  cartas,
  jugadorId,
  hoverCardIdx,
  handleMouseEnter,
  handleMouseLeave,
}: Props) {
  const { efectoPendiente, modoActual, socket, roomId } = useGame();

  const cartasUnicornio = cartas.filter(
    (c) =>
      c.tipo === "BEBE UNICORNIO" ||
      c.tipo === "UNICORNIO BÁSICO" ||
      c.tipo === "UNICORNIO MÁGICO"
  );
  const cartasMejora = cartas.filter((c) => c.tipo === "MEJORA");
  const cartasDeterioro = cartas.filter((c) => c.tipo === "DETERIORO");
  return (
    // Establo
    <div className="w-[400px] h-[200px] border-2 border-black rounded flex justify-center flex-col gap-6">
      {/* Cartas*/}
      {/* CARTAS UNICORNIO */}
      <div className="flex justify-center items-center h-[68px] ">
        <div className="flex justify-center items-center">
          {cartasUnicornio.map((carta, idx) => {
            const isHover =
              hoverCardIdx?.jugadorId === jugadorId &&
              hoverCardIdx?.zona === "unicornio" &&
              hoverCardIdx.idx === idx;

            return (
              <div
                key={carta.id}
                className="-ml-28 first:ml-0 origin-center"
                style={{
                  zIndex: cartas.length - idx,
                  transform: isHover ? "translateY(-20px) scale(1.1)" : "",
                }}
                onMouseEnter={() =>
                  handleMouseEnter(jugadorId, idx, "unicornio")
                }
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                  if (efectoPendiente && modoActual?.modos.includes("cartaEstabloJugador")) {
                    console.log("Efecto Pendiente Activo");
                    
                    socket.emit("resolverEfecto", {
                      salaId: roomId,
                      jugadorVictimaId: jugadorId,
                      cartaId: carta.id,
                      zona: "Establo"
                    });
                    console.log(efectoPendiente);
                    console.log(carta.id)
                    console.log(idx)

                    
                  } else {
                    console.log("Sin efectos pendientes");
                  }
                }}
              >
                <Carta
                  key={carta.id}
                  carta={carta}
                  className="w-[65px] h-[85px]"
                />
              </div>
            );
          })}
        </div>
      </div>
      {/* CARTAS RESTANTES */}
      <div className="flex justify-center items-center h-[68px] gap-15">
        <div className="flex justify-center items-center">
          {cartasMejora.map((carta, idx) => {
            const isHover =
              hoverCardIdx?.jugadorId === jugadorId &&
              hoverCardIdx?.zona === "mejora" &&
              hoverCardIdx.idx === idx;

            return (
              <div
                key={carta.id}
                className="-ml-22 first:ml-0 origin-center"
                style={{
                  zIndex: cartas.length - idx,
                  transform: isHover ? "translateY(-20px) scale(1.1)" : "",
                }}
                onMouseEnter={() => handleMouseEnter(jugadorId, idx, "mejora")}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                  if (efectoPendiente && modoActual?.modos.includes("cartaEstabloJugador")) {
                    console.log("Efecto Pendiente Activo");
                    socket.emit("resolverEfecto", {
                      salaId: roomId,
                      jugadorVictimaId: jugadorId,
                      cartaId: carta.id,
                      zona: "Establo"
                    });
                    console.log(efectoPendiente);
                    console.log(carta.id)
                    console.log(idx)

                    
                  } else {
                    console.log("Sin efectos pendientes");
                  }
                }}
              >
                <Carta
                  key={carta.id}
                  carta={carta}
                  className="w-[65px] h-[85px]"
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-center items-center">
          {cartasDeterioro.map((carta, idx) => {
            const isHover =
              hoverCardIdx?.jugadorId === jugadorId &&
              hoverCardIdx?.zona === "deterioro" &&
              hoverCardIdx.idx === idx;

            return (
              <div
                key={carta.id}
                className="-ml-22 first:ml-0 origin-center"
                style={{
                  zIndex: cartas.length - idx,
                  transform: isHover ? "translateY(-20px) scale(1.1)" : "",
                }}
                onMouseEnter={() =>
                  handleMouseEnter(jugadorId, idx, "deterioro")
                }
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                  if (efectoPendiente && modoActual?.modos.includes("cartaEstabloJugador")) {
                    console.log("Efecto Pendiente Activo");
                    socket.emit("resolverEfecto", {
                      salaId: roomId,
                      jugadorVictimaId: jugadorId,
                      cartaId: carta.id,
                      zona: "Establo"
                    });
                    console.log(efectoPendiente);
                    console.log(carta.id)
                    console.log(idx)

                    
                  } else {
                    console.log("Sin efectos pendientes");
                  }
                }}
              >
                <Carta
                  key={carta.id}
                  carta={carta}
                  className="w-[65px] h-[85px]"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
