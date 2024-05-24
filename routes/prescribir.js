import express from "express";
import { prescribirGet, prescribirPost, postIdPaciente, postGuardarResultadoPrestacion} from "../controllers/prescribirController.js";

const route = express.Router();

route.get("/", prescribirGet);
route.get("/:idPaciente", postIdPaciente);
route.post("/", prescribirPost);
route.put("/guardarResultado", postGuardarResultadoPrestacion)

export default route;