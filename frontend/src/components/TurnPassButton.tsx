import { useGame } from "../context/GameContext";

function TurnPassButton() {
  const { roomId, socket, turnoActual, jugadores } = useGame();

  const yo = jugadores.find((j) => j.id === socket.id);

  if (!yo || turnoActual?.id !== yo.id) return null; //No mostrar si no es mi turno

  return (
    <div>
      <button
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
        onClick={() => {
          socket.emit("robarMazo", { salaId: roomId, jugadorId: yo.id });
        }}
      >
        Pasar Turno
      </button>
    </div>
  );
}

export default TurnPassButton;
