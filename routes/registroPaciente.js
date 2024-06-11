import express from "express";
import { registroPacienteGet, planesPorIdPaciente, registroPacientePost, obtenerPacientes, obtenerOSByIdPlan, registroPacienteUpdate, borradoLogicoPaciente, obtenerPacienteByDocumento } from "../controllers/pacientesControllers.js";
const route = express.Router();

route.get("/", registroPacienteGet);
route.post("/", registroPacientePost);
route.put("/", registroPacienteUpdate);
route.get("/pacientes", obtenerPacientes);
route.put("/pacientes", borradoLogicoPaciente);
route.get("/pacientes/:documento", obtenerPacienteByDocumento)
route.post("/obrasSociales", obtenerOSByIdPlan);
// route.post("/pacienteByDocumento", obtenerPacienteByDocumento)
route.get("/:idPaciente", planesPorIdPaciente);

export default route;