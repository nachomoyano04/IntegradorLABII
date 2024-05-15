import express from "express";
import {registroMedicoGet, insertarDoctorPost} from "../controllers/medicosControllers.js";
const router = express.Router();

router.get("/", registroMedicoGet)
router.post("/", insertarDoctorPost)

export default router;