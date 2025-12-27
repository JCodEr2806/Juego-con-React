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
  | "modoSeleccion";

// Jugador en partida, con sus cartas y estado
export interface JugadorEnPartida extends Jugador {
  mano: CartaIndividual[];
  establo: CartaIndividual[];
  jugadasDisponible: number;
  modoActual: ModoDeJugada[];
  // efectoPendiente?: {
  //   tipo: "desactivo" | "activo";
  //   dato?: any;
  // };
}

// Cuando una carta quiera hacer efecto, primero comprobara q esa carta victima cumpla con estos requisitos
export type SubTipoCarta = "INDESTRUCTIBLE" | "INMEDIATA";

export type Condicion = {
  id: string;
  args: any[];
}

export type TipoCarta =
  | "MEJORA"
  | "INSTANTANEO"
  | "DETERIORO"
  | "MÁGICA"
  | "UNICORNIO MÁGICO"
  | "UNICORNIO BÁSICO"
  | "BEBE UNICORNIO";

export interface CartaPlantilla {
  nombre: string;
  tipo: TipoCarta;
  imagen: string;
  fondo?: string;
  descripcion: string;
  mensaje?: string;
  efecto?:
    | {
        id: string;
        modo: "inmediato" | "objetivo";
      }
    | undefined;
  condicion?: Condicion | Condicion[]
  modoDeJugador?: ModoDeJugada;
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

  efectoPendiente?:
    | {
        jugadorQueJugo: string;
        efecto: string;
        cartaId: string;
        mensaje?: string;
        datos?: any;
      }
    | undefined;
}

export type ZonasDeEfecto =
  | "mazoRobo"
  | "mazoDescarte"
  | "manoJugador"