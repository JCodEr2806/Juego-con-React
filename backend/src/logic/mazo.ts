import type { CartaIndividual } from "../shared/types";

export function separarUniBebes(mazo: CartaIndividual[]): { bebes:CartaIndividual[]; resto: CartaIndividual[]} {
  const bebes: CartaIndividual[] = [];
  const resto: CartaIndividual[] = [];

  for(const carta of mazo) {
    if(carta.tipo === "BEBE UNICORNIO") bebes.push(carta);
    else resto.push(carta);
  }

  return {bebes, resto};
}

export function barajarMazo(mazo: CartaIndividual[]): CartaIndividual[] {
  for (let i = mazo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mazo[i]!, mazo[j]!] = [mazo[j]!, mazo[i]!];
  }
  return mazo;
}

export function barajarDobleMazo(mazo1: CartaIndividual[], mazo2: CartaIndividual[]): CartaIndividual[] {
  const mazoCombinado = [...mazo1, ...mazo2];
  
  return barajarMazo(mazoCombinado);
}


export function asignarCartas(
  mazo: CartaIndividual[],
  cantidad: number
): CartaIndividual[] {
  const cartas: CartaIndividual[] = [];
  for (let i = 0; i < cantidad; i++) {
    const randomIndex = Math.floor(Math.random() * mazo.length);
    const carta = mazo.splice(randomIndex, 1)[0]; // saca la carta del mazo
    if (carta) cartas.push(carta);
  }
  // console.log(mazo);

  return cartas;
}
