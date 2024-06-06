import { insertDoctor, getAllDoctors } from "../models/medicos.js";
import { getEspecialidades, insertMedicoEspecialidad } from "../models/especialidades.js";
import { getProfesiones } from "../models/profesiones.js";
import { insertarUsuario } from "../models/login.js";
import pool from "../models/database.js";

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
                    res.render("registrarMedico", {especialidades, profesiones})
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
    const {nombre, apellido, documento, idProfesion, domicilio, matricula, idRefeps, especialidad} = req.body;
    const {usuario, password} = req.body;
    console.log(req.body);
    const connection = pool.getConnection();
    try{
        (await connection).beginTransaction();    
        const resultado = await insertarUsuario(usuario, password);
        console.log(resultado);
        let idUsuario = resultado[0].insertId;
        const resultado2 = await insertDoctor(nombre,apellido,documento,idProfesion,domicilio,matricula,idRefeps, idUsuario);
        let idMedico = resultado2[0].insertId;
        console.log(resultado); ///verigicarrrrrrrrrrrrrrrrrr
        for(let e of especialidad){
            await insertMedicoEspecialidad(idMedico, e); 
        }
        (await connection).commit();
        res.send({ok:true});
    }catch(error){
        (await connection).rollback();
        const mensajeDeError500 = `Error interno en el servidor: ${error}`;
        // res.render("404", {error500:true, mensajeDeError500});
        res.send({ok:false});
    }finally{
        (await connection).release();
    }
}

const getProfesionales = async(req, res) => {
    try {
        const profesionales = await getAllDoctors();
        res.json(profesionales[0]); 
    } catch (error) {
        res.render("404", {error500:true, mensajeDeError500: error});
    }
}

export {registroMedicoGet, insertarDoctorPost, getProfesionales};