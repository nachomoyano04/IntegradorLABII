import express from "express";
import { prescribirGet, prescribirPost, postIdPaciente } from "../controllers/prescribirController.js";

const route = express.Router();

route.get("/", prescribirGet);
route.get("/:idPaciente", postIdPaciente);
route.post("/", prescribirPost);

export default route;