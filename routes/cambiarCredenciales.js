import express from "express";
import { getCambiarCredenciales, postCambiarCredenciales } from "../controllers/cambiarCredencialesController.js";

const route = express.Router();

route.get("/", getCambiarCredenciales);
route.post("/", postCambiarCredenciales);

export default route;