import express from "express";
import { registroPacienteGet } from "../controllers/pacientesControllers.js";
const route = express.Router();

route.get("/", registroPacienteGet)

export default route;