import express from "express";
import {registroMedicoGet, insertarDoctorPost, getProfesionales} from "../controllers/medicosControllers.js";
const router = express.Router();

router.get("/", registroMedicoGet)
router.post("/", insertarDoctorPost)
router.get("/profesionales", getProfesionales)

export default router;