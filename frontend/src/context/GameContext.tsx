import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Socket, io } from "socket.io-client";
import type { CartaIndividual, Jugador, ModoDeJugada } from "../shared/types";

type GameContextType = {
  nombre: string;
  setNombre: (name: string) => void;
  roomId: string;
  setRoomId: (id: string) => void;
  socket: Socket;
  jugadores: Jugador[]; // Todos los jugadores
  setJugadores: (players: Jugador[]) => void;
  turnoActual: Jugador | null; // Solo un jugador
  setTurnoActual: (players: Jugador) => void;
  cartasJugador: CartaIndividual[];
  setCartasJugador: (cartas: CartaIndividual[]) => void;
  establos: Record<string, CartaIndividual[]>;
  setEstablos: (establos: Record<string, CartaIndividual[]>) => void;
  cartasDeTodos: Record<string, CartaIndividual[]>; // Solo de prueba
  setCartasDeTodos: (data: Record<string, CartaIndividual[]>) => void;

  mazo: CartaIndividual[];
  setMazo: (deck: CartaIndividual[]) => void;
  mazoBebes: CartaIndividual[];
  setMazoBebes: (deck: CartaIndividual[]) => void;
  mazoDeDescarte: CartaIndividual[];
  setMazoDeDescarte: (deck: CartaIndividual[]) => void;
  cantidadesManos: Record<string, number>;
  setCantidadesManos: (data: Record<string, number>) => void;
  // forzarDescarte: {
  //   maxCartas: number;
  //   cartasActuales: CartaIndividual[];
  // } | null;
  // setForzarDescarte: (
  //   descarte: { maxCartas: number; cartasActuales: CartaIndividual[] } | null
  // ) => void;
  efectoPendiente: string | null;
  setEfectoPendiente: (
    efecto: string | null
  ) => void;
  efectoMensaje: { mensaje?: string; fondo?: string } | null;
  setEfectoMensaje: (
    efecto: { mensaje?: string; fondo?: string } | null
  ) => void;

  modoActual: {
    modos: ModoDeJugada[];
    mensaje?: string;
  } | null;
  setModoActual: (data: {modos: ModoDeJugada[]; mensaje?: string}) => void;
};

const socket = io("http://localhost:3000");

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [nombre, setNombre] = useState("");
  const [roomId, setRoomId] = useState("");
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [turnoActual, setTurnoActual] = useState<Jugador | null>(null);
  const [cartasJugador, setCartasJugador] = useState<CartaIndividual[]>([]); //Cartas de un solo jugador
  const [cartasDeTodos, setCartasDeTodos] = useState<
    Record<string, CartaIndividual[]>
  >({});
  const [mazo, setMazo] = useState<CartaIndividual[]>([]);
  const [mazoBebes, setMazoBebes] = useState<CartaIndividual[]>([]);
  const [mazoDeDescarte, setMazoDeDescarte] = useState<CartaIndividual[]>([]);
  const [cantidadesManos, setCantidadesManos] = useState<
    Record<string, number>
  >({});
  const [establos, setEstablos] = useState<Record<string, CartaIndividual[]>>(
    {}
  );
  // const [forzarDescarte, setForzarDescarte] = useState<{
  //   maxCartas: number;
  //   cartasActuales: CartaIndividual[];
  // } | null>(null);
  const [efectoPendiente, setEfectoPendiente] = useState<string | null>(null);
  const [efectoMensaje, setEfectoMensaje] = useState<{
    mensaje?: string;
    fondo?: string;
  } | null>(null);

  const [modoActual, setModoActual] = useState<{
    modos: ModoDeJugada[];
    mensaje?: string;
  } | null>(null)

  useEffect(() => {
    socket.on("turnoActualizado", (data: { turnoActual: Jugador }) => {
      setTurnoActual(data.turnoActual);
    });

    socket.on("partidaIniciada", (data: { ordenTurnos: Jugador[] }) => {
      setJugadores(data.ordenTurnos);
    });

    socket.on("cartasIniciales", (cartas: CartaIndividual[]) => {
      setCartasJugador(cartas);
    });

    socket.on("cartasDeTodos", (data: Record<string, CartaIndividual[]>) => {
      setCartasDeTodos(data);
    });

    socket.on("mazoActualizado", (mazo: CartaIndividual[]) => {
      setMazo(mazo);
    });
    socket.on("guarderiaActualizada", (guarderia: CartaIndividual[]) => {
      setMazoBebes(guarderia);
    });
    socket.on(
      "mazoDescarteActualizada",
      (mazoDeDescarte: CartaIndividual[]) => {
        setMazoDeDescarte(mazoDeDescarte);
      }
    );
    socket.on("manoActualizada", (mano: CartaIndividual[]) => {
      setCartasJugador(mano);
    });
    socket.on(
      "establosActualizado",
      (establos: Record<string, CartaIndividual[]>) => {
        setEstablos(establos);
      }
    );

    socket.on("cartaRobada", (mano: CartaIndividual[]) => {
      setCartasJugador(mano);
    });
    socket.on("cantidadesManos", (data: Record<string, number>) => {
      setCantidadesManos(data);
    });
    // socket.on(
    //   "forzarDescartar",
    //   (data: { maxCartas: number; cartasActuales: CartaIndividual[] }) => {
    //     setForzarDescarte(data);
    //   }
    // );
    // socket.on("resetForzarDescarte", () => {
    //   setForzarDescarte(null);
    // });
    socket.on("efectoPendiente", (data: string | null) =>{
      setEfectoPendiente(data);
    })
    socket.on(
      "efectoMensaje",
      (data: { mensaje?: string; fondo?: string }) => {
        setEfectoMensaje(data);
      }
    );

    socket.on("modoActualActualizado", (data: {modos: ModoDeJugada[]; mensaje?: string}) =>{
      setModoActual(data);
    })

    return () => {
      socket.off("turnoActualizado");
      socket.off("partidaIniciada");
      socket.off("cartasIniciales");
      socket.off("cartasDeTodos");
      socket.off("mazoActualizado");
      socket.off("guarderiaActualizada");
      socket.off("mazoDescarteActualizada");
      socket.off("cantidadesManos");
      socket.off("manoActualizada");
      socket.off("establosActualizado");
      socket.off("cartaRobada");
      // socket.off("forzarDescartar");
      // socket.off("resetForzarDescarte");
      socket.off("efectoPendiente");
      socket.off("efectoMensaje");
      
      socket.off("modoActualActualizado");
    };
  }, []);

  return (
    <GameContext.Provider
      value={{
        nombre,
        setNombre,
        roomId,
        setRoomId,
        socket,
        jugadores,
        setJugadores,
        turnoActual,
        setTurnoActual,
        cartasJugador,
        setCartasJugador,
        establos,
        setEstablos,
        cartasDeTodos,
        setCartasDeTodos,

        mazo,
        setMazo,
        mazoBebes,
        setMazoBebes,
        mazoDeDescarte,
        setMazoDeDescarte,
        cantidadesManos,
        setCantidadesManos,
        // forzarDescarte,
        // setForzarDescarte,
        efectoPendiente,
    setEfectoPendiente,
        efectoMensaje,
    setEfectoMensaje,

        modoActual,
        setModoActual,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame deve de estar dentro del provider");
  return context;
};
