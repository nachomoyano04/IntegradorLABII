import express from "express";
import { inicioGet } from "../controllers/inicioControllers.js";
const router = express.Router();

router.get("/", inicioGet)

export default router;