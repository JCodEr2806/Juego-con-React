import "../Cartas/animations.css";
import { useGame } from "../../context/GameContext";
import { useEffect, useState } from "react";

export function EffectsWarning() {
  const { efectoMensaje } = useGame();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if(efectoMensaje?.mensaje){
        setVisible(true);

        const timer = setTimeout(() =>{
            setVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }
  }, [efectoMensaje])

  if(!visible) return null;
  
  return (
    <>
      {efectoMensaje?.mensaje && (
        <div className="fixed inset-0 flex items-center justify-center z-[99999] pointer-events-none  ">
          <div
            className="w-[350px] h-[150px] rounded-lg shadow-2xl p-4 flex justify-center items-center float transition-opacity duration-700"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${efectoMensaje.fondo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <p className="text-center text-2xl text-white text-shadow-lg/30 text-shadow-orange-600 font-bold p-1.5">
              {efectoMensaje.mensaje}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
