import React, { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import PlayersList from "./PlayersList";
import type { Jugador } from "../shared/types";

interface LobbyProps {
  onIniciarPartida: (ordenTurnos: Jugador[]) => void;
}

function Lobby({ onIniciarPartida }: LobbyProps) {
  const { nombre, roomId, socket, jugadores, setJugadores } = useGame();

  useEffect(() => {
    if (!nombre || !roomId) return;

    // Unirme a la sala
    console.log("Uniendo a sala: ", roomId, "Jugador: ", nombre);
    socket.emit("unirseSala", { salaId: roomId, nombre });

    // Recibir lista de players
    socket.on("actualizarJugadores", (lista: Jugador[]) => {
      setJugadores(lista);
    });

    socket.on("partidaIniciada", (data: { ordenTurnos: Jugador[] }) => {
      const { ordenTurnos } = data;
      console.log("Evento 'partidaIniciada' recibido");
      console.log("Orden recibido: ", ordenTurnos);
      const jugadoresFiltrados = ordenTurnos.filter((j) => j !== null); // Filtrar jugadores nulos

      onIniciarPartida(jugadoresFiltrados); // Llamar a la función que inicia la partida y le pasamos el orden de los jugadores
    });

    return () => {
      socket.off("actualizarJugadores");
      socket.off("partidaIniciada");
    };
  }, [nombre, roomId, socket]);

  const handleStart = () => {
    console.log("Enviando evento iniciarPartida con roomId:", roomId);
    socket.emit("iniciarPartida", { salaId: roomId });
  };

  const esCreador = jugadores.length > 0 && jugadores[0].nombre === nombre;

  return (
    <div>
      <h1>Sala: {roomId}</h1>
      <p>Jugador: {nombre} </p>

      <PlayersList players={jugadores.map((p) => p.nombre)} />
      {esCreador && (
        <button
          onClick={handleStart}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl"
        >
          Iniciar Partida
        </button>
      )}
    </div>
  );
}

export default Lobby;
