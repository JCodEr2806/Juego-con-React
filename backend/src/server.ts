import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { CartaIndividual, Sala } from "./shared/types";
import { iniciarPartida } from "./logic/gameSetup";
import { robarMazo } from "./logic/drawManager";
import {
  asignarCarta,
  jugadorDescartaCarta,
  jugadorJuegaCarta,
  jugadorRobaCarta,
  resolverEfecto,
} from "./logic/turnManager";

dotenv.config();

const PORT = process.env.PORT || 4000;

const salas: Record<string, Sala> = {};

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Un jugador se conectó:", socket.id);

  socket.on(
    "unirseSala",
    ({ salaId, nombre }: { salaId: string; nombre: string }) => {
      if (!salas[salaId]) {
        salas[salaId] = {
          id: salaId,
          jugadores: [],
          creadorId: socket.id,
          ordenTurnos: [],
          turnoActual: 0,
          cartasJugadores: {},
          mazo: [],
          mazoBebes: [],
          mazoDescarte: [],
        };
      }

      const yaExiste = salas[salaId].jugadores.find((j) => j.id === socket.id);
      if (!yaExiste) {
        salas[salaId].jugadores.push({
          id: socket.id,
          nombre,
          mano: [],
          establo: [],
          jugadasDisponible: 2,
          modoActual: ["normal"],
        });
      }

      socket.join(salaId);
      io.to(salaId).emit("actualizarJugadores", salas[salaId].jugadores);

      console.log(`Jugador ${nombre} se unió a la sala ${salaId}`);
    }
  );

  socket.on("disconnect", () => {
    for (const salaId in salas) {
      const sala = salas[salaId];
      if (!sala) continue; // Evitar errores

      sala.jugadores = sala.jugadores.filter((j) => j.id !== socket.id);

      if (sala.jugadores.length === 0) {
        delete salas[salaId];
      } else {
        io.to(salaId).emit("actualizarJugadores", sala.jugadores);
      }
    }
    console.log("Jugador desconectado:", socket.id);
  });

  socket.on("iniciarPartida", ({ salaId }: { salaId: string }) => {
    const sala = salas[salaId];
    if (sala && sala.creadorId === socket.id) {
      iniciarPartida(sala, io);
    }
  });

  //Para Efectos
  socket.on(
    "resolverEfecto",
    ({
      salaId,
      jugadorId,
      posicion,
    }: {
      salaId: string;
      jugadorId: string;
      posicion: number;
    }) => {
      const sala = salas[salaId];
      if (!sala) return;
      jugadorJuegaCarta(sala, jugadorId, io, posicion);
    }
  );

  socket.on(
    "robarMazo",
    ({ salaId, jugadorId }: { salaId: string; jugadorId: string }) => {
      const sala = salas[salaId];
      if (!sala) return;
      jugadorRobaCarta(sala, jugadorId, io);
    }
  );
  socket.on(
    "jugarCarta",
    ({
      salaId,
      jugadorId,
      posicion,
    }: {
      salaId: string;
      jugadorId: string;
      posicion: number;
    }) => {
      const sala = salas[salaId];
      if (!sala) return;
      jugadorJuegaCarta(sala, jugadorId, io, posicion);
    }
  );
  socket.on(
    "descartarCarta",
    ({
      salaId,
      jugadorId,
      posicion,
    }: {
      salaId: string;
      jugadorId: string;
      posicion: number;
    }) => {
      const sala = salas[salaId];
      if (!sala) return;
      jugadorDescartaCarta(sala, jugadorId, io, posicion);
    }
  );

  socket.on(
    "resolverEfecto",
    ({
      salaId,
      jugadorVictimaId,
      cartaPosicion,
      cartaId,
      zona,
    }: {
      salaId: string;
      jugadorVictimaId: string;
      cartaPosicion?: number;
      cartaId?: string;
      zona: string;
    }) => {
      const sala = salas[salaId];
      if (!sala) return;
      resolverEfecto(sala, io, jugadorVictimaId, zona, cartaPosicion, cartaId);
    }
  );

  socket.on(
    "asignarCarta",
    ({
      salaId,
      jugadorVictimaId,
      jugadorActualId,
    }: {
      salaId: string;
      jugadorVictimaId: string;
      jugadorActualId: string;
    }) => {
      const sala = salas[salaId];
      if (!sala) return;
      // jugadorJuegaCarta(sala, jugadorId, io, posicion);
      asignarCarta(sala, io, jugadorVictimaId, jugadorActualId);
    }
  );
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
