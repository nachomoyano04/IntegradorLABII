import { insertDoctor, getAllDoctors,actualizarMedico, borrarMedico, getIdUsuarioByIdMedico, getMedicoByIdUsuario } from "../models/medicos.js";
import { getEspecialidades, insertMedicoEspecialidad, getEspecialidadesByIdMedico, borrarEspecialidadByMedico } from "../models/especialidades.js";
import { getProfesiones } from "../models/profesiones.js";
import { insertarUsuario, insertarUsuarioRol, updateUsuario, getUsuarioByIdUsuario, buscarUsersByUsuario } from "../models/login.js";
import bcrpyt from "bcrypt";
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
                    let usuario = req.session.usuario;
                    res.render("registrarMedico", {especialidades, profesiones, usuario});
            }else{
                res.send("No tienes permisos de administrador...");
            }
        }else{
            // const inicio = false;
            // const mensaje = "Debe iniciar sesión";
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
    const {nombre, apellido, documento, profesion, domicilio, matricula, refeps, especialidad} = req.body;
    let passwordHasheada = await bcrpyt.hash(documento, 8);
    const connection = pool.getConnection();
    try{
        (await connection).beginTransaction();    
        //cómo al momento de registrar el usuario y password serán el documento del profesional lo insertamos así.
        const resultado = await insertarUsuario(documento, passwordHasheada);
        let idUsuario = resultado[0].insertId;
        const resultado2 = await insertDoctor(nombre,apellido,documento,profesion,domicilio,matricula,refeps, idUsuario);
        let idMedico = resultado2[0].insertId;
        await insertarUsuarioRol(idUsuario, 2); //le asignamos el rol profesional por defecto...
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

const updateMedico = async(req, res) => {
    const connection = await pool.getConnection();
    const {nombre,apellido,documento,profesion,domicilio,matricula,refeps,idMedico} = req.body;
    const {especialidad} = req.body;
    try {
        await connection.beginTransaction();
        //update medico
        const resultado = await actualizarMedico(nombre,apellido,documento,profesion,domicilio,matricula,refeps,idMedico);
        //update usuario
        const idUsuario = await getIdUsuarioByIdMedico(idMedico);
        const {nombreUsuario, password} = await getUsuarioByIdUsuario(idUsuario);
        //chequeamos de que haya algun cambio en el documento para cambiar los datos del usuario
        if(!(nombreUsuario === documento && await bcrpyt.compare(documento, password))){    
            const passwordHasheada = await bcrpyt.hash(documento, 8);
            const resultado2 = await updateUsuario(documento, passwordHasheada, idUsuario);
        }
        //update especialidades
        if(especialidad.length > 0){
            const especialidadesYaCargadas = await getEspecialidadesByIdMedico(idMedico);
            // console.log(especialidadesYaCargadas[0]);
            let especialidadesEnBD = especialidadesYaCargadas[0].map(e => e.idEspecialidad+"");
            // chequeamos de que si no esta la especialidad cargada para ese médico, se la agregamos
            for(let especial of especialidad){ 
                if(!(especialidadesEnBD.includes(especial))){
                    await insertMedicoEspecialidad(idMedico, especial);
                }else{
                    especialidadesEnBD = especialidadesEnBD.filter(e => e !== especial);
                }
            }
            for(let es of especialidadesEnBD){
                await borrarEspecialidadByMedico(idMedico, es);
            }
        }
        await connection.commit();
        if(resultado[0].affectedRows > 0){
            res.send({ok:true});
        }
    } catch (error) {
        await connection.rollback();
        res.render("404", {error500:true, mensajeDeError500: error});
    } finally{
        connection.release();
    }
}

const borradoLogico = async(req, res) => {
    const {idMedico} = req.body;
    try {
        const resultado = await borrarMedico(idMedico);
        if(resultado[0].affectedRows > 0){
            res.send({ok:true});
        }
    } catch (error) {
        res.render("404", {error500:true, mensajeDeError500: error});
    }
}


const getEspecialidadesWithId = async(req,res) => {
    const idMedico = req.params.idMedico;
    try {
        const resultado = await getEspecialidadesByIdMedico(idMedico);
        res.send(resultado[0])        
    } catch (error) {
        res.render("404", {error500:true, mensajeDeError500: error});
    }
}

export {registroMedicoGet, insertarDoctorPost, getProfesionales, updateMedico, borradoLogico, getEspecialidadesWithId};