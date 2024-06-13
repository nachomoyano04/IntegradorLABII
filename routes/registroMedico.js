import express from "express";
import {registroMedicoGet, insertarDoctorPost, getProfesionales, updateMedico, borradoLogico, getEspecialidadesWithId, obtenerMedicoById, darDeAltaMedico} from "../controllers/medicosControllers.js";
const router = express.Router();

router.get("/", registroMedicoGet)
router.post("/", insertarDoctorPost)
router.get("/profesionales", getProfesionales)
router.put("/update", updateMedico);
router.put("/borrado", borradoLogico);
router.put("/darDeAltaMedico", darDeAltaMedico)
router.get("/medicos/:idMedico", obtenerMedicoById);
router.get("/:idMedico", getEspecialidadesWithId);

export default router;