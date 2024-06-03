import { getAllDoctors } from "../models/medicos.js";
import { getAllPatients } from "../models/pacientes.js";
import { getMedicamento } from "../models/medicamentos.js";
import { getPrestaciones } from "../models/prestaciones.js";
import { insertPrescripcion, getPrescripcionByIdPaciente } from "../models/prescripcion.js";
import { insertPrescripcionMedicamentoDetalle } from "../models/prescripcionMedicamentoDetalle.js";
import { insertPrescripcionPrestacion } from "../models/prescripcionPrestacion.js";
import { updateResultadoPrestacion } from "../models/prescripcionPrestacion.js";
import pool from "../models/database.js";

const prescribirGet = async(req, res) => { //funcion que renderiza el form prescribir obteniendo los medicos y pacientes 
    if(req.session.loggedin && req.session.idRol === 2){
        let queryMedicamento = req.query.query;
        if(queryMedicamento === "medicamentos"){
            try {            
                let medicamentos = await getMedicamento();
                let prestaciones = await getPrestaciones();
                if(medicamentos[0].length > 0){
                    return res.status(200).send({medicamentos: medicamentos[0], prestaciones: prestaciones[0]})
                }
                return res.status(200).send("");
            } catch (error) {
                const mensajeDeError500 = `Error interno en el servidor: ${error}`
                res.status(500).render("404", {error500:true, mensajeDeError500});
            }
        }else{
            try {
                let medicos = await getAllDoctors();
                let pacientes = await getAllPatients();
                medicos = medicos[0];
                pacientes = pacientes[0];
                res.render("prescribir", {medicos, pacientes});
            } catch (error) {
                const mensajeDeError500 = `Error interno en el servidor: ${error}`
                res.status(500).render("404", {error500:true, mensajeDeError500});
            }
        }
    }else{
        res.send("no eres un profesional, no puedes prescribir...")
    }
}   

const prescribirPost = async (req, res) => {
    let {diagnostico, vigencia, idMedico, idPaciente, idMedicamentoDetalle, dosis, intervalo, duracion, idPrestacion} = req.body;
    //convertimos a objeto los idMedicamentoDetalle e idPrestacion para que sea mas facil las inserciones (si existen)
    const connection = await pool.getConnection();
    try{
        if(typeof idMedicamentoDetalle !== "object" && idMedicamentoDetalle){
            idMedicamentoDetalle = [idMedicamentoDetalle];
            dosis = [dosis];
            intervalo = [intervalo];
            duracion = [duracion];
        }
        if(typeof idPrestacion !== "object" && idPrestacion){
            idPrestacion = [idPrestacion];
        }
        const prescripcion = {diagnostico, vigencia, idMedico, idPaciente};
        await connection.beginTransaction();
        const idPrescripcion = await insertPrescripcion(prescripcion);
        if(idMedicamentoDetalle){
            for(let i = 0; i < idMedicamentoDetalle.length; i++){
                await insertPrescripcionMedicamentoDetalle(idPrescripcion, idMedicamentoDetalle[i], dosis[i], duracion[i], intervalo[i]);
            }
        }
        if(idPrestacion){
            for(let ip of idPrestacion){
                await insertPrescripcionPrestacion(idPrescripcion, ip);
            }
        }
        await connection.commit();
        res.status(200).json({mensaje: "Se realizó la prescripción correctamente..."})
    }catch(error){
        await connection.rollback();
        res.status(500).render("404", {error500:true ,mensajeDeError500:"Errooooooooooor"})
    }finally{
        connection.release();
    }
}

const postIdPaciente = async (req, res) => {
    // console.log(req.params)
    const idPaciente = req.params.idPaciente;
    try {
        const prescripciones = await getPrescripcionByIdPaciente(idPaciente);
        res.send(prescripciones);
    } catch (error) {
        const mensajeDeError500 = `Error interno en el servidor: ${error}`
        res.status(500).render("404", {error500:true, mensajeDeError500});
    }
}

const postGuardarResultadoPrestacion = async (req, res) => {
    const {idPrestacion, resultado, idPrescripcion} = req.body;
    try {
        const result = await updateResultadoPrestacion(resultado, idPrestacion, idPrescripcion);
        if(result[0].affectedRows > 0){
            res.json({mensaje:"Resultado añadido correctamente", aniadido:true, resultado});
        }else{
            res.json({mensaje: "Error al cargar el resultado en la base de datos...", aniadido:false});
        }
    } catch (error) {
        
    }
}

export {prescribirGet, prescribirPost, postIdPaciente, postGuardarResultadoPrestacion};