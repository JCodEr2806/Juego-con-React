export interface Jugador {
    id: string;
    nombre: string;
}
export type ModoDeJugada =
  | "normal"
  | "descarte"
  | "jugarCarta"
  | "cartaMazo"
  | "cartaMazoDescarte"
  | "cartaManoJugador"
  | "cartaEstabloJugador"
  | "cartaEstabloJugador"
    | "modoSeleccion"

// Jugador en partida, con sus cartas y estado
export interface JugadorEnPartida extends Jugador {
  mano: CartaIndividual[];
  establo: CartaIndividual[];
  jugadasDisponible: number;
  enModoDescarte: boolean;
  enModoJugarCarta: boolean;
  modoActual: ModoDeJugada[];
  efectoPendiente?: {
    tipo: "descarte" | "robar" | "jugarCarta";
    dato?: any;
  };
}

export interface CartaPlantilla {
    nombre: string;
    tipo: "MEJORA" | "INSTANTANEO" | "DETERIORO" | "MÁGICA" | "UNICORNIO MÁGICO" | "UNICORNIO BÁSICO" | "BEBE UNICORNIO";
    imagen: string;
    descripcion: string;
    // efecto ...
    repeticiones: number;
}
export interface CartaIndividual extends CartaPlantilla {
    id: string; // Unico para cada carta
}

// Estructura de una sala de juego
export interface Sala {
    id: string;
  jugadores: JugadorEnPartida[];
  creadorId: string;
  ordenTurnos: JugadorEnPartida[];
  turnoActual: number;
  cartasJugadores: Record<string, CartaIndividual[]>;
  mazo: CartaIndividual[];
  mazoBebes: CartaIndividual[];
  mazoDescarte: CartaIndividual[];
}