import type { CartaIndividual } from "../shared/types";

interface Props {
  carta: CartaIndividual;
  className?: string;
}

export function Carta({ carta, className }: Props) {
  let tamaño: string
  if (!className) {
    tamaño = "w-[120px] h-[170px]";
  } else {
    tamaño = className;
  }

  return (
    // Modelo de las cartas
    <div
      className={`border-2 border-black rounded shadow-md hover:scale-105 transition-all ${tamaño}`}
      style={{
        backgroundImage: `url(${carta.imagen})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      title={carta.nombre}
    />
  );
}
