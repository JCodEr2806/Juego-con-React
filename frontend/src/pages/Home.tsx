import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

const Home = () => {
  const [nombreInput, setNombreInput] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const navigate = useNavigate();
  const { setNombre, setRoomId } = useGame();

  const crearSala = () => {
    const nuevaSala = crypto.randomUUID().slice(0, 6); // Generar una id simple
    setNombre(nombreInput); // Guardar el nombre del jugador
    setRoomId(nuevaSala); // Guardar la id de la sala
    navigate(`/sala/${nuevaSala}`);
  };

  const unirseASala = () => {
    if (roomIdInput.trim()) {
      setNombre(nombreInput);
      setRoomId(roomIdInput);
      navigate(`/sala/${roomIdInput}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-600 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">BIENVENIDO AL JUEGO</h1>

      <input
        type="text"
        placeholder="Tu nombre"
        className="mb-4 p-2 text-black rounded"
        value={nombreInput}
        onChange={(e) => setNombreInput(e.target.value)}
      />

      <button
        className="bg-green-500 px-4 py-2 rounded mb-4"
        onClick={crearSala}
        disabled={!nombreInput}
      >
        Crear Sala
      </button>

      <input
        type="text"
        placeholder="Codigo o enlace de sala"
        className="mb-2 p-2 text-black rounded"
        value={roomIdInput}
        onChange={(e) => setRoomIdInput(e.target.value)}
      />
      <button
        className="bg-green-500 px-4 py-2 rounded mb-4"
        onClick={unirseASala}
        disabled={!nombreInput || !roomIdInput}
      >
        Unirse a Sala
      </button>
    </div>
  );
};

export default Home;
