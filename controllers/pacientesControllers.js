// import { getObrasSociales } from "../models/obraSocial.js";
import {getPlanes, getPlanByIdPaciente} from "../models/planes.js";
import { deletePatient, getAllPatients, getPatientByDocumento, insertPatient, updatePatient } from "../models/pacientes.js";
import { getDoctorById} from "../models/medicos.js";
import { getObraSocialByIdPlan } from "../models/obraSocial.js";
import pool from "../models/database.js";
import { borrarPlanPaciente, insertPacientePlan } from "../models/pacientePlan.js";

const registroPacienteGet = async (req, res) => {
    try {
        if(req.session.loggedin){
            // logica para conseguir el nombre y apellido del usuario
            let usuario = req.session.usuario;
            if(req.session.idMedico){
                const medics = await getDoctorById(req.session.idMedico);
                usuario =  `${medics[0][0].nombre} ${medics[0][0].apellido} REFEPS: ${medics[0][0].idRefeps}`
            }
            const planes = await getPlanes();
            res.render("registrarPaciente", {usuario, planes})
        }else{
            res.redirect("/login");
        }      
    } catch (error) {
        res.render("404", {error500: true, mensajeDeError500: error});
    }
}

const planesPorIdPaciente = async(req, res) => {
    const idPaciente = req.params.idPaciente;
    try {
        const planes = await getPlanByIdPaciente(idPaciente);
        res.json(planes);
    } catch (error) {
        const mensajeDeError500 = `Error interno en el servidor: ${error}`
        res.status(500).render("404", {error500:true, mensajeDeError500});
    }
}

const registroPacientePost = async (req, res) => {
    const connection = await pool.getConnection();
    const {nombre, apellido, documento, fechaNacimiento, sexo, planes} = req.body;
    try {
        await connection.beginTransaction();
        const idPaciente = await insertPatient(nombre,apellido,documento,fechaNacimiento,sexo);
        for(let p of planes){
            await insertPacientePlan(idPaciente, p);
        }
        await connection.commit();
        res.send({ok:true});
    } catch (error) {
        await connection.rollback();
        const mensajeDeError500 = `Error interno en el servidor: ${error}`;
        console.log(error);
        res.status(500).render("404", {error500:true, mensajeDeError500});
    } finally {
        connection.release();
    }
} 

const obtenerPacientes = async (req, res) => {
    try {
        const pacientes = await getAllPatients();
        res.json(pacientes);
    } catch (error) {
        res.status(500).render("404", {error500:true, mensajeDeError500:error});
    }
}

const obtenerOSByIdPlan = async (req, res) => {
    const {idPlan} = req.body;
    try {
        const resultado = await getObraSocialByIdPlan(idPlan);
        res.json(resultado);
    } catch (error) {
        res.status(500).render("404", {error500:true, mensajeDeError500:error});
    }
}

const registroPacienteUpdate = async (req, res) => {
    const {idPaciente, nombre, apellido, documento, fechaNacimiento, sexo} = req.body;
    let {planes} = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        let planesBD = await getPlanByIdPaciente(idPaciente);
        planesBD = planesBD.map(e => e.idPlan.toString()); //mapeamos los planes de la bd para que sea un arreglo de idPlan's
        for(let pbd of planesBD){
            if(planes.includes(pbd)){ // si lo incluye, lo eliminamos de los planes a agregar...
                planes = planes.filter(e => e !== pbd);
            }else{
                let filas = await borrarPlanPaciente(idPaciente, pbd); //si no, eliminamos ese plan para el paciente
                if(filas !== 1){
                    throw error;
                }
            }
        }
        for(let p of planes){ //agregamos los planes al paciente si quedan...
            await insertPacientePlan(idPaciente, p);
        }
        const resultado = await updatePatient(nombre, apellido, documento, fechaNacimiento, sexo, idPaciente);
        if(resultado === 1){ //si
            res.send({ok:true});
        }else{
            res.send({ok:false});
        }
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        if(error.code === 'ER_DUP_ENTRY'){
            res.status(400).json({duplicado:true});
        }else{
            res.status(400).render("404", {error500:true, mensajeDeError500:error});
        }
    }finally{
        connection.release();
    }
}

const borradoLogicoPaciente = async (req, res) => {
    const {idPaciente} = req.body;
    try {
        const resultado = await deletePatient(idPaciente);
        if(resultado===1){
            res.send({ok:true})
        }else{
            res.send({ok:false})
        }
    } catch (error) {
        res.status(500).render("404", {error500:true, mensajeDeError500:error});
    }
}

const obtenerPacienteByDocumento = async (req, res) => {
    const documento = req.params.documento;
    try {
        const paciente = await getPatientByDocumento(documento);
        res.json(paciente);
    } catch (error) {
        res.status(500).render("404", {error500:true, mensajeDeError500:error});
    }
} 

export {registroPacienteGet, planesPorIdPaciente, registroPacientePost, obtenerPacientes, obtenerOSByIdPlan, registroPacienteUpdate, borradoLogicoPaciente, obtenerPacienteByDocumento};