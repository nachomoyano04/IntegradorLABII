import { insertDoctor, getAllDoctors } from "../models/medicos.js";
import { getEspecialidades } from "../models/especialidades.js";
import { getProfesiones } from "../models/profesiones.js";

const registroMedicoGet = async (req, res) => {
    try {
        if(req.session.loggedin){
            let roles = req.session.rol;
            let tienePermiso = false;
            for(let i = 0; i < roles.length; i++){
                if(roles[i].idRol === 1){
                    tienePermiso = true;
                    break;
                }
            }
            if(tienePermiso){
                    const especialidades = await getEspecialidades(); 
                    const profesiones = await getProfesiones();
                    res.render("registrarMedico",{especialidades, profesiones})
            }else{
                res.send("No tienes permisos de administrador...");
            }
        }else{
            const inicio = false;
            const mensaje = "Debe iniciar sesión";
            res.redirect("/login");
            // res.render("inicio", {inicio, mensaje, usuario: null});
            // res.send("debe iniciar sesión");
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

const getProfesionales = async(req, res) => {
    try {
        const profesionales = await getAllDoctors();
        return profesionales[0];
    } catch (error) {
        res.status(500).render("404", {error500:true, mensajeDeError500: error});
    }
}

export {registroMedicoGet, insertarDoctorPost, getProfesionales};