import express from "express";
import { registroPacienteGet, planesPorId, registroPacientePost } from "../controllers/pacientesControllers.js";
const route = express.Router();

route.get("/", registroPacienteGet);
route.get("/:idObraSocial", planesPorId);
route.post("/", registroPacientePost);

export default route;