// import { getObrasSociales } from "../models/obraSocial.js";
import {getPlanes, getPlanByIdPaciente} from "../models/planes.js";
import { getAllPatients, insertPatient } from "../models/pacientes.js";
import { getDoctorById} from "../models/medicos.js";
import { getObraSocialByIdPlan } from "../models/obraSocial.js";
import pool from "../models/database.js";
import { insertPacientePlan } from "../models/pacientePlan.js";

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
        const mensajeDeError500 = `Error interno en el servidor: ${error}`
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

export {registroPacienteGet, planesPorIdPaciente, registroPacientePost, obtenerPacientes, obtenerOSByIdPlan};