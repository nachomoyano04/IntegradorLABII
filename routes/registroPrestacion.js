import express from "express";
import { registroPrestacionGet, obtenerPrestaciones, darDeAltaPrestacion, borradoLogicoPrestacion, obtenerPrestacionById, registroPrestacionPut, registroPrestacionPost } from "../controllers/prestacionesControllers.js";
import pool from "../models/database.js";

const route = express.Router();

route.get("/", registroPrestacionGet);
route.put("/", registroPrestacionPut);
route.post("/", registroPrestacionPost);
route.get("/prestaciones", obtenerPrestaciones);
route.put("/darDeAltaPrestacion", darDeAltaPrestacion)
route.put("/borrarPrestacion", borradoLogicoPrestacion)
route.get("/prestaciones/:idPrestacion", obtenerPrestacionById)
route.get("/getLados", async (req, res) => {
    const resultado = await pool.query("SELECT * FROM lado");
    res.json(resultado[0]);
})
export default route;