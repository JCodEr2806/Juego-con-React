import type { CartaIndividual } from "../../shared/types";

interface Props {
  mazo: CartaIndividual[];
  mazoVisible: boolean;
}

export function Mazo({ mazo, mazoVisible }: Props) {
  const cartasVisibles = mazo.slice(-3); // las 3 primeras
  const hayCartas = mazo.length > 0;
  return (
    <div className="relative w-[120px] h-[170px] shadow-lg ">
      {hayCartas ? (
        cartasVisibles.map((carta, index) => (
          <div
            key={carta.id}
            className="absolute w-[120px] h-[170px] border-2 border-black rounded shadow-md transition-all"
            style={{
              backgroundImage: mazoVisible ? `url(${carta.imagen})`: `url(/img/UU-Back-Main.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              top: index * 3,
              left: index * 3,
              zIndex: cartasVisibles.length - 1,
            }}
            title={mazoVisible ? carta.nombre : "Carta Oculta" }
          />
        ))
      ) : (
        <div
          className="w-[120px] h-[170px]  rounded shadow-md flex items-center justify-center"
          style={{
            backgroundImage: `url(/img/UU-Vacio-Main.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Podrías poner texto opcional */}
          {/* <span className="text-sm text-black">Mazo vacío</span> */}
        </div>
      )}
    </div>
  );
}
