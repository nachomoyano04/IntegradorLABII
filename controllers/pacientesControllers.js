import { getObrasSociales } from "../models/obraSocial.js";
import {getPlanByIdObraSocial} from "../models/planes.js";
import { insertPatient } from "../models/pacientes.js";
import { getObrasSocialPlanByIDs } from "../models/obraSocial_plan.js";

const registroPacienteGet = async (req, res) => {
    if(req.session.loggedin && req.session.idRol === 1){
        try {
            const obraSocial = await getObrasSociales();
            res.render("registrarPaciente", {obraSocial});
        } catch (error) {
            const mensajeDeError500 = `Error interno en el servidor: ${error}`
            res.status(500).render("404", {error500:true, mensajeDeError500});
        }
    }else{
        res.send("No tienes permiso de administrador...");
    }
}

const planesPorId = async(req, res) => {
    try {
        const idObraSocial = req.params.idObraSocial;
        const planes = await getPlanByIdObraSocial(idObraSocial);
        return res.json(planes);
    } catch (error) {
        const mensajeDeError500 = `Error interno en el servidor: ${error}`
        res.status(500).render("404", {error500:true, mensajeDeError500});
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
        const mensajeDeError500 = `Error interno en el servidor: ${error}`
        res.status(500).render("404", {error500:true, mensajeDeError500});
    }
} 

export {registroPacienteGet, planesPorId, registroPacientePost};