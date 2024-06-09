import express from "express";
import { registroPacienteGet, planesPorIdPaciente, registroPacientePost, obtenerPacientes, obtenerOSByIdPlan } from "../controllers/pacientesControllers.js";
const route = express.Router();

route.get("/", registroPacienteGet);
route.post("/", registroPacientePost);
route.get("/pacientes", obtenerPacientes);
route.post("/obrasSociales", obtenerOSByIdPlan);
route.get("/:idPaciente", planesPorIdPaciente);

export default route;