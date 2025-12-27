

import { BrowserRouter, Outlet } from "react-router-dom";


function App() {
  // const [mensaje, setMensaje] = useState<string>("");
  // const [mensajes, setMensajes] = useState<string[]>([]);

  // useEffect(() => {
  //   socket.on("mensaje", (data: string) => {
  //     setMensajes((prev) => [...prev, data]);
  //   });

  //   return () => {
  //     socket.off("mensaje");
  //   };
  // }, []);

  // const enviarMensaje = (): void => {
  //   if (mensaje.trim()) {
  //     socket.emit("mensaje", mensaje);
  //     setMensaje("");
  //   }
  // };

  return (
    <div>
      <Outlet/>
    </div>
  );
}

export default App;
