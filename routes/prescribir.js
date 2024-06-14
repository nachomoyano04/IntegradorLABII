import express from "express";
import { prescribirGet, prescribirPost, postIdPaciente, postGuardarResultadoPrestacion} from "../controllers/prescribirController.js";
import { getPrescripcionByIdPrescripcion } from "../models/prescripcion.js";

const route = express.Router();

route.get("/", prescribirGet);
route.get("/:idPaciente", postIdPaciente);
route.post("/", prescribirPost);
route.put("/guardarResultado", postGuardarResultadoPrestacion)
route.post("/prescripcionesByIdPrescripcion", async (req, res) => {
    const {idPrescripcion} = req.body;
    try {
        const resultado = await getPrescripcionByIdPrescripcion(idPrescripcion);
        res.json(resultado);
    } catch (error) {
        res.json(error);
    }
})

export default route;