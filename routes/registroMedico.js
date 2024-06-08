import express from "express";
import {registroMedicoGet, insertarDoctorPost, getProfesionales, updateMedico, borradoLogico, getEspecialidadesWithId} from "../controllers/medicosControllers.js";
const router = express.Router();

router.get("/", registroMedicoGet)
router.post("/", insertarDoctorPost)
router.get("/profesionales", getProfesionales)
router.put("/update", updateMedico);
router.put("/borrado", borradoLogico);
router.get("/:idMedico", getEspecialidadesWithId);

export default router;