import { insertDoctor } from "../models/medicos.js";
import { getEspecialidades } from "../models/especialidades.js";
import { getProfesiones } from "../models/profesiones.js";

const registroMedicoGet = async (req, res) => {
    try {
        if(req.session.loggedin && req.session.idRol === 1){ //nos aseguramos de que haya un ADMIN logueado
            const especialidades = await getEspecialidades(); 
            const profesiones = await getProfesiones();
            res.render("registrarMedico",{especialidades, profesiones})
        }else{
            res.send("No tienes permisos de administrador...");
        }
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