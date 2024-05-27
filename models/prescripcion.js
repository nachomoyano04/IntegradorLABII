import pool from "./database.js";

const insertPrescripcion = (prescripcion) => {
    let fecha = new Date().toLocaleString('sv-SE');
    let {diagnostico, vigencia, idMedico, idPaciente} = prescripcion;
    let idMedicamentoDetalle = prescripcion.idMedicamentoDetalle || null;
    let idPrestacion = prescripcion.idPrestacion || null;
    let prescripcionConFecha = {diagnostico, fecha, vigencia, idMedicamentoDetalle, idPrestacion, idMedico, idPaciente};
    console.log(`Prescripción:`)
    console.log(prescripcionConFecha)
    const query = "INSERT INTO prescripcion SET ?";
    try{
        const resultado = pool.query(query, prescripcionConFecha);
        return resultado;
    }catch(error){
        throw error;
    }
}

const getPrescripcionByIdPaciente = async(idPaciente) => {
    const query = ` SELECT
                        *
                    FROM
                        prescripcion AS pre
                    JOIN paciente AS p ON pre.idPaciente = p.idPaciente
                    LEFT JOIN prescripcion_prestacion AS pp ON pre.idPrescripcion = pp.idPrescripcion
                    LEFT JOIN prestacion ON prestacion.idPrestacion = pp.idPrestacion
                    LEFT JOIN prescripcion_medicamentodetalle AS pmd ON pre.idPrescripcion =  pmd.idPrescripcion
                    LEFT JOIN medicamentodetalle AS md ON pmd.idMedicamentoDetalle = md.id
                    LEFT JOIN medicamento ON md.idMedicamento = medicamento.idMedicamento
                    LEFT JOIN concentracion ON md.idConcentracion = concentracion.idConcentracion
                    LEFT JOIN formafarmaceutica ON md.idFormaFarmaceutica = formafarmaceutica.idFormaFarmaceutica
                    LEFT JOIN presentacion ON md.idPresentacion = presentacion.idPresentacion
                    WHERE p.idPaciente = ? AND (pmd.idPrescripcion IS NOT NULL OR pp.idPrescripcion IS NOT NULL);`;
    try {
        const resultado = await pool.query(query, [idPaciente])
        return resultado[0];
    } catch (error) {
        throw error;
    }
}

export {insertPrescripcion, getPrescripcionByIdPaciente}