import { useState } from "react";
import Lobby from "../components/Lobby";
import { useGame } from "../context/GameContext";
import Mesa from "../components/Mesa";
import type { Jugador } from "../shared/types";

const Sala = () => {
  const [partidaIniciada, setPartidaIniciada] = useState(false);
  const [jugadoresOrden, setJugadoresOrden] = useState<Jugador[]>([]);

  const { socket } = useGame(); //Se pone en {} el socket para que se reconozca como un objeto

  return (
    <div>
      {!partidaIniciada ? (
        <Lobby
          onIniciarPartida={(orden) => {
            setJugadoresOrden(orden);
            setPartidaIniciada(true);
          }}
        />
      ) : (
        <Mesa jugadorId={socket?.id || ""} jugadoresOrdenados={jugadoresOrden} />
      )}
    </div>
  );
};

export default Sala;
