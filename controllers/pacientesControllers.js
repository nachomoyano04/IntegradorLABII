import { getObrasSociales } from "../models/obraSocial.js";
import {getPlanByIdObraSocial} from "../models/planes.js";
import { insertPatient } from "../models/pacientes.js";
import { getObrasSocialPlanByIDs } from "../models/obraSocial_plan.js";

const registroPacienteGet = async (req, res) => {
    try {
        const obraSocial = await getObrasSociales();
        res.render("registrarPaciente", {obraSocial});
    } catch (error) {
        res.status(500).send("Error en el servidor al obtener obras sociales");
    }
}

const planesPorId = async(req, res) => {
    try {
        const idObraSocial = req.params.idObraSocial;
        const planes = await getPlanByIdObraSocial(idObraSocial);
        return res.json(planes);
    } catch (error) {
        res.status(500).send("Error en el servidor al obtener los planes por id");
    }
}

const registroPacientePost = async (req, res) => {
    try {
        const {nombre, apellido, documento, fechaNacimiento, sexo, obraSocial, plan} = req.body;
        let idObraSocialPlan = await getObrasSocialPlanByIDs(obraSocial, plan);
        idObraSocialPlan = idObraSocialPlan[0].id;
        const paciente = {nombre, apellido, documento, fechaNacimiento, sexo, idObraSocialPlan};
        const resultado = await insertPatient(paciente);
        res.json(`Paciente insertado correctamente con el id: ${resultado[0].insertId}`);
    } catch (error) {
        res.status(500).send("Error interno en el servidor al insertar un nuevo paciente asdasd");
    }
} 

export {registroPacienteGet, planesPorId, registroPacientePost};