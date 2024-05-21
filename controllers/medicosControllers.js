import { insertDoctor } from "../models/medicos.js";
import { getEspecialidades } from "../models/especialidades.js";
import { getProfesiones } from "../models/profesiones.js";

const registroMedicoGet = async (req, res) => {
    const especialidades = await getEspecialidades(); 
    const profesiones = await getProfesiones();
    res.render("registrarMedico",{especialidades, profesiones})
}

const insertarDoctorPost = async (req, res) => {
    const medico = req.body;
    try{
        const resultado = await insertDoctor(medico);
        res.redirect("/");
    }catch(error){
        res.status(500).send(`Error interno en el servidor: ${error}`)
    }
}

export {registroMedicoGet, insertarDoctorPost};