import bcrypt from "bcrypt";
import { updateUsuario } from "../models/login.js";
import { getIdUsuarioByIdMedico } from "../models/medicos.js";
const getCambiarCredenciales = async(req, res) => {
    try {
        if(req.session.loggedin){
            let roles = req.session.rol;
            let tienePermiso = false;
            for(let i = 0; i < roles.length; i++){ // verificamos que sólo un médico pueda cambiar la contraseña
                if(roles[i].idRol === 1){
                    break;
                }else{
                    tienePermiso = true;
                }
            }
            if(tienePermiso){
                res.render("cambiarCredenciales");
            }else{
                res.render("404", {sinPermiso:true});
            }
        }else{
            res.redirect("/login");
        }
    } catch (error) {
        res.render("404", {error500: true, mensajeDeError500: error});
    }
}

const postCambiarCredenciales = async (req, res) => {
    const {usuario, password} = req.body;
    const idMedico = req.session.idMedico;
    try {
        const passwordHasheada = await bcrypt.hash(password, 8);
        const idUsuario = await getIdUsuarioByIdMedico(idMedico);
        const resultado = await updateUsuario(usuario, passwordHasheada, idUsuario);
        res.json({ok:true});
    } catch (error) {
        res.json(error);
    }
}

export {getCambiarCredenciales, postCambiarCredenciales};