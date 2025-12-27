import type { CartaIndividual } from "../../shared/types";

interface Props {
  carta: CartaIndividual;
}

export function ShowCards({ carta }: Props) {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-[99999] pointer-events-none">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg shadow-2xl p-4 flex flex-col items-center">
          {/* Modelo de las cartas */}
          <div
            className="w-[200px] h-[280px] border-2 border-black rounded shadow-md hover:scale-105 transition-all"
            style={{
              backgroundImage: `url(${carta.imagen})`,
              backgroundSize: "cover",
            }}
            title={carta.nombre}
          />
          {carta.descripcion && (
            <div className="mt-2 text-center text-white max-w-xs">
              {carta.descripcion}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
