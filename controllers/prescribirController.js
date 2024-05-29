import { getAllDoctors } from "../models/medicos.js";
import { getAllPatients } from "../models/pacientes.js";
import { getMedicamento } from "../models/medicamentos.js";
import { getPrestaciones } from "../models/prestaciones.js";
import { insertPrescripcion, getPrescripcionByIdPaciente } from "../models/prescripcion.js";
import { insertPrescripcionMedicamentoDetalle } from "../models/prescripcionMedicamentoDetalle.js";
import { insertPrescripcionPrestacion } from "../models/prescripcionPrestacion.js";
import { updateResultadoPrestacion } from "../models/prescripcionPrestacion.js";

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
    const {idMedicamentoDetalle, dosis, duracion, intervalo} = prescripcion;
    let medicamento = prescripcion.idMedicamentoDetalle;
    let prestacion = prescripcion.idPrestacion;
    let nMedicamentos0Prestaciones = typeof medicamento==="object" && !prestacion;
    let nMedicamentos1Prestacion = typeof medicamento==="object" && typeof prestacion==="string";  
    let nMedicamentosNPrestaciones = typeof medicamento==="object" && typeof prestacion==="object";
    let unMedicamento0Prestaciones = typeof medicamento==="string" && !prestacion;
    let nPrestaciones0Medicamento = typeof prestacion==="object" && !medicamento;
    let nPrestaciones1Medicamento = typeof medicamento==="string" && typeof prestacion==="object";
    let unaPrestacion1Medicamento = typeof medicamento==="string" && typeof prestacion==="string";
    if(nMedicamentos0Prestaciones){
        //LOGICA PARA INSERTAR MUCHOS MEDICAMENTOS A UNA SOLA PRESCRIPCION
        try {
            const idPrescripcion = await insertPrescripcion(prescripcion);
            for(let m of medicamento){
                let idMedicamentoDetalle = parseInt(m);
                const prescripcion_medicamentodetalle = {idPrescripcion, idMedicamentoDetalle, dosis, duracion, intervalo};
                const resultado = await insertPrescripcionMedicamentoDetalle(prescripcion_medicamentodetalle);
                console.log(`prescripcion_medicamentodetalle añadido correctamente con el id: ${resultado}`);
            }
            res.status(200).json("Muchos medicamentos y ninguna prescripcion añadidos correctamente");
        } catch (error) {
            res.status(500).render("404", {error500:true, mensajeDeError500: error});        
        }
    }else if(nMedicamentos1Prestacion){
        //LOGICA PARA INSERTAR MUCHOS MEDICAMENTOS Y UNA PRESTACION A UNA SOLA PRESCRIPCION
        try {
            const idPrescripcion = await insertPrescripcion(prescripcion);
            for(let m of medicamento){
                let idMedicamentoDetalle = parseInt(m);
                const prescripcion_medicamentodetalle = {idPrescripcion, idMedicamentoDetalle, dosis, duracion, intervalo};
                const resultado = await insertPrescripcionMedicamentoDetalle(prescripcion_medicamentodetalle);
                console.log(`prescripcion_medicamentodetalle añadido correctamente con el id: ${resultado}`);
            }
            const resultadoPrestacion = await insertPrescripcionPrestacion(idPrescripcion, prestacion);
            res.status(200).json("Muchos medicamentos y ninguna prescripcion añadidos correctamente");
        } catch (error) {
            res.status(500).render("404", {error500:true, mensajeDeError500: error});          
        }
    }else if(nMedicamentosNPrestaciones){
        //LOGICA PARA INSERTAR MUCHOS MEDICAMENTOS Y MUCHAS PRESTACIONES A UNA SOLA PRESCRIPCION
        try {
            const idPrescripcion = await insertPrescripcion(prescripcion);
            for(let m of medicamento){
                let idMedicamentoDetalle = parseInt(m);
                const prescripcion_medicamentodetalle = {idPrescripcion, idMedicamentoDetalle, dosis, duracion, intervalo};
                const resultado = await insertPrescripcionMedicamentoDetalle(prescripcion_medicamentodetalle);
                console.log(`prescripcion_medicamentodetalle añadido correctamente con el id: ${resultado}`);
            }
            for(let p of prestacion){
                let idPrestacion = parseInt(p);
                const resultadoPrestacion = await insertPrescripcionPrestacion(idPrescripcion, idPrestacion);
            }
            res.status(200).json("Muchos medicamentos y ninguna prescripcion añadidos correctamente");
        } catch (error) {
            res.status(500).render("404", {error500:true, mensajeDeError500: error});        
        }
    }else if(nPrestaciones0Medicamento){
        //LOGICA PARA INSERTAR MUCHAS PRESTACIONES A UNA SOLA PRESCRIPCION
        try {
            const idPrescripcion = await insertPrescripcion(prescripcion);
            for(let p of prestacion){
                let idPrestacion = parseInt(p);
                const resultadoPrestacion = await insertPrescripcionPrestacion(idPrescripcion, idPrestacion);
            }
            res.status(200).json("Muchos medicamentos y ninguna prescripcion añadidos correctamente");
        } catch (error) {
            res.status(500).render("404", {error500:true, mensajeDeError500: error});           
        }
    }else if(nPrestaciones1Medicamento){
        //LOGICA PARA INSERTAR MUCHAS PRESTACIONES Y UN MEDICAMENTO A UNA SOLA PRESCRIPCION
        try {
            const idPrescripcion = await insertPrescripcion(prescripcion);
            const prescripcion_medicamentodetalle = {idPrescripcion, medicamento, dosis, duracion, intervalo};
            const resultado = await insertPrescripcionMedicamentoDetalle(prescripcion_medicamentodetalle);
            console.log(`prescripcion_medicamentodetalle añadido correctamente con el id: ${resultado}`);
            for(let p of prestacion){
                let idPrestacion = parseInt(p);
                const resultadoPrestacion = await insertPrescripcionPrestacion(idPrescripcion, idPrestacion);
            }
            res.status(200).json("Muchos medicamentos y ninguna prescripcion añadidos correctamente");
        } catch (error) {
            res.status(500).render("404", {error500:true, mensajeDeError500: error});           
        }
    }else if(unMedicamento0Prestaciones){
        //LOGICA PARA INSERTAR UN MEDICAMENTO A UNA SOLA PRESCRIPCION
        try {
            const idPrescripcion = await insertPrescripcion(prescripcion);
            const prescripcion_medicamentodetalle = {idPrescripcion, medicamento, dosis, duracion, intervalo};
            const resultado = await insertPrescripcionMedicamentoDetalle(prescripcion_medicamentodetalle);
            console.log(`prescripcion_medicamentodetalle añadido correctamente con el id: ${resultado}`);
            res.status(200).json("Muchos medicamentos y ninguna prescripcion añadidos correctamente");
        } catch (error) {
            res.status(500).render("404", {error500:true, mensajeDeError500: error});            
        }
    }else if(unaPrestacion1Medicamento){
        //LOGICA PARA INSERTAR UNA PRESTACION Y UN MEDICAMENTO A UNA SOLA PRESCRIPCION
        try {
            const idPrescripcion = await insertPrescripcion(prescripcion);
            const prescripcion_medicamentodetalle = {idPrescripcion, medicamento, dosis, duracion, intervalo};
            const resultadoMD = await insertPrescripcionMedicamentoDetalle(prescripcion_medicamentodetalle);
            const resultadoPP = await insertPrescripcionPrestacion(idPrescripcion, prestacion);
        } catch (error) {
            res.status(500).render("404", {error500:true, mensajeDeError500: error});
        }
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
    console.log(idPrestacion)
    console.log(resultado)
    try {
        const result = await updateResultadoPrestacion(resultado, idPrestacion, idPrescripcion);
        if(result[0].affectedRows > 0){
            res.json({mensaje:"Resultado añadido correctamente"});
        }else{
            res.json({mensaje: "Error al cargar el resultado en la base de datos..."});
        }
    } catch (error) {
        
    }
}

export {prescribirGet, prescribirPost, postIdPaciente, postGuardarResultadoPrestacion};