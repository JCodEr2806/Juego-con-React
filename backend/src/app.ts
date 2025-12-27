import express, { Application, Request, Response } from "express";

const app: Application = express();

app.use(express.json());
app.use(express.static("public"));

app.use((req: Request, res: Response) => {
  res.status(404).send("Ruta no encontrada");
});

export default app;
