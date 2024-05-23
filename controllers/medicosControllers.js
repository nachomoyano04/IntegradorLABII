import { insertDoctor } from "../models/medicos.js";
import { getEspecialidades } from "../models/especialidades.js";
import { getProfesiones } from "../models/profesiones.js";

const registroMedicoGet = async (req, res) => {
    try {
        const especialidades = await getEspecialidades(); 
        const profesiones = await getProfesiones();
        res.render("registrarMedico",{especialidades, profesiones})
    } catch(error) {
        const mensajeDeError500 = `Error interno en el servidor: ${error}`
        res.status(500).render("404", {error500:true, mensajeDeError500});
    }
}

const insertarDoctorPost = async (req, res) => {
    const medico = req.body;
    try{
        const resultado = await insertDoctor(medico);
        res.redirect("/");
    }catch(error){
        const mensajeDeError500 = `Error interno en el servidor: ${error}`
        res.status(500).render("404", {error500:true, mensajeDeError500});
    }
}

export {registroMedicoGet, insertarDoctorPost};