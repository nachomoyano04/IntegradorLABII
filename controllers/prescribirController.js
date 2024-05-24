import { getAllDoctors } from "../models/medicos.js";
import { getAllPatients } from "../models/pacientes.js";
import { getMedicamento } from "../models/medicamentos.js";
import { getPrestaciones, insertResultadoEnPrestacionConId } from "../models/prestaciones.js";
import { insertPrescripcion, getPrescripcionByIdPaciente } from "../models/prescripcion.js";

const prescribirGet = async(req, res) => { //funcion que renderiza el form prescribir obteniendo los medicos y pacientes 
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
}   

const prescribirPost = async (req, res) => {
    const prescripcion = req.body;
    console.log(prescripcion)
    // try {
    //     const resultado = await insertPrescripcion(prescripcion);
    //     res.status(200).json(`Prescripción cargada correctamente con el id: ${resultado[0].insertId}`)        
    // } catch (error) {
    //     const mensajeDeError500 = `Error interno en el servidor: ${error}`
    //     res.status(500).render("404", {error500:true, mensajeDeError500});
    // }
}

const postIdPaciente = async (req, res) => {
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
    const {idPrestacion, resultado} = req.body;
    console.log(idPrestacion)
    console.log(resultado)
    try {
        const result = await insertResultadoEnPrestacionConId(resultado, idPrestacion);
        if(result[0].affectedRows > 0){
            res.json({mensaje:"Resultado añadido correctamente"});
        }else{
            res.json({mensaje: "Error al cargar el resultado en la base de datos..."});
        }
    } catch (error) {
        
    }
}

export {prescribirGet, prescribirPost, postIdPaciente, postGuardarResultadoPrestacion};