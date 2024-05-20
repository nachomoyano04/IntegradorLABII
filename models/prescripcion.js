import pool from "./database.js";

const insertPrescripcion = (prescripcion) => {
    let fecha = new Date().toLocaleString();
    const {diagnostico, vigencia, idMedicamento, idPrestacion, idMedico, idPaciente} = prescripcion;
    const prescripcionConFecha = {diagnostico, fecha, vigencia, idMedicamento, idPrestacion, idMedico, idPaciente};
    const query = "INSERT INTO prescripcion SET ?";
    try{
        const resultado = pool.query(query, prescripcionConFecha);
        return resultado;
    }catch(error){
        return error;
    }
}

export {insertPrescripcion}