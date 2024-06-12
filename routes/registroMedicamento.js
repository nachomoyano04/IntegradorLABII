import express from "express";
import { registroMedicamentoGet, obtenerMedicamentos, darDeAltaMedicamento, borradoLogicoMedicamento, editarMedicamento, insertarMedicamento, obtenerMedicamentoPorIdMedicamentoDetalle } from "../controllers/medicamentosControllers.js";
const route = express.Router();

route.get("/", registroMedicamentoGet)
route.put("/", editarMedicamento);
route.post("/", insertarMedicamento);
route.get("/medicamentos", obtenerMedicamentos);
route.get("/medicamentos/:idMedicamentoDetalle", obtenerMedicamentoPorIdMedicamentoDetalle)
route.put("/darDeAltaMedicamento", darDeAltaMedicamento)
route.put("/borrarMedicamento", borradoLogicoMedicamento);

export default route;