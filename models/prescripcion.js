import pool from "./database.js";

const insertPrescripcion = (prescripcion) => {
    let fecha = new Date().toLocaleString('sv-SE');
    const {diagnostico, vigencia, idMedicamentoDetalle, idPrestacion, idMedico, idPaciente} = prescripcion;
    const prescripcionConFecha = {diagnostico, fecha, vigencia, idMedicamentoDetalle, idPrestacion, idMedico, idPaciente};
    const query = "INSERT INTO prescripcion SET ?";
    try{
        const resultado = pool.query(query, prescripcionConFecha);
        return resultado;
    }catch(error){
        throw error;
    }
}

export {insertPrescripcion}